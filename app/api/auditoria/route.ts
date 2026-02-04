import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/utils/prisma';
import { requireAuth } from '@/app/utils/routeAuth';

/**
 * GET /api/auditoria
 * Busca o histórico de eventos de um processo
 */
export async function GET(request: NextRequest) {
  try {
    const { user, error } = await requireAuth(request);
    if (!user) return error;

    const { searchParams } = new URL(request.url);
    const processoId = searchParams.get('processoId');

    if (!processoId) {
      return NextResponse.json({ error: 'processoId é obrigatório' }, { status: 400 });
    }

    // Buscar histórico de eventos
    const historico = await prisma.historicoEvento.findMany({
      where: {
        processoId: parseInt(processoId),
      },
      include: {
        responsavel: {
          select: {
            id: true,
            nome: true,
            email: true,
          },
        },
      },
      orderBy: {
        data: 'desc',
      },
    });

    // Serializar BigInt para string
    const historicoSerializado = historico.map((evento) => ({
      ...evento,
      dataTimestamp: evento.dataTimestamp ? evento.dataTimestamp.toString() : null,
    }));

    return NextResponse.json(historicoSerializado);
  } catch (error) {
    console.error('Erro ao buscar histórico:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar histórico', details: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/auditoria
 * Registra um novo evento no histórico
 */
export async function POST(request: NextRequest) {
  try {
    const { user, error } = await requireAuth(request);
    if (!user) return error;

    const body = await request.json();
    const { processoId, tipo, acao, responsavelId, departamento, detalhes, dataTimestamp } = body;

    if (!processoId || !tipo || !acao) {
      return NextResponse.json(
        { error: 'processoId, tipo e acao são obrigatórios' },
        { status: 400 }
      );
    }

    // Validar tipo de evento
    const tiposValidos = ['INICIO', 'ALTERACAO', 'MOVIMENTACAO', 'CONCLUSAO', 'FINALIZACAO', 'DOCUMENTO', 'COMENTARIO'];
    if (!tiposValidos.includes(tipo)) {
      return NextResponse.json(
        { error: `Tipo de evento inválido. Use: ${tiposValidos.join(', ')}` },
        { status: 400 }
      );
    }

    // Criar evento no histórico
    const evento = await prisma.historicoEvento.create({
      data: {
        processoId: parseInt(processoId),
        tipo,
        acao,
        responsavelId: responsavelId || user.id,
        departamento,
        dataTimestamp: dataTimestamp || Date.now(),
      },
      include: {
        responsavel: {
          select: {
            id: true,
            nome: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(evento, { status: 201 });
  } catch (error) {
    console.error('Erro ao registrar evento:', error);
    return NextResponse.json(
      { error: 'Erro ao registrar evento', details: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/auditoria/[id]
 * Remove um evento do histórico (apenas para admins)
 */
export async function DELETE(request: NextRequest) {
  try {
    const { user, error } = await requireAuth(request);
    if (!user) return error;

    // Apenas admins podem deletar histórico
    if (user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Apenas administradores podem deletar histórico' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'id é obrigatório' }, { status: 400 });
    }

    await prisma.historicoEvento.delete({
      where: {
        id: parseInt(id),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao deletar evento:', error);
    return NextResponse.json(
      { error: 'Erro ao deletar evento', details: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    );
  }
}
