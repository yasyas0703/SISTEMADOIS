# 📋 Sistema de Auditoria - Guia de Uso

## O que foi implementado

O sistema de auditoria registra **automaticamente** todas as ações importantes que acontecem nos processos. Isso inclui:

- ✅ Criação de processos
- 🔄 Movimentação entre departamentos
- ✏️ Alterações de status/prioridade
- 📎 Upload/remoção de documentos
- 💬 Adição de comentários
- 🏁 Finalização de processos
- E muito mais!

## Arquivos Criados

### 1. **HistoricoTimeline.tsx** 
Componente visual que exibe uma timeline bonita com todos os eventos.

### 2. **auditoria.ts** (utils)
Funções para registrar e buscar eventos do histórico.

### 3. **route.ts** (api/auditoria)
API para salvar e recuperar eventos de auditoria.

### 4. **ProcessoDetalhado.tsx** (atualizado)
Agora tem uma aba "Histórico Completo" que mostra toda a timeline.

---

## Como Testar

### Passo 1: Verificar o Banco de Dados

O modelo `HistoricoEvento` já existe no seu schema.prisma. Certifique-se de que está sincronizado:

```powershell
# No terminal do VSCode
cd c:\Users\yasmin.teodoro\Documents\sistematriar\SISTEMADOIS
npx prisma generate
npx prisma db push
```

### Passo 2: Testar a API de Auditoria

Primeiro, vamos criar um evento manualmente para testar:

```powershell
# Testar criação de evento (substitua o processoId por um ID real)
curl -X POST http://localhost:3000/api/auditoria `
  -H "Content-Type: application/json" `
  -d '{
    "processoId": 1,
    "tipo": "INICIO",
    "acao": "Processo criado para Empresa XYZ",
    "departamento": "Comercial"
  }'
```

### Passo 3: Testar Busca do Histórico

```powershell
# Buscar histórico de um processo (substitua o ID)
curl http://localhost:3000/api/auditoria?processoId=1
```

### Passo 4: Testar na Interface

1. **Inicie o servidor**:
   ```powershell
   npm run dev
   ```

2. **Acesse o sistema** em `http://localhost:3000`

3. **Abra um processo**:
   - Clique em um processo existente
   - Clique na aba **"🕒 Histórico Completo"**
   - Você verá a timeline com todos os eventos

4. **Realize ações** para gerar novos eventos:
   - Adicione um comentário
   - Faça upload de um documento
   - Mova o processo para outro departamento
   - Depois, volte e veja os eventos aparecendo!

---

## Como Usar no Código

### Exemplo 1: Registrar evento ao criar processo

```typescript
import { registrarEventoRapido, EVENTOS } from '@/app/utils/auditoria';
import { useSistema } from '@/app/context/SistemaContext';

// Dentro do seu componente/função
const { usuarioLogado } = useSistema();

// Após criar o processo
const novoProcesso = await criarProcesso(dados);

// Registrar no histórico
await registrarEventoRapido(
  novoProcesso.id,
  EVENTOS.PROCESSO_CRIADO(nomeEmpresa, nomeDepartamento),
  usuarioLogado?.id,
  nomeDepartamento
);
```

### Exemplo 2: Registrar ao mover processo

```typescript
import { registrarEventoRapido, EVENTOS } from '@/app/utils/auditoria';

// Ao avançar processo
await avancarProcesso(processoId);

// Registrar
await registrarEventoRapido(
  processoId,
  EVENTOS.PROCESSO_AVANCADO('Comercial', 'Financeiro'),
  usuarioLogado?.id,
  'Financeiro'
);
```

### Exemplo 3: Registrar ao adicionar documento

```typescript
import { registrarEventoRapido, EVENTOS } from '@/app/utils/auditoria';

// Após upload
const documento = await uploadDocumento(arquivo);

// Registrar
await registrarEventoRapido(
  processoId,
  EVENTOS.DOCUMENTO_ADICIONADO(arquivo.name, 'Contrato'),
  usuarioLogado?.id,
  departamentoAtual
);
```

