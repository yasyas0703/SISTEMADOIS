# 📋 Sistema de Validações e Checklists - Implementado

## ✅ Resumo da Implementação

Foi implementado um **sistema completo de validações e checklists** para garantir a qualidade e completude dos processos antes de avançarem entre departamentos.

---

## 🎯 Funcionalidades Implementadas

### 1. **Validações de Campos** ([validation.ts](app/utils/validation.ts))

#### Schemas Zod criados:
- ✅ **Processo**: Nome do serviço, empresa, status, prioridade, departamento, email, telefone, descrição
- ✅ **Empresa**: Razão social, CNPJ, código, inscrição estadual, email, telefone, CEP
- ✅ **Usuário**: Nome, email, senha (mín 6 caracteres), role, departamento
- ✅ **Departamento**: Nome, descrição, responsável, cor, ordem
- ✅ **Questionário**: Label, tipo, obrigatório, opções, ordem

#### Validadores customizados:
- ✅ **CPF**: Validação com cálculo de dígito verificador
- ✅ **CNPJ**: Validação com cálculo de dígito verificador
- ✅ **Telefone**: 10-11 dígitos
- ✅ **CEP**: 8 dígitos
- ✅ **E-mail**: Formato válido

---

### 2. **Validação de Requisitos** ([validation.ts](app/utils/validation.ts))

#### Função `validarAvancoDepartamento()`:
Valida se um processo está pronto para avançar, verificando:

1. **Questionários obrigatórios respondidos**
   - Identifica perguntas não respondidas
   - Valida tipos de resposta (email, phone, number, date, file)
   - Retorna mensagem específica para cada erro

2. **Documentos obrigatórios enviados**
   - Verifica se documentos configurados foram enviados
   - Compara por tipo ou categoria

3. **Regras de negócio**
   - Processos de alta prioridade devem ter prazo de entrega
   - Outras regras customizáveis

#### Função `calcularProgresso()`:
Calcula percentual de completude:
- Conta perguntas obrigatórias respondidas
- Conta documentos obrigatórios enviados
- Retorna: `{ percentual, itensCompletos, itensTotal, detalhes }`

---

### 3. **Hook `useValidacoes`** ([hooks/useValidacoes.ts](app/hooks/useValidacoes.ts))

Hook customizado para facilitar uso das validações nos componentes:

```typescript
const {
  errosValidacao,      // Lista de erros
  validando,           // Estado de carregamento
  validarAvanco,       // Função para validar
  obterProgresso,      // Função para calcular progresso
  limparErros,         // Limpar erros
  temErrosCriticos,    // Verificar se há erros críticos
  temAvisos            // Verificar se há avisos
} = useValidacoes();
```

---

### 4. **Componente `ChecklistDepartamento`** ([components/ChecklistDepartamento.tsx](app/components/ChecklistDepartamento.tsx))

Componente visual que exibe:

#### Interface Visual:
```
┌─────────────────────────────────────────────┐
│ ⚠️ Checklist - Comercial          3/5      │
│ ▓▓▓▓▓▓░░░░░ 60%                            │
├─────────────────────────────────────────────┤
│ ✅ 📋 Razão Social           [Completo]    │
│ ✅ 📄 CNPJ                   [Completo]    │
│ ✅ 📋 E-mail contato         [Completo]    │
│ ⭕ 📄 Contrato Social        [Pendente]    │
│ ⭕ 📋 Responsável técnico     [Pendente]    │
├─────────────────────────────────────────────┤
│ ⚠️ Complete todos os itens obrigatórios    │
│    antes de avançar este processo.         │
└─────────────────────────────────────────────┘
```

#### Recursos:
- ✅ **Ícones por tipo**: 📋 Questionário / 📄 Documento
- ✅ **Cores por status**: Verde (completo) / Cinza (pendente)
- ✅ **Barra de progresso**: Visual com percentual
- ✅ **Contador**: X/Y completos
- ✅ **Mensagem de aviso**: Quando há pendências
- ✅ **Tema claro/escuro**: Totalmente responsivo

