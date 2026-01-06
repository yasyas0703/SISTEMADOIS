# 🎯 PASSO A PASSO - DO ZERO AO FUNCIONANDO

## ETAPA 1: PREPARAR O AMBIENTE

### Passo 1.1 - Abrir Terminal/PowerShell
```bash
# Navegar até a pasta
cd c:\Users\yasmin.teodoro\Desktop\novo
```

### Passo 1.2 - Verificar Node.js instalado
```bash
node --version
npm --version
```
Se não tiver, baixar em: https://nodejs.org

---

## ETAPA 2: INSTALAR DEPENDÊNCIAS

### Passo 2.1 - Rodar instalação
```bash
npm install
```

**Isso vai:**
- Baixar todas as dependências listadas em `package.json`
- Criar pasta `node_modules/` (pode ser grande)
- Gerar arquivo `package-lock.json`

**Tempo estimado:** 2-5 minutos (depende da internet)

---

## ETAPA 3: RODAR O PROJETO

### Passo 3.1 - Iniciar servidor de desenvolvimento
```bash
npm run dev
```

**Você verá:**
```
  ▲ Next.js 14.0
  - Local:        http://localhost:3000
  - Environments: .env.local
  ready - started server on 0.0.0.0:3000
```

### Passo 3.2 - Abrir no navegador
Clique ou acesse: **http://localhost:3000**

---

## ETAPA 4: FAZER LOGIN

### Passo 4.1 - Tela de Login aparecerá
Você verá um formulário bonito com:
- Campo "Usuário"
- Campo "Senha"
- Dica com credenciais

### Passo 4.2 - Preencher dados demo
```
Usuário: admin
Senha: admin123
```

### Passo 4.3 - Clicar em "Entrar"
Pronto! Você está logado! 🎉

---

## ETAPA 5: EXPLORAR O PROJETO

Agora você tem acesso a:

### 📊 Dashboard
- 4 cards com estatísticas
- Total de processos
- Em andamento
- Finalizados
- Taxa de sucesso

### 📁 Departamentos
- Grid de departamentos
- Drag-drop de processos
- Criar novo departamento
- 3 departamentos demo (Recebimento, Análise, Finalização)

### 🔍 Filtros
- Buscar por nome
- Filtrar por status
- Filtrar por tags
- Filtrar por departamento

### 📋 Processos
- Lista completa de processos
- Clique para ver detalhes
- 3 processos demo

### 🎛️ Botões do Header
- 📊 Análises (gráficos e métricas)
- 📝 Nova Solicitação
- 👥 Gerenciar Usuários
- 🏷️ Gerenciar Tags
- 📋 Empresas (listar)
- ⚙️ Configurações

---

## ETAPA 6: TESTAR FUNCIONALIDADES

### Teste 1: Criar Departamento
1. Clique em "+ Criar Departamento"
2. Preencha nome e descrição
3. Escolha uma cor
4. Clique em "Criar"
✅ Novo departamento apareceu no grid!

### Teste 2: Criar Nova Solicitação
1. Clique em "+ Personalizada"
2. Preencha os dados
3. Selecione um departamento
4. Clique em "Criar Solicitação"
✅ Novo processo criado!

### Teste 3: Abrir Modais
Clique em qualquer botão para ver os modais:
- Análises → Gráficos e métricas
- Gerenciar Usuários → Adicionar/remover usuários
- Gerenciar Tags → Criar tags
- Empresas → Listar empresas
- E muito mais!

### Teste 4: Filtrar Processos
1. Digite algo no campo de busca
2. Selecione status
3. Escolha tags
4. Escolha departamento
✅ Lista filtra automaticamente!

---

## ETAPA 7: FAZER ALTERAÇÕES

### Exemplo: Mudar Cor do Header

#### Passo A - Abrir arquivo
```
app\components\Header.tsx
```

#### Passo B - Encontrar linha com cor
```tsx
className="bg-gradient-to-r from-cyan-500 to-blue-600"
```

#### Passo C - Mudar para outra cor
```tsx
className="bg-gradient-to-r from-purple-500 to-pink-600"
```

#### Passo D - Salvar arquivo
Ctrl + S

#### Passo E - Ver mudança no navegador
O navegador recarrega automaticamente! ✅

---

## ETAPA 8: ESTRUTURA DE PASTAS

Arquivos importantes para editar:

```
app/
├── page.tsx                    ← Página principal
├── context/
│   └── SistemaContext.tsx      ← Estado global
├── components/
│   ├── Header.tsx              ← Cabeçalho
│   ├── DashboardStats.tsx      ← Stats
│   ├── modals/                 ← Todos os pop-ups
│   └── sections/               ← Seções principais
└── globals.css                 ← Estilos
```

---

## ETAPA 9: DÚVIDAS COMUNS

### P: Meu navegador não atualiza?
**R:** Pressione F5 ou Ctrl + Shift + R para recarregar forçado

### P: Erro ao salvar arquivo?
**R:** Verifique se está salvo com Ctrl + S

### P: Porta 3000 já em uso?
**R:** Pressione Ctrl + C no terminal e rode `npm run dev` novamente

### P: Projeto muito lento?
**R:** Feche abas/programas pesados ou reinicie o terminal

### P: Como alterar cores?
**R:** Edite `tailwind.config.js` ou mude classes `bg-X-500` nos arquivos

---

## ETAPA 10: PARAR O PROJETO

### Para parar o servidor
```bash
Ctrl + C
```

Você verá:
```
Gracefully shutting down Next.js...
```

---

## ETAPA 11: RODAR NOVAMENTE

Para rodar novamente depois:
```bash
npm run dev
```

---

## ETAPA 12: BUILD PARA PRODUÇÃO

Quando quiser deployar:

### Passo A - Fazer build
```bash
npm run build
```

### Passo B - Rodar versão otimizada
```bash
npm start
```

---

## ✅ CHECKLIST DE SUCESSO

- [x] Node.js instalado
- [x] `npm install` executado
- [x] `npm run dev` rodando
- [x] http://localhost:3000 abrindo
- [x] Login funcionando (admin/admin123)
- [x] Dashboard carregando
- [x] Departamentos aparecendo
- [x] Filtros funcionando
- [x] Modais abrindo
- [x] Alterações sendo salvas

---

## 🎓 APRENDIZADO

### Como funciona?

```
1. Você abre http://localhost:3000
        ↓
2. Next.js carrega layout.tsx
        ↓
3. layout.tsx carrega SistemaProvider
        ↓
4. page.tsx renderiza todos componentes
        ↓
5. Componentes usam useSistema() para acessar estado
        ↓
6. Cliques em botões acionam funções
        ↓
7. Funções atualizam state via Context
        ↓
8. React re-renderiza componentes
        ↓
9. Você vê mudanças na tela
```

---

## 📚 PRÓXIMAS LEITURAS

Depois de explorar:
1. Leia `README.md`
2. Leia `GUIA_ESTRUTURA.md`
3. Explore o código dos componentes
4. Faça suas próprias alterações

---

## 🚀 PARABÉNS!

Você agora tem um projeto Next.js completo e funcional!

```
███████████████████████ 100% Completo!

✅ Frontend criado
✅ Componentes separados
✅ Estado centralizado
✅ Design mantido
✅ Documentação incluída
✅ Pronto para desenvolvimento
```

---

**Aproveite o projeto! 🎉**

Para qualquer dúvida, revise os arquivos de documentação:
- README.md
- GUIA_ESTRUTURA.md
- GUIA_RAPIDO.md
- PROJETO_COMPLETO.md

Happy coding! 💻✨
