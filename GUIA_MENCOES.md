# 🔔 Sistema de Menções nos Comentários

## Visão Geral

O sistema de menções permite que usuários mencionem outros membros da equipe nos comentários usando `@`, criando notificações automáticas e destaque visual para melhorar a comunicação entre a equipe.

## ✨ Recursos Implementados

### 1. Autocomplete Inteligente

Quando você digita `@` em um comentário, aparece automaticamente uma lista de usuários disponíveis:

- **Busca em tempo real**: Filtra usuários conforme você digita
- **Navegação por teclado**: Use ↑↓ para navegar, Enter para selecionar
- **Busca por nome ou email**: Encontra usuários pelo nome completo ou email
- **Destaque visual**: O usuário selecionado é destacado

### 2. Menções Visuais

As menções aparecem destacadas nos comentários:

- **Formato especial**: Nomes mencionados aparecem com fundo azul claro
- **Destaque para você**: Comentários onde você foi mencionado têm:
  - 🔵 Borda lateral azul
  - 💠 Fundo gradiente especial (cyan/azul)
  - 🔔 Badge "Você foi mencionado" com animação
  - ✨ Sombra realçada

### 3. Notificações Automáticas

Quando alguém menciona você:

- ✅ Recebe uma notificação no sistema
- 📬 Notificação contém link direto para o processo
- 👤 Mostra quem mencionou você
- 📝 Inclui contexto do processo

## 🎯 Como Usar

### Para Mencionar Alguém

1. **Comece digitando** seu comentário normalmente
2. **Digite `@`** quando quiser mencionar alguém
3. **Aparecerá uma lista** de usuários disponíveis
4. **Use as setas** ↑↓ para navegar ou continue digitando para filtrar
5. **Pressione Enter** para selecionar o usuário
6. **Continue escrevendo** seu comentário

**Atalhos de Teclado:**
- `@` - Abrir lista de usuários
- `↑` `↓` - Navegar na lista
- `Enter` - Selecionar usuário
- `Esc` - Fechar lista
- `Ctrl+Enter` - Enviar comentário

### Exemplo de Uso

```
Olá @Maria_Silva, poderia revisar os documentos do cliente? 
Também gostaria que @João_Santos verificasse o status.
```

## 🎨 Componentes Criados

### MentionInput Component

Localização: `app/components/MentionInput.tsx`

**Props:**
- `value`: string - Texto atual do comentário
- `onChange`: (value: string) => void - Callback quando texto muda
- `usuarios`: Usuario[] - Lista de usuários disponíveis
- `placeholder`: string (opcional) - Placeholder do campo
- `rows`: number (opcional) - Número de linhas
- `onKeyDown`: (e: KeyboardEvent) => void (opcional) - Evento de teclado

**Características:**
- Detecção automática de `@`
- Autocomplete com busca
- Suporte a tema dark/light
- Navegação por teclado completa
- Click fora para fechar

### Melhorias no ModalComentarios

Localização: `app/components/modals/ModalComentarios.tsx`

**Novas features:**
- Integração com MentionInput
- Carregamento de lista de usuários
- Destaque visual para menções do usuário logado
- Badge "Você foi mencionado" animado
- Lista de menções no rodapé do comentário

## 🔧 API e Backend

### POST /api/comentarios

**Payload estendido:**
```json
{
  "processoId": 123,
  "texto": "Comentário com @usuario",
  "departamentoId": 1,
  "mencoes": ["@usuario"]
}
```

**Comportamento:**
1. Cria o comentário no banco
2. Extrai nomes dos usuários mencionados
3. Busca usuários no banco pelo nome
4. Cria notificações para cada usuário mencionado
5. Notificação inclui:
   - Link para o processo
   - Nome de quem mencionou
   - Nome do processo/empresa
   - Tipo: INFO

### Notificações Criadas

Quando você menciona alguém, o sistema:
- ✅ Cria notificação automaticamente
- 🚫 Não notifica o próprio autor
- 📧 Notifica apenas usuários válidos encontrados
- 🔗 Inclui link direto para o processo
- 🔄 Continua funcionando mesmo se notificação falhar

## 📝 Tipos de Dados

### Comentario Interface

```typescript
interface Comentario {
  id: number;
  processoId: number;
  texto: string;
  autor: string;
  departamentoId?: number;
  departamento?: string;
  timestamp: Date | string;
  editado: boolean;
  editadoEm?: Date | string;
  mencoes?: string[]; // Array de menções formato @nome
}
```

## 🎨 Estilos Visuais

### Comentário Normal
- Fundo: Cinza claro (#f9fafb)
- Hover: Cinza médio

### Comentário com Você Mencionado
- Fundo: Gradiente cyan para azul
- Borda esquerda: 4px azul cyan (#06b6d4)
- Sombra: Realçada
- Badge: Animado com ícone de sino

### Menção no Texto
- Fundo: Cyan claro (#e0f2fe)
- Texto: Cyan escuro (#0e7490)
- Borda arredondada
- Fonte: Medium weight

## 🚀 Funcionalidades Futuras (Sugeridas)

1. **Email notifications**: Enviar email quando mencionado
2. **Menções múltiplas**: @equipe, @departamento
3. **Histórico de menções**: Ver todos os comentários onde você foi mencionado
4. **Resposta rápida**: Responder diretamente de uma menção
5. **Status de leitura**: Indicar se o usuário viu a menção
6. **Preview ao hover**: Mostrar info do usuário ao passar mouse na menção

## 🐛 Tratamento de Erros

O sistema é robusto:
- Comentário é criado mesmo se notificação falhar
- Busca de usuários tem fallback para array vazio
- Menções inválidas não quebram o sistema
- Nome com espaços é convertido para underscore automaticamente

## 💡 Dicas de Uso

1. **Nomes com espaço**: Use underscore - `@Maria_Silva`
2. **Case insensitive**: `@maria`, `@Maria`, `@MARIA` - todos funcionam
3. **Múltiplas menções**: Pode mencionar vários usuários no mesmo comentário
4. **Edição**: Ao editar, menções antigas são preservadas
5. **Visualização**: Menções antigas continuam destacadas

## 📱 Responsividade

O componente funciona bem em:
- 💻 Desktop
- 📱 Mobile
- 🖥️ Tablet
- 🌙 Dark mode
- ☀️ Light mode

---

**Desenvolvido para melhorar a comunicação e colaboração da equipe! 🎉**
