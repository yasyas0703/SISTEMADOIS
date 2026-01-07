'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Departamento, Processo, Tag, Usuario, Notificacao, Empresa, Template } from '@/app/types';
import type { TipoAlerta } from '@/app/components/modals/ModalAlerta';

type ShowListarEmpresasState =
  | null
  | 'cadastradas'
  | 'nao-cadastradas'
  | { tipo: 'cadastradas' | 'nao-cadastradas'; empresaId?: number };

interface SistemaContextType {
  // Estados
  processos: Processo[];
  empresas: Empresa[];
  templates: Template[];
  departamentos: Departamento[];
  tags: Tag[];
  usuarios: Usuario[];
  notificacoes: Notificacao[];
  usuarioLogado: Usuario | null;

  // Modals
  showNovaEmpresa: boolean;
  showQuestionario: any;
  showVisualizacao: any;
  showComentarios: number | null;
  showAnalytics: boolean;
  showUploadDocumento: any;
  showGaleria: any;
  showGerenciarTags: boolean;
  showSelecionarTags: any;
  showConfirmacao: any;
  showAlerta: any;
  showPreviewDocumento: any;
  showGerenciarUsuarios: boolean;
  showCadastrarEmpresa: boolean;
  showListarEmpresas: ShowListarEmpresasState;
  showCriarDepartamento: boolean;
  showQuestionarioSolicitacao: any;
  showSelecionarTemplate: boolean;

  // Funções
  setProcessos: React.Dispatch<React.SetStateAction<Processo[]>>;
  setEmpresas: React.Dispatch<React.SetStateAction<Empresa[]>>;
  setTemplates: React.Dispatch<React.SetStateAction<Template[]>>;
  setDepartamentos: React.Dispatch<React.SetStateAction<Departamento[]>>;
  setTags: React.Dispatch<React.SetStateAction<Tag[]>>;
  setUsuarios: React.Dispatch<React.SetStateAction<Usuario[]>>;
  setNotificacoes: React.Dispatch<React.SetStateAction<Notificacao[]>>;
  setUsuarioLogado: React.Dispatch<React.SetStateAction<Usuario | null>>;

  setShowNovaEmpresa: (show: boolean) => void;
  setShowQuestionario: (show: any) => void;
  setShowVisualizacao: (show: any) => void;
  setShowComentarios: (show: number | null) => void;
  setShowAnalytics: (show: boolean) => void;
  setShowUploadDocumento: (show: any) => void;
  setShowGaleria: (show: any) => void;
  setShowGerenciarTags: (show: boolean) => void;
  setShowSelecionarTags: (show: any) => void;
  setShowConfirmacao: (show: any) => void;
  setShowAlerta: (show: any) => void;
  setShowPreviewDocumento: (show: any) => void;
  setShowGerenciarUsuarios: (show: boolean) => void;
  setShowCadastrarEmpresa: (show: boolean) => void;
  setShowListarEmpresas: (show: ShowListarEmpresasState) => void;
  setShowCriarDepartamento: (show: boolean) => void;
  setShowQuestionarioSolicitacao: (show: any) => void;
  setShowSelecionarTemplate: (show: boolean) => void;

  adicionarNotificacao: (mensagem: string, tipo: 'sucesso' | 'erro' | 'info') => void;
  removerNotificacao: (id: number) => void;
  mostrarAlerta: (titulo: string, mensagem: string, tipo?: TipoAlerta) => Promise<void>;
  mostrarConfirmacao: (config: {
    titulo: string;
    mensagem: string;
    tipo?: 'info' | 'aviso' | 'perigo' | 'sucesso';
    textoConfirmar?: string;
    textoCancelar?: string;
  }) => Promise<boolean>;
  criarEmpresa: (dados: Partial<Empresa>) => Empresa;
  atualizarEmpresa: (empresaId: number, dados: Partial<Empresa>) => void;
  excluirEmpresa: (empresaId: number) => void;
  criarTemplate: (dados: {
    nome: string;
    descricao?: string;
    fluxoDepartamentos: number[];
    questionariosPorDepartamento: any;
  }) => Template;
  excluirTemplate: (templateId: number) => void;
  criarProcesso: (dados: Partial<Processo>) => Processo;
  atualizarProcesso: (processoId: number, dados: Partial<Processo>) => void;
  excluirProcesso: (processoId: number) => void;
  avancarParaProximoDepartamento: (processoId: number) => void;
  finalizarProcesso: (processoId: number) => void;
  aplicarTagsProcesso: (processoId: number, tags: number[]) => void;
  adicionarComentarioProcesso: (processoId: number, texto: string, mencoes?: string[]) => void;
  adicionarDocumentoProcesso: (processoId: number, documento: any) => void;
}

