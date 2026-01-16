import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/utils/prisma';
import { deleteFile, supabase } from '@/app/utils/supabase';
import { requireAuth, requireRole } from '@/app/utils/routeAuth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const preferredRegion = 'gru1';

// DELETE /api/documentos/:id
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { user, error } = await requireAuth(request);
    if (!user) return error;
    const idRaw = params.id;
    const docId = Number(idRaw);
    if (!Number.isFinite(docId) || Number.isNaN(docId)) {
      console.warn('DELETE /api/documentos/:id recebido com id inválido', idRaw);
      return NextResponse.json({ error: 'id inválido' }, { status: 400 });
    }

    // Buscar documento
    const documento = await prisma.documento.findUnique({
      where: { id: docId },
    });

    if (!documento) {
      console.warn(`Documento não encontrado ao excluir, id=${docId}`);
      return NextResponse.json(
        { error: 'Documento não encontrado', id: docId },
        { status: 404 }
      );
    }
    
    // Verificar permissão para excluir:
    // Autor do upload sempre pode excluir. Para outros, somente se tiverem permissão de visualização
    // (não permitimos que ADMIN bypass automaticamente para documentos confidenciais).
    const userId = Number(user.id);
    const userRole = String((user as any).role || '').toUpperCase();
    const allowedRoles: string[] = Array.isArray((documento as any).allowedRoles) ? (documento as any).allowedRoles.map((r: any) => String(r).toUpperCase()) : [];
    const allowedUserIds: number[] = Array.isArray((documento as any).allowedUserIds) ? (documento as any).allowedUserIds.map((n: any) => Number(n)) : [];
    const vis = String((documento as any).visibility || 'PUBLIC').toUpperCase();

    const podeVer = vis === 'PUBLIC'
      ? true
      : vis === 'ROLES'
        ? allowedRoles.length > 0 && allowedRoles.includes(userRole)
        : vis === 'USERS'
          ? allowedUserIds.length > 0 && allowedUserIds.includes(userId)
          : allowedUserIds.length > 0 && allowedUserIds.includes(userId);

    if (documento.uploadPorId !== user.id && !podeVer) {
      return NextResponse.json(
        { error: 'Sem permissão para excluir este documento' },
        { status: 403 }
      );
    }
    
    // Excluir do Supabase Storage
    if (documento.path) {
      try {
        await deleteFile(documento.path);
      } catch (error) {
        console.error('Erro ao excluir arquivo do storage:', error);
        // Continua mesmo se falhar no storage
      }
    }
    
    // Excluir do banco
    await prisma.documento.delete({
      where: { id: parseInt(params.id) },
    });
    
    // Criar evento no histórico
    await prisma.historicoEvento.create({
      data: {
        processoId: documento.processoId,
        tipo: 'DOCUMENTO',
        acao: `Documento "${documento.nome}" excluído`,
        responsavelId: user.id,
        dataTimestamp: BigInt(Date.now()),
      },
    });
    
    return NextResponse.json({ message: 'Documento excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir documento:', error);
    return NextResponse.json(
      { error: 'Erro ao excluir documento' },
      { status: 500 }
    );
  }
}

// GET /api/documentos/:id -> retorna URL temporária (signed) se permitido
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { user, error } = await requireAuth(request);
    if (!user) return error;

    const docId = Number(params.id);
    if (!Number.isFinite(docId)) return NextResponse.json({ error: 'id inválido' }, { status: 400 });

    const documento = await prisma.documento.findUnique({ where: { id: docId } });
    if (!documento) return NextResponse.json({ error: 'Documento não encontrado' }, { status: 404 });

    // Verificar permissão de visualização conforme os campos de visibilidade
    const userId = Number((user as any).id);
    const userRole = String((user as any).role || '').toUpperCase();

    const allowedRoles: string[] = Array.isArray((documento as any).allowedRoles) ? (documento as any).allowedRoles.map((r: any) => String(r).toUpperCase()) : [];
    const allowedUserIds: number[] = Array.isArray((documento as any).allowedUserIds) ? (documento as any).allowedUserIds.map((n: any) => Number(n)) : [];
    const vis = String((documento as any).visibility || 'PUBLIC').toUpperCase();

    let podeVer = false;
    if (vis === 'PUBLIC') podeVer = true;
    else if (vis === 'ROLES') podeVer = allowedRoles.length > 0 && allowedRoles.includes(userRole);
    else if (vis === 'USERS') podeVer = allowedUserIds.length > 0 && allowedUserIds.includes(userId);
    else podeVer = allowedUserIds.length > 0 && allowedUserIds.includes(userId);

    if (!podeVer) return NextResponse.json({ error: 'Sem permissão para visualizar este documento' }, { status: 403 });

    const bucket = process.env.SUPABASE_STORAGE_BUCKET || 'documentos';

    // Se for público e já tivermos URL pública, retornamos ela
    if (vis === 'PUBLIC' && documento.url) {
      return NextResponse.json({ url: documento.url });
    }

    // Gera signed URL temporária (60s)
    // path pode ser null para documentos confidenciais que não expõem URL
    if (!documento.path) {
      console.error('Documento não possui path armazenado, não é possível gerar signed URL', { id: documento.id });
      return NextResponse.json({ error: 'Documento sem arquivo público' }, { status: 400 });
    }

    try {
      const expires = 60; // segundos
      const pathStr: string = documento.path as string;
      const { data, error } = await supabase.storage.from(bucket).createSignedUrl(pathStr, expires);
      if (error || !data?.signedUrl) {
        console.error('Erro ao gerar signed URL:', error);
        return NextResponse.json({ error: 'Erro ao gerar URL temporária' }, { status: 500 });
      }
      return NextResponse.json({ url: data.signedUrl });
    } catch (e) {
      console.error('Erro ao gerar signed URL:', e);
      return NextResponse.json({ error: 'Erro ao gerar URL temporária' }, { status: 500 });
    }
  } catch (error) {
    console.error('Erro no GET /api/documentos/:id', error);
    return NextResponse.json({ error: 'Erro ao buscar documento' }, { status: 500 });
  }
}




