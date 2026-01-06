# 🔥 GUIA DE IMPLEMENTAÇÃO DOS MODAIS

Este documento contém exemplos de código para implementar cada modal de forma idêntica.

---

## 1️⃣ ModalNovaEmpresa - Exemplo de Implementação

### Estrutura Básica:
```jsx
const ModalNovaEmpresa = ({ onClose, onSave, onSalvarTemplate }) => {
  const [nomeEmpresa, setNomeEmpresa] = useState("");
  const [cliente, setCliente] = useState("");
  const [nomeServico, setNomeServico] = useState("");
  const [questionariosPorDept, setQuestionariosPorDept] = useState({});
  const [departamentoSelecionado, setDepartamentoSelecionado] = useState(null);
  const [fluxoDepartamentos, setFluxoDepartamentos] = useState([]);
  
  // ... handlers
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-6 rounded-t-2xl sticky top-0 z-10">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-white">Nova Solicitação</h3>
            <button onClick={onClose} className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg">
              <X size={20} />
            </button>
          </div>
        </div>
        
        {/* Conteúdo */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Seções do formulário */}
        </form>
      </div>
    </div>
  );
};
```

### Tipos de Campos Suportados:
```jsx
const tiposCampo = [
  { valor: "text", label: "Texto Simples" },
  { valor: "textarea", label: "Texto Longo" },
  { valor: "number", label: "Número" },
  { valor: "date", label: "Data" },
  { valor: "boolean", label: "Sim/Não" },
  { valor: "select", label: "Seleção Única" },
  { valor: "file", label: "Arquivo/Anexo" },
  { valor: "phone", label: "Telefone" },
  { valor: "email", label: "Email" },
];
```

### Handlers Principais:
```jsx
const adicionarDepartamentoAoFluxo = (deptId) => {
  if (!fluxoDepartamentos.includes(deptId)) {
    setFluxoDepartamentos([...fluxoDepartamentos, deptId]);
    setQuestionariosPorDept({
      ...questionariosPorDept,
      [deptId]: []
    });
  }
  setDepartamentoSelecionado(deptId);
};

const adicionarPergunta = (tipo) => {
  const novaPergunta = {
    id: Date.now(),
    label: "",
    tipo: tipo,
    obrigatorio: false,
    opcoes: tipo === "select" ? [""] : [],
    ordem: (questionariosPorDept[departamentoSelecionado]?.length || 0) + 1,
    condicao: null
  };
  setEditandoPergunta(novaPergunta);
};

const salvarPergunta = () => {
  if (!editandoPergunta.label.trim()) {
    alert("Digite o texto da pergunta!");
    return;
  }
  
  const perguntasDepto = questionariosPorDept[departamentoSelecionado] || [];
  setQuestionariosPorDept({
    ...questionariosPorDept,
    [departamentoSelecionado]: [...perguntasDepto, editandoPergunta]
  });
  setEditandoPergunta(null);
};
```

---

## 2️⃣ ModalCadastrarEmpresa - Exemplo

### Auto-Formatação de Campos:
```jsx
const formatarCPFCNPJ = (valor) => {
  const apenasNumeros = valor.replace(/\D/g, '');
  
  if (apenasNumeros.length <= 11) {
    // CPF: 000.000.000-00
    return apenasNumeros
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  } else {
    // CNPJ: 00.000.000/0000-00
    return apenasNumeros
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  }
};

const formatarCEP = (valor) => {
  const apenasNumeros = valor.replace(/\D/g, '');
  if (apenasNumeros.length <= 5) {
    return apenasNumeros;
  }
  return `${apenasNumeros.slice(0, 5)}-${apenasNumeros.slice(5, 8)}`;
};
```

### Validação de Submissão:
```jsx
const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!formData.codigo || !formData.razao_social) {
    await mostrarAlerta("Campos Obrigatórios", "Código e Razão Social são obrigatórios", "aviso");
    return;
  }
  
  if (empresaCadastrada && !formData.cnpj) {
    await mostrarAlerta("CNPJ Obrigatório", "Empresas cadastradas precisam ter CNPJ", "aviso");
    return;
  }
  
  // Salvar empresa
};
```

---

