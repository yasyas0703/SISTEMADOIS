# 📋 ANÁLISE COMPLETA DOS MODAIS - Sistema de Abertura

**Data de Extração:** 6 de janeiro de 2026  
**Arquivo Analisado:** `sistema.js` (12.956 linhas)  
**Total de Modais:** 13 + 5 componentes auxiliares

---

## 📊 RESUMO EXECUTIVO

Foram identificados e documentados **13 modais principais** e **5 componentes auxiliares** no arquivo `sistema.js`. Todos os modais foram extraídos com suas estruturas HTML/JSX completas, incluindo:

- ✅ Campos e inputs
- ✅ Estados (useState)
- ✅ Handlers (onChange, onClick, onSubmit)
- ✅ Classes CSS/Tailwind
- ✅ Lógica de validação
- ✅ Integração com API

---

## 🎯 MODAIS PRINCIPAIS

### 1. **ModalNovaEmpresa** (Linhas 3628-4329)
**Propósito:** Criar nova solicitação com seleção de empresa, departamentos e questionários.

**Campos:**
- `nomeEmpresa`, `cliente`, `email`, `telefone`
- `nomeServico` (obrigatório)
- `questionariosPorDept` (dinâmico)
- `fluxoDepartamentos` (array)
- `salvarComoTemplateChecked`

**Funcionalidades Principais:**
- ✨ Seleção de empresa cadastrada
- ✨ Criação dinâmica de questionários por departamento
- ✨ Adição/remoção de departamentos
- ✨ 9 tipos de campos: text, textarea, number, date, boolean, select, file, phone, email
- ✨ Perguntas condicionais
- ✨ Opção de salvar como template

---

### 2. **ModalConfirmacao** (Linhas 4330-4408)
**Propósito:** Modal genérico de confirmação com diferentes tipos.

**Tipos Suportados:**
- `perigo` (vermelho)
- `aviso` (âmbar)
- `sucesso` (verde)
- `info` (azul)

**Customização:**
- Ícones dinâmicos por tipo
- Gradientes de cores
- Textos de botão personalizáveis

---

### 3. **ModalCadastrarEmpresa** (Linhas 4708-5216)
**Propósito:** Cadastro e edição de empresas com dados completos.

**Campos Principais:**
```
Dados Principais:
- cnpj (formatado)
- codigo (obrigatório)
- razao_social (obrigatório)
- apelido (nome fantasia)

Inscrições e Regimes:
- inscricao_estadual
- inscricao_municipal
- regime_federal (Simples/Lucro Presumido/Lucro Real)
- regime_estadual
- regime_municipal

Endereço:
- cep (formatado)
- estado (select com 27 estados)
- cidade
- bairro
- logradouro
- numero (apenas números)
```

**Auto-Formatações:**
- CPF/CNPJ: formatação automática
- CEP: 00000-000
- Telefone: (00) 00000-0000

---

### 4. **ModalCriarDepartamento** (Linhas 5217-5794)
**Propósito:** Criar/editar departamentos com cores e ícones.

**Campos:**
- `nome` (obrigatório)
- `responsavel` (obrigatório)
- `descricao`
- `corSelecionada` (12 cores)
- `iconeSelecionado` (múltiplos ícones)
- `docsObrigatorios` (array)

**Grid de Cores:** 3 colunas com preview  
**Grid de Ícones:** 6 colunas com seleção visual

---

### 5. **ModalSelecionarTemplate** (Linhas 5795-7694)
**Propósito:** Selecionar template de solicitação.

**Campos:**
- `templateSelecionado`
- `empresaSelecionadaSolicitacao`
- `responsavel`

**Funcionalidades:**
- Radio buttons para seleção
- Tooltips com detalhes do fluxo
- Menu de contexto (admin)
- Validação de permissões

---

### 6. **ModalListarEmpresas** (Linhas 7695-8028)
**Propósito:** Listar empresas com filtro e busca.

**Filtros:**
- Tipo: cadastradas vs não-cadastradas
- Busca: código, CNPJ, razão social

**Grid:** Responsivo (1/2/3 colunas)  
**Ações:** Ver detalhes, editar (admin), excluir (admin)

---

### 7. **ModalGerenciarTags** (Linhas 8029-8581)
**Propósito:** Gerenciar tags do sistema.

**Funcionalidades:**
- Criar novas tags
- Editar tags existentes
- Selecionar cor (12 opções)
- Excluir tags
- Grid 6 colunas para cores

