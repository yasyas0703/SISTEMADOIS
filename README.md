# Sistema de Abertura de Empresas - Frontend Next.js

Um projeto Next.js moderno e bem estruturado para gerenciamento de processos e departamentos, com uma interface bonita e responsiva.

## 🚀 Características

- ✨ Interface moderna com Tailwind CSS
- 📱 Totalmente responsivo
- 🎨 Sistema de cores e gradientes personalizados
- 🔄 Gerenciamento de estado global com Context API
- 📦 Componentes reutilizáveis e bem organizados
- 🎯 Sem dependência de backend - apenas frontend
- ⚡ Next.js 14 com App Router

## 📁 Estrutura do Projeto

```
app/
├── components/
│   ├── Header.tsx                 # Cabeçalho principal
│   ├── DashboardStats.tsx         # Cards de estatísticas
│   ├── NotificacoesPanel.tsx      # Painel de notificações
│   ├── modals/
│   │   ├── ModalLogin.tsx         # Modal de login
│   │   ├── ModalConfirmacao.tsx   # Modal de confirmação
│   │   └── ModalCriarDepartamento.tsx  # Modal criar departamento
│   └── sections/
│       ├── DepartamentosGrid.tsx  # Grid de departamentos
│       ├── Filtros.tsx            # Filtros de busca
│       └── ListaProcessos.tsx     # Lista de processos
├── context/
│   └── SistemaContext.tsx         # Context global (estado + funções)
├── hooks/
│   └── (hooks customizados aqui)
├── utils/
│   └── (funções utilitárias aqui)
├── layout.tsx                      # Layout root
├── page.tsx                        # Página principal
└── globals.css                     # Estilos globais
```

## 🛠️ Instalação

### 1. Clone ou extraia o projeto

```bash
cd novo
```

### 2. Instale as dependências

```bash
npm install
# ou
yarn install
```

### 3. Execute o projeto em desenvolvimento

```bash
npm run dev
# ou
yarn dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## 🔐 Login Padrão (Demo)

- **Usuário**: `admin`
- **Senha**: `admin123`

## 📚 Componentes Principais

### Header
O componente header contém:
- Logo e título do sistema
- Painel de notificações
- Botões de ação (Análises, Nova Solicitação, etc.)
- Informações do usuário logado

### DashboardStats
Exibe 4 cards com:
- Total de processos
- Processos em andamento
- Processos finalizados
- Taxa de sucesso

### DepartamentosGrid
Grid de departamentos com:
- Drag & drop de processos
- Lista de processos por departamento
- Ações de editar/excluir

### ListaProcessos
Listagem detalhada de processos com:
- Filtros por status, busca, tags
- Informações completas do processo
- Design responsivo

## 🎨 Customização

### Cores Principais
As cores estão definidas em `tailwind.config.ts` e usadas em gradientes:
- Cyan/Azul: `from-cyan-500 to-blue-600`
- Purple/Pink: `from-purple-500 to-pink-600`
- Verde: `from-green-500 to-emerald-600`

### Adicionar Novos Componentes
1. Crie o arquivo em `app/components/`
2. Use o Context `useSistema()` para acessar o estado
3. Importe e use no `page.tsx`

## 🔌 Context API (Gerenciamento de Estado)

O projeto usa `SistemaContext` para gerenciar:

```typescript
const { 
  processos, 
  departamentos, 
  tags, 
  usuarioLogado,
  // ... e mais estados
  setProcessos,
  adicionarNotificacao,
  // ... e mais funções
} = useSistema();
```

## 📝 Tipos de Dados

### Processo
```typescript
interface Processo {
  id: number;
  nome: string;
  empresa: string;
  status: 'Em Andamento' | 'Finalizado' | 'Pausado';
  prioridade: 'alta' | 'media' | 'baixa';
  departamentoAtual: number;
  criadoEm: Date;
  dataAtualizacao: Date;
  dataEntrega?: Date;
  tags?: number[];
}
```

### Departamento
```typescript
interface Departamento {
  id: number;
  nome: string;
  descricao?: string;
  cor?: string; // gradient class
  ativo?: boolean;
}
```

## 🚀 Build para Produção

```bash
npm run build
npm start
```

## 📦 Dependências Principais

- **next**: Framework React para produção
- **react**: Biblioteca UI
- **tailwindcss**: Framework CSS
- **lucide-react**: Ícones
- **typescript**: Tipagem estática

## 🤝 Próximas Melhorias

- [ ] Integrar com backend real
- [ ] Persistência de dados em banco
- [ ] Sistema de autenticação completo
- [ ] Mais modais e funcionalidades
- [ ] Testes automatizados
- [ ] PWA offline support

## 📄 Licença

Este projeto é fornecido como está, sem garantias.

---

**Desenvolvido com ❤️ usando Next.js 14 e Tailwind CSS**
