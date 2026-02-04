# 💬 Sistema de Respostas em Comentários - Guia de Migração

## 🚀 Implementação Completa

### Alterações Realizadas

#### 1. Schema do Banco de Dados (Prisma)

Adicionado suporte a respostas aninhadas no modelo `Comentario`:

```prisma
model Comentario {
  // ... campos existentes
  
  parentId        Int?      // ID do comentário pai (para respostas)
  parent          Comentario? @relation("ComentarioRespostas", fields: [parentId], references: [id], onDelete: Cascade)
  respostas       Comentario[] @relation("ComentarioRespostas")
  
  @@index([parentId])
}
```

#### 2. Tipos TypeScript

Atualizado `app/types/index.ts`:
```typescript
export interface Comentario {
  // ... campos existentes
  parentId?: number | null;
  respostas?: Comentario[];
  autorId?: number;
}
```

#### 3. API Backend

Atualizado `app/api/comentarios/route.ts` para aceitar `parentId`.

#### 4. Interface do Usuário

**ModalComentarios.tsx** completamente atualizado com:
- ✅ Botão "Responder" em cada comentário
- ✅ Campo de resposta inline com MentionInput
- ✅ Organização automática de threads (comentários principais + respostas)
- ✅ Respostas aninhadas com visual diferenciado
- ✅ Ícone de seta para indicar respostas
- ✅ Cancelar resposta
- ✅ Ctrl+Enter para enviar resposta rápida

## 📋 Passos para Aplicar as Mudanças

### 1. Atualizar o Banco de Dados

Execute no terminal:

```bash
# Gerar migration do Prisma
npx prisma migrate dev --name adicionar-respostas-comentarios

# OU se preferir apenas gerar o client (sem migration)
npx prisma generate
```

### 2. Testar o Sistema

1. **Abra um processo**
2. **Clique em "Comentários"**
3. **Adicione um comentário principal**
4. **Clique em "Responder"**
5. **Digite uma resposta** (pode usar @ para mencionar)
6. **Envie a resposta**

## 🎨 Visual do Sistema de Respostas

### Comentário Principal
```
┌─────────────────────────────────────────────────────────┐
│  [JS] João Silva                              ✏️ ❌     │
│       Departamento RH • 04/02/2026 15:30               │
│                                                         │
│  Precisamos revisar esse contrato urgentemente         │
│                                                         │
│  ─────────────────────────────────────────────────────  │
│  💬 Responder                                          │
└─────────────────────────────────────────────────────────┘
```

### Com Resposta
```
┌─────────────────────────────────────────────────────────┐
│  [JS] João Silva                              ✏️ ❌     │
│       Departamento RH • 04/02/2026 15:30               │
│                                                         │
│  Precisamos revisar esse contrato urgentemente         │
│                                                         │
│  ┌─────────────────────────────────────────────────────┐
│  │ ↳ [MS] Maria Silva                                  │
│  │   Departamento Jurídico • 04/02/2026 16:45         │
│  │                                                     │
│  │   Já estou revisando, João! Termino hoje.          │
│  └─────────────────────────────────────────────────────┘
│                                                         │
│  ─────────────────────────────────────────────────────  │
│  💬 Responder                                          │
└─────────────────────────────────────────────────────────┘
```

### Modo Resposta Ativa
```
┌─────────────────────────────────────────────────────────┐
│  [JS] João Silva                              ✏️ ❌     │
│       Departamento RH • 04/02/2026 15:30               │
│                                                         │
│  Precisamos revisar esse contrato urgentemente         │
│                                                         │
│  ┌─────────────────────────────────────────────────────┐
│  │ Respondendo para João Silva...                      │
│  │ [                                                  ]│
│  │                                                     │
│  │  [Enviar Resposta]  [Cancelar]                     │
│  └─────────────────────────────────────────────────────┘
│                                                         │
│  ─────────────────────────────────────────────────────  │
│  💬 Cancelar resposta                                  │
└─────────────────────────────────────────────────────────┘
```

## ✨ Recursos Implementados

### Thread de Conversas
- Comentários principais ficam no nível superior
- Respostas aparecem indentadas abaixo do comentário pai
- Visual diferenciado para respostas (fundo roxo claro)
- Ícone de seta (↳) indicando resposta

### Interações
- **Responder**: Clique no botão "Responder"
- **Cancelar**: Clique novamente ou no botão "Cancelar"
- **Enviar**: Pressione "Enviar Resposta" ou Ctrl+Enter
- **Mencionar**: Use @ dentro das respostas também

### Notificações
- Quando você responde um comentário, o autor original pode ser notificado
- Menções funcionam normalmente nas respostas
- Badge vermelho aparece se você foi mencionado em respostas

## 🎯 Casos de Uso

### 1. Esclarecimento Rápido
```
João: "Qual o prazo para entregar os documentos?"
  ↳ Maria: "Até sexta-feira, 10/02"
```

### 2. Thread de Discussão
```
Carlos: "Precisamos revisar a cláusula 5 do contrato"
  ↳ Ana: "Concordo, tem algumas inconsistências"
  ↳ Pedro: "Vou revisar hoje mesmo"
  ↳ Carlos: "@Pedro obrigado! Avise quando terminar"
```

### 3. Delegação com Contexto
```
Gerente: "Este processo precisa de atenção especial"
  ↳ Analista: "Entendido! Já estou priorizando"
```

## 🔧 Funções Principais

### organizarComentariosEmThreads()
Separa comentários principais de respostas e agrupa por parentId.

### handleEnviarResposta(parentId)
Envia uma resposta vinculada a um comentário específico.

### renderTextoComMencoes(texto)
Destaca menções (@usuario) tanto em comentários quanto respostas.

## 🎨 Cores e Estilos

### Respostas
- **Fundo**: `bg-purple-50 dark:bg-purple-950/30`
- **Borda**: `border-l-2 border-purple-200`
- **Ícone**: `CornerDownRight` em roxo

### Botão Responder
- **Cor**: `text-purple-600 hover:text-purple-700`
- **Ícone**: `Reply`

## 📊 Estrutura de Dados

### Comentário Principal
```json
{
  "id": 1,
  "processoId": 123,
  "texto": "Comentário principal",
  "autorId": 5,
  "parentId": null,
  "respostas": [...]
}
```

### Resposta
```json
{
  "id": 2,
  "processoId": 123,
  "texto": "Respondendo...",
  "autorId": 8,
  "parentId": 1,
  "respostas": []
}
```

## 🚨 Importante

1. **Execute a migration** antes de testar
2. **Respostas de respostas** não são suportadas (apenas 1 nível)
3. **Editar/Excluir** respostas funciona igual a comentários normais
4. **Notificações** funcionam em respostas também

## 🎉 Pronto!

O sistema está completo e pronto para uso. Os usuários agora podem ter conversas contextualizadas dentro dos comentários!

---

**Desenvolvido com ❤️ para melhorar a comunicação da equipe!**
