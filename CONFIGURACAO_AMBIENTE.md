# 🔧 Configuração do Ambiente

## Problemas Identificados e Soluções

### 1. ❌ Erro de Autenticação no Banco de Dados

**Erro:** `Authentication failed against database server at aws-1-sa-east-1.pooler.supabase.com`

**Causa:** Credenciais do banco de dados inválidas ou DATABASE_URL incorreta.

**Solução:**

1. Verifique seu arquivo `.env` na raiz do projeto
2. A `DATABASE_URL` deve estar no formato correto para Supabase:

```env
DATABASE_URL="postgresql://postgres:[SENHA]@aws-1-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
```

**Para obter a URL correta:**

1. Acesse o painel do Supabase (https://supabase.com)
2. Vá em **Settings** > **Database**
3. Procure por **Connection string** ou **Connection pooling**
4. Copie a URL e substitua `[YOUR-PASSWORD]` pela senha do seu banco
5. Cole no arquivo `.env`

**Formato completo do arquivo `.env`:**

```env
# Database - Supabase PostgreSQL
DATABASE_URL="postgresql://postgres:SUA_SENHA_AQUI@aws-1-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-key
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key

# Supabase Storage
SUPABASE_STORAGE_BUCKET=documentos

# JWT Secret (gere uma chave segura)
JWT_SECRET=sua-chave-secreta-super-segura-aqui
JWT_EXPIRES_IN=7d

# API
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NODE_ENV=development
```

### 2. ❌ Erros 404 nas Rotas

**Possíveis causas:**
- Servidor Next.js não reiniciado após alterações
- Rotas não encontradas por problemas de build

**Solução:**

1. Pare o servidor (Ctrl+C)
2. Gere o Prisma Client:
   ```bash
   npx prisma generate
   ```
3. Reinicie o servidor:
   ```bash
   npm run dev
   ```

### 3. ⚠️ Script do Package.json Corrigido

O script `dev` foi corrigido para não executar comandos em background. Agora:
- O Prisma Client será gerado automaticamente no `postinstall`
- O comando `dev` apenas inicia o servidor Next.js

### 4. 🔍 Verificar Conexão com o Banco

Para testar a conexão:

```bash
# Gerar Prisma Client
npx prisma generate

# Testar conexão (abre o Prisma Studio)
npx prisma studio
```

Se o Prisma Studio abrir, significa que a conexão está funcionando.

## 📝 Checklist de Configuração

- [ ] Arquivo `.env` existe na raiz do projeto
- [ ] `DATABASE_URL` está configurada corretamente
- [ ] Senha do banco está correta (sem espaços extras)
- [ ] URL do Supabase está correta
- [ ] `JWT_SECRET` está definido
- [ ] Prisma Client foi gerado (`npx prisma generate`)
- [ ] Migrations foram executadas (`npx prisma migrate dev`)
- [ ] Servidor foi reiniciado após alterações no `.env`

## 🚀 Próximos Passos

1. Configure o arquivo `.env` com as credenciais corretas
2. Execute `npx prisma generate` para gerar o cliente
3. Execute `npx prisma migrate dev` para criar as tabelas (se ainda não foram criadas)
4. Reinicie o servidor com `npm run dev`
5. Teste o login na aplicação

## 💡 Dicas

- **Nunca commite o arquivo `.env`** no git (já deve estar no `.gitignore`)
- Se usar **Connection Pooling** do Supabase, use a porta **6543** e adicione `?pgbouncer=true`
- Se usar **Direct Connection**, use a porta **5432** (não recomendado para produção)
- Teste sempre a conexão com `npx prisma studio` antes de rodar a aplicação