## 3️⃣ ModalCriarDepartamento - Exemplo

### Seleção de Cores:
```jsx
const coresDisponiveis = [
  { nome: "Cyan", gradient: "from-cyan-500 to-cyan-600" },
  { nome: "Blue", gradient: "from-blue-500 to-blue-600" },
  { nome: "Purple", gradient: "from-purple-500 to-purple-600" },
  { nome: "Pink", gradient: "from-pink-500 to-pink-600" },
  { nome: "Red", gradient: "from-red-500 to-red-600" },
  { nome: "Orange", gradient: "from-orange-500 to-orange-600" },
  { nome: "Yellow", gradient: "from-yellow-500 to-yellow-600" },
  { nome: "Green", gradient: "from-green-500 to-green-600" },
];

<div className="grid grid-cols-3 gap-3">
  {coresDisponiveis.map((cor) => (
    <button
      key={cor.nome}
      type="button"
      onClick={() => setCorSelecionada(cor)}
      className={`p-4 rounded-xl bg-gradient-to-r ${cor.gradient} text-white font-medium transition-all ${
        corSelecionada?.nome === cor.nome
          ? "ring-4 ring-offset-2 ring-gray-400 scale-105"
          : "hover:scale-105"
      }`}
    >
      {cor.nome}
    </button>
  ))}
</div>
```

### Grid de Ícones:
```jsx
const iconesDisponiveis = [
  { nome: "Briefcase", componente: Briefcase },
  { nome: "Users", componente: Users },
  { nome: "Building", componente: Building },
  { nome: "FileText", componente: FileText },
  // ... mais ícones
];

<div className="grid grid-cols-6 gap-3">
  {iconesDisponiveis.map((icone) => {
    const IconeComp = icone.componente;
    return (
      <button
        key={icone.nome}
        type="button"
        onClick={() => setIconeSelecionado(icone)}
        className={`p-4 rounded-xl border-2 transition-all ${
          iconeSelecionado?.nome === icone.nome
            ? "border-cyan-500 bg-cyan-50 scale-110"
            : "border-gray-300 hover:border-cyan-300 hover:scale-105"
        }`}
      >
        <IconeComp size={24} />
      </button>
    );
  })}
</div>
```

---

## 4️⃣ ModalUploadDocumento - Drag & Drop

### Implementação Completa:
```jsx
const handleDragOver = (e) => {
  e.preventDefault();
  setArrastando(true);
};

const handleDragLeave = () => {
  setArrastando(false);
};

const handleDrop = (e) => {
  e.preventDefault();
  setArrastando(false);
  handleArquivosSelecionados(e.dataTransfer.files);
};

const handleArquivosSelecionados = (files) => {
  const novosArquivos = Array.from(files).map((file) => ({
    file,
    id: Date.now() + Math.random(),
    nome: file.name,
    tipo: file.type,
    tamanho: file.size,
    progresso: 0,
  }));
  setArquivos((prev) => [...prev, ...novosArquivos]);
};

// JSX
<div
  className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
    arrastando
      ? "border-cyan-500 bg-cyan-50"
      : "border-gray-300 hover:border-cyan-400 hover:bg-cyan-50"
  }`}
  onDragOver={handleDragOver}
  onDragLeave={handleDragLeave}
  onDrop={handleDrop}
>
  <Upload size={48} className="mx-auto text-gray-400 mb-4" />
  <p className="text-gray-600 mb-2">Arraste arquivos aqui ou clique para selecionar</p>
  <input
    type="file"
    multiple
    onChange={(e) => handleArquivosSelecionados(e.target.files)}
    className="hidden"
    id="file-upload"
  />
  <label
    htmlFor="file-upload"
    className="inline-block bg-cyan-600 text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-cyan-700"
  >
    Selecionar Arquivos
  </label>
