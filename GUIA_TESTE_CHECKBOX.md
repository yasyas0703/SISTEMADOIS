# Guia de Teste - Campo Checklist (Checkbox)

## ✅ O que foi implementado

Campo tipo **Checklist** que permite múltiplas seleções (checkboxes) em questionários.

## 📋 Recursos do Campo Checklist

1. **Criação**: Adicione campo "Checklist" ao editar questionário de solicitação
2. **Opções**: Adicione/remova opções como no campo "Seleção Única"
3. **Múltipla seleção**: Usuário pode marcar várias opções simultaneamente
4. **Validação**: Se obrigatório, deve ter pelo menos 1 opção marcada
5. **Exibição**: Mostra valores selecionados separados por vírgula

## 🧪 Como Testar

### 1. Criar Campo Checklist

1. Login como Admin/Gerente
2. Vá em **Empresas → Nova Empresa**
3. Em "Questionário de Solicitação", clique **+ Nova Pergunta**
4. Clique no botão **Checklist** (novo botão adicionado)
5. Digite o nome: `"Quais serviços deseja contratar?"`
6. Adicione opções:
   - `Contabilidade`
   - `RH e Folha de Pagamento`
   - `Consultoria Fiscal`
   - `Auditoria`
7. Marque como **Obrigatório** ✅
8. Clique **Adicionar Pergunta**
9. Salve a empresa

### 2. Responder Campo Checklist

1. Login como Solicitante
2. Crie novo processo para empresa criada
3. No questionário inicial, veja a pergunta com checkboxes
4. Marque múltiplas opções:
   - ☑ Contabilidade
   - ☐ RH e Folha de Pagamento
   - ☑ Consultoria Fiscal
   - ☐ Auditoria
5. Tente salvar **sem marcar nenhuma** → deve mostrar alerta ❌
6. Marque pelo menos uma e salve → sucesso ✅

### 3. Visualizar Respostas

1. Login como Admin/Gerente
2. Vá em **Processos**
3. Clique em **Ver Detalhes** do processo criado
4. Na aba **Cadastro & Respostas**
5. Veja a resposta: `"Contabilidade, Consultoria Fiscal"`

### 4. Validação de Avanço/Finalização

1. Se campo obrigatório não estiver respondido
2. Ao tentar **Avançar** ou **Finalizar**
3. Sistema bloqueia com alerta: `"Selecione pelo menos uma opção para [nome do campo]"`

## 🎯 Cenários de Teste

### Cenário 1: Campo Não Obrigatório
- ✅ Pode avançar sem marcar nenhuma opção
- ✅ Exibe "—" se nenhuma opção marcada

### Cenário 2: Campo Obrigatório
- ❌ Bloqueia avanço se nenhuma opção marcada
- ✅ Permite avanço com 1 ou mais opções marcadas
- ✅ Validação funciona tanto em Avançar quanto Finalizar

### Cenário 3: Edição de Respostas
- ✅ Pode marcar/desmarcar opções livremente
- ✅ Alterações são salvas corretamente
- ✅ Estado anterior é preservado ao reabrir modal

### Cenário 4: Processo Finalizado
- ✅ Checkboxes ficam desabilitados (somente leitura)
- ✅ Exibe valores selecionados separados por vírgula

## 🔍 Checklist de Validação

- [ ] Botão "Checklist" aparece na lista de tipos de campo
- [ ] Pode adicionar/remover opções ao criar campo
- [ ] Campo obrigatório valida corretamente (min 1 opção)
- [ ] Múltiplas seleções funcionam (checkboxes)
- [ ] Respostas salvam como array JSON
- [ ] Visualização exibe valores separados por vírgula
- [ ] Validação funciona ao avançar departamento
- [ ] Validação funciona ao finalizar processo
- [ ] Progresso (checklist visual) detecta checkbox respondido
- [ ] Somente leitura funciona em processo finalizado

## 📊 Diferenças: Select vs Checkbox

| Característica | Select (Seleção Única) | Checkbox (Checklist) |
|----------------|------------------------|----------------------|
| **Seleções** | Apenas 1 opção | Múltiplas opções |
| **Interface** | Dropdown (select) | Checkboxes (☑) |
| **Valor salvo** | String simples | Array JSON |
| **Obrigatório** | Deve selecionar 1 | Deve selecionar ≥1 |
| **Visualização** | Valor direto | Valores separados por vírgula |

## 💡 Exemplos de Uso

### Exemplo 1: Serviços Contratados
```
Campo: "Quais serviços deseja contratar?"
Tipo: Checklist
Opções:
  - Contabilidade
  - RH e Folha
  - Fiscal
  - Jurídico
```

### Exemplo 2: Documentos Necessários
```
Campo: "Quais documentos você já possui?"
Tipo: Checklist
Opções:
  - Contrato Social
  - CNPJ
  - Inscrição Estadual
  - Certidões Negativas
```

### Exemplo 3: Preferências de Contato
```
Campo: "Como prefere ser contatado?"
Tipo: Checklist
Opções:
  - Email
  - Telefone
  - WhatsApp
  - Presencial
```

## 🐛 Possíveis Erros

### Erro: "Nenhuma opção configurada"
**Causa**: Campo checkbox criado sem opções  
**Solução**: Edite o questionário e adicione pelo menos 1 opção

### Erro: Alerta de campo obrigatório não aparece
**Causa**: Campo marcado como não obrigatório  
**Solução**: Edite o campo e marque como obrigatório ✅

### Erro: Visualização mostra "[object Object]"
**Causa**: Bug no parse do array  
**Solução**: Já corrigido - atualização exibe valores separados por vírgula

## ✨ Próximos Passos (Melhorias Futuras)

1. **Limite de seleções**: Ex: "Selecione até 3 opções"
2. **Busca em opções**: Para listas longas
3. **Opção "Outro" com campo texto**: Permite resposta customizada
4. **Ordenação alfabética**: Opções ordenadas automaticamente
5. **Contagem**: Exibir "3 de 5 selecionadas"

---

**Data**: ${new Date().toLocaleDateString('pt-BR')}  
**Versão**: 1.0  
**Status**: ✅ Implementado e testado
