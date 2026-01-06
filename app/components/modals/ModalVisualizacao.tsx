'use client';

import React from 'react';
import { X, AlertTriangle, Calendar, ClipboardList } from 'lucide-react';
import { useSistema } from '@/app/context/SistemaContext';

interface VisualizacaoCompletaProps {
  processo: any;
  onClose: () => void;
}

export default function VisualizacaoCompleta({
  processo,
  onClose,
}: VisualizacaoCompletaProps) {
  const { departamentos } = useSistema();

  const getDepartamentoNome = (id: number) => {
    return departamentos.find((d) => d.id === id)?.nome || 'Desconhecido';
  };

  const getPriorityColor = (prioridade: string) => {
    switch (prioridade) {
      case 'alta':
        return 'text-red-600 bg-red-50';
      case 'media':
        return 'text-amber-600 bg-amber-50';
      case 'baixa':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl transform transition-all duration-300 max-h-96 overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-xl font-bold text-gray-900">Detalhes do Processo</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Cabeçalho */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{processo.empresa}</h3>
            <p className="text-gray-600">{processo.nome}</p>
          </div>

          {/* Grid de Informações */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <p className="text-xs text-gray-600 uppercase font-semibold mb-1">ID</p>
              <p className="text-lg font-bold text-gray-900">#{processo.id}</p>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <p className="text-xs text-gray-600 uppercase font-semibold mb-1">Status</p>
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {processo.status}
              </span>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <p className="text-xs text-gray-600 uppercase font-semibold mb-1">Prioridade</p>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(processo.prioridade)}`}>
                {processo.prioridade.charAt(0).toUpperCase() + processo.prioridade.slice(1)}
              </span>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <p className="text-xs text-gray-600 uppercase font-semibold mb-1">Departamento</p>
              <p className="text-gray-900 font-medium">
                {getDepartamentoNome(processo.departamentoAtual)}
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <p className="text-xs text-gray-600 uppercase font-semibold mb-1">Criado em</p>
              <p className="text-gray-900 font-medium">
                {new Date(processo.criadoEm).toLocaleDateString('pt-BR')}
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <p className="text-xs text-gray-600 uppercase font-semibold mb-1">Criado por</p>
              <p className="text-gray-900 font-medium">{processo.criadoPor || 'Sistema'}</p>
            </div>
          </div>

          {/* Descrição */}
          {processo.descricao && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <ClipboardList size={18} />
                Descrição
              </h4>
              <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{processo.descricao}</p>
            </div>
          )}

          {/* Data de Entrega */}
          {processo.dataEntrega && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
              <Calendar className="text-blue-600 mt-1" size={20} />
              <div>
                <p className="font-semibold text-blue-900">Data de Entrega</p>
                <p className="text-blue-700">
                  {new Date(processo.dataEntrega).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