### Exemplo 4: Evento customizado

```typescript
import { registrarEvento } from '@/app/utils/auditoria';

await registrarEvento({
  processoId: 123,
  tipo: 'ALTERACAO',
  acao: 'Cliente alterou o telefone de contato',
  responsavelId: usuarioLogado?.id,
  departamento: 'Atendimento',
  detalhes: {
    telefoneAntigo: '11999999999',
    telefoneNovo: '11888888888'
  }
});
```

---

## Integração Automática

Para tornar o sistema **totalmente automático**, adicione as chamadas de auditoria em:

### 1. API de Processos (`/api/processos/route.ts`)
```typescript
// No POST (criar processo)
const novoProcesso = await prisma.processo.create({...});

// Registrar evento
await prisma.historicoEvento.create({
  data: {
    processoId: novoProcesso.id,
    tipo: 'INICIO',
    acao: `Processo criado para ${body.nomeEmpresa}`,
    responsavelId: user.id,
    departamento: departamentoNome,
    dataTimestamp: Date.now(),
  }
});
```

### 2. API de Processos/[id] (mover/atualizar)
```typescript
// No PUT (atualizar)
if (statusAntigo !== statusNovo) {
  await prisma.historicoEvento.create({
    data: {
      processoId: parseInt(params.id),
      tipo: 'ALTERACAO',
      acao: `Status alterado de ${statusAntigo} para ${statusNovo}`,
      responsavelId: user.id,
      dataTimestamp: Date.now(),
    }
  });
}
```

### 3. API de Documentos
```typescript
// No POST (upload)
await prisma.historicoEvento.create({
  data: {
    processoId,
    tipo: 'DOCUMENTO',
    acao: `Documento adicionado: ${nomeArquivo}`,
    responsavelId: user.id,
    dataTimestamp: Date.now(),
  }
});
```

### 4. API de Comentários
```typescript
// No POST (comentar)
await prisma.historicoEvento.create({
  data: {
    processoId,
    tipo: 'COMENTARIO',
    acao: `Comentário adicionado: "${texto.substring(0, 50)}..."`,
    responsavelId: user.id,
    dataTimestamp: Date.now(),
  }
});
```

---

## Visualização

A timeline mostra:

- 🟢 **Ícone colorido** por tipo de evento
- 👤 **Nome do responsável**
- 📅 **Data e hora**
- 📍 **Departamento** (quando aplicável)
- 📝 **Descrição da ação**
- 🔵 **Destaque** para o evento mais recente

### Tipos de Evento e Cores:

- 🟢 **INICIO** - Verde (processo criado)
- 🔵 **MOVIMENTACAO** - Azul (mudou de departamento)
- 🟡 **ALTERACAO** - Amarelo (editado)
- 🟣 **DOCUMENTO** - Roxo (arquivo adicionado)
- 🔷 **COMENTARIO** - Índigo (comentário)
- 🟢 **CONCLUSAO** - Esmeralda (concluído)
- 🟠 **FINALIZACAO** - Âmbar (finalizado)

---

## Benefícios

✅ **Rastreabilidade Total**: Saiba exatamente o que aconteceu e quando  
✅ **Transparência**: Todos veem quem fez cada ação  
✅ **Compliance**: Auditoria para regulamentações  
✅ **Debugging**: Identifique problemas no fluxo  
✅ **Confiança**: Clientes veem o progresso real  
✅ **Responsabilização**: Cada ação tem um autor  

---

## Próximos Passos (Opcional)

1. **Exportar histórico em PDF**
2. **Filtrar eventos por tipo/departamento**
3. **Notificações baseadas em eventos**
4. **Relatórios de tempo médio por departamento**
5. **Dashboard de atividades**

---

## Precisa de Ajuda?

Se tiver dúvidas ou encontrar problemas, me avise! 🚀
