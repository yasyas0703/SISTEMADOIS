'use client';

import React from 'react';
import { X, MessageCircle, Send, Trash2, Edit2 } from 'lucide-react';
import { useSistema, Processo } from '@/app/context/SistemaContext';

interface ModalComentariosProps {
  processoId: number;
  processo?: Processo;
  onClose: () => void;
}

export default function ModalComentarios({
  processoId,
  processo,
  onClose,
}: ModalComentariosProps) {
  const [comentarios, setComentarios] = React.useState([
    {
      id: 1,
      autor: 'João Silva',
      texto: 'Iniciado análise de documentos',
      data: new Date(Date.now() - 2 * 60 * 60 * 1000),
      editado: false,
    },
    {
      id: 2,
      autor: 'Maria Santos',
      texto: 'Documentação em conformidade',
      data: new Date(Date.now() - 1 * 60 * 60 * 1000),
      editado: true,
    },
  ]);

  const [novoComentario, setNovoComentario] = React.useState('');

  const handleAdicionarComentario = () => {
    if (novoComentario.trim()) {
      setComentarios([
        ...comentarios,
        {
          id: Math.max(...comentarios.map((c) => c.id), 0) + 1,
          autor: 'Você',
          texto: novoComentario,
          data: new Date(),
          editado: false,
        },
      ]);
      setNovoComentario('');
    }
  };

  const handleRemover = (id: number) => {
    setComentarios(comentarios.filter((c) => c.id !== id));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl transform transition-all duration-300 flex flex-col max-h-96">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <MessageCircle size={24} />
            Comentários - {processo?.empresa || `Processo #${processoId}`}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {comentarios.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MessageCircle size={48} className="mx-auto mb-2 opacity-30" />
              <p>Nenhum comentário ainda</p>
            </div>
          ) : (
            comentarios.map((comentario) => (
              <div
                key={comentario.id}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold text-gray-900">{comentario.autor}</p>
                    <p className="text-xs text-gray-600">
                      {comentario.data.toLocaleString('pt-BR')}
                      {comentario.editado && ' (editado)'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors">
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleRemover(comentario.id)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <p className="text-gray-700 text-sm">{comentario.texto}</p>
              </div>
            ))
          )}
        </div>

        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="flex gap-2">
            <input
              type="text"
              value={novoComentario}
              onChange={(e) => setNovoComentario(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAdicionarComentario()}
              placeholder="Adicione um comentário..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
            <button
              onClick={handleAdicionarComentario}
              className="bg-cyan-500 text-white px-4 py-2 rounded-lg hover:bg-cyan-600 transition-colors flex items-center gap-2"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