---

### 5. **Integração na API** ([api/processos/[id]/avancar/route.ts](app/api/processos/[id]/avancar/route.ts))

#### Validação automática ao avançar:

**ANTES** (sem validação):
```typescript
// Processo avançava sem verificar requisitos
const processoAtualizado = await prisma.processo.update({
  departamentoAtual: proximoDepartamentoId,
  ...
});
```

**AGORA** (com validação):
```typescript
// 1. Busca questionários e documentos obrigatórios
// 2. Monta respostas do departamento
// 3. Valida requisitos
const validacao = validarAvancoDepartamento({...});

// 4. Se inválido, retorna erro 400 com detalhes
if (!validacao.valido) {
  return NextResponse.json({
    error: 'Requisitos obrigatórios não preenchidos',
    detalhes: errosCriticos.map(e => e.mensagem),
    validacao: validacao.erros,
  }, { status: 400 });
}

// 5. Se válido, avança o processo
const processoAtualizado = await prisma.processo.update({...});
```

#### Resposta de Erro (exemplo):
```json
{
  "error": "Requisitos obrigatórios não preenchidos",
  "detalhes": [
    "Pergunta obrigatória não respondida: \"Razão Social\"",
    "Documento obrigatório não enviado: \"CNPJ\"",
    "\"E-mail corporativo\" deve ser um e-mail válido"
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
    },
    {
      "campo": "pergunta_789",
      "mensagem": "\"E-mail corporativo\" deve ser um e-mail válido",
      "tipo": "erro"
    }
  ]
}
```

---

### 6. **Integração Visual** ([components/modals/ModalVisualizacao.tsx](app/components/modals/ModalVisualizacao.tsx))

O componente `ChecklistDepartamento` foi adicionado na **aba "Cadastro & Respostas"**, logo após as respostas de cada departamento.

#### Localização:
- Modal de visualização do processo
- Aba "📋 Cadastro & Respostas"
- Após exibir as respostas de cada departamento
- Antes de finalizar o card do departamento

---

## 📁 Arquivos Criados/Modificados

### Criados:
1. ✅ `app/components/ChecklistDepartamento.tsx` - Componente visual do checklist
2. ✅ `app/hooks/useValidacoes.ts` - Hook customizado de validações
3. ✅ `GUIA_TESTES_VALIDACOES.md` - Guia completo de testes
4. ✅ `RESUMO_VALIDACOES.md` - Este arquivo

### Modificados:
1. ✅ `app/utils/validation.ts` - Expandido com schemas e validações
2. ✅ `app/api/processos/[id]/avancar/route.ts` - Integrada validação na API
3. ✅ `app/components/modals/ModalVisualizacao.tsx` - Adicionado ChecklistDepartamento
4. ✅ `app/hooks/index.ts` - Exportado useValidacoes

---

## 🧪 Como Testar

Consulte o arquivo **[GUIA_TESTES_VALIDACOES.md](GUIA_TESTES_VALIDACOES.md)** para:

- ✅ 7 cenários de teste detalhados
- ✅ Exemplos de código
- ✅ Resultados esperados
- ✅ Ferramentas de debug
- ✅ Checklist completo

---

## 🚀 Fluxo de Uso

### Cenário: Usuário tenta avançar processo sem completar requisitos

1. **Usuário**: Abre processo no departamento Comercial
2. **Sistema**: Exibe checklist mostrando:
   - ⚠️ 2/5 itens completos (40%)
   - ⭕ 3 itens pendentes
3. **Usuário**: Clica em "Avançar Processo"
4. **Sistema**: 
   - Valida requisitos
   - Detecta pendências
   - Retorna erro 400 com lista de itens pendentes
