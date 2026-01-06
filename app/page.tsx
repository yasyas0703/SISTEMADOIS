'use client';

import React, { useState, useEffect } from 'react';
import { useSistema, Processo, Departamento } from '@/app/context/SistemaContext';
import Header from '@/app/components/Header';
import DashboardStats from '@/app/components/DashboardStats';
import DepartamentosGrid from '@/app/components/sections/DepartamentosGrid';
import Filtros from '@/app/components/sections/Filtros';
import ListaProcessos from '@/app/components/sections/ListaProcessos';
import SecaoAlertas from '@/app/components/sections/SecaoAlertas';
import ModalLogin from '@/app/components/modals/ModalLogin';
import ModalCriarDepartamento from '@/app/components/modals/ModalCriarDepartamento';
import ModalNovaEmpresa from '@/app/components/modals/ModalNovaEmpresa';
import ModalCadastrarEmpresa from '@/app/components/modals/ModalCadastrarEmpresa';
import ModalGerenciarUsuarios from '@/app/components/modals/ModalGerenciarUsuarios';
import ModalAnalytics from '@/app/components/modals/ModalAnalytics';
import ModalListarEmpresas from '@/app/components/modals/ModalListarEmpresas';
import ModalGerenciarTags from '@/app/components/modals/ModalGerenciarTags';
import ModalComentarios from '@/app/components/modals/ModalComentarios';
import ModalUploadDocumento from '@/app/components/modals/ModalUploadDocumento';
import ModalQuestionario from '@/app/components/modals/ModalQuestionario';
import ModalSelecionarTemplate from '@/app/components/modals/ModalSelecionarTemplate';
import ModalVisualizacao from '@/app/components/modals/ModalVisualizacao';
import GaleriaDocumentos from '@/app/components/modals/ModalGaleria';