**Cores Disponíveis:**
Vermelho, Laranja, Amarelo, Verde, Azul, Índigo, Roxo, Rosa, Cinza, Ciano, Esmeralda, Âmbar

---

### 8. **ModalAnalytics** (Linhas 8582-9478)
**Propósito:** Dashboard com análises e métricas.

**3 Abas:**
1. **Visão Geral**
   - Total de processos
   - Taxa de sucesso
   - Tempo médio
   - Gargalos

2. **Departamentos**
   - Performance por departamento
   - Eficiência
   - Tempo médio

3. **Previsões**
   - Previsão de conclusão
   - Nível de confiança

---

### 9. **ModalComentarios** (Linhas 9479-9720)
**Propósito:** Gerenciar comentários de processo.

**Funcionalidades:**
- Envio com Ctrl+Enter
- Edição de comentários
- Exclusão (com permissão)
- Menções (@usuario)
- Histórico com timestamps

---

### 10. **ModalUploadDocumento** (Linhas 9721-10412)
**Propósito:** Upload de documentos com drag-and-drop.

**Tipos de Documento:**
- Geral
- Contrato Social
- CNPJ
- Inscrição Estadual
- Certificado Digital
- Procurações
- Documentos dos Sócios
- Comprovante de Endereço

**Funcionalidades:**
- Drag-and-drop
- Seleção múltipla
- Visualização de arquivos
- Remover da lista

---

### 11. **ModalQuestionario** (Componente funcional)
**Propósito:** Preencher/visualizar questionários.

**9 Tipos de Campos Suportados:**
1. **text** - Texto simples
2. **textarea** - Texto longo
3. **number** - Número
4. **date** - Data
5. **boolean** - Sim/Não (radio buttons)
6. **select** - Dropdown
7. **file** - Upload de arquivo
8. **phone** - Telefone
9. **email** - Email

**Recursos Avançados:**
- Perguntas condicionais (aparecem se X = Y)
- Upload inline de documentos
- Visualização de respostas anteriores
- Backup em localStorage
- Salvar silenciosamente

---

### 12. **ModalVisualizacao** (VisualizacaoCompleta)
**Propósito:** Visualizar processo completo.

**Seções:**
- Informações gerais
- Respostas por departamento
- Histórico completo
- Documentos do processo

---

### 13. **ModalGaleria** (GaleriaDocumentos)
**Propósito:** Galeria de documentos por departamento.

**Funcionalidades:**
- Filtro por departamento
- Agrupamento por tipo
- Cards com preview/download/excluir

---

## 🔧 COMPONENTES AUXILIARES

| Componente | Linhas | Descrição |
|-----------|--------|-----------|
| **ModalEditarQuestionarioSolicitacao** | 5217+ | Editar questionários de solicitações |
| **ModalSelecionarTags** | 8582+ | Sub-modal para seleção de tags |
| **PreviewDocumento** | 8582+ | Preview de imagens/PDFs |
| **ModalLogin** | 10413+ | Autenticação do usuário |
| **ModalGerenciarUsuarios** | 10413+ | Gerenciamento de usuários (admin) |

---

## 📱 ESTRUTURA DE GRID RESPONSIVO

### Padrões Utilizados:
```
1 coluna (mobile):        grid-cols-1
2 colunas (tablet):       grid-cols-1 md:grid-cols-2
3 colunas (desktop):      grid-cols-1 md:grid-cols-2 lg:grid-cols-3
4+ colunas (wide):        grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
```

### Tamanhos Máximos:
- **Pequeno:** max-w-md
- **Médio:** max-w-2xl
- **Grande:** max-w-4xl
- **Extra grande:** max-w-6xl

---

## 🎨 ESQUEMA DE CORES TAILWIND

### Gradientes Principais:
- **Cyan/Blue:** `from-cyan-500 to-blue-600`
- **Verde:** `from-green-500 to-green-600`
- **Roxo:** `from-purple-500 to-purple-600`
- **Âmbar:** `from-amber-500 to-orange-600`
- **Indigo:** `from-indigo-500 to-purple-600`

### Estados:
- **Hover:** `hover:from-[color]-600 hover:to-[color]-700`
- **Focus:** `focus:ring-2 focus:ring-[color]-500`
- **Disabled:** `disabled:opacity-50 disabled:cursor-not-allowed`
- **Active:** `active:scale-95`

---

