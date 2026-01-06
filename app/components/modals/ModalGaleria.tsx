'use client';

import React from 'react';
import { X, File, Download, Eye, Trash2 } from 'lucide-react';
import { useSistema } from '@/app/context/SistemaContext';

interface GaleriaDocumentosProps {
  onClose: () => void;
}

export default function GaleriaDocumentos({ onClose }: GaleriaDocumentosProps) {
  const [documentos] = React.useState([
    {
      id: 1,
      nome: 'Contrato_Social.pdf',
      tamanho: '2.4 MB',
      tipo: 'PDF',
      departamento: 'Análise',
      dataUpload: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    },
    {
      id: 2,
      nome: 'RG_Socio.jpg',
      tamanho: '1.2 MB',
      tipo: 'Imagem',
      departamento: 'Recebimento',
      dataUpload: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
    {
      id: 3,
      nome: 'Comprovante_Endereco.pdf',
      tamanho: '890 KB',
      tipo: 'PDF',
      departamento: 'Análise',
      dataUpload: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
  ]);

  const getIconeByTipo = (tipo: string) => {
    return <File size={24} className="text-gray-400" />;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl transform transition-all duration-300 max-h-96 overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-xl font-bold text-gray-900">Galeria de Documentos</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {documentos.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <File size={48} className="mx-auto mb-2 opacity-30" />
              <p>Nenhum documento disponível</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {documentos.map((doc) => (
                <div
                  key={doc.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all hover:bg-gray-50"
                >
                  <div className="flex justify-center mb-3">{getIconeByTipo(doc.tipo)}</div>
                  <p className="font-medium text-gray-900 text-sm text-center truncate">
                    {doc.nome}
                  </p>
                  <p className="text-xs text-gray-600 text-center mt-1">
                    {doc.tamanho} • {doc.tipo}
                  </p>
                  <p className="text-xs text-gray-500 text-center mt-1">
                    {doc.departamento}
                  </p>
                  <div className="flex gap-2 mt-4">
                    <button className="flex-1 p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors flex items-center justify-center gap-1">
                      <Eye size={14} />
                      <span className="text-xs">Ver</span>
                    </button>
                    <button className="flex-1 p-2 text-cyan-600 hover:bg-cyan-50 rounded transition-colors flex items-center justify-center gap-1">
                      <Download size={14} />
                      <span className="text-xs">Baixar</span>
                    </button>
                    <button className="flex-1 p-2 text-red-600 hover:bg-red-50 rounded transition-colors flex items-center justify-center gap-1">
                      <Trash2 size={14} />
                      <span className="text-xs">Apagar</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
