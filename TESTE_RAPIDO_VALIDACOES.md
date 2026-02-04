# 🚀 Teste Rápido - Validações e Checklists

## Como Testar em 5 Minutos

### 1️⃣ **Iniciar o Servidor**
```bash
cd SISTEMADOIS
npm run dev
```

Aguarde abrir em: http://localhost:3000

---

### 2️⃣ **Login no Sistema**
- Usuário: `admin` (ou seu usuário admin)
- Senha: sua senha

---

### 3️⃣ **Criar um Processo de Teste**

1. Clique em **"+ Novo Processo"**
2. Preencha:
   - Nome do Serviço: `Teste de Validação`
   - Empresa: `Empresa Teste`
   - Status: `Em Andamento`
   - Prioridade: `Alta`
3. Defina fluxo com **seus departamentos** (ex: Departamento 1 → Departamento 2 → Departamento 3)
4. Clique em **"Criar"**

---

### 4️⃣ **Configurar Questionário Obrigatório**

1. Abra o processo criado
2. Vá para o **primeiro departamento do fluxo**
3. Clique em **"Editar Questionário"**
4. Adicione 3 perguntas:

   **Pergunta 1:**
   - Texto: `Razão Social`
   - Tipo: `Texto`
   - ✅ Marcar como **Obrigatório**

   **Pergunta 2:**
   - Texto: `E-mail Corporativo`
   - Tipo: `E-mail`
   - ✅ Marcar como **Obrigatório**

   **Pergunta 3:**
   - Texto: `Telefone`
   - Tipo: `Telefone`
   - ✅ Marcar como **Obrigatório**

5. Salve o questionário

---

### 5️⃣ **Configurar Documento Obrigatório**

1. Vá em **Configurações** → **Departamentos**
2. Edite o **primeiro departamento do fluxo**
3. Adicione documento obrigatório:
   - Nome: `CNPJ` (ou qualquer nome)
   - Tipo: `CNPJ`
4. Salve

---

### 6️⃣ **Testar Bloqueio de Avanço (SEM preencher)**

1. Volte ao processo
2. **NÃO** preencha nenhuma pergunta
3. **NÃO** envie nenhum documento
4. Tente clicar em **"Avançar Processo"**

**✅ Resultado Esperado:**
- ❌ Erro: "Requisitos obrigatórios não preenchidos"
- 📋 Lista de pendências:
  ```
  - Pergunta obrigatória não respondida: "Razão Social"
  - Pergunta obrigatória não respondida: "E-mail Corporativo"
  - Pergunta obrigatória não respondida: "Telefone"
  - Documento obrigatório não enviado: "CNPJ"
  ```
- 🚫 Processo NÃO deve avançar

---

### 7️⃣ **Ver Checklist Visual**

1. Abra a modal de visualização do processo
2. Vá para aba **"📋 Cadastro & Respostas"**
3. Role até o final do card do departamento

**✅ Você deve ver:**
```
┌─────────────────────────────────────┐
│ ⚠️ Checklist - [Seu Dept]    0/4   │
│ ░░░░░░░░░░ 0%                      │
├─────────────────────────────────────┤
│ ⭕ 📋 Razão Social       [Pendente] │
│ ⭕ 📋 E-mail Corporativo [Pendente] │
│ ⭕ 📋 Telefone           [Pendente] │
│ ⭕ 📄 CNPJ                [Pendente] │
└─────────────────────────────────────┘
```
*([Seu Dept] = nome do seu departamento)

---

### 8️⃣ **Preencher Parcialmente (Teste de Progresso)**

1. Responda **apenas** 2 perguntas:
   - Razão Social: `"Empresa XYZ Ltda"`
   - E-mail: `"contato@empresa.com"`
2. Recarregue o checklist

