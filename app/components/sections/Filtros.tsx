'use client';

import React, { useState } from 'react';
import { Search, Filter, ChevronDown } from 'lucide-react';
import { useSistema } from '@/app/context/SistemaContext';

interface FiltrosProps {
  onBuscaChange: (busca: string) => void;
  onStatusChange: (status: string) => void;
  onTagsChange: (tags: number[]) => void;
  onDepartamentoChange: (deptId: number | null) => void;
}

export default function Filtros({
  onBuscaChange,
  onStatusChange,
  onTagsChange,
  onDepartamentoChange,
}: FiltrosProps) {
  const { tags, departamentos } = useSistema();
  const [filtroTags, setFiltroTags] = useState<number[]>([]);
  const [showTagsModal, setShowTagsModal] = useState(false);

  const handleTagChange = (tagId: number) => {
    const novasTags = filtroTags.includes(tagId)
      ? filtroTags.filter((t) => t !== tagId)
      : [...filtroTags, tagId];
    setFiltroTags(novasTags);
    onTagsChange(novasTags);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Busca */}
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar processos..."
              onChange={(e) => onBuscaChange(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 w-64"
            />
          </div>

          {/* Status */}
          <select
            onChange={(e) => onStatusChange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
          >
            <option value="todos">Todos os processos</option>
            <option value="andamento">Em andamento</option>
            <option value="finalizado">Finalizados</option>
            <option value="alta">Prioridade alta</option>
          </select>

          {/* Tags */}
          <div className="relative">
            <button
              onClick={() => setShowTagsModal(!showTagsModal)}
              className="px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 flex items-center gap-2"
            >
              <Filter size={16} />
              Tags {filtroTags.length > 0 && `(${filtroTags.length})`}
            </button>

            {showTagsModal && (
              <div className="absolute top-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl p-4 z-50 w-64">
                <div className="space-y-2">
                  {tags.map((tag) => (
                    <label
                      key={tag.id}
                      className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                    >
                      <input
                        type="checkbox"
                        checked={filtroTags.includes(tag.id)}
                        onChange={() => handleTagChange(tag.id)}
                        className="w-4 h-4"
                      />
                      <span className={`${tag.cor} ${tag.texto} px-2 py-1 rounded text-xs`}>
                        {tag.nome}
                      </span>
                    </label>
                  ))}
                </div>
                {filtroTags.length > 0 && (
                  <button
                    onClick={() => {
                      setFiltroTags([]);
                      onTagsChange([]);
                    }}
                    className="w-full mt-3 text-xs text-red-600 hover:text-red-700"
                  >
                    Limpar filtros
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Departamentos */}
          <select
            onChange={(e) => onDepartamentoChange(e.target.value ? parseInt(e.target.value) : null)}
            className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
          >
            <option value="">Todos os departamentos</option>
            {departamentos.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.nome}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
