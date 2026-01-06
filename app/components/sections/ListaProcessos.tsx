'use client';

import React from 'react';
import { Building, Eye, ArrowRight, CheckCircle, MessageSquare, FileText, Star, X, User, Calendar, Clock } from 'lucide-react';
import { useSistema, Processo } from '@/app/context/SistemaContext';

interface ListaProcessosProps {
  onProcessoClicado: (processo: Processo) => void;
  filtroStatus?: string;
  filtroBusca?: string;
  filtroTags?: number[];
  filtroDepartamento?: number | null;
  departamentos?: any[];
  onComentarios?: (processo: Processo) => void;
  onQuestionario?: (processo: Processo) => void;
  onDocumentos?: (processo: Processo) => void;
  onExcluir?: (processo: Processo) => void;
  onAvancar?: (processo: Processo) => void;
  onFinalizar?: (processo: Processo) => void;
  onTags?: (processo: Processo) => void;
  onGerenciarTags?: (processo: Processo) => void;
}

export default function ListaProcessos({
  onProcessoClicado,
  filtroStatus = 'todos',
  filtroBusca = '',
  filtroTags = [],
  filtroDepartamento = null,
  departamentos = [],
  onComentarios,
  onQuestionario,
  onDocumentos,
  onExcluir,
  onAvancar,
  onFinalizar,
  onTags,
  onGerenciarTags,
}: ListaProcessosProps) {
  const { processos } = useSistema();

  const processosFiltrados = processos.filter((proc) => {
    // Filtro por status
    if (filtroStatus === 'andamento' && proc.status !== 'Em Andamento') return false;
    if (filtroStatus === 'finalizado' && proc.status !== 'Finalizado') return false;
    if (filtroStatus === 'alta' && proc.prioridade !== 'alta' && proc.prioridade !== 'ALTA') return false;

    // Filtro por busca
    const nomeEmpresa = proc.empresa || proc.nomeEmpresa || '';
    if (filtroBusca && !nomeEmpresa.toLowerCase().includes(filtroBusca.toLowerCase())) {
      return false;
    }

    // Filtro por tags
    if (filtroTags.length > 0 && !filtroTags.some((t) => proc.tags?.includes(t))) {
      return false;
    }

    // Filtro por departamento
    if (filtroDepartamento && proc.departamentoAtual !== filtroDepartamento) {
      return false;
    }

    return true;
  });

  const getPriorityColor = (prioridade: string) => {
    const prio = prioridade.toLowerCase();
    switch (prio) {
      case 'alta':
      case 'ALTA':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'media':
      case 'MEDIA':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'baixa':
      case 'BAIXA':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Em Andamento':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Finalizado':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Pausado':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getDepartamentoAtual = (processo: Processo) => {
    return departamentos.find(dept => dept.id === processo.departamentoAtual);
  };

  if (processosFiltrados.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Processos Detalhados</h2>
        </div>
        <div className="p-12 text-center text-gray-500">
          <Building size={48} className="mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium mb-2">Nenhum processo encontrado</p>
          <p className="text-sm">Tente ajustar os filtros ou criar uma nova solicitação</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">Processos Detalhados</h2>
      </div>

      <div className="divide-y divide-gray-100">
        {processosFiltrados.map((processo) => {
          const isFinalizado = processo.status === 'Finalizado';
          const isUltimoDepartamento = processo.departamentoAtualIndex === (processo.fluxoDepartamentos?.length || 1) - 1;
          const departamentoAtual = getDepartamentoAtual(processo);
          const nomeEmpresa = processo.empresa || processo.nomeEmpresa || 'Nova Empresa';
          const nomeServico = processo.nome || processo.nomeServico || 'Processo';

          return (
            <div
              key={processo.id}
              className="p-6 hover:bg-gray-50 transition-all duration-200"
              onClick={() => onProcessoClicado(processo)}
            >
              <div className="flex justify-between items-start mb-6 gap-4">
                {/* Coluna Esquerda - Informações */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      {/* Nome do Serviço */}
                      <div className="text-sm font-semibold text-blue-600 mb-1 truncate" title={nomeServico}>
                        {nomeServico}
                      </div>

                      {/* Nome da Empresa + Tags */}
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="text-xl font-bold text-gray-900 truncate" title={nomeEmpresa}>
                          {nomeEmpresa}
                        </h3>

                        {(processo.tags || []).length > 0 && (
                          <div className="flex gap-1">
                            {(processo.tags || []).map((tagId) => (
                              <div key={tagId} className="w-3 h-3 rounded-full bg-purple-500 border border-white shadow-sm" title={`Tag ${tagId}`} />
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Cliente */}
                      <p className="text-sm text-gray-600 truncate" title={processo.cliente}>
                        {processo.cliente || 'Não informado'}
                      </p>
                    </div>

                    {/* Status e Prioridade */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(processo.status)}`}>
                        {processo.status}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(processo.prioridade)}`}>
                        {processo.prioridade.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Informações em Grid */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="flex items-center gap-3">
                      <User size={16} className="text-gray-400 flex-shrink-0" />
                      <div>
                        <div className="text-xs text-gray-500">Cliente</div>
                        <div className="text-sm font-medium text-gray-900 truncate">{processo.cliente || 'Não informado'}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Calendar size={16} className="text-gray-400 flex-shrink-0" />
                      <div>
                        <div className="text-xs text-gray-500">Início</div>
                        <div className="text-sm font-medium text-gray-900">
                          {new Date(processo.criadoEm).toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Clock size={16} className="text-gray-400 flex-shrink-0" />
                      <div>
                        <div className="text-xs text-gray-500">Prazo</div>
                        <div className="text-sm font-medium text-gray-900">
                          {processo.dataEntrega ? new Date(processo.dataEntrega).toLocaleDateString('pt-BR') : 'Não definido'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Departamento Atual (só para processos em andamento) */}
                  {!isFinalizado && departamentoAtual && (
                    <div className="bg-white border-l-4 border-blue-500 rounded-lg p-5 shadow-sm mb-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${departamentoAtual.cor || 'from-blue-500 to-cyan-500'} flex items-center justify-center flex-shrink-0`}>
                          {departamentoAtual.icone ? (
                            <departamentoAtual.icone size={24} className="text-white" />
                          ) : (
                            <User size={24} className="text-white" />
                          )}
                        </div>

                        <div className="flex-1">
                          <p className="text-xs text-blue-600 font-semibold uppercase mb-1">Departamento Atual</p>
                          <h4 className="text-lg font-bold text-gray-900">{departamentoAtual.nome || 'Sem departamento'}</h4>
                          <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                            <User size={14} />
                            <span>{departamentoAtual.responsavel || 'Sem responsável'}</span>
                          </div>
                        </div>

                        <div className="bg-blue-50 rounded-lg px-4 py-3 text-center">
                          <div className="text-2xl font-bold text-blue-600">{processo.progresso || 0}%</div>
                          <div className="text-xs text-gray-500">Completo</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Coluna Direita - Ações */}
                <div className="flex gap-2">
                  <div className="flex gap-3">
                    {/* Botão Ver Completo */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onProcessoClicado(processo);
                      }}
                      className="bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      <Eye size={16} />
                      Ver Completo
                    </button>

                    {/* Botões de Ação condicionais */}
                    {!isFinalizado && (
                      <>
                        {!isUltimoDepartamento && onAvancar && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onAvancar(processo);
                            }}
                            className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl"
                          >
                            <ArrowRight size={16} />
                            Avançar ({(processo.departamentoAtualIndex || 0) + 2}/{processo.fluxoDepartamentos?.length || 1})
                          </button>
                        )}

                        {isUltimoDepartamento && onFinalizar && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onFinalizar(processo);
                            }}
                            className="bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl"
                          >
                            <CheckCircle size={16} />
                            Finalizar
                          </button>
                        )}
                      </>
                    )}
                  </div>

                  {/* Botão Excluir */}
                  {onExcluir && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onExcluir(processo);
                      }}
                      className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                      title="Excluir processo"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>
              </div>

              {/* Histórico de Atividades */}
              {processo.historico && processo.historico.length > 0 && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <Clock size={16} />
                    Últimas Atividades
                  </h4>
                  <div className="space-y-2">
                    {processo.historico.slice(-3).map((item: any, index: number) => (
                      <div key={index} className="flex items-start gap-3 text-sm">
                        <div className="mt-1">
                          {item.tipo === 'inicio' && <Calendar className="text-blue-500" size={12} />}
                          {item.tipo === 'conclusao' && <CheckCircle className="text-green-500" size={12} />}
                          {item.tipo === 'finalizacao' && <Star className="text-yellow-500" size={12} />}
                          {item.tipo === 'movimentacao' && <ArrowRight className="text-purple-500" size={12} />}
                        </div>
                        <div className="flex-1">
                          <div className="text-gray-900">{item.acao}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            {item.responsavel} • {new Date(item.data).toLocaleDateString('pt-BR')}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="p-6 border-t border-gray-200 text-sm text-gray-600 text-center">
        Mostrando {processosFiltrados.length} de {processos.length} processos
      </div>
    </div>
  );
}