const SistemaContext = createContext<SistemaContextType | undefined>(undefined);

export function SistemaProvider({ children }: { children: React.ReactNode }) {
  // Estados principais
  const [processos, setProcessos] = useState<Processo[]>([]);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [templates, setTemplates] = useState<Template[]>(() => {
    try {
      if (typeof window === 'undefined') return [];
      const raw = window.localStorage.getItem('templates');
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [tags, setTags] = useState<Tag[]>([
    { id: 1, nome: 'Urgente', cor: 'bg-red-500', texto: 'text-white' },
    { id: 2, nome: 'Aguardando Cliente', cor: 'bg-yellow-500', texto: 'text-white' },
    { id: 3, nome: 'Revisão', cor: 'bg-purple-500', texto: 'text-white' },
    { id: 4, nome: 'Documentação Pendente', cor: 'bg-orange-500', texto: 'text-white' },
  ]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
  const [usuarioLogado, setUsuarioLogado] = useState<Usuario | null>(null);

  // Estados de Modals
  const [showNovaEmpresa, setShowNovaEmpresa] = useState(false);
  const [showQuestionario, setShowQuestionario] = useState<any>(null);
  const [showVisualizacao, setShowVisualizacao] = useState<any>(null);
  const [showComentarios, setShowComentarios] = useState<number | null>(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showUploadDocumento, setShowUploadDocumento] = useState<any>(null);
  const [showGaleria, setShowGaleria] = useState<any>(null);
  const [showGerenciarTags, setShowGerenciarTags] = useState(false);
  const [showSelecionarTags, setShowSelecionarTags] = useState<any>(null);
  const [showConfirmacao, setShowConfirmacao] = useState<any>(null);
  const [showAlerta, setShowAlerta] = useState<any>(null);
  const [showPreviewDocumento, setShowPreviewDocumento] = useState<any>(null);
  const [showGerenciarUsuarios, setShowGerenciarUsuarios] = useState(false);
  const [showCadastrarEmpresa, setShowCadastrarEmpresa] = useState(false);
  const [showListarEmpresas, setShowListarEmpresas] = useState<ShowListarEmpresasState>(null);
  const [showCriarDepartamento, setShowCriarDepartamento] = useState(false);
  const [showQuestionarioSolicitacao, setShowQuestionarioSolicitacao] = useState<any>(null);
  const [showSelecionarTemplate, setShowSelecionarTemplate] = useState(false);

  const mostrarAlerta = useCallback(
    (titulo: string, mensagem: string, tipo: TipoAlerta = 'info') => {
      return new Promise<void>((resolve) => {
        setShowAlerta(null);
        setTimeout(() => {
          setShowAlerta({
            titulo,
            mensagem,
            tipo,
            onClose: () => {
              setShowAlerta(null);
              resolve();
            },
          });
        }, 10);
      });
    },
    []
  );

  const mostrarConfirmacao = useCallback(
    (config: {
      titulo: string;
      mensagem: string;
      tipo?: 'info' | 'aviso' | 'perigo' | 'sucesso';
      textoConfirmar?: string;
      textoCancelar?: string;
    }) => {
      return new Promise<boolean>((resolve) => {
        setShowConfirmacao(null);
        setTimeout(() => {
          setShowConfirmacao({
            ...config,
            onConfirm: () => {
              setShowConfirmacao(null);
              resolve(true);
            },
            onCancel: () => {
              setShowConfirmacao(null);
              resolve(false);
            },
          });
        }, 10);
      });
    },
    []
  );

  // Funções de notificação
  const adicionarNotificacao = useCallback((mensagem: string, tipo: 'sucesso' | 'erro' | 'info') => {
    const novaNotificacao: Notificacao = {
      id: Date.now(),
      mensagem,
      tipo,
      timestamp: new Date().toLocaleTimeString('pt-BR'),
      lida: false,
    };
    setNotificacoes(prev => [novaNotificacao, ...prev]);
  }, []);

  const removerNotificacao = useCallback((id: number) => {
    setNotificacoes(prev => prev.filter(n => n.id !== id));
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem('templates', JSON.stringify(templates));
    } catch {
      // noop
    }
  }, [templates]);

  const criarEmpresa = useCallback((dados: Partial<Empresa>) => {
    const agora = new Date();
    const novoId = Math.max(0, ...empresas.map(e => Number(e.id) || 0)) + 1;

    const cnpjLimpo = String(dados.cnpj || '').replace(/\D/g, '');
    const cadastrada = cnpjLimpo.length > 0;

    const nova: Empresa = {
      id: novoId,
      cnpj: String(dados.cnpj || ''),
      codigo: String(dados.codigo || ''),
      razao_social: String(dados.razao_social || ''),
      apelido: dados.apelido,
      inscricao_estadual: dados.inscricao_estadual,
      inscricao_municipal: dados.inscricao_municipal,
      regime_federal: dados.regime_federal,
      regime_estadual: dados.regime_estadual,
      regime_municipal: dados.regime_municipal,
      data_abertura: dados.data_abertura,
      estado: dados.estado,
      cidade: dados.cidade,
      bairro: dados.bairro,
      logradouro: dados.logradouro,
      numero: dados.numero,
      cep: dados.cep,
      email: dados.email,
      telefone: dados.telefone,
      cadastrada,
      criado_em: dados.criado_em || agora,
    };

    setEmpresas(prev => [...prev, nova]);
    return nova;
  }, [empresas]);

  const atualizarEmpresa = useCallback((empresaId: number, dados: Partial<Empresa>) => {
    setEmpresas(prev =>
      prev.map(e => {
        if (e.id !== empresaId) return e;
        const cnpj = dados.cnpj !== undefined ? String(dados.cnpj || '') : e.cnpj;
        const cadastrada = String(cnpj || '').replace(/\D/g, '').length > 0;
        return { ...e, ...dados, cnpj, cadastrada };
      })
    );
  }, []);

  const excluirEmpresa = useCallback((empresaId: number) => {
    setEmpresas(prev => prev.filter(e => e.id !== empresaId));
  }, []);

  const criarTemplate = useCallback(
    (dados: {
      nome: string;
      descricao?: string;
      fluxoDepartamentos: number[];
      questionariosPorDepartamento: any;
    }) => {
      const agora = new Date();
      const novoId = Math.max(0, ...templates.map(t => Number(t.id) || 0)) + 1;

      const novo: Template = {
        id: novoId,
        nome: dados.nome,
        descricao: dados.descricao,
        fluxo_departamentos: JSON.stringify(dados.fluxoDepartamentos || []),
        questionarios_por_departamento: JSON.stringify(dados.questionariosPorDepartamento || {}),
        criado_em: agora,
        criado_por: usuarioLogado?.id,
      };

      setTemplates(prev => [...prev, novo]);
      return novo;
    },
    [templates, usuarioLogado]
  );

  const excluirTemplate = useCallback((templateId: number) => {
    setTemplates(prev => prev.filter(t => t.id !== templateId));
  }, []);

  const criarHistoricoEvento = useCallback(
    (
      processo: Processo,
      tipo: any,
      acao: string,
      opts?: {
        departamentoNome?: string;
        responsavel?: string;
        data?: Date;
      }
    ) => {
      const data = opts?.data ?? new Date();
      return {
        departamento: opts?.departamentoNome || 'Sistema',
        data: data.toISOString(),
        dataTimestamp: data.getTime(),
        acao,
        responsavel: opts?.responsavel || usuarioLogado?.nome || 'Sistema',
        tipo,
      };
    },
    [usuarioLogado]
  );

  const atualizarProcesso = useCallback((processoId: number, dados: Partial<Processo>) => {
    setProcessos(prev =>
      prev.map(p =>
        p.id === processoId
          ? {
              ...p,
              ...dados,
              dataAtualizacao: new Date(),
            }
          : p
      )
    );
  }, []);

  const criarProcesso = useCallback(
    (dados: Partial<Processo>) => {
      const agora = new Date();
      const fluxo =
        (dados.fluxoDepartamentos && dados.fluxoDepartamentos.length > 0
          ? dados.fluxoDepartamentos
          : departamentos.length > 0
            ? [departamentos[0].id]
            : [1]) as number[];

      const departamentoInicial =
        (dados.departamentoAtual ?? fluxo[0] ?? departamentos[0]?.id ?? 1) as number;

      const novoId = Math.max(0, ...processos.map(p => p.id || 0)) + 1;

      const novo: Processo = {
        id: novoId,
        nome: dados.nome,
        nomeServico: dados.nomeServico,
        nomeEmpresa: dados.nomeEmpresa || dados.empresa || 'Nova Empresa',
        cliente: dados.cliente,
        empresa: dados.empresa,
        email: dados.email,
        telefone: dados.telefone,
        status: 'em_andamento',
        prioridade: (dados.prioridade || 'media') as any,
        departamentoAtual: departamentoInicial,
        departamentoAtualIndex: 0,
        fluxoDepartamentos: fluxo,
        criadoEm: dados.criadoEm || agora,
        dataCriacao: dados.dataCriacao || agora,
        dataAtualizacao: agora,
        descricao: dados.descricao,
        tags: dados.tags || [],
        historico:
          dados.historico && Array.isArray(dados.historico) && dados.historico.length > 0
            ? dados.historico
            : [
                criarHistoricoEvento(
                  {} as any,
                  'inicio',
                  `Solicitação criada: ${String(dados.nomeServico || dados.nome || '').trim() || 'Solicitação'}`,
                  {
                    departamentoNome: 'Sistema',
                    responsavel: dados.criadoPor || usuarioLogado?.nome || 'Sistema',
                    data: agora,
                  }
                ) as any,
              ],
        historicoEvento:
          dados.historicoEvento && Array.isArray(dados.historicoEvento) && dados.historicoEvento.length > 0
            ? dados.historicoEvento
            : [
                criarHistoricoEvento(
                  {} as any,
                  'inicio',
                  `Solicitação criada: ${String(dados.nomeServico || dados.nome || '').trim() || 'Solicitação'}`,
                  {
                    departamentoNome: 'Sistema',
                    responsavel: dados.criadoPor || usuarioLogado?.nome || 'Sistema',
                    data: agora,
                  }
                ) as any,
              ],
        comentarios: dados.comentarios || [],
        documentos: dados.documentos || [],
        questionariosPorDepartamento: dados.questionariosPorDepartamento || {},
        questionarioSolicitacao: dados.questionarioSolicitacao,
        respostasHistorico: dados.respostasHistorico || {},
        criadoPor: dados.criadoPor || usuarioLogado?.nome || 'Sistema',
        progresso:
          fluxo.length > 0 ? Math.round((1 / fluxo.length) * 100) : (dados.progresso as any) || 0,
      };

      setProcessos(prev => [...prev, novo]);
      return novo;
    },
    [departamentos, processos, usuarioLogado, criarHistoricoEvento]
  );

  const excluirProcesso = useCallback((processoId: number) => {
    setProcessos(prev => prev.filter(p => p.id !== processoId));
  }, []);

  const avancarParaProximoDepartamento = useCallback(
    (processoId: number) => {
      setProcessos(prev =>
        prev.map(p => {
          if (p.id !== processoId) return p;

          const fluxo = p.fluxoDepartamentos || [];
          if (fluxo.length === 0) return p;

          const idxAtual = p.departamentoAtualIndex ?? Math.max(0, fluxo.indexOf(p.departamentoAtual));
          if (idxAtual >= fluxo.length - 1) return p;

          const proximoDept = fluxo[idxAtual + 1];
          const novoIdx = idxAtual + 1;

          const deptAtualNome = departamentos.find(d => d.id === p.departamentoAtual)?.nome;
          const proximoNome = departamentos.find(d => d.id === proximoDept)?.nome;
          const dataAtual = new Date();
          const evento = criarHistoricoEvento(
            p,
            'movimentacao',
            `Avançou de ${deptAtualNome || 'Sistema'} para ${proximoNome || 'Sistema'} (${novoIdx + 1}/${fluxo.length})`,
            {
              departamentoNome: deptAtualNome || 'Sistema',
              data: dataAtual,
            }
          );

          return {
            ...p,
            departamentoAtual: proximoDept,
            departamentoAtualIndex: novoIdx,
            dataAtualizacao: new Date(),
            progresso: Math.round(((novoIdx + 1) / fluxo.length) * 100),
            historico: [...(p.historico || []), evento as any],
            historicoEvento: [...(p.historicoEvento || []), evento as any],
          };
        })
      );
    },
    [departamentos, criarHistoricoEvento]
  );

  const finalizarProcesso = useCallback((processoId: number) => {
    setProcessos(prev =>
      prev.map(p =>
        p.id === processoId
          ? {
              ...p,
              status: 'finalizado',
              dataFinalizacao: new Date(),
              dataAtualizacao: new Date(),
              progresso: 100,
              historico: [
                ...(p.historico || []),
                criarHistoricoEvento(p, 'finalizacao', 'Processo finalizado com sucesso', {
                  departamentoNome: 'Sistema',
                }) as any,
              ],
              historicoEvento: [
                ...(p.historicoEvento || []),
                criarHistoricoEvento(p, 'finalizacao', 'Processo finalizado com sucesso', {
                  departamentoNome: 'Sistema',
                }) as any,
              ],
            }
          : p
      )
    );
  }, [criarHistoricoEvento]);

  const aplicarTagsProcesso = useCallback((processoId: number, novasTags: number[]) => {
    atualizarProcesso(processoId, { tags: novasTags });
  }, [atualizarProcesso]);

  const adicionarComentarioProcesso = useCallback(
    (processoId: number, texto: string, mencoes?: string[]) => {
      if (!texto.trim()) return;

      setProcessos(prev =>
        prev.map(p => {
          if (p.id !== processoId) return p;

          const comentarios = p.comentarios || [];
          const deptNome = departamentos.find(d => d.id === p.departamentoAtual)?.nome;
          const evento = criarHistoricoEvento(
            p,
            'comentario',
            'Novo comentário adicionado',
            { departamentoNome: deptNome || 'Sistema' }
          );
          return {
            ...p,
            comentarios: [
              ...comentarios,
              {
                id: Math.max(0, ...comentarios.map(c => c.id || 0)) + 1,
                processoId,
                texto,
                autor: usuarioLogado?.nome || 'Você',
                timestamp: new Date(),
                editado: false,
                departamentoId: p.departamentoAtual,
                mencoes: Array.isArray(mencoes) ? mencoes : [],
              },
            ],
            dataAtualizacao: new Date(),
            historico: [...(p.historico || []), evento as any],
            historicoEvento: [...(p.historicoEvento || []), evento as any],
          };
        })
      );
    },
    [usuarioLogado, departamentos, criarHistoricoEvento]
  );

  const adicionarDocumentoProcesso = useCallback((processoId: number, documento: any) => {
    setProcessos(prev =>
      prev.map(p => {
        if (p.id !== processoId) return p;
        const documentos = p.documentos || [];
        const deptNome = departamentos.find(d => d.id === p.departamentoAtual)?.nome;
        const evento = criarHistoricoEvento(
          p,
          'documento',
          'Novo documento adicionado',
          { departamentoNome: deptNome || 'Sistema' }
        );
        return {
          ...p,
          documentos: [...documentos, documento],
          dataAtualizacao: new Date(),
          historico: [...(p.historico || []), evento as any],
          historicoEvento: [...(p.historicoEvento || []), evento as any],
        };
      })
    );
  }, [departamentos, criarHistoricoEvento]);

  const value: SistemaContextType = {
    processos,
    empresas,
    templates,
    departamentos,
    tags,
    usuarios,
    notificacoes,
    usuarioLogado,

    showNovaEmpresa,
    showQuestionario,
    showVisualizacao,
    showComentarios,
    showAnalytics,
    showUploadDocumento,
    showGaleria,
    showGerenciarTags,
    showSelecionarTags,
    showConfirmacao,
    showAlerta,
    showPreviewDocumento,
    showGerenciarUsuarios,
    showCadastrarEmpresa,
    showListarEmpresas,
    showCriarDepartamento,
    showQuestionarioSolicitacao,
    showSelecionarTemplate,

    setProcessos,
    setEmpresas,
    setTemplates,
    setDepartamentos,
    setTags,
    setUsuarios,
    setNotificacoes,
    setUsuarioLogado,

    setShowNovaEmpresa,
    setShowQuestionario,
    setShowVisualizacao,
    setShowComentarios,
    setShowAnalytics,
    setShowUploadDocumento,
    setShowGaleria,
    setShowGerenciarTags,
    setShowSelecionarTags,
    setShowConfirmacao,
    setShowAlerta,
    setShowPreviewDocumento,
    setShowGerenciarUsuarios,
    setShowCadastrarEmpresa,
    setShowListarEmpresas,
    setShowCriarDepartamento,
    setShowQuestionarioSolicitacao,
    setShowSelecionarTemplate,

    adicionarNotificacao,
    removerNotificacao,
    mostrarAlerta,
    mostrarConfirmacao,
    criarEmpresa,
    atualizarEmpresa,
    excluirEmpresa,
    criarTemplate,
    excluirTemplate,
    criarProcesso,
    atualizarProcesso,
    excluirProcesso,
    avancarParaProximoDepartamento,
    finalizarProcesso,
    aplicarTagsProcesso,
    adicionarComentarioProcesso,
    adicionarDocumentoProcesso,
  };

  return (
    <SistemaContext.Provider value={value}>
      {children}
    </SistemaContext.Provider>
  );
}

export { SistemaContext };

export function useSistema() {
  const context = useContext(SistemaContext);
  if (!context) {
    throw new Error('useSistema deve ser usado dentro de SistemaProvider');
  }
  return context;
}
