# 🎯 COMO TESTAR O HISTÓRICO - GUIA RÁPIDO

## ✅ Passo a Passo Completo

### 1️⃣ Abrir o Sistema
```
Acesse: http://localhost:3001
(ou http://localhost:3000 se estiver na porta 3000)
```

### 2️⃣ Fazer Login
- Entre com seu usuário admin

### 3️⃣ Ver um Processo
- Clique em qualquer card de processo
- OU clique em "Ver Completo" em algum processo

### 4️⃣ Ver o Histórico
Você verá 3 abas:
- 📋 Cadastro & Respostas
- **🕒 Histórico Completo** ⬅️ CLIQUE AQUI!
- 📎 Documentos

### 5️⃣ Criar Eventos de Teste (Primeira vez)

**Opção A - Pelo Console do Navegador:**

1. Abra o Console do Navegador (pressione `F12`)
2. Vá na aba "Console"
3. Cole este código (altere o processoId):

```javascript
const processoId = 1; // ⚠️ ALTERE PARA SEU ID

async function criarEventos() {
  const eventos = [
    { tipo: 'INICIO', acao: '🎯 Processo criado', departamento: 'Comercial' },
    { tipo: 'DOCUMENTO', acao: '📎 Contrato Social anexado', departamento: 'Comercial' },
    { tipo: 'COMENTARIO', acao: '💬 Cliente solicitou urgência', departamento: 'Comercial' },
    { tipo: 'ALTERACAO', acao: '🔄 Prioridade alterada para ALTA', departamento: 'Comercial' },
  ];

  for (const e of eventos) {
    await fetch('/api/auditoria', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ processoId, ...e, dataTimestamp: Date.now() })
    });
    await new Promise(r => setTimeout(r, 300));
  }
  
  console.log('✅ Eventos criados!');
  alert('Eventos criados! Recarregue a aba de histórico.');
}

criarEventos();
```

4. Pressione `Enter`
5. Aguarde a mensagem "✅ Eventos criados!"
6. Clique novamente na aba "🕒 Histórico Completo"

---

**Opção B - Criar Evento Único (Teste Rápido):**

```javascript
fetch('/api/auditoria', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    processoId: 1, // ⚠️ ALTERE!
    tipo: 'INICIO',
    acao: '🎯 Teste de histórico funcionando!',
    departamento: 'Teste',
    dataTimestamp: Date.now()
  })
}).then(r => r.ok ? alert('✅ Evento criado!') : alert('❌ Erro'));
```

---

## 🎨 O Que Você Vai Ver

A timeline mostrará:

```
🟢 [INICIO] Processo criado
   👤 Seu Nome | 📅 03/02/2026 14:30

🟣 [DOCUMENTO] Contrato Social anexado
   👤 Seu Nome | 📅 03/02/2026 14:35

🔵 [COMENTARIO] Cliente solicitou urgência
   👤 Seu Nome | 📅 03/02/2026 14:40
```

Com:
- ✨ Cores diferentes por tipo de evento
- 👤 Nome de quem fez a ação
- 📅 Data e hora exatos
- 📍 Departamento
- 🎯 Destaque para o evento mais recente

---

## 🔄 Próximos Passos (Automático)

Para registrar eventos automaticamente quando você:
- Criar processo
- Mover departamento
- Adicionar documento
- Fazer comentário

Preciso integrar nas APIs. Quer que eu faça isso agora?

---

## ❓ Problemas?

### "Não vejo a aba de histórico"
- Certifique-se de que está clicando no processo (modal verde "Processo Completo")
- Recarregue a página (Ctrl+F5)

### "A aba está vazia"
- É normal! Você precisa criar eventos primeiro
- Use o código JavaScript acima no console

### "Erro ao criar evento"
- Verifique se está logado
- Verifique o processoId (deve existir no banco)
- Veja o console do navegador (F12) para detalhes

---

## 📞 Precisa de Ajuda?

Me avise se:
- Não aparecer a aba
- Der algum erro
- Quiser que eu integre automaticamente
