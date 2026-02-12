import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/utils/prisma';
import { requireAuth } from '@/app/utils/routeAuth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const preferredRegion = 'gru1';

// GET /api/processos/[id]/checklist — Busca checklist de departamentos de um processo
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { user, error } = await requireAuth(request);
    if (!user) return error;

    const processoId = parseInt(params.id);

    // Tenta buscar da tabela dedicada
    try {
      const checklist = await (prisma as any).checklistDepartamento.findMany({
        where: { processoId },
        orderBy: { id: 'asc' },
      });
      return NextResponse.json(checklist);
    } catch {
      // Tabela pode não existir ainda
      return NextResponse.json([]);
    }
  } catch (error) {
    console.error('Erro ao buscar checklist:', error);
    return NextResponse.json([], { status: 200 });
  }
}

// POST /api/processos/[id]/checklist — Criar/atualizar item de checklist
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { user, error } = await requireAuth(request);
    if (!user) return error;

    const processoId = parseInt(params.id);
    const data = await request.json();

    const { departamentoId, concluido } = data;

    if (!departamentoId) {
      return NextResponse.json({ error: 'departamentoId obrigatório' }, { status: 400 });
    }

    try {
      // Buscar o processo para validar a ordem do fluxo
      const processo = await (prisma as any).processo.findUnique({
        where: { id: processoId },
        select: { fluxoDepartamentos: true, deptIndependente: true },
      });

      if (!processo) {
        return NextResponse.json({ error: 'Processo não encontrado' }, { status: 404 });
      }

      const fluxo: number[] = Array.isArray(processo.fluxoDepartamentos)
        ? processo.fluxoDepartamentos.map(Number)
        : [];

      // Validação sequencial: só pode dar check se o anterior no fluxo já está concluído
      if (concluido && fluxo.length > 1) {
        const idx = fluxo.indexOf(Number(departamentoId));
        if (idx > 0) {
          // Buscar checklist do departamento anterior
          const anterior = await (prisma as any).checklistDepartamento.findFirst({
            where: { processoId, departamentoId: fluxo[idx - 1] },
          });
          if (!anterior || !anterior.concluido) {
            const deptAnterior = await prisma.departamento.findUnique({
              where: { id: fluxo[idx - 1] },
              select: { nome: true },
            });
            return NextResponse.json(
              { error: `"${deptAnterior?.nome || `Dept #${fluxo[idx - 1]}`}" precisa dar check primeiro.` },
              { status: 400 }
            );
          }
        }
      }

      // Upsert: cria ou atualiza
      const existing = await (prisma as any).checklistDepartamento.findFirst({
        where: { processoId, departamentoId: Number(departamentoId) },
      });

      if (existing) {
        const updated = await (prisma as any).checklistDepartamento.update({
          where: { id: existing.id },
          data: {
            concluido: Boolean(concluido),
            concluidoPorId: concluido ? user.id : null,
            concluidoEm: concluido ? new Date() : null,
          },
        });

        // Registrar evento de histórico quando departamento conclui
        if (concluido) {
          try {
            const dept = await prisma.departamento.findUnique({
              where: { id: Number(departamentoId) },
              select: { nome: true },
            });
            await prisma.historicoEvento.create({
              data: {
                processoId,
                tipo: 'CONCLUSAO',
                acao: `Departamento "${dept?.nome || `#${departamentoId}`}" concluiu sua parte (check paralelo)`,
                responsavelId: user.id,
                departamento: dept?.nome || `Dept #${departamentoId}`,
                dataTimestamp: BigInt(Date.now()),
              },
            });
          } catch { /* não bloquear */ }
        }

        return NextResponse.json(updated);
      } else {
        const created = await (prisma as any).checklistDepartamento.create({
          data: {
            processoId,
            departamentoId: Number(departamentoId),
            concluido: Boolean(concluido),
            concluidoPorId: concluido ? user.id : null,
            concluidoEm: concluido ? new Date() : null,
          },
        });

        // Registrar evento de histórico quando departamento conclui
        if (concluido) {
          try {
            const dept = await prisma.departamento.findUnique({
              where: { id: Number(departamentoId) },
              select: { nome: true },
            });
            await prisma.historicoEvento.create({
              data: {
                processoId,
                tipo: 'CONCLUSAO',
                acao: `Departamento "${dept?.nome || `#${departamentoId}`}" concluiu sua parte (check paralelo)`,
                responsavelId: user.id,
                departamento: dept?.nome || `Dept #${departamentoId}`,
                dataTimestamp: BigInt(Date.now()),
              },
            });
          } catch { /* não bloquear */ }
        }

        return NextResponse.json(created);
      }
    } catch (err) {
      console.error('Erro ao salvar checklist departamento:', err);
      return NextResponse.json({ ok: true }); // Graceful fallback se tabela não existir
    }
  } catch (error) {
    console.error('Erro ao salvar checklist:', error);
    return NextResponse.json({ error: 'Erro ao salvar checklist' }, { status: 500 });
  }
}
