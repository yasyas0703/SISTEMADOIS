# 🔐 Como Verificar e Obter a Senha Correta do Supabase

## Problema Atual

O erro "Authentication failed" ou "Tenant or user not found" indica que:
- A senha pode estar incorreta
- Ou a URL não está no formato correto

## Como Obter a URL Correta do Supabase

### Passo 1: Acessar o Painel do Supabase

1. Vá para https://supabase.com
2. Faça login na sua conta
3. Selecione seu projeto

### Passo 2: Obter a Connection String

1. No menu lateral, clique em **Settings** (⚙️)
2. Clique em **Database**
3. Role até a seção **Connection string** ou **Connection pooling**

### Passo 3: Escolher o Tipo de Conexão

#### Opção A: Connection Pooling (Recomendado para produção)

1. Clique na aba **Connection pooling**
2. Escolha **Transaction mode** (recomendado)
3. Você verá algo assim:
   ```
   postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-1-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true
   ```
4. **Copie essa URL completa**
5. No seu arquivo `.env`, substitua `[YOUR-PASSWORD]` pela senha real do banco

#### Opção B: Direct Connection (Para desenvolvimento)

1. Clique na aba **Connection string**
2. Você verá algo assim:
   ```
   postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-1-sa-east-1.pooler.supabase.com:5432/postgres
   ```
3. **Copie essa URL completa**
4. Substitua `[YOUR-PASSWORD]` pela senha real

### Passo 4: Obter/Resetar a Senha

Se você não sabe a senha do banco:

1. Na mesma página **Settings** > **Database**
2. Role até **Database password**
3. Se você já tem uma senha:
   - Clique em **Reveal** para ver (se possível)
   - Ou clique em **Reset database password**
4. Se precisar resetar:
   - Clique em **Reset database password**
   - Uma nova senha será gerada
   - **COPIE E SALVE** essa senha em local seguro
   - Use essa senha na URL

### Passo 5: Atualizar o .env

1. Abra o arquivo `.env` na raiz do projeto
2. Substitua a linha `DATABASE_URL` pela URL completa que você copiou do Supabase
3. **Certifique-se de substituir `[YOUR-PASSWORD]` pela senha real**

Exemplo:
```env
DATABASE_URL="postgresql://postgres.mhavpkynzyihrcauhpig:SUA_SENHA_REAL_AQUI@aws-1-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
```

### Passo 6: Codificar Caracteres Especiais

Se sua senha contém caracteres especiais, eles precisam ser codificados na URL:

- `@` → `%40`
- `#` → `%23`
- `$` → `%24`
- `%` → `%25`
- `&` → `%26`
- `+` → `%2B`
- `=` → `%3D`
- `?` → `%3F`
- `/` → `%2F`
- ` ` (espaço) → `%20`

**Exemplo:**
- Senha: `minha@senha#123`
- Na URL: `minha%40senha%23123`

### Passo 7: Testar a Conexão

Após atualizar o `.env`, execute:

```bash
npm run testar-conexao
```

Se funcionar, você verá: ✅ **Conexão estabelecida com sucesso!**

## Resumo Rápido

1. ✅ Acesse Supabase > Settings > Database
2. ✅ Copie a Connection String completa (pooling ou direct)
3. ✅ Se não souber a senha, faça Reset da senha do banco
4. ✅ Substitua `[YOUR-PASSWORD]` pela senha real
5. ✅ Codifique caracteres especiais se necessário
6. ✅ Cole no arquivo `.env`
7. ✅ Teste com `npm run testar-conexao`

## Formato Final Esperado

**Para Connection Pooling:**
```env
DATABASE_URL="postgresql://postgres.mhavpkynzyihrcauhpig:SUA_SENHA@aws-1-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
```

**Para Direct Connection:**
```env
DATABASE_URL="postgresql://postgres.mhavpkynzyihrcauhpig:SUA_SENHA@aws-1-sa-east-1.pooler.supabase.com:5432/postgres"
```

## Dica Importante

Se você estiver usando Connection Pooling (porta 6543), o formato da URL no Supabase pode variar. Certifique-se de:
- ✅ Usar o usuário completo: `postgres.xxx`
- ✅ Usar a porta correta: `6543` para pooling, `5432` para direct
- ✅ Incluir `?pgbouncer=true` para pooling
- ✅ Usar a senha correta (sem espaços extras)

