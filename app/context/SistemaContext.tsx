'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

export interface Departamento {
  id: number;
  nome: string;
  icone?: string;
  cor?: string;
  descricao?: string;
  permissoes?: string[];
  questionarios?: any[];
  documentosObrigatorios?: any[];
  ativo?: boolean;
  criadoEm?: Date;
}

export interface Processo {
  id: number;
  nome: string;
  empresa: string;
  status: 'Em Andamento' | 'Finalizado' | 'Pausado';
  prioridade: 'alta' | 'media' | 'baixa';
  departamentoAtual: number;
  criadoEm: Date;
  dataAtualizacao: Date;
  dataEntrega?: Date;
  descricao?: string;
  tags?: number[];
  notasCriador?: string;
  historicoFluxo?: any[];
  questionarios?: any[];
  documentos?: any[];
  comentarios?: any[];
  criadoPor?: string;
}

export interface Tag {
  id: number;
  nome: string;
  cor: string;
  texto: string;
}

export interface Usuario {
  id: number;
  nome: string;
  role: 'admin' | 'gerente' | 'usuario';
  ativo: boolean;
  criadoEm: Date;
  permissoes?: string[];
  departamento_id?: number;
}

export interface Notificacao {
  id: number;
  mensagem: string;
  tipo: 'sucesso' | 'erro' | 'info';
  timestamp: string;
  lida: boolean;
}

interface SistemaContextType {
  // Estados
  processos: Processo[];
  departamentos: Departamento[];
  tags: Tag[];
  usuarios: Usuario[];
  notificacoes: Notificacao[];
  usuarioLogado: Usuario | null;

  // Modals
  showNovaEmpresa: boolean;
  showQuestionario: any;
  showVisualizacao: any;
  showComentarios: string | null;
  showAnalytics: boolean;
  showUploadDocumento: any;
  showGaleria: any;
  showGerenciarTags: boolean;
  showSelecionarTags: any;
  showConfirmacao: any;
  showAlerta: any;
  showGerenciarUsuarios: boolean;
  showCadastrarEmpresa: boolean;
  showListarEmpresas: string | null;
  showCriarDepartamento: boolean;
  showQuestionarioSolicitacao: any;
  showSelecionarTemplate: boolean;

  // Funções
  setProcessos: (processos: Processo[]) => void;
  setDepartamentos: (departamentos: Departamento[]) => void;
  setTags: (tags: Tag[]) => void;
  setUsuarios: (usuarios: Usuario[]) => void;
  setNotificacoes: (notificacoes: Notificacao[]) => void;
  setUsuarioLogado: (usuario: Usuario | null) => void;

  setShowNovaEmpresa: (show: boolean) => void;
  setShowQuestionario: (show: any) => void;
  setShowVisualizacao: (show: any) => void;
  setShowComentarios: (show: string | null) => void;
  setShowAnalytics: (show: boolean) => void;
  setShowUploadDocumento: (show: any) => void;
  setShowGaleria: (show: any) => void;
  setShowGerenciarTags: (show: boolean) => void;
  setShowSelecionarTags: (show: any) => void;
  setShowConfirmacao: (show: any) => void;
  setShowAlerta: (show: any) => void;
  setShowGerenciarUsuarios: (show: boolean) => void;
  setShowCadastrarEmpresa: (show: boolean) => void;
  setShowListarEmpresas: (show: string | null) => void;
  setShowCriarDepartamento: (show: boolean) => void;
  setShowQuestionarioSolicitacao: (show: any) => void;
  setShowSelecionarTemplate: (show: boolean) => void;

  adicionarNotificacao: (mensagem: string, tipo: 'sucesso' | 'erro' | 'info') => void;
  removerNotificacao: (id: number) => void;
}

const SistemaContext = createContext<SistemaContextType | undefined>(undefined);

export function SistemaProvider({ children }: { children: React.ReactNode }) {
  // Estados principais
  const [processos, setProcessos] = useState<Processo[]>([]);
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
  const [showComentarios, setShowComentarios] = useState<string | null>(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showUploadDocumento, setShowUploadDocumento] = useState<any>(null);
  const [showGaleria, setShowGaleria] = useState<any>(null);
  const [showGerenciarTags, setShowGerenciarTags] = useState(false);
  const [showSelecionarTags, setShowSelecionarTags] = useState<any>(null);
  const [showConfirmacao, setShowConfirmacao] = useState<any>(null);
  const [showAlerta, setShowAlerta] = useState<any>(null);
  const [showGerenciarUsuarios, setShowGerenciarUsuarios] = useState(false);
  const [showCadastrarEmpresa, setShowCadastrarEmpresa] = useState(false);
  const [showListarEmpresas, setShowListarEmpresas] = useState<string | null>(null);
  const [showCriarDepartamento, setShowCriarDepartamento] = useState(false);
  const [showQuestionarioSolicitacao, setShowQuestionarioSolicitacao] = useState<any>(null);
  const [showSelecionarTemplate, setShowSelecionarTemplate] = useState(false);

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

  const value: SistemaContextType = {
    processos,
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
    showGerenciarUsuarios,
    showCadastrarEmpresa,
    showListarEmpresas,
    showCriarDepartamento,
    showQuestionarioSolicitacao,
    showSelecionarTemplate,

    setProcessos,
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
    setShowGerenciarUsuarios,
    setShowCadastrarEmpresa,
    setShowListarEmpresas,
    setShowCriarDepartamento,
    setShowQuestionarioSolicitacao,
    setShowSelecionarTemplate,

    adicionarNotificacao,
    removerNotificacao,
  };

  return (
    <SistemaContext.Provider value={value}>
      {children}
    </SistemaContext.Provider>
  );
}

export function useSistema() {
  const context = useContext(SistemaContext);
  if (!context) {
    throw new Error('useSistema deve ser usado dentro de SistemaProvider');
  }
  return context;
}
