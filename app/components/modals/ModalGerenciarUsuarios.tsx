'use client';

import React, { useState, useEffect } from 'react';
import { X, Trash2, UserPlus, Edit, Check, User, Play, Pause } from 'lucide-react';
import { useSistema } from '@/app/context/SistemaContext';

interface ModalGerenciarUsuariosProps {
  onClose: () => void;
}

export default function ModalGerenciarUsuarios({ onClose }: ModalGerenciarUsuariosProps) {
  const { departamentos } = useSistema();
  
  const [usuarios, setUsuarios] = useState([
    {
      id: 1,
      nome: 'Admin',
      role: 'admin',
      ativo: true,
      departamento: 'N/A',
    },
    {
      id: 2,
      nome: 'Gerente Análise',
      role: 'gerente',
      ativo: true,
      departamento: 'Análise',
    },
  ]);

  const [novoUsuario, setNovoUsuario] = useState({ 
    nome: '', 
    senha: '',
    role: 'comum', 
    departamento: '' 
  });
  
  const [editandoUsuario, setEditandoUsuario] = useState(null);
  const [showConfirmacaoExclusao, setShowConfirmacaoExclusao] = useState(null);
  const [showAlteracaoStatus, setShowAlteracaoStatus] = useState(null);

  const permissoesDisponiveis = [
    { id: "criar_processo", label: "Criar Processos" },
    { id: "editar_processo", label: "Editar Processos" },
    { id: "excluir_processo", label: "Excluir Processos" },
    { id: "criar_tag", label: "Criar Tags" },
    { id: "editar_tag", label: "Editar Tags" },
    { id: "excluir_tag", label: "Excluir Tags" },
    { id: "criar_departamento", label: "Criar Departamentos" },
    { id: "editar_departamento", label: "Editar Departamentos" },
    { id: "excluir_departamento", label: "Excluir Departamentos" },
    { id: "gerenciar_usuarios", label: "Gerenciar Usuários" }
  ];

  const handleCriarUsuario = () => {
    if (!novoUsuario.nome || !novoUsuario.senha) {
      alert('Preencha nome e senha');
      return;
    }

    if (novoUsuario.role === 'gerente' && !novoUsuario.departamento) {
      alert('Selecione um departamento para o gerente');
      return;
    }

    setUsuarios([
      ...usuarios,
      {
        id: Date.now(),
        nome: novoUsuario.nome,
        role: novoUsuario.role,
        ativo: true,
        departamento: novoUsuario.role === 'gerente' ? novoUsuario.departamento : 'N/A',
      },
    ]);
    
    setNovoUsuario({ nome: '', senha: '', role: 'comum', departamento: '' });
  };

  const handleEditarUsuario = () => {
    if (!editandoUsuario.nome) {
      alert('Preencha o nome do usuário');
      return;
    }

    setUsuarios(usuarios.map(u => 
      u.id === editandoUsuario.id ? editandoUsuario : u
    ));
    
    setEditandoUsuario(null);
  };

  const handleExcluirUsuario = (id: number) => {
    setUsuarios(usuarios.filter(u => u.id !== id));
    setShowConfirmacaoExclusao(null);
  };

  const toggleStatusUsuario = (usuario) => {
    setUsuarios(usuarios.map(u => 
      u.id === usuario.id ? { ...u, ativo: !u.ativo } : u
    ));
    setShowAlteracaoStatus(null);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-t-2xl sticky top-0 z-10">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">Gerenciar Usuários</h3>
              <button 
                onClick={onClose} 
                className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Formulário Criar/Editar */}
            <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
              <h4 className="font-semibold text-gray-800 mb-4">
                {editandoUsuario ? `Editando: ${editandoUsuario.nome}` : 'Criar Novo Usuário'}
              </h4>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome do usuário *
                    </label>
                    <input
                      type="text"
                      placeholder="Nome do usuário"
                      value={editandoUsuario ? editandoUsuario.nome : novoUsuario.nome}
                      onChange={(e) => editandoUsuario 
                        ? setEditandoUsuario({ ...editandoUsuario, nome: e.target.value })
                        : setNovoUsuario({ ...novoUsuario, nome: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {editandoUsuario ? 'Nova Senha (opcional)' : 'Senha *'}
                    </label>
                    <input
                      type="password"
                      placeholder={editandoUsuario ? "Nova senha (opcional)" : "Senha"}
                      value={editandoUsuario ? (editandoUsuario.senha || '') : novoUsuario.senha}
                      onChange={(e) => editandoUsuario
                        ? setEditandoUsuario({ ...editandoUsuario, senha: e.target.value })
                        : setNovoUsuario({ ...novoUsuario, senha: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo de Usuário
                    </label>
                    <select
                      value={editandoUsuario ? editandoUsuario.role : novoUsuario.role}
                      onChange={(e) => {
                        const newRole = e.target.value;
                        if (editandoUsuario) {
                          setEditandoUsuario({ ...editandoUsuario, role: newRole });
                        } else {
                          setNovoUsuario({ ...novoUsuario, role: newRole });
                        }
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="comum">Usuário Comum</option>
                      <option value="gerente">Gerente</option>
                      <option value="admin">Administrador</option>
                    </select>
                  </div>

                  {(editandoUsuario ? editandoUsuario.role === 'gerente' : novoUsuario.role === 'gerente') && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Departamento *
                      </label>
                      <select
                        value={editandoUsuario ? editandoUsuario.departamento : novoUsuario.departamento}
                        onChange={(e) => editandoUsuario
                          ? setEditandoUsuario({ ...editandoUsuario, departamento: e.target.value })
                          : setNovoUsuario({ ...novoUsuario, departamento: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="">Selecione...</option>
                        {departamentos.map(d => (
                          <option key={d.id} value={d.nome}>{d.nome}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {editandoUsuario && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <div className="flex items-center gap-2 mt-2">
                        <input
                          type="checkbox"
                          checked={editandoUsuario.ativo}
                          onChange={(e) => setEditandoUsuario({ 
                            ...editandoUsuario, 
                            ativo: e.target.checked 
                          })}
                          className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                        />
                        <label className="text-sm font-medium text-gray-700">
                          Usuário ativo
                        </label>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-2">
                  {editandoUsuario ? (
                    <>
                      <button
                        onClick={() => setEditandoUsuario(null)}
                        className="flex-1 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={handleEditarUsuario}
                        className="flex-1 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
                      >
                        Salvar Alterações
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={handleCriarUsuario}
                      className="w-full bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 font-medium"
                    >
                      Criar Usuário
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Lista de Usuários */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">
                Usuários Cadastrados ({usuarios.length})
              </h4>

              <div className="space-y-3">
                {usuarios.map(user => (
                  <div key={user.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                          {user.nome.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium">{user.nome}</div>
                          <div className="text-sm text-gray-600">
                            {user.role === 'admin' && 'Administrador'}
                            {user.role === 'gerente' && `Gerente - ${user.departamento}`}
                            {user.role === 'comum' && 'Usuário Comum'}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          user.ativo 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {user.ativo ? 'Ativo' : 'Inativo'}
                        </span>

                        <div className="flex gap-1">
                          <button
                            onClick={() => setShowAlteracaoStatus(user)}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"
                            title={user.ativo ? "Desativar" : "Ativar"}
                          >
                            {user.ativo ? <Pause size={16} /> : <Play size={16} />}
                          </button>

                          <button
                            onClick={() => setEditandoUsuario(user)}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"
                            title="Editar"
                          >
                            <Edit size={16} />
                          </button>

                          <button
                            onClick={() => setShowConfirmacaoExclusao(user)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                            title="Excluir"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Confirmação Exclusão */}
      {showConfirmacaoExclusao && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[100]">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4">
            <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 rounded-t-2xl">
              <h3 className="text-xl font-bold text-white">Excluir Usuário</h3>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-6">
                Tem certeza que deseja excluir o usuário <strong>{showConfirmacaoExclusao.nome}</strong>?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmacaoExclusao(null)}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-100"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleExcluirUsuario(showConfirmacaoExclusao.id)}
                  className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700"
                >
                  Excluir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Alteração Status */}
      {showAlteracaoStatus && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[100]">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4">
            <div className={`bg-gradient-to-r ${
              showAlteracaoStatus.ativo 
                ? 'from-amber-500 to-amber-600' 
                : 'from-green-500 to-green-600'
            } p-6 rounded-t-2xl`}>
              <h3 className="text-xl font-bold text-white">
                {showAlteracaoStatus.ativo ? 'Desativar' : 'Ativar'} Usuário
              </h3>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-6">
                Deseja {showAlteracaoStatus.ativo ? 'desativar' : 'ativar'} o usuário <strong>{showAlteracaoStatus.nome}</strong>?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowAlteracaoStatus(null)}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-100"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => toggleStatusUsuario(showAlteracaoStatus)}
                  className={`flex-1 px-6 py-3 text-white rounded-xl ${
                    showAlteracaoStatus.ativo 
                      ? 'bg-amber-600 hover:bg-amber-700' 
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {showAlteracaoStatus.ativo ? 'Desativar' : 'Ativar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}