'use client';

import React from 'react';
import { X, Calendar, CheckCircle, Star, ArrowRight, FileText, Eye, Download, MessageSquare } from 'lucide-react';
import { useSistema } from '@/app/context/SistemaContext';
import { formatarDataHora } from '@/app/utils/helpers';

interface VisualizacaoCompletaProps {
  processo: any;
  onClose: () => void;
}

export default function VisualizacaoCompleta({ processo, onClose }: VisualizacaoCompletaProps) {
  const { departamentos, setShowUploadDocumento, setShowGaleria, setShowPreviewDocumento } = useSistema();

  const prioridadeTexto = (p?: string) => {
    if (!p) return 'Média';
    return p.charAt(0).toUpperCase() + p.slice(1);
  };

  const respostasPorDept = processo?.respostasHistorico || {};
  const documentos = Array.isArray(processo?.documentos) ? processo.documentos : [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-[10010] p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold text-white">Processo Completo</h3>
              <p className="text-white opacity-90 text-sm">{processo?.nomeEmpresa || processo?.empresa || 'Empresa'}</p>
            </div>
            <button onClick={onClose} className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-8">
          <div className="bg-gray-50 rounded-xl p-6">
            <h4 className="font-bold text-gray-800 mb-4">Informações Gerais</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <span className="font-medium text-gray-600">Cliente:</span>
                <div className="text-gray-800">{processo?.cliente || '-'}</div>
              </div>
              <div>
                <span className="font-medium text-gray-600">Status:</span>
                <div className="text-gray-800">{processo?.status || '-'}</div>
              </div>
              <div>
                <span className="font-medium text-gray-600">Prioridade:</span>
                <div className="text-gray-800">{prioridadeTexto(processo?.prioridade)}</div>
              </div>
            </div>
          </div>

          {departamentos.map((dept: any) => {
            const respostasDept = respostasPorDept[dept.id];
            const hasRespostas = !!respostasDept && respostasDept.questionario && Object.keys(respostasDept.respostas || {}).length > 0;
            if (!hasRespostas) return null;

            return (
              <div key={dept.id} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  {typeof dept.icone === 'function' ? (() => { const Icon = dept.icone as any; return <Icon size={20} />; })() : null}
                  {dept.nome} {dept.responsavel ? `- ${dept.responsavel}` : ''}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {respostasDept.questionario.map((pergunta: any) => {
                    const resposta = respostasDept.respostas?.[pergunta.id];
                    if (resposta === undefined || resposta === null || resposta === '') return null;
                    return (
                      <div key={pergunta.id} className={pergunta.tipo === 'textarea' ? 'md:col-span-2' : ''}>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <label className="block text-sm font-medium text-gray-600 mb-2">{pergunta.label}</label>
                          <div className="text-gray-800">
                            {pergunta.tipo === 'textarea' ? (
                              <div className="whitespace-pre-wrap">{String(resposta)}</div>
                            ) : (
                              String(resposta)
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h4 className="font-bold text-gray-800 mb-4">Histórico Completo</h4>
            <div className="space-y-4">
              {(processo?.historico || []).map((item: any, index: number) => (
                <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="mt-1">
                    {item.tipo === 'inicio' && <Calendar className="text-blue-500" size={16} />}
                    {item.tipo === 'conclusao' && <CheckCircle className="text-green-500" size={16} />}
                    {item.tipo === 'finalizacao' && <Star className="text-yellow-500" size={16} />}
                    {item.tipo === 'movimentacao' && <ArrowRight className="text-purple-500" size={16} />}
                    {item.tipo === 'documento' && <FileText className="text-cyan-600" size={16} />}
                    {item.tipo === 'comentario' && <MessageSquare className="text-gray-600" size={16} />}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{item.acao}</div>
                    <div className="text-sm text-gray-600 mt-1">
                      <span className="bg-gray-200 px-2 py-1 rounded">{item.departamento}</span>
                      <span className="mx-2">•</span>
                      <span>{item.responsavel}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{formatarDataHora(item.data)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h4 className="font-bold text-gray-800 mb-4 flex items-center justify-between">
              <span>Documentos do Processo</span>
              <button
                onClick={() => {
                  onClose();
                  setShowUploadDocumento(processo);
                }}
                className="bg-cyan-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-cyan-700 flex items-center gap-2"
              >
                <Download size={16} className="opacity-0" />
                Adicionar Documento
              </button>
            </h4>

            {documentos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {documentos.map((doc: any) => (
                  <div key={doc.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <FileText size={16} className="text-gray-400" />
                        <span className="font-medium text-sm">{doc.nome}</span>
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => setShowPreviewDocumento(doc)} className="p-1 text-cyan-600 hover:bg-cyan-100 rounded">
                          <Eye size={14} />
                        </button>
                        <a href={doc.url} download={doc.nome} className="p-1 text-gray-600 hover:bg-gray-100 rounded">
                          <Download size={14} />
                        </a>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {(Number(doc.tamanho || 0) / 1024 / 1024).toFixed(2)} MB
                    </div>
                    <div className="text-xs text-gray-500">{formatarDataHora(doc.dataUpload)}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FileText size={48} className="mx-auto mb-4 opacity-30" />
                <p>Nenhum documento enviado ainda</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
