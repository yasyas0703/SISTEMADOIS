# 🚨 Como Resolver o Erro de Comentários

## Erro Encontrado

```
Erro ao salvar comentário: Error: Erro ao criar comentário
```

## 🔧 Solução Rápida

O erro acontece porque o banco de dados precisa ser atualizado para suportar o sistema de respostas.

### Opção 1: Executar Script (RECOMENDADO) ⚡

**Windows:**
```bash
.\scripts\atualizar-comentarios.bat
```

**Linux/Mac:**
```bash
chmod +x scripts/atualizar-comentarios.sh
./scripts/atualizar-comentarios.sh
```

### Opção 2: Comandos Manuais

Execute no terminal na raiz do projeto:

```bash
# 1. Gerar migration
npx prisma migrate dev --name adicionar-respostas-comentarios

# 2. Gerar Prisma Client
npx prisma generate
```

### Opção 3: Resetar Banco (Apenas Desenvolvimento) ⚠️

**ATENÇÃO: Isso apaga todos os dados!**

```bash
npx prisma migrate reset
npx prisma migrate dev
npx prisma generate
```

## 📋 O Que Foi Alterado?

Foi adicionado suporte a **respostas aninhadas** nos comentários:

### No Schema do Prisma:
```prisma
model Comentario {
  // ... campos existentes
  
  parentId   Int?          // Novo campo
  parent     Comentario?   // Nova relação
  respostas  Comentario[]  // Nova relação
}
```

### Na Interface:
- Botão "Responder" em cada comentário
- Campo de resposta inline
- Visual de threads organizadas

## ✅ Como Saber que Funcionou?

Após executar os comandos:

1. Não deve haver erros de compilação
2. Ao clicar em "Responder" em um comentário, deve funcionar
3. O campo de resposta deve aparecer
4. A resposta deve ser salva com sucesso

## 🆘 Ainda com Problemas?

### Erro: "Migration already applied"

```bash
npx prisma migrate resolve --applied adicionar-respostas-comentarios
npx prisma generate
```

### Erro: "Can't reach database server"

1. Verifique se o PostgreSQL está rodando
2. Verifique a variável `DATABASE_URL` no `.env`
3. Teste a conexão:
   ```bash
   npx prisma db pull
   ```

### Erro: Prisma Client desatualizado

```bash
# Limpar cache
rm -rf node_modules/.prisma
npx prisma generate
```

## 💡 Por Que Isso Aconteceu?

O sistema foi atualizado com novos recursos:
1. ✅ Menções com @ e autocomplete
2. ✅ Badges de notificação (bolinha vermelha)
3. ✅ **Sistema de respostas** (NOVO!)
4. ✅ Tema escuro melhorado

O campo `parentId` é necessário para vincular respostas aos comentários principais.

## 📞 Próximos Passos

Após atualizar o banco:

1. ✅ Recarregue a aplicação
2. ✅ Abra um processo
3. ✅ Vá em Comentários
4. ✅ Teste responder um comentário
5. ✅ Aproveite! 🎉

---

**Tempo estimado**: 1-2 minutos

**Comandos resumidos:**
```bash
npx prisma migrate dev --name adicionar-respostas-comentarios
npx prisma generate
```

**Pronto!** 🚀
