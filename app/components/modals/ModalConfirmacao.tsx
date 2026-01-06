'use client';

import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';

interface ModalConfirmacaoProps {
  titulo: string;
  mensagem: string;
  onConfirm: () => void;
  onCancel: () => void;
  tipo?: 'info' | 'warning' | 'error' | 'success';
  textoConfirmar?: string;
  textoCancelar?: string;
}

export default function ModalConfirmacao({
  titulo,
  mensagem,
  onConfirm,
  onCancel,
  tipo = 'info',
  textoConfirmar = 'Confirmar',
  textoCancelar = 'Cancelar',
}: ModalConfirmacaoProps) {
  const getColors = () => {
    switch (tipo) {
      case 'error':
        return { bg: 'from-red-500 to-red-600', icon: 'text-red-600' };
      case 'warning':
        return { bg: 'from-amber-500 to-amber-600', icon: 'text-amber-600' };
      case 'success':
        return { bg: 'from-green-500 to-green-600', icon: 'text-green-600' };
      default:
        return { bg: 'from-blue-500 to-blue-600', icon: 'text-blue-600' };
    }
  };

  const colors = getColors();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100">
        <div className={`bg-gradient-to-r ${colors.bg} p-6 rounded-t-2xl`}>
          <div className="flex items-center gap-3">
            <div className="bg-white bg-opacity-20 p-2 rounded-full">
              <AlertCircle size={24} className="text-white" />
            </div>
            <h3 className="text-xl font-bold text-white">{titulo}</h3>
          </div>
        </div>

        <div className="p-6">
          <p className="text-gray-700 text-center mb-6">{mensagem}</p>

          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-6 py-3 text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-100 transition-all duration-200 font-medium"
            >
              {textoCancelar}
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 px-6 py-3 text-white rounded-xl font-medium transition-all duration-200 bg-gradient-to-r ${colors.bg}`}
            >
              {textoConfirmar}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
