'use client';

import React, { useState } from 'react';
import { X, Search, Building, RefreshCw, Edit, Trash2, AlertCircle } from 'lucide-react';

interface Empresa {
  id: number;
  cnpj: string;
  codigo: string;
  razao_social: string;
  apelido?: string;
  inscricao_estadual?: string;
  inscricao_municipal?: string;
  regime_federal?: string;
  regime_estadual?: string;
  regime_municipal?: string;
  data_abertura?: string;
  estado?: string;
  cidade?: string;
  bairro?: string;
  logradouro?: string;
  numero?: string;
  cep?: string;
  email?: string;
  telefone?: string;
  cadastrada: boolean;
}

interface ModalListarEmpresasProps {
  onClose: () => void;
  tipo?: 'cadastradas' | 'nao-cadastradas';
}

export default function ModalListarEmpresas({
  onClose,
  tipo = 'cadastradas',
}: ModalListarEmpresasProps) {
  const [buscaEmpresa, setBuscaEmpresa] = useState('');
  const [empresaSelecionada, setEmpresaSelecionada] = useState<Empresa | null>(null);

  // Mock de empresas - substitua pela sua API/Context
  const [empresas] = useState<Empresa[]>([
    {
      id: 1,
      cnpj: '12.345.678/0001-90',
      codigo: '001',
      razao_social: 'Tech Solutions Ltda',
      apelido: 'Tech Solutions',
      cidade: 'São Paulo',
      estado: 'SP',
      cadastrada: true,
      regime_federal: 'Simples Nacional',
      data_abertura: '2020-01-15',
    },
    {
      id: 2,
      cnpj: '98.765.432/0001-10',
      codigo: '002',
      razao_social: 'Investimentos Brasil SA',
      apelido: 'Inv Brasil',
      cidade: 'Rio de Janeiro',
      estado: 'RJ',
      cadastrada: false,
    },
    {
      id: 3,
      cnpj: '11.222.333/0001-44',
      codigo: '003',
      razao_social: 'ABC Consultoria Empresarial',
      cidade: 'Belo Horizonte',
      estado: 'MG',
      cadastrada: true,
      regime_federal: 'Lucro Presumido',
    },
  ]);

  const empresasFiltradas = empresas.filter((empresa) => {
    const matchBusca =
      empresa.razao_social.toLowerCase().includes(buscaEmpresa.toLowerCase()) ||
      empresa.codigo.toLowerCase().includes(buscaEmpresa.toLowerCase()) ||
      (empresa.cnpj && empresa.cnpj.includes(buscaEmpresa));

    const matchTipo =
      tipo === 'cadastradas'
        ? empresa.cadastrada === true
        : empresa.cadastrada === false;

    return matchBusca && matchTipo;
  });

  const formatarData = (data?: string) => {
    if (!data) return 'Não informada';
    return new Date(data).toLocaleDateString('pt-BR');
  };

  const recarregarEmpresas = () => {
    // Implementar lógica de recarregamento
    console.log('Recarregando empresas...');
  };

  const handleEditar = (empresa: Empresa) => {
    // Implementar lógica de edição
    console.log('Editar:', empresa);
  };

  const handleExcluir = (empresa: Empresa) => {
    // Implementar lógica de exclusão
    console.log('Excluir:', empresa);
  };

  return (
    <>
      {/* Modal Principal */}
      <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div
            className={`bg-gradient-to-r ${
              tipo === 'cadastradas'
                ? 'from-blue-500 to-blue-600'
                : 'from-amber-500 to-orange-600'
            } p-6 rounded-t-2xl sticky top-0 z-10`}
          >
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">
                {tipo === 'cadastradas' ? '📋 Empresas Cadastradas' : '🆕 Empresas Novas'} (
                {empresasFiltradas.length})
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={recarregarEmpresas}
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-lg transition-colors"
                  title="Recarregar lista"
                >
                  <RefreshCw size={16} />
                </button>
                <button
                  onClick={onClose}
                  className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Busca */}
          <div className="p-6">
            <div className="mb-6">
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Buscar por código, CNPJ ou razão social..."
                  value={buscaEmpresa}
                  onChange={(e) => setBuscaEmpresa(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Grid de Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {empresasFiltradas.map((empresa) => (
                <div
                  key={empresa.id}
                  className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between h-full"
                  onClick={() => setEmpresaSelecionada(empresa)}
                >
                  <div className="flex-grow">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1 min-w-0">
                        <h4
                          className="font-bold text-gray-900 text-sm sm:text-base truncate max-w-[180px] md:max-w-[200px] lg:max-w-[220px]"
                          title={empresa.razao_social}
                        >
                          {empresa.razao_social}
                        </h4>

                        {empresa.apelido && (
                          <p
                            className="text-sm text-gray-600 truncate max-w-[180px] md:max-w-[200px] lg:max-w-[220px]"
                            title={empresa.apelido}
                          >
                            ({empresa.apelido})
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                          {empresa.codigo}
                        </span>

                        {!empresa.cadastrada && (
                          <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
                            <AlertCircle size={10} />
                            Nova
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1 text-xs text-gray-600">
                      <p>📄 CNPJ: {empresa.cnpj}</p>
                      {empresa.cidade && empresa.estado && (
                        <p>
                          📍 {empresa.cidade}/{empresa.estado}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEmpresaSelecionada(empresa);
                      }}
                      className="w-full bg-blue-500 text-white px-3 py-1.5 rounded text-xs hover:bg-blue-600"
                    >
                      Ver Detalhes
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {empresasFiltradas.length === 0 && (
              <div className="text-center py-12">
                <Building size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-600">Nenhuma empresa encontrada</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Detalhes */}
      {empresaSelecionada && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto m-4">
            {/* Header Detalhes */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">📊 Detalhes da Empresa</h3>
                <button
                  onClick={() => setEmpresaSelecionada(null)}
                  className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Conteúdo Detalhes */}
            <div className="p-6 space-y-6">
              {/* Informações Principais */}
              <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                <h4 className="font-semibold text-green-800 mb-4">Informações Principais</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Razão Social
                    </label>
                    <p className="text-gray-900 font-semibold">
                      {empresaSelecionada.razao_social}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Código</label>
                    <p className="text-gray-900 font-semibold">{empresaSelecionada.codigo}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CNPJ</label>
                    <p className="text-gray-900">{empresaSelecionada.cnpj}</p>
                  </div>
                  {empresaSelecionada.apelido && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nome Fantasia
                      </label>
                      <p className="text-gray-900">{empresaSelecionada.apelido}</p>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Data de Abertura
                    </label>
                    <p className="text-gray-900">
                      {formatarData(empresaSelecionada.data_abertura)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Inscrições e Regimes */}
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-4">Inscrições e Regimes</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {empresaSelecionada.inscricao_estadual && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Inscrição Estadual (IE)
                      </label>
                      <p className="text-gray-900 break-words">
                        {empresaSelecionada.inscricao_estadual}
                      </p>
                    </div>
                  )}
                  {empresaSelecionada.inscricao_municipal && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Inscrição Municipal (IM)
                      </label>
                      <p className="text-gray-900 break-words">
                        {empresaSelecionada.inscricao_municipal}
                      </p>
                    </div>
                  )}
                  {empresaSelecionada.regime_federal && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Regime Federal
                      </label>
                      <p className="text-gray-900">{empresaSelecionada.regime_federal}</p>
                    </div>
                  )}
                  {empresaSelecionada.regime_estadual && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Regime Estadual
                      </label>
                      <p className="text-gray-900 break-words">
                        {empresaSelecionada.regime_estadual}
                      </p>
                    </div>
                  )}
                  {empresaSelecionada.regime_municipal && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Regime Municipal
                      </label>
                      <p className="text-gray-900 break-words">
                        {empresaSelecionada.regime_municipal}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Endereço */}
              <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                <h4 className="font-semibold text-purple-800 mb-4">Endereço</h4>
                <div className="space-y-2">
                  {empresaSelecionada.logradouro && (
                    <p className="text-gray-900">
                      {empresaSelecionada.logradouro}
                      {empresaSelecionada.numero && `, ${empresaSelecionada.numero}`}
                    </p>
                  )}
                  {empresaSelecionada.bairro && (
                    <p className="text-gray-900">
                      {empresaSelecionada.bairro}
                      {empresaSelecionada.cidade && empresaSelecionada.estado && (
                        <> - {empresaSelecionada.cidade}/{empresaSelecionada.estado}</>
                      )}
                    </p>
                  )}
                  {empresaSelecionada.cep && (
                    <p className="text-gray-900">CEP: {empresaSelecionada.cep}</p>
                  )}
                </div>
              </div>

              {/* Botões de Ação (Admin) */}
              <div className="flex gap-3">
                <button
                  onClick={() => handleEditar(empresaSelecionada)}
                  className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 flex items-center justify-center gap-2"
                >
                  <Edit size={16} />
                  Editar
                </button>
                <button
                  onClick={() => handleExcluir(empresaSelecionada)}
                  className="px-6 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 flex items-center gap-2"
                >
                  <Trash2 size={16} />
                  Excluir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}