## 🔐 PERMISSÕES REQUERIDAS

```
criar_processo
editar_processo
excluir_processo
criar_tag
editar_tag
excluir_tag
criar_departamento
editar_departamento
excluir_departamento
gerenciar_usuarios
mover_processo
```

---

## 💾 ESTADO GLOBAL (useState)

### Estados Principais:
```javascript
showNovaEmpresa
showCadastrarEmpresa
showCriarDepartamento
showAnalytics
showComentarios
showUploadDocumento
showGerenciarTags
showSelecionarTags
showListarEmpresas
showGaleria
showVisualizacao
showQuestionario
showLogin
showGerenciarUsuarios
```

### LocalStorage:
- `respostas_temp_[processoId]_[departamentoId]` - Backup de respostas
- `scroll_[processoId]_[departamentoId]` - Posição de scroll

---

## 📡 INTEGRAÇÃO COM API

### Endpoints Utilizados:
```
POST   /login
POST   /empresas
PUT    /empresas/{id}
DELETE /empresas/{id}
GET    /empresas
POST   /departamentos
PUT    /departamentos/{id}
DELETE /departamentos/{id}
POST   /processos
PUT    /processos/{id}
DELETE /processos/{id}
GET    /processos/em-risco
POST   /comentarios
PUT    /comentarios/{id}
DELETE /comentarios/{id}
POST   /documentos
DELETE /documentos/{id}
POST   /tags
PUT    /tags/{id}
DELETE /tags/{id}
```

---

## 🎯 CASOS DE USO PRINCIPAIS

### 1. Criar Nova Solicitação
```
ModalSelecionarTemplate → ModalNovaEmpresa → QuestionarioModal
```

### 2. Gerenciar Empresa
```
ModalListarEmpresas → ModalCadastrarEmpresa (editar)
```

### 3. Processar Solicitação
```
QuestionarioModal → ModalUploadDocumento → ModalComentarios
```

### 4. Analisar Performance
```
ModalAnalytics (dashboard com métricas)
```

### 5. Gerenciar Sistema (Admin)
```
ModalCriarDepartamento
ModalGerenciarTags
ModalGerenciarUsuarios
```

---

## 🚀 PRÓXIMOS PASSOS PARA RECREAR OS MODAIS

1. **Copie o JSON** (`MODAIS_EXTRAIDOS.json`) com a estrutura completa
2. **Crie componentes React** separados para cada modal
3. **Implemente os handlers** de cada modal
4. **Integre com sua API** usando as rotas documentadas
5. **Teste a responsividade** em diferentes tamanhos
6. **Valide as permissões** de usuário
7. **Configure localStorage** para backup de dados

---

## 📊 ESTATÍSTICAS

| Métrica | Valor |
|---------|-------|
| Total de Modais | 13 |
| Componentes Auxiliares | 5 |
| Linhas Analisadas | 12.956 |
| Tipos de Campos | 9 |
| Cores Disponíveis | 12 |
| Permissões | 12 |
| Estados Globais | 14 |
| Responsividade | 100% |

---

## ✨ CARACTERÍSTICAS AVANÇADAS

### Perguntas Condicionais
```javascript
condicao: {
  perguntaId: 123,
  operador: "igual", // igual, diferente, contem
  valor: "Sim"
}
```

### Auto-Formatação de Campos
- CPF/CNPJ: `000.000.000-00`
- CEP: `00000-000`
- Telefone: `(00) 00000-0000`

### Backup de Respostas
Utiliza localStorage para recuperar respostas em caso de falha.

### Galeria de Documentos
Agrupa documentos por tipo e departamento com preview.

---

## 📝 NOTAS IMPORTANTES

1. **WebSocket:** Sistema suporta conexão WebSocket para atualizações em tempo real
2. **Validação:** Validações client-side + server-side
3. **Upload:** Suporta múltiplos arquivos e drag-and-drop
4. **Permissões:** Sistema baseado em roles (admin, gerente, comum)
5. **Responsividade:** Todos os modais são totalmente responsivos
6. **Acessibilidade:** Utiliza labels, aria-labels e focus management

---

## 🎓 REFERÊNCIA RÁPIDA

**JSON Completo:** Veja `MODAIS_EXTRAIDOS.json`  
**Arquivo Original:** `sistema.js`  
**Data de Extração:** 6 de janeiro de 2026

---

**Documento gerado automaticamente para facilitar a recriação idêntica dos modais.**
