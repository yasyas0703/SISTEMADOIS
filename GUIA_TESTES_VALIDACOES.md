# Guia de Testes - Sistema de Validações e Checklists

## 📋 Visão Geral

Este guia mostra como testar o sistema de validações e checklists implementado no sistema de gestão de processos.

---

## ✅ Funcionalidades Implementadas

### 1. Validações de Campos (Zod Schemas)
- **Processos**: Nome do serviço, empresa, status, prioridade, departamento
- **Empresas**: Razão social, CNPJ, código, inscrição estadual
- **Usuários**: Nome, email, senha, perfil, departamento
- **Departamentos**: Nome, descrição, responsável, cor, ordem
- **Questionários**: Label, tipo, obrigatório, opções

### 2. Checklist de Requisitos
- Questionários obrigatórios
- Documentos obrigatórios
- Indicador visual de progresso
- Bloqueio de avanço sem completar requisitos

### 3. Validações de Avanço
- Verificação automática ao tentar avançar departamento
- Mensagens de erro específicas
- Validação de tipos de resposta (email, telefone, número, data)

---

## 🧪 Como Testar

### **TESTE 1: Validação de Campos de Processo**

#### Objetivo
Verificar se campos inválidos são rejeitados ao criar/editar processo.

#### Passos
1. Acesse a tela de criação de processo
2. Tente criar processo com:
   - ❌ Nome do serviço com menos de 3 caracteres
   - ❌ Empresa vazia
   - ❌ Status inválido (ex: "teste")
   - ❌ Prioridade inválida

#### Resultado Esperado
- Mensagens de erro específicas para cada campo
- Processo não deve ser criado com dados inválidos

