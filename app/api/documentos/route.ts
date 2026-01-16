import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/utils/prisma';
import { uploadFile, deleteFile } from '@/app/utils/supabase';
import { requireAuth } from '@/app/utils/routeAuth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const preferredRegion = 'gru1';

function jsonBigInt(data: unknown, init?: { status?: number }) {
  return new NextResponse(
    JSON.stringify(data, (_key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    ),
    {
      status: init?.status ?? 200,
      headers: {
        'content-type': 'application/json; charset=utf-8',
      },
    }
  );
}

// GET /api/documentos?processoId=123
export async function GET(request: NextRequest) {
  try {
    const { user, error } = await requireAuth(request);
    if (!user) return error;

    const { searchParams } = new URL(request.url);
    const processoId = searchParams.get('processoId');
    const departamentoId = searchParams.get('departamentoId');
    
    if (!processoId) {
      return NextResponse.json(
        { error: 'processoId é obrigatório' },
        { status: 400 }
      );
    }
    
    const documentos = await prisma.documento.findMany({
      where: {
        processoId: parseInt(processoId),
        ...(departamentoId && { departamentoId: parseInt(departamentoId) }),
      },
      include: {
        departamento: {
          select: { id: true, nome: true },
        },
      },
      orderBy: { dataUpload: 'desc' },
    });

    const userId = Number((user as any).id);
    const userRole = String((user as any).role || '').toUpperCase();

    const documentoPodeSerVisto = (doc: any) => {
      try {
        const vis = String(doc.visibility || 'PUBLIC').toUpperCase();
        const allowedRoles: string[] = Array.isArray(doc.allowedRoles) ? doc.allowedRoles.map(r => String(r).toUpperCase()) : [];
        const allowedUserIds: number[] = Array.isArray(doc.allowedUserIds) ? doc.allowedUserIds.map((n: any) => Number(n)) : [];

        if (vis === 'PUBLIC') return true;
        if (vis === 'ROLES') {
          if (allowedRoles.length === 0) return false;
          return allowedRoles.includes(userRole);
        }
        if (vis === 'USERS') {
          if (allowedUserIds.length === 0) return false;
          return allowedUserIds.includes(userId);
        }
        return Array.isArray(allowedUserIds) && allowedUserIds.includes(userId);
      } catch (e) {
        return false;
      }
    };

    const filtrados = documentos.filter(d => documentoPodeSerVisto(d));
    return jsonBigInt(filtrados);
  } catch (error) {
    console.error('Erro ao buscar documentos:', error);
    return jsonBigInt({ error: 'Erro ao buscar documentos' }, { status: 500 });
  }
}

// POST /api/documentos - Upload de documento
export async function POST(request: NextRequest) {
  try {
    const { user, error } = await requireAuth(request);
    if (!user) return error;
    
    const formData = await request.formData();
    const file = formData.get('arquivo') as File;
    const processoId = parseInt(formData.get('processoId') as string);
    const tipo = formData.get('tipo') as string;
    const departamentoId = formData.get('departamentoId')
      ? parseInt(formData.get('departamentoId') as string)
      : null;
    const perguntaId = formData.get('perguntaId')
      ? parseInt(formData.get('perguntaId') as string)
      : null;
    
    if (!file || !processoId || !tipo) {
      return NextResponse.json(
        { error: 'Dados incompletos' },
        { status: 400 }
      );
    }
    
    // Upload para Supabase Storage
    const { url, path } = await uploadFile(file, `processos/${processoId}`);
    
    // Salvar no banco
    // parse visibility metadata (optional)
    const visibilityRaw = (formData.get('visibility') as string) || undefined;
    const allowedRolesRaw = (formData.get('allowedRoles') as string) || undefined; // comma-separated
    const allowedUserIdsRaw = (formData.get('allowedUserIds') as string) || undefined; // comma-separated

    const allowedRolesArr = allowedRolesRaw ? allowedRolesRaw.split(',').map(s => s.trim()).filter(Boolean) : [];
    const allowedUserIdsArr = allowedUserIdsRaw ? allowedUserIdsRaw.split(',').map(s => Number(s.trim())).filter(n => Number.isFinite(n)) : [];

    // Normaliza visibility para o enum aceito pelo Prisma
    const visibilityRawUpper = visibilityRaw ? String(visibilityRaw).toUpperCase() : undefined;
    const visibilityNormalized = visibilityRawUpper && ['PUBLIC', 'ROLES', 'USERS'].includes(visibilityRawUpper)
      ? (visibilityRawUpper as 'PUBLIC' | 'ROLES' | 'USERS')
      : undefined;

    // Não expor publicUrl quando documento for confidencial
    const storedUrl = (visibilityRaw && visibilityRaw.toUpperCase() !== 'PUBLIC') ? '' : url;

    const documento = await prisma.documento.create({
      data: {
        processoId,
        nome: file.name,
        tipo,
        tipoCategoria: (formData.get('tipoCategoria') as string) || null,
        tamanho: BigInt(file.size),
        url: storedUrl,
        path,
        departamentoId,
        perguntaId,
        uploadPorId: user.id,
        ...(visibilityNormalized && { visibility: visibilityNormalized as any }),
        ...(allowedRolesArr.length > 0 && { allowedRoles: allowedRolesArr }),
        ...(allowedUserIdsArr.length > 0 && { allowedUserIds: allowedUserIdsArr }),
      },
      include: {
        departamento: {
          select: { id: true, nome: true },
        },
      },
    });
    
    // Criar evento no histórico
    await prisma.historicoEvento.create({
      data: {
        processoId,
        tipo: 'DOCUMENTO',
        acao: `Documento "${file.name}" adicionado`,
        responsavelId: user.id,
        dataTimestamp: BigInt(Date.now()),
      },
    });
    
    return jsonBigInt(documento, { status: 201 });
  } catch (error) {
    console.error('Erro no upload:', error);
    const message = error instanceof Error ? error.message : 'Erro ao fazer upload';
    return jsonBigInt({ error: message }, { status: 500 });
  }
}




