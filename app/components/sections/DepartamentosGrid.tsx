'use client';

import React, { useState } from 'react';
import { Plus, Building, GripVertical, Trash2, Edit2 } from 'lucide-react';
import { useSistema, Departamento, Processo } from '@/app/context/SistemaContext';

interface DepartamentosGridProps {
  onCriarDepartamento: () => void;
  onEditarDepartamento: (dept: Departamento) => void;
  onExcluirDepartamento: (dept: Departamento) => void;
  onProcessoClicado?: (processo: Processo) => void;
}

export default function DepartamentosGrid({
  onCriarDepartamento,
  onEditarDepartamento,
  onExcluirDepartamento,
  onProcessoClicado,
}: DepartamentosGridProps) {
  const { departamentos, processos, usuarioLogado } = useSistema();
  const [draggedProcess, setDraggedProcess] = useState<Processo | null>(null);

  const temPermissao = (permissao: string) => {
    return usuarioLogado?.permissoes?.includes(permissao) || usuarioLogado?.role === 'admin';
  };

  const getProcessosDepartamento = (deptId: number) => {
    return processos.filter((p) => p.departamentoAtual === deptId && p.status === 'Em Andamento');
  };

  const handleDragStart = (e: React.DragEvent, processo: Processo) => {
    setDraggedProcess(processo);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, deptId: number) => {
    e.preventDefault();
    if (draggedProcess) {
      // Implementar lógica de drop
      setDraggedProcess(null);
    }
  };

  if (departamentos.length === 0) {
    return (
      <div className="col-span-4 text-center py-12">
        <Building size={64} className="mx-auto text-gray-300 mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Nenhum departamento criado</h3>
        <p className="text-gray-600 mb-6">Crie seu primeiro departamento para começar a gerenciar processos</p>
        <button
          onClick={onCriarDepartamento}
          className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-8 py-4 rounded-xl font-medium inline-flex items-center gap-2"
        >
          <Plus size={20} />
          Criar Primeiro Departamento
        </button>
      </div>
    );
  }

  return (
    <>
      {departamentos.map((dept) => {
        const processosDept = getProcessosDepartamento(dept.id);

        return (
          <div
            key={dept.id}
            className="bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300"
          >
            {/* Header do Departamento */}
            <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-4 text-white">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold">{dept.nome}</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => onEditarDepartamento(dept)}
                    className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => onExcluirDepartamento(dept)}
                    className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <p className="text-sm opacity-90">{dept.descricao || 'Sem descrição'}</p>
            </div>

            {/* Lista de Processos */}
            <div
              className="p-4 min-h-96 space-y-3"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, dept.id)}
            >
              {processosDept.length === 0 ? (
                <div className="h-96 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
                  <Building size={48} className="mb-2 opacity-50" />
                  <p>Nenhum processo</p>
                  <p className="text-sm">Arraste processos aqui</p>
                </div>
              ) : (
                processosDept.map((proc) => (
                  <div
                    key={proc.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, proc)}
                    onClick={() => onProcessoClicado?.(proc)}
                    className="bg-white p-3 rounded-lg border border-gray-200 hover:border-cyan-400 hover:shadow-md cursor-move transition-all"
                  >
                    <div className="flex items-start gap-2">
                      <GripVertical size={16} className="text-gray-400 mt-1 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-sm truncate">{proc.empresa}</p>
                        <p className="text-xs text-gray-600 truncate">{proc.nome}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 bg-gray-50 text-center text-sm text-gray-600">
              {processosDept.length} processo(s) em andamento
            </div>
          </div>
        );
      })}
    </>
  );
}
