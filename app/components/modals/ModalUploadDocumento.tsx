'use client';

import React from 'react';
import { X, Upload, File, Trash2, Download } from 'lucide-react';

interface Documento {
  id: number;
  nome: string;
  tamanho: string;
  tipo: string;
  dataUpload: Date;
}

interface ModalUploadDocumentoProps {
  processoId?: number;
  onClose: () => void;
}

export default function ModalUploadDocumento({
  processoId,
  onClose,
}: ModalUploadDocumentoProps) {
  const [documentos, setDocumentos] = React.useState<Documento[]>([
    {
      id: 1,
      nome: 'Contrato_Social.pdf',
      tamanho: '2.4 MB',
      tipo: 'PDF',
      dataUpload: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
    {
      id: 2,
      nome: 'RG_Socio.jpg',
      tamanho: '1.2 MB',
      tipo: 'Imagem',
      dataUpload: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
  ]);

  const [uploading, setUploading] = React.useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setUploading(true);
      // Simulando upload
      for (const file of files) {
        setDocumentos([
          ...documentos,
          {
            id: Math.max(...documentos.map((d) => d.id), 0) + 1,
            nome: file.name,
            tamanho: (file.size / 1024 / 1024).toFixed(1) + ' MB',
            tipo: file.type.split('/')[1].toUpperCase() || 'Arquivo',
            dataUpload: new Date(),
          },
        ]);
      }
      setUploading(false);
    }
  };

  const handleRemover = (id: number) => {
    setDocumentos(documentos.filter((d) => d.id !== id));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl transform transition-all duration-300 max-h-96 overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Upload size={24} />
            Upload de Documentos
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Área de Upload */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-cyan-500 hover:bg-cyan-50 transition-colors cursor-pointer relative">
            <input
              type="file"
              multiple
              onChange={handleUpload}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <Upload size={48} className="mx-auto text-gray-400 mb-2" />
            <p className="font-semibold text-gray-900 mb-1">
              {uploading ? 'Enviando...' : 'Clique ou arraste arquivos aqui'}
            </p>
            <p className="text-sm text-gray-600">
              Formatos suportados: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG
            </p>
          </div>

          {/* Lista de Documentos */}
          {documentos.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900">
                Documentos Enviados ({documentos.length})
              </h3>
              <div className="space-y-2">
                {documentos.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <File size={20} className="text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{doc.nome}</p>
                        <p className="text-xs text-gray-600">
                          {doc.tamanho} • {doc.dataUpload.toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors">
                        <Download size={18} />
                      </button>
                      <button
                        onClick={() => handleRemover(doc.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Botão de Fechar */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="w-full px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all font-medium"
            >
              Concluído
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