#### Código para testar manualmente (Console do navegador)
\`\`\`javascript
import { processoSchema } from '@/app/utils/validation';

// Teste com dados inválidos
try {
  processoSchema.parse({
    nomeServico: "AB", // < 3 caracteres
    nomeEmpresa: "",   // vazio
    status: "invalido",
    prioridade: "urgentissima",
    departamentoAtual: -1
  });
} catch (error) {
  console.log("Erros:", error.errors); // Deve mostrar os erros
}
\`\`\`

---

### **TESTE 2: Checklist Visual no Processo**

#### Objetivo
Verificar se o checklist mostra corretamente os requisitos pendentes/completos.

#### Passos
1. Abra um processo que tenha questionários e documentos obrigatórios
2. Na modal de visualização, acesse a aba "Cadastro & Respostas"
3. Role até o final para ver o componente ChecklistDepartamento

#### Resultado Esperado
- ✅ Itens completos aparecem em verde com ícone de check
- ⚠️ Itens pendentes aparecem em cinza com círculo vazio
- 📊 Barra de progresso mostra percentual correto
- 🔢 Contador mostra "X/Y completos"

#### Exemplo Visual
\`\`\`
┌─────────────────────────────────────┐
│ ⚠️ Checklist - Comercial   3/5     │
│ ▓▓▓▓▓▓░░░░░ 60%                    │
├─────────────────────────────────────┤
│ ✅ 📋 Razão Social         Completo │
│ ✅ 📄 CNPJ                 Completo │
│ ✅ 📋 E-mail contato       Completo │
│ ⭕ 📄 Contrato Social      Pendente │
│ ⭕ 📋 Responsável técnico   Pendente │
└─────────────────────────────────────┘
\`\`\`

---

### **TESTE 3: Bloqueio de Avanço sem Requisitos**

#### Objetivo
Verificar se o sistema impede avançar processo com requisitos pendentes.

#### Passos
1. Crie ou edite um processo
2. Configure um departamento com:
   - Pelo menos 1 pergunta obrigatória
   - Pelo menos 1 documento obrigatório
3. **NÃO** preencha a pergunta ou envie o documento
4. Tente avançar o processo para o próximo departamento

#### Resultado Esperado
- ❌ Requisição deve retornar erro 400
- 📝 Mensagem: "Requisitos obrigatórios não preenchidos"
- 📋 Lista detalhada dos itens pendentes
- 🚫 Processo **não** deve avançar

#### Resposta da API (exemplo)
\`\`\`json
{
  "error": "Requisitos obrigatórios não preenchidos",
  "detalhes": [
    "Pergunta obrigatória não respondida: \"Razão Social\"",
    "Documento obrigatório não enviado: \"CNPJ\""
  ],
  "validacao": [
    {
      "campo": "pergunta_123",
      "mensagem": "Pergunta obrigatória não respondida: \"Razão Social\"",
      "tipo": "erro"
    },
    {
      "campo": "documento_456",
      "mensagem": "Documento obrigatório não enviado: \"CNPJ\"",
      "tipo": "erro"
    }
  ]
}
\`\`\`

---

### **TESTE 4: Validação de Tipos de Resposta**

#### Objetivo
Verificar se respostas de questionários são validadas por tipo.

#### Configuração
Crie questionário com perguntas de diferentes tipos:

| Pergunta            | Tipo     | Obrigatório |
|---------------------|----------|-------------|
| E-mail corporativo  | email    | Sim         |
| Telefone            | phone    | Sim         |
| Número de sócios    | number   | Sim         |
| Data de fundação    | date     | Sim         |
| Contrato social     | file     | Sim         |

#### Testes a Realizar

**4.1. E-mail inválido**
- Preencha: `"teste@"` ou `"invalido"`
- Tente avançar
- ✅ Deve retornar erro: "E-mail inválido"

**4.2. Telefone inválido**
- Preencha: `"123"` ou `"abcdef"`
- Tente avançar
- ✅ Deve retornar erro: "Telefone inválido"

**4.3. Número inválido**
- Preencha: `"abc"` ou `"texto"`
- Tente avançar
- ✅ Deve retornar erro: "deve ser um número válido"

**4.4. Data inválida**
- Preencha: `"32/13/2025"` ou `"data-invalida"`
- Tente avançar
- ✅ Deve retornar erro: "deve ser uma data válida"

**4.5. Arquivo não anexado**
- Deixe o campo de arquivo vazio
- Tente avançar
- ✅ Deve retornar erro: "Arquivo obrigatório não anexado"

---

### **TESTE 5: Cálculo de Progresso**

#### Objetivo
Verificar se o percentual de completude é calculado corretamente.

#### Cenário
- 3 perguntas obrigatórias
- 2 documentos obrigatórios
- **Total**: 5 itens

#### Testes

**5.1. Nenhum item completo**
- Não responda nada
- ✅ Progresso: 0% (0/5)

**5.2. 1 item completo**
- Responda 1 pergunta
- ✅ Progresso: 20% (1/5)

**5.3. 3 itens completos**
- Responda 2 perguntas + envie 1 documento
- ✅ Progresso: 60% (3/5)

**5.4. Todos os itens completos**
- Responda todas as perguntas + envie todos os documentos
- ✅ Progresso: 100% (5/5)

#### Código para testar
\`\`\`javascript
import { calcularProgresso } from '@/app/utils/validation';

const resultado = calcularProgresso({
  questionarios: [
    { id: 1, obrigatorio: true },
    { id: 2, obrigatorio: true },
    { id: 3, obrigatorio: true },
  ],
  documentosObrigatorios: [
    { id: 1, tipo: 'CNPJ' },
    { id: 2, tipo: 'Contrato' },
  ],
  respostas: {
    1: "Resposta 1",
    2: "Resposta 2",
    // 3 não respondida
  },
  documentos: [
    { tipo: 'CNPJ' },
    // Contrato não enviado
  ],
});

console.log(resultado);
// {
//   percentual: 60,
//   itensCompletos: 3,
//   itensTotal: 5,
//   detalhes: {
//     questionarios: { completos: 2, total: 3 },
//     documentos: { completos: 1, total: 2 }
//   }
// }
\`\`\`

---

### **TESTE 6: Validação de CNPJ/CPF**

#### Objetivo
Verificar se validadores de documentos funcionam corretamente.

#### Testes

**6.1. CNPJ Válido**
- Valor: `"11.222.333/0001-81"`
- ✅ Deve ser aceito

**6.2. CNPJ Inválido**
- Valor: `"11.111.111/1111-11"` (dígitos repetidos)
- ❌ Deve retornar: "CNPJ inválido"

**6.3. CPF Válido**
- Valor: `"123.456.789-09"`
- ✅ Deve ser aceito

**6.4. CPF Inválido**
- Valor: `"111.111.111-11"` (dígitos repetidos)
- ❌ Deve retornar: "CPF inválido"

---

### **TESTE 7: Integração Completa (Fluxo End-to-End)**

#### Objetivo
Testar todo o fluxo de validação em um cenário real.

#### Cenário
Processo com 3 departamentos do seu fluxo (ex: **Dept 1 → Dept 2 → Dept 3**)

#### Passos Detalhados

**7.1. Criar processo**
1. Login como Admin
2. Criar novo processo
3. Definir fluxo com seus 3 departamentos
4. ✅ Processo criado com sucesso

**7.2. Primeiro Departamento**
1. Configurar questionário:
   - "Razão Social" (text, obrigatório)
   - "CNPJ" (text, obrigatório)
   - "E-mail" (email, obrigatório)
2. Configurar documento obrigatório: "Contrato Social"
3. Responder questionário COMPLETO
4. Enviar documento obrigatório
5. Verificar checklist: ✅ 4/4 completos (100%)
6. Avançar para o próximo departamento
7. ✅ Deve avançar com sucesso

**7.3. Segundo Departamento (Teste de Bloqueio)**
1. Configurar questionário:
   - "Responsável Legal" (text, obrigatório)
   - "Telefone contato" (phone, obrigatório)
2. Configurar documento obrigatório: "Procuração"
3. **NÃO** preencher nada
4. Verificar checklist: ⚠️ 0/3 completos (0%)
5. Tentar avançar para o próximo departamento
6. ❌ Deve retornar erro com lista de pendências
7. ✅ Processo deve permanecer no departamento atual

**7.4. Completar Requisitos**
1. Responder todas as perguntas
2. Enviar documento
3. Verificar checklist: ✅ 3/3 completos (100%)
4. Avançar para o próximo departamento
5. ✅ Deve avançar com sucesso

**7.5. Finalizar Processo**
1. No último departamento, completar requisitos
2. Marcar como finalizado
3. ✅ Processo finalizado com sucesso

---

## 🐛 Casos de Erro Conhecidos

### Erro 1: Validação não executa
**Sintoma**: Processo avança mesmo com requisitos pendentes

**Solução**:
1. Verificar se a importação está correta em `avancar/route.ts`
2. Verificar se `validarAvancoDepartamento` está sendo chamada
3. Conferir logs do console do servidor

### Erro 2: Checklist não aparece
**Sintoma**: Componente ChecklistDepartamento não renderiza

**Solução**:
1. Verificar se o componente foi importado corretamente
2. Verificar se está na aba correta da modal
3. Conferir se há questionários/documentos obrigatórios configurados

### Erro 3: Progresso sempre 0%
**Sintoma**: Barra de progresso sempre vazia

**Solução**:
1. Verificar se `respostas` está no formato correto (`Record<number, any>`)
2. Verificar se documentos têm o campo `tipo` ou `tipoCategoria`
3. Conferir função `calcularProgresso` no console

---

## 📊 Métricas de Sucesso

Validações estão funcionando corretamente se:

- ✅ Processo **não avança** sem preencher requisitos obrigatórios
- ✅ Checklist visual mostra progresso correto
- ✅ Mensagens de erro são **específicas** e **úteis**
- ✅ Tipos de resposta são validados corretamente
- ✅ CNPJ/CPF inválidos são rejeitados
- ✅ API retorna erro 400 com detalhes ao tentar avançar sem requisitos

---

## 🔧 Ferramentas de Debug

### Console do Navegador
\`\`\`javascript
// Ver estado de validação de um processo
const processo = { /* dados do processo */ };
const validacao = validarAvancoDepartamento({ /* params */ });
console.log("Validação:", validacao);
\`\`\`

### Network Tab
1. Abra DevTools (F12)
2. Vá para aba "Network"
3. Tente avançar processo
4. Procure requisição POST para `/api/processos/[id]/avancar`
5. Veja response com erros de validação

### Logs do Servidor
\`\`\`bash
# No terminal onde o Next.js está rodando
npm run dev

# Você verá logs de validação se houver erros
\`\`\`

---

## 📝 Checklist de Testes Completo

Marque cada teste conforme completa:

- [ ] TESTE 1: Validação de Campos de Processo
- [ ] TESTE 2: Checklist Visual no Processo
- [ ] TESTE 3: Bloqueio de Avanço sem Requisitos
- [ ] TESTE 4.1: E-mail inválido
- [ ] TESTE 4.2: Telefone inválido
- [ ] TESTE 4.3: Número inválido
- [ ] TESTE 4.4: Data inválida
- [ ] TESTE 4.5: Arquivo não anexado
- [ ] TESTE 5: Cálculo de Progresso (todos os cenários)
- [ ] TESTE 6: Validação de CNPJ/CPF
- [ ] TESTE 7: Integração Completa (fluxo end-to-end)

---

## 🎯 Próximos Passos

Após validar que tudo funciona:

1. **Adicionar mais validações customizadas** (ex: valor mínimo/máximo)
2. **Configurar validações por departamento** (cada dept pode ter regras diferentes)
3. **Histórico de validações** (registrar quando validação falhou)
4. **Dashboard de conformidade** (mostrar processos com pendências)
5. **Notificações de requisitos pendentes** (alertar responsáveis)

---

**Última atualização**: ${new Date().toLocaleDateString('pt-BR')}