export default function Home() {
  const {
    usuarioLogado,
    setUsuarioLogado,
    processos,
    setProcessos,
    departamentos,
    setDepartamentos,
    showCriarDepartamento,
    setShowCriarDepartamento,
    showNovaEmpresa,
    setShowNovaEmpresa,
    showGerenciarUsuarios,
    setShowGerenciarUsuarios,
    showAnalytics,
    setShowAnalytics,
    showListarEmpresas,
    setShowListarEmpresas,
    showGerenciarTags,
    setShowGerenciarTags,
    showComentarios,
    setShowComentarios,
    showUploadDocumento,
    setShowUploadDocumento,
    showSelecionarTemplate,
    setShowSelecionarTemplate,
  } = useSistema();

  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [filtroBusca, setFiltroBusca] = useState('');
  const [filtroTags, setFiltroTags] = useState<number[]>([]);
  const [filtroDepartamento, setFiltroDepartamento] = useState<number | null>(null);
  const [processoSelecionado, setProcessoSelecionado] = useState<Processo | null>(null);
  const [showVisualizacao, setShowVisualizacao] = useState<Processo | null>(null);
  const [showGaleria, setShowGaleria] = useState(false);
  const [showCadastrarEmpresa, setShowCadastrarEmpresa] = useState(false);

  // Dados de exemplo para demo
  useEffect(() => {
    if (usuarioLogado && processos.length === 0) {
      const processosDemo: Processo[] = [
        {
          id: 1,
          nome: 'Abertura de Empresa - Documentação Completa',
          empresa: 'Tech Solutions Ltda',
          status: 'Em Andamento',
          prioridade: 'ALTA',
          departamentoAtual: 1,
          criadoEm: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          dataAtualizacao: new Date(),
          dataEntrega: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
          descricao: 'Solicitação de abertura de empresa com todos os documentos necessários',
          tags: [1],
          criadoPor: 'João Silva',
        },
        {
          id: 2,
          nome: 'Análise de Documentos - Compliance',
          empresa: 'Investimentos Brasil SA',
          status: 'Em Andamento',
          prioridade: 'MEDIA',
          departamentoAtual: 2,
          criadoEm: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          dataAtualizacao: new Date(),
          dataEntrega: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          descricao: 'Análise de documentação para compliance regulatório',
          tags: [3],
          criadoPor: 'Maria Santos',
        },
        {
          id: 3,
          nome: 'Processo Finalizado - Empresa ABC',
          empresa: 'ABC Consultoria',
          status: 'Finalizado',
          prioridade: 'BAIXA',
          departamentoAtual: 3,
          criadoEm: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          dataAtualizacao: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          descricao: 'Processo de abertura de empresa finalizado com sucesso',
          tags: [2],
          criadoPor: 'Pedro Costa',
        },
      ];

      setProcessos(processosDemo);

      const departamentosDemo: Departamento[] = [
        {
          id: 1,
          nome: 'Recebimento',
          descricao: 'Receção e validação de documentos',
          cor: 'from-cyan-500 to-blue-600',
          ativo: true,
          criadoEm: new Date(),
        },
        {
          id: 2,
          nome: 'Análise',
          descricao: 'Análise de documentação e conformidade',
          cor: 'from-purple-500 to-pink-600',
          ativo: true,
          criadoEm: new Date(),
        },
        {
          id: 3,
          nome: 'Finalização',
          descricao: 'Conclusão e entrega dos processos',
          cor: 'from-green-500 to-emerald-600',
          ativo: true,
          criadoEm: new Date(),
        },
      ];

      setDepartamentos(departamentosDemo);
    }
  }, [usuarioLogado, processos.length, setProcessos, setDepartamentos]);

  const handleLogin = (usuario: any) => {
    setUsuarioLogado(usuario);
  };

  const handleCriarDepartamento = (data: any) => {
    setDepartamentos([...departamentos, data]);
  };

  const handleNovaEmpresa = (data: any) => {
    setProcessos([...processos, data]);
    setShowNovaEmpresa(false);
  };

  const handleProcessoClicado = (processo: Processo) => {
    setProcessoSelecionado(processo);
    setShowVisualizacao(processo);
  };

  if (!usuarioLogado) {
    return <ModalLogin onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-100">
      <Header
        onNovaEmpresa={() => setShowNovaEmpresa(true)}
        onPersonalizado={() => setShowNovaEmpresa(true)}
        onGerenciarUsuarios={() => setShowGerenciarUsuarios(true)}
        onAnalytics={() => setShowAnalytics(true)}
        onSelecionarTemplate={() => setShowSelecionarTemplate(true)}
        onLogout={() => setUsuarioLogado(null)}
      />

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Alertas */}
        <SecaoAlertas />

        {/* Dashboard Stats */}
        <DashboardStats />

        {/* Departamentos */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Fluxo dos Departamentos</h2>
              <p className="text-gray-600">
                {departamentos.length === 0
                  ? 'Crie seus departamentos para começar'
                  : 'Arraste os processos entre os departamentos'}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCadastrarEmpresa(true)}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                ➕ Cadastrar Empresa
              </button>
              <button
                onClick={() => setShowListarEmpresas('cadastradas')}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                📋 Empresas (370)
              </button>
              <button
                onClick={() => setShowListarEmpresas('nao-cadastradas')}
                className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                ⚠️ Empresas Novas (1)
              </button>
              <button
                onClick={() => setShowCriarDepartamento(true)}
                className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                ➕ Criar Departamento
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <DepartamentosGrid
              onCriarDepartamento={() => setShowCriarDepartamento(true)}
              onEditarDepartamento={() => {}}
              onExcluirDepartamento={() => {}}
              onProcessoClicado={handleProcessoClicado}
            />
          </div>
        </div>

        {/* Filtros */}
        <Filtros
          onBuscaChange={setFiltroBusca}
          onStatusChange={setFiltroStatus}
          onTagsChange={setFiltroTags}
          onDepartamentoChange={setFiltroDepartamento}
        />

        {/* Lista de Processos */}
        <ListaProcessos
          onProcessoClicado={handleProcessoClicado}
          filtroStatus={filtroStatus}
          filtroBusca={filtroBusca}
          filtroTags={filtroTags}
          filtroDepartamento={filtroDepartamento}
          departamentos={departamentos}
          onExcluir={(processo) => {
            console.log('Excluir processo:', processo.id);
            // Implemente a lógica de exclusão aqui
          }}
        />
      </div>

      {/* MODALS */}
      {showCriarDepartamento && (
        <ModalCriarDepartamento
          onClose={() => setShowCriarDepartamento(false)}
          onSave={handleCriarDepartamento}
        />
      )}

      {showNovaEmpresa && (
        <ModalNovaEmpresa
          onClose={() => setShowNovaEmpresa(false)}
        />
      )}

      {showGerenciarUsuarios && (
        <ModalGerenciarUsuarios onClose={() => setShowGerenciarUsuarios(false)} />
      )}

      {showAnalytics && <ModalAnalytics onClose={() => setShowAnalytics(false)} />}

      {showListarEmpresas && (
        <ModalListarEmpresas
          onClose={() => setShowListarEmpresas(null)}
          tipo={showListarEmpresas as any}
        />
      )}

      {showGerenciarTags && (
        <ModalGerenciarTags onClose={() => setShowGerenciarTags(false)} />
      )}

      {showComentarios && (
        <ModalComentarios
          processoId={showComentarios}
          processo={processos.find((p) => p.id === showComentarios)}
          onClose={() => setShowComentarios(null)}
        />
      )}

      {showUploadDocumento && (
        <ModalUploadDocumento onClose={() => setShowUploadDocumento(null)} />
      )}

      {showSelecionarTemplate && (
        <ModalSelecionarTemplate
          onClose={() => setShowSelecionarTemplate(false)}
        />
      )}

      {showVisualizacao && (
        <ModalVisualizacao
          processo={showVisualizacao}
          onClose={() => setShowVisualizacao(null)}
        />
      )}

      {showGaleria && <GaleriaDocumentos onClose={() => setShowGaleria(false)} />}

      {showCadastrarEmpresa && (
        <ModalCadastrarEmpresa
          onClose={() => setShowCadastrarEmpresa(false)}
        />
      )}
    </div>
  );
}