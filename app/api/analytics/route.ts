import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Esta rota de API pode ser implementada no futuro para retornar dados reais de analytics
    // Por enquanto, retornamos dados vazios para evitar erros de build
    return NextResponse.json({
      metricasGerais: {
        totalProcessos: 0,
        processosFinalizados: 0,
        taxaSucesso: 0,
        tempoMedioTotal: 0
      },
      tempoMedioPorDepartamento: {},
      gargalos: [],
      taxaConclusaoMensal: {},
      performanceDepartamentos: {},
      previsaoConclusao: {}
    });
  } catch (error) {
    console.error('Erro ao buscar analytics:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar dados de analytics' },
      { status: 500 }
    );
  }
}

