'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalCadastrarEmpresaProps {
  onClose: () => void;
  empresa?: any;
}

export default function ModalCadastrarEmpresa({ onClose, empresa }: ModalCadastrarEmpresaProps) {
  const [empresaCadastrada, setEmpresaCadastrada] = useState(
    empresa ? empresa.cadastrada !== false : true
  );

  const [formData, setFormData] = useState({
    cnpj: '',
    codigo: '',
    razao_social: '',
    apelido: '',
    inscricao_estadual: '',
    inscricao_municipal: '',
    regime_federal: '',
    regime_estadual: '',
    regime_municipal: '',
    data_abertura: '',
    estado: '',
    cidade: '',
    bairro: '',
    logradouro: '',
    numero: '',
    cep: '',
    cadastrada: empresaCadastrada
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  useEffect(() => {
    handleChange('cadastrada', empresaCadastrada ? 'true' : 'false');
  }, [empresaCadastrada]);

  useEffect(() => {
    if (empresa) {
      setFormData(empresa);
      setEmpresaCadastrada(empresa.cadastrada !== false);
    }
  }, [empresa]);

  const formatarCPFCNPJ = (valor: string): string => {
    const apenasNumeros = valor.replace(/\D/g, '');

    if (apenasNumeros.length <= 11) {
      // Formatar como CPF: 000.000.000-00
      return apenasNumeros
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})/, '$1-$2')
        .replace(/(-\d{2})\d+?$/, '$1');
    } else {
      // Formatar como CNPJ: 00.000.000/0000-00
      return apenasNumeros
        .replace(/(\d{2})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1/$2')
        .replace(/(\d{4})(\d)/, '$1-$2')
        .replace(/(-\d{2})\d+?$/, '$1');
    }
  };

  const formatarCEP = (valor: string): string => {
    const apenasNumeros = valor.replace(/\D/g, '');
    if (apenasNumeros.length <= 5) {
      return apenasNumeros;
    }
    return `${apenasNumeros.slice(0, 5)}-${apenasNumeros.slice(5, 8)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.codigo || !formData.razao_social) {
      alert("Código e Razão Social são obrigatórios");
      return;
    }

    if (empresaCadastrada && !formData.cnpj) {
      alert("Empresas cadastradas precisam ter CNPJ");
      return;
    }

    const dadosParaSalvar = {
      ...formData,
      cadastrada: empresaCadastrada,
      cnpj: empresaCadastrada ? formData.cnpj : null
    };

    console.log('Salvando empresa:', dadosParaSalvar);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-t-2xl sticky top-0 z-10">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-white">
              {empresa ? "Editar Empresa" : "Cadastrar Nova Empresa"}
            </h3>
            <button onClick={onClose} className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg">
              <X size={20} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Tipo de Empresa */}
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-4">Tipo de Empresa</h4>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer bg-white p-4 rounded-lg border-2 border-gray-200 hover:border-blue-500 transition-all flex-1">
                <input
                  type="radio"
                  name="tipoCadastro"
                  checked={empresaCadastrada}
                  onChange={() => setEmpresaCadastrada(true)}
                  className="w-5 h-5 text-blue-600"
                />
                <div>
                  <div className="font-semibold text-gray-900">Empresa Cadastrada</div>
                  <div className="text-xs text-gray-600">Já possui CNPJ e Razão Social</div>
                </div>
              </label>

              <label className="flex items-center gap-2 cursor-pointer bg-white p-4 rounded-lg border-2 border-gray-200 hover:border-blue-500 transition-all flex-1">
                <input
                  type="radio"
                  name="tipoCadastro"
                  checked={!empresaCadastrada}
                  onChange={() => setEmpresaCadastrada(false)}
                  className="w-5 h-5 text-blue-600"
                />
                <div>
                  <div className="font-semibold text-gray-900">Empresa Nova</div>
                  <div className="text-xs text-gray-600">Ainda não possui CNPJ</div>
                </div>
              </label>
            </div>
          </div>

          {/* Dados Principais */}
          <div className="bg-green-50 rounded-xl p-4 border border-green-200">
            <h4 className="font-semibold text-green-800 mb-4">
              Dados Principais {empresaCadastrada && '*'}
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* CPF/CNPJ */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  CPF/CNPJ {empresaCadastrada && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="text"
                  value={formData.cnpj}
                  onChange={(e) => {
                    const valorFormatado = formatarCPFCNPJ(e.target.value);
                    handleChange('cnpj', valorFormatado);
                  }}
                  onKeyDown={(e) => {
                    if (
                      e.ctrlKey || e.metaKey ||
                      ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(e.key) ||
                      /^[0-9]$/.test(e.key)
                    ) return;
                    e.preventDefault();
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500"
                  placeholder={empresaCadastrada ? "000.000.000-00 ou 00.000.000/0000-00" : "Opcional"}
                  required={empresaCadastrada}
                  maxLength={18}
                />
              </div>

              {/* Código */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Código <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.codigo}
                  onChange={(e) => handleChange('codigo', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500"
                  placeholder="001"
                  required
                />
              </div>
            </div>

            {/* Razão Social e Apelido */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Razão Social {empresaCadastrada && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="text"
                  value={formData.razao_social}
                  onChange={(e) => handleChange('razao_social', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500"
                  placeholder={empresaCadastrada ? "Nome oficial da empresa" : "Nome provisório (opcional)"}
                  required={empresaCadastrada}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Apelido/Nome Fantasia
                </label>
                <input
                  type="text"
                  value={formData.apelido}
                  onChange={(e) => handleChange('apelido', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500"
                  placeholder="Apelido"
                />
              </div>
            </div>

            {!empresaCadastrada && (
              <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-800">
                  ⚠️ <strong>Empresa não cadastrada:</strong> Os campos CNPJ e Razão Social são opcionais.
                  Complete estas informações quando a empresa for oficializada.
                </p>
              </div>
            )}
          </div>

          {/* Inscrições e Regimes */}
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200 mt-6">
            <h4 className="font-semibold text-blue-800 mb-4">Inscrições e Regimes</h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Inscrição Estadual
                </label>
                <input
                  type="text"
                  value={formData.inscricao_estadual}
                  onChange={(e) => handleChange('inscricao_estadual', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Inscrição Municipal
                </label>
                <input
                  type="text"
                  value={formData.inscricao_municipal}
                  onChange={(e) => handleChange('inscricao_municipal', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Regime Federal
                </label>
                <select
                  value={formData.regime_federal}
                  onChange={(e) => handleChange('regime_federal', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecione...</option>
                  <option value="Simples Nacional">Simples Nacional</option>
                  <option value="Lucro Presumido">Lucro Presumido</option>
                  <option value="Lucro Real">Lucro Real</option>
                </select>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Regime Estadual
                </label>
                <input
                  type="text"
                  value={formData.regime_estadual}
                  onChange={(e) => handleChange('regime_estadual', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Regime Municipal
                </label>
                <input
                  type="text"
                  value={formData.regime_municipal}
                  onChange={(e) => handleChange('regime_municipal', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Endereço */}
          <div className="bg-purple-50 rounded-xl p-4 border border-purple-200 mt-6">
            <h4 className="font-semibold text-purple-800 mb-4">Endereço</h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  CEP
                </label>
                <input
                  type="text"
                  value={formData.cep}
                  onChange={(e) => {
                    const apenasNumeros = e.target.value.replace(/\D/g, '');
                    const valorFormatado = formatarCEP(apenasNumeros);
                    handleChange('cep', valorFormatado);
                  }}
                  onKeyDown={(e) => {
                    if (
                      e.ctrlKey || e.metaKey ||
                      ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(e.key) ||
                      /^[0-9]$/.test(e.key)
                    ) return;
                    e.preventDefault();
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
                  placeholder="00000-000"
                  maxLength={9}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Estado
                </label>
                <select
                  value={formData.estado}
                  onChange={(e) => handleChange('estado', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Selecione...</option>
                  <option value="AC">AC</option>
                  <option value="AL">AL</option>
                  <option value="AP">AP</option>
                  <option value="AM">AM</option>
                  <option value="BA">BA</option>
                  <option value="CE">CE</option>
                  <option value="DF">DF</option>
                  <option value="ES">ES</option>
                  <option value="GO">GO</option>
                  <option value="MA">MA</option>
                  <option value="MT">MT</option>
                  <option value="MS">MS</option>
                  <option value="MG">MG</option>
                  <option value="PA">PA</option>
                  <option value="PB">PB</option>
                  <option value="PR">PR</option>
                  <option value="PE">PE</option>
                  <option value="PI">PI</option>
                  <option value="RJ">RJ</option>
                  <option value="RN">RN</option>
                  <option value="RS">RS</option>
                  <option value="RO">RO</option>
                  <option value="RR">RR</option>
                  <option value="SC">SC</option>
                  <option value="SP">SP</option>
                  <option value="SE">SE</option>
                  <option value="TO">TO</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Cidade
                </label>
                <input
                  type="text"
                  value={formData.cidade}
                  onChange={(e) => handleChange('cidade', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Bairro
                </label>
                <input
                  type="text"
                  value={formData.bairro}
                  onChange={(e) => handleChange('bairro', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Logradouro
                </label>
                <input
                  type="text"
                  value={formData.logradouro}
                  onChange={(e) => handleChange('logradouro', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
                  placeholder="Rua, Avenida..."
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Número
              </label>
              <input
                type="text"
                value={formData.numero}
                onChange={(e) => {
                  const apenasNumeros = e.target.value.replace(/\D/g, '');
                  handleChange('numero', apenasNumeros);
                }}
                onKeyDown={(e) => {
                  if (
                    e.ctrlKey || e.metaKey ||
                    ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(e.key) ||
                    /^[0-9]$/.test(e.key)
                  ) return;
                  e.preventDefault();
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Botões */}
          <div className="flex gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
            >
              {empresa ? "Salvar Alterações" : "Cadastrar Empresa"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