5. **Frontend**: Exibe mensagem de erro com detalhes
6. **Usuário**: Completa os requisitos pendentes
7. **Sistema**: Atualiza checklist para ✅ 5/5 completos (100%)
8. **Usuário**: Clica em "Avançar Processo" novamente
9. **Sistema**: Valida requisitos → ✅ OK → Avança processo

---

## 🎨 Recursos Visuais

### Cores por Status:
- **✅ Completo**: Verde (`green-600`)
- **⭕ Pendente**: Cinza (`gray-400`)
- **⚠️ Aviso**: Amarelo (`amber-600`)
- **❌ Erro**: Vermelho (`red-600`)

### Ícones:
- **CheckCircle2**: Item completo
- **Circle**: Item pendente
- **AlertCircle**: Aviso/pendências
- **ClipboardList**: Questionário
- **FileText**: Documento

### Temas:
- ✅ Suporte completo a tema claro
- ✅ Suporte completo a tema escuro
- ✅ Transições suaves entre estados

---

## 📊 Tipos de Validação Suportados

| Tipo       | Validação                                    | Exemplo              |
|------------|----------------------------------------------|----------------------|
| `text`     | Não vazio                                    | "Nome da empresa"    |
| `textarea` | Não vazio                                    | "Descrição detalhada"|
| `email`    | Formato de e-mail válido                     | teste@email.com      |
| `phone`    | 10-11 dígitos                                | (11) 98765-4321      |
| `number`   | Número válido                                | 42                   |
| `date`     | Data válida                                  | 2025-02-03           |
| `file`     | Arquivo anexado                              | documento.pdf        |
| `select`   | Opção selecionada                            | "Opção A"            |
| `boolean`  | true/false definido                          | true                 |

---

## 🔐 Regras de Negócio Implementadas

1. ✅ **Perguntas obrigatórias** devem ser respondidas
2. ✅ **Documentos obrigatórios** devem ser enviados
3. ✅ **Tipos de resposta** devem ser válidos (email, telefone, etc)
4. ✅ **Processos de alta prioridade** devem ter prazo de entrega (aviso)
5. ✅ **Campos vazios** não contam como respondidos
6. ✅ **Arquivos não anexados** são detectados

---

## 🎯 Próximos Passos (Sugestões)

1. **Validações customizadas por departamento**
   - Cada departamento pode ter regras específicas
   - Ex: Jurídico exige documentos com assinatura

2. **Histórico de validações**
   - Registrar quando validação falhou
   - Quem tentou avançar sem completar requisitos

3. **Dashboard de conformidade**
   - Listar processos com pendências
   - Gráficos de completude por departamento

4. **Notificações de pendências**
   - Alertar responsáveis sobre requisitos pendentes
   - Lembrete automático após X dias

5. **Validações assíncronas**
   - Consultar APIs externas (ex: validar CNPJ na Receita)
   - Verificar duplicidade de dados

6. **Campos condicionais**
   - Validar apenas se outra condição for verdadeira
   - Ex: Se "Pessoa Jurídica", exigir CNPJ

---

## 💡 Dicas de Uso

### Para Administradores:
- Configure questionários obrigatórios em cada departamento
- Defina documentos obrigatórios por tipo de processo
- Monitore processos com pendências no dashboard

### Para Gerentes:
- Verifique o checklist antes de solicitar avanço
- Complete todos os itens obrigatórios
- Use filtros para ver apenas processos completos

### Para Desenvolvedores:
- Use `useValidacoes()` em novos componentes
- Adicione novos schemas em `validation.ts`
- Customize `ChecklistDepartamento` se necessário

---

## 📞 Suporte

Para dúvidas ou problemas:
1. Consulte o [GUIA_TESTES_VALIDACOES.md](GUIA_TESTES_VALIDACOES.md)
2. Verifique os logs do console (F12)
3. Teste com dados de exemplo
4. Revise a implementação nos arquivos listados

---

**Data de Implementação**: ${new Date().toLocaleDateString('pt-BR')}
**Versão**: 1.0.0