**✅ Resultado Esperado:**
```
┌─────────────────────────────────────┐
│ ⚠️ Checklist - [Seu Dept]    2/4   │
│ ▓▓▓▓▓░░░░░ 50%                     │
├─────────────────────────────────────┤
│ ✅ 📋 Razão Social       [Completo] │
│ ✅ 📋 E-mail Corporativo [Completo] │
│ ⭕ 📋 Telefone           [Pendente] │
│ ⭕ 📄 CNPJ                [Pendente] │
└─────────────────────────────────────┘
```
*([Seu Dept] = nome do seu departamento)

---

### 9️⃣ **Testar Validação de Tipo (E-mail Inválido)**

1. Edite a resposta do e-mail
2. Digite: `"invalido"` (sem @)
3. Tente avançar

**✅ Resultado Esperado:**
- ❌ Erro: "E-mail inválido"

---

### 🔟 **Completar Todos os Requisitos**

1. Complete todas as perguntas:
   - Razão Social: `"Empresa XYZ Ltda"`
   - E-mail: `"contato@empresa.com"`
   - Telefone: `"11987654321"`

2. Envie documento CNPJ (qualquer arquivo PDF)

3. Verifique o checklist:

**✅ Resultado Esperado:**
```
┌─────────────────────────────────────┐
│ ✅ Checklist - [Seu Dept]    4/4   │
│ ▓▓▓▓▓▓▓▓▓▓ 100%                    │
├─────────────────────────────────────┤
│ ✅ 📋 Razão Social       [Completo] │
│ ✅ 📋 E-mail Corporativo [Completo] │
│ ✅ 📋 Telefone           [Completo] │
│ ✅ 📄 CNPJ                [Completo] │
└─────────────────────────────────────┘
```
*([Seu Dept] = nome do seu departamento)

---

### 1️⃣1️⃣ **Avançar Processo (Agora deve funcionar)**

1. Clique em **"Avançar Processo"**

**✅ Resultado Esperado:**
- ✅ Processo avança para o **próximo departamento** com sucesso
- ✅ Mensagem: "Processo avançado com sucesso"
- ✅ Histórico registra movimentação

---

## 🎯 Checklist de Validação

Marque conforme testa:

- [ ] ❌ Bloqueio funciona (não avança sem requisitos)
- [ ] 📋 Checklist visual aparece corretamente
- [ ] 📊 Barra de progresso atualiza (0%, 50%, 100%)
- [ ] ✅ Itens completos ficam verdes
- [ ] ⭕ Itens pendentes ficam cinza
- [ ] 📧 Validação de e-mail funciona
- [ ] 📞 Validação de telefone funciona
- [ ] 📄 Documentos obrigatórios são detectados
- [ ] ✅ Avanço funciona quando 100% completo
- [ ] 🎨 Tema claro/escuro funcionam

---

## 🐛 Problemas Comuns

### Checklist não aparece?
- ✅ Verifique se está na aba "Cadastro & Respostas"
- ✅ Role até o final do card do departamento
- ✅ Certifique-se que há questionários/documentos obrigatórios

### Validação não bloqueia?
- ✅ Verifique o console do navegador (F12)
- ✅ Veja a aba Network → requisição `/avancar`
- ✅ Confirme que questionários estão marcados como obrigatórios

### Progresso sempre 0%?
- ✅ Verifique se salvou as respostas
- ✅ Recarregue a página
- ✅ Confira o console para erros

---

## 📚 Documentação Completa

Para testes mais avançados, consulte:
- **[GUIA_TESTES_VALIDACOES.md](GUIA_TESTES_VALIDACOES.md)** - 7 cenários detalhados
- **[RESUMO_VALIDACOES.md](RESUMO_VALIDACOES.md)** - Visão geral da implementação

---

## 🎉 Pronto!

Se todos os testes passarem, o sistema está funcionando corretamente! ✅

**Próximos passos:**
1. Teste com processos reais
2. Configure validações customizadas
3. Adicione mais regras de negócio conforme necessário
