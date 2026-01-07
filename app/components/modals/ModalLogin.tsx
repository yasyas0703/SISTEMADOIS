'use client';

import React, { useState } from 'react';
import { LogIn } from 'lucide-react';
import ModalBase from './ModalBase';

interface ModalLoginProps {
  onLogin: (usuario: any) => void;
}

export default function ModalLogin({ onLogin }: ModalLoginProps) {
  const [formData, setFormData] = useState({
    nome: '',
    senha: '',
  });

  const [erro, setErro] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');

    if (!formData.nome || !formData.senha) {
      setErro('Preencha todos os campos');
      return;
    }

    if (formData.nome === 'admin' && formData.senha === 'admin123') {
      const usuario = {
        id: 1,
        nome: 'Admin',
        role: 'admin' as const,
        ativo: true,
        criadoEm: new Date(),
        permissoes: [
          'criar_processo',
          'editar_processo',
          'excluir_processo',
          'criar_departamento',
          'editar_departamento',
          'excluir_departamento',
          'gerenciar_usuarios',
        ],
      };
      onLogin(usuario);
    } else {
      setErro('Credenciais inválidas');
    }
  };

  return (
    <ModalBase
      isOpen
      onClose={() => {}}
      labelledBy="login-title"
      describedBy="login-desc"
      initialFocusSelector="#login-user"
      dialogClassName="w-full max-w-md bg-white dark:bg-[var(--card)] rounded-2xl shadow-2xl outline-none"
    >
        {/* Card Principal */}
        <div className="bg-white dark:bg-[var(--card)] rounded-2xl overflow-hidden">
          {/* Header com Gradient */}
          <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-8 text-white">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 rounded-xl bg-white/20 flex items-center justify-center">
                <img
                  src="/triar.png"
                  alt="Logo"
                  className="w-12 h-12 object-contain"
                />
              </div>
            </div>
            <h1 id="login-title" className="text-3xl font-bold text-center">Sistema de Abertura</h1>
            <p id="login-desc" className="text-center text-white/90 mt-2">Gerenciamento de Processos</p>
          </div>

          {/* Form */}
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                  Usuário
                </label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-[var(--border)] rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition-all duration-200 text-gray-900 dark:text-[var(--fg)] bg-white dark:bg-[var(--card)]"
                  placeholder="Seu usuário"
                  id="login-user"
                  aria-required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                  Senha
                </label>
                <input
                  type="password"
                  value={formData.senha}
                  onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-[var(--border)] rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition-all duration-200 text-gray-900 dark:text-[var(--fg)] bg-white dark:bg-[var(--card)]"
                  placeholder="Sua senha"
                  aria-required
                />
              </div>

              {erro && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm" role="alert">
                  {erro}
                </div>
              )}

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-600 text-sm">
                <p className="font-semibold mb-1">Demo Credentials:</p>
                <p>Usuário: <span className="font-mono">admin</span></p>
                <p>Senha: <span className="font-mono">admin123</span></p>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
              >
                <LogIn size={20} />
                Entrar
              </button>
            </form>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-[var(--border)] text-center text-sm text-gray-600 dark:text-gray-300">
            Versão 1.0 - Sistema de Abertura © 2026
          </div>
        </div>
    </ModalBase>
  );
}