</div>
```

---

## 5️⃣ QuestionarioModal - Renderização de Campos

### Renderização Dinâmica:
```jsx
const renderCampo = (pergunta) => {
  const bloqueado = somenteLeitura || processo.status === "Finalizado";
  const k = keyOf(pergunta);
  const valor = respostas[k];
  
  switch (pergunta.tipo) {
    case "text":
      return (
        <input
          type="text"
          value={valor || ""}
          onChange={(e) => handleRespostaChange(pergunta.id, e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500"
          required={pergunta.obrigatorio}
          disabled={bloqueado}
        />
      );
    
    case "textarea":
      return (
        <textarea
          value={valor || ""}
          onChange={(e) => handleRespostaChange(pergunta.id, e.target.value)}
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 resize-vertical"
          required={pergunta.obrigatorio}
          disabled={bloqueado}
        />
      );
    
    case "date":
      return (
        <input
          type="date"
          value={valor || ""}
          onChange={(e) => handleRespostaChange(pergunta.id, e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500"
          required={pergunta.obrigatorio}
          disabled={bloqueado}
        />
      );
    
    case "boolean":
      return (
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name={pergunta.id}
              value="Sim"
              checked={valor === "Sim"}
              onChange={(e) => handleRespostaChange(pergunta.id, e.target.value)}
              disabled={bloqueado}
            />
            <span>Sim</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name={pergunta.id}
              value="Não"
              checked={valor === "Não"}
              onChange={(e) => handleRespostaChange(pergunta.id, e.target.value)}
              disabled={bloqueado}
            />
            <span>Não</span>
          </label>
        </div>
      );
    
    case "select":
      return (
        <select
          value={valor || ""}
          onChange={(e) => handleRespostaChange(pergunta.id, e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500"
          required={pergunta.obrigatorio}
          disabled={bloqueado}
        >
          <option value="">Selecione...</option>
          {pergunta.opcoes.map((opcao) => (
            <option key={opcao} value={opcao}>{opcao}</option>
          ))}
        </select>
      );
    
    case "file":
      // Retorna componente de upload
      return <FileUploadComponent pergunta={pergunta} />;
  }
};
```

### Perguntas Condicionais:
```jsx
const avaliarCondicao = (pergunta, respostas) => {
  if (!pergunta.condicao) return true;
  
  const { perguntaId, operador, valor } = pergunta.condicao;
  const respostaCondicional = respostas[perguntaId];
  
  if (!respostaCondicional) return false;
  
  switch (operador) {
    case "igual":
      return String(respostaCondicional).toLowerCase() === String(valor).toLowerCase();
    case "diferente":
      return String(respostaCondicional).toLowerCase() !== String(valor).toLowerCase();
    case "contem":
      return String(respostaCondicional).toLowerCase().includes(String(valor).toLowerCase());
    default:
      return true;
  }
};

// Renderizar apenas perguntas que passam na condição
{questionarioAtual
  .filter(pergunta => avaliarCondicao(pergunta, respostas))
  .map((pergunta) => (
    <div key={pergunta.id}>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {pergunta.label}
        {pergunta.obrigatorio && <span className="text-red-500">*</span>}
      </label>
      {renderCampo(pergunta)}
    </div>
  ))}
```

---

## 6️⃣ ModalAnalytics - Gráficos

### Componente de Gráfico de Barras:
```jsx
const GraficoBarras = ({ dados, titulo, cor = "from-cyan-500 to-blue-600" }) => {
  const maxValor = Math.max(
    ...Object.values(dados).map((val) =>
      typeof val === "number" ? val : val.tempoMedio || 0
    )
  );

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
      <h4 className="font-bold text-gray-800 mb-4">{titulo}</h4>
      <div className="space-y-3">
        {Object.entries(dados).map(([nome, valor]) => {
          const valorNumerico = typeof valor === "number" ? valor : valor.tempoMedio || 0;
          const porcentagem = maxValor > 0 ? (valorNumerico / maxValor) * 100 : 0;

          return (
            <div key={nome} className="flex items-center gap-3">
              <div className="w-32 text-sm text-gray-600 truncate">{nome}</div>
              <div className="flex-1">
                <div className="bg-gray-200 rounded-full h-4 overflow-hidden">
                  <div
                    className={`bg-gradient-to-r ${cor} h-4 rounded-full transition-all duration-500`}
                    style={{ width: `${porcentagem}%` }}
                  ></div>
                </div>
              </div>
              <div className="w-16 text-right text-sm font-semibold text-gray-700">
                {valorNumerico}d
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
```

---

## 7️⃣ ModalComentarios - Menções

### Renderização com Menções:
```jsx
const renderTextoComMencoes = (texto) => {
  const partes = texto.split(/(@\w+)/g);
  return partes.map((parte, idx) => {
    if (parte.startsWith("@")) {
      return (
        <span
          key={idx}
          className="bg-cyan-100 text-cyan-700 px-1 rounded font-medium"
        >
          {parte}
        </span>
      );
    }
    return parte;
  });
};

const detectarMencoes = (texto) => {
  const regex = /@(\w+)/g;
  const mencoes = [];
  let match;
  
  while ((match = regex.exec(texto)) !== null) {
    mencoes.push(match[1]);
  }
  
  return mencoes;
};
```

---

## 8️⃣ LocalStorage para Backup

### Sistema de Backup de Respostas:
```jsx
// Salvar no LocalStorage
const salvarBackup = (processoId, departamentoId, respostas) => {
  const chave = `respostas_temp_${processoId}_${departamentoId}`;
  localStorage.setItem(chave, JSON.stringify(respostas));
};

// Recuperar do LocalStorage
const recuperarBackup = (processoId, departamentoId) => {
  const chave = `respostas_temp_${processoId}_${departamentoId}`;
  const backupSalvo = localStorage.getItem(chave);
  
  if (backupSalvo) {
    return JSON.parse(backupSalvo);
  }
  
  return {};
};

// Remover do LocalStorage
const removerBackup = (processoId, departamentoId) => {
  const chave = `respostas_temp_${processoId}_${departamentoId}`;
  localStorage.removeItem(chave);
};

// UseEffect para salvar automaticamente
useEffect(() => {
  const chave = `respostas_temp_${processoId}_${departamentoId}`;
  if (Object.keys(respostas).length > 0) {
    localStorage.setItem(chave, JSON.stringify(respostas));
  }
}, [respostas, processoId, departamentoId]);
```

---

## 9️⃣ Estrutura de Grid Responsivo

### Padrão 1 - 3 Colunas:
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {items.map(item => (
    <div key={item.id} className="bg-white rounded-xl p-4">
      {/* conteúdo */}
    </div>
  ))}
</div>
```

### Padrão 2 - 4 Colunas:
```jsx
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
  {/* items */}
</div>
```

### Padrão 3 - Automático:
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
  {/* items */}
</div>
```

---

## 🔟 Validação Customizada

### Validação de Email:
```jsx
const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};
```

### Validação de Telefone:
```jsx
const isValidPhone = (phone) => {
  const apenasNumeros = phone.replace(/\D/g, '');
  return apenasNumeros.length >= 10 && apenasNumeros.length <= 11;
};
```

### Validação de CNPJ:
```jsx
const isValidCNPJ = (cnpj) => {
  const apenasNumeros = cnpj.replace(/\D/g, '');
  return apenasNumeros.length === 14;
};
```

---

## 📋 CHECKLIST PARA IMPLEMENTAÇÃO

- [ ] Criar arquivo separado para cada modal
- [ ] Implementar todos os hooks (useState, useEffect)
- [ ] Adicionar handlers de submit/cancel
- [ ] Integrar com API
- [ ] Adicionar validação de campos
- [ ] Implementar localStorage quando necessário
- [ ] Testar responsividade em mobile/tablet/desktop
- [ ] Adicionar loading states
- [ ] Implementar error handling
- [ ] Adicionar notificações de sucesso/erro
- [ ] Testar perguntas condicionais
- [ ] Testar upload de arquivos
- [ ] Validar permissões de usuário
- [ ] Testar em diferentes browsers

---

## 🎯 PADRÃO DE ESTRUTURA

Todos os modais seguem este padrão:

```jsx
const Modal[Nome] = ({ onClose, ...props }) => {
  // 1. Estados
  const [state1, setState1] = useState(initialValue);
  
  // 2. Effects
  useEffect(() => {
    // logic
  }, [dependencies]);
  
  // 3. Handlers
  const handler1 = () => { /* logic */ };
  
  // 4. JSX
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[SIZE]">
        {/* Header */}
        {/* Content */}
        {/* Footer */}
      </div>
    </div>
  );
};
```

---

**Documento de implementação atualizado: 6 de janeiro de 2026**
