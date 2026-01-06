'use client';

import React, { useState } from 'react';
import { X, Plus, Trash2, Tag } from 'lucide-react';
import { useSistema } from '@/app/context/SistemaContext';

interface ModalGerenciarTagsProps {
  onClose: () => void;
}

export default function ModalGerenciarTags({ onClose }: ModalGerenciarTagsProps) {
  const { tags, setTags } = useSistema();
  const [novaTag, setNovaTag] = useState({ nome: '', cor: 'bg-red-500' });

  const cores = [
    'bg-red-500',
    'bg-orange-500',
    'bg-yellow-500',
    'bg-green-500',
    'bg-blue-500',
    'bg-indigo-500',
    'bg-purple-500',
    'bg-pink-500',
  ];

  const handleAdicionarTag = () => {
    if (novaTag.nome) {
      const novaTagObj = {
        id: Math.max(...tags.map((t) => t.id), 0) + 1,
        nome: novaTag.nome,
        cor: novaTag.cor,
        texto: 'text-white',
      };
      setTags([...tags, novaTagObj]);
      setNovaTag({ nome: '', cor: 'bg-red-500' });
    }
  };

  const handleRemoverTag = (id: number) => {
    setTags(tags.filter((t) => t.id !== id));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl transform transition-all duration-300 max-h-96 overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Tag size={24} />
            Gerenciar Tags
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Adicionar Nova Tag */}
          <div className="border border-gray-200 rounded-lg p-4 space-y-3 bg-gray-50">
            <h3 className="font-semibold text-gray-900">Adicionar Tag</h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome *
                </label>
                <input
                  type="text"
                  value={novaTag.nome}
                  onChange={(e) => setNovaTag({ ...novaTag, nome: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  placeholder="Nome da tag"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cor
                </label>
                <select
                  value={novaTag.cor}
                  onChange={(e) => setNovaTag({ ...novaTag, cor: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                >
                  {cores.map((cor) => (
                    <option key={cor} value={cor}>
                      {cor.replace('bg-', '').replace('-500', '')}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-2">
              <div className={`${novaTag.cor} text-white px-3 py-2 rounded-lg text-sm font-medium`}>
                {novaTag.nome || 'Prévia da Tag'}
              </div>
              <button
                onClick={handleAdicionarTag}
                className="flex-1 bg-cyan-500 text-white px-4 py-2 rounded-lg hover:bg-cyan-600 transition-colors flex items-center justify-center gap-2 font-medium"
              >
                <Plus size={18} />
                Adicionar
              </button>
            </div>
          </div>

          {/* Lista de Tags */}
          {tags.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900">Tags ({tags.length})</h3>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <div
                    key={tag.id}
                    className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2"
                  >
                    <span className={`${tag.cor} ${tag.texto} px-2 py-0.5 rounded text-xs font-semibold`}>
                      {tag.nome}
                    </span>
                    <button
                      onClick={() => handleRemoverTag(tag.id)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
