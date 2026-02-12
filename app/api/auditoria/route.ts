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

    const pid = parseInt(processoId);

    // Buscar o processo para verificar interligações
    const processo = await prisma.processo.findUnique({
      where: { id: pid },
      select: { id: true, interligadoComId: true, interligadoNome: true, nomeServico: true, nomeEmpresa: true },
    });

    // Coletar IDs de todos os processos interligados
    const processosIds = new Set<number>([pid]);
    const processosNomes: Record<number, string> = {};
    if (processo) {
      processosNomes[pid] = processo.nomeServico || processo.nomeEmpresa || `#${pid}`;
    }

    // Processo pai (este processo é continuação de outro)
    if (processo?.interligadoComId) {
      processosIds.add(processo.interligadoComId);
      processosNomes[processo.interligadoComId] = processo.interligadoNome || `#${processo.interligadoComId}`;
    }

    // Processos filhos (outros processos que são continuação deste)
    const filhos = await prisma.processo.findMany({
      where: { interligadoComId: pid },
      select: { id: true, nomeServico: true, nomeEmpresa: true },
    });
    for (const f of filhos) {
      processosIds.add(f.id);
      processosNomes[f.id] = f.nomeServico || f.nomeEmpresa || `#${f.id}`;
    }

    // Também verificar via tabela InterligacaoProcesso
    try {
      const interligacoes = await (prisma as any).interligacaoProcesso.findMany({
        where: {
          OR: [
            { processoOrigemId: pid },
            { processoDestinoId: pid },
          ],
        },
      });
      for (const inter of interligacoes) {
        if (inter.processoOrigemId !== pid) processosIds.add(inter.processoOrigemId);
        if (inter.processoDestinoId !== pid) processosIds.add(inter.processoDestinoId);
      }
    } catch { /* tabela pode não existir */ }

    // Buscar nomes de processos que ainda não temos
    const idsSemNome = Array.from(processosIds).filter(id => !processosNomes[id]);
    if (idsSemNome.length > 0) {
      const extras = await prisma.processo.findMany({
        where: { id: { in: idsSemNome } },
        select: { id: true, nomeServico: true, nomeEmpresa: true },
      });
      for (const e of extras) {
        processosNomes[e.id] = e.nomeServico || e.nomeEmpresa || `#${e.id}`;
      }
    }

    // Buscar histórico de eventos de TODOS os processos interligados
    const historico = await prisma.historicoEvento.findMany({
      where: {
        processoId: { in: Array.from(processosIds) },
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

    // Serializar BigInt para string e adicionar informação do processo de origem
    const historicoSerializado = historico.map((evento) => ({
      ...evento,
      dataTimestamp: evento.dataTimestamp ? evento.dataTimestamp.toString() : null,
      // Campos extras para o front identificar eventos de processos interligados
      processoOrigemId: evento.processoId,
      processoOrigemNome: processosNomes[evento.processoId] || `#${evento.processoId}`,
      isInterligado: evento.processoId !== pid,
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
