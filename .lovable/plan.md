## Objetivo

Expandir o conhecimento da IA Orientadora com o banco completo de perguntas poderosas (11 categorias + sequência curta de destrave) e orientá-la a usá-las de forma estratégica, no momento certo da conversa — sem despejar listas no usuário.

## Mudança

Editar **`src/routes/api/chat.ts`** — apenas a constante `SYSTEM_PROMPT`. Nenhum outro arquivo, rota, tabela ou dependência é tocado.

### O que será adicionado ao SYSTEM_PROMPT

1. **Nova seção `BANCO DE PERGUNTAS PODEROSAS`** com as 11 categorias (Abrir consciência, Autorresponsabilidade, Nada quebrado/faltando/fora do lugar, Crenças limitantes, Identidade, Capacidade, Merecimento, Vitimismo, Clarear objetivo, Ação imediata, Fechamento), cada uma com suas 10 perguntas — texto integral fornecido pelo usuário.

2. **Seção `SEQUÊNCIA CURTA DE DESTRAVE`** com os 7 passos (dor → consciência → responsabilidade → decisão → ação) para usar quando o usuário estiver pronto para uma "mini-sessão" ao vivo.

3. **Regras de uso estratégico** (curtas e diretivas, para evitar que a IA cole a lista):
   - Nunca listar várias perguntas de uma vez. **Uma pergunta poderosa por mensagem**, escolhida pelo momento do usuário.
   - Escolher a categoria conforme o estado emocional/conversacional detectado: desabafo → abrir consciência; culpando outros → autorresponsabilidade / vitimismo; "não consigo" → capacidade / crenças; "não mereço" → merecimento; sem clareza → objetivo; pronto para agir → ação imediata; final de conversa → fechamento.
   - Usar a **sequência curta** somente quando o usuário sinalizar que quer destravar algo agora ("me ajuda a resolver isso", "quero sair desse lugar"), conduzindo passo a passo e esperando resposta entre cada pergunta.
   - Sempre combinar a pergunta com acolhimento curto antes — não fazer "interrogatório".
   - Respeitar os limites já existentes (não substituir terapeuta, etc.) e nunca usar perguntas de identidade/merecimento como provocação se houver sinal de risco emocional sério.

### O que NÃO muda

- Sem nova tabela, sem migração, sem alteração de UI.
- Sem mexer no snapshot de pilares/alertas que já é injetado no prompt.
- Sem trocar de modelo nem mexer no streaming.
- Sem tocar `src/routes/_authenticated/orientadora.tsx`.

## Como validar

Após o deploy do prompt, abrir `/orientadora` e testar três cenários:
1. "Estou cansado, nada anda" → IA deve responder acolhendo + 1 pergunta de abrir consciência.
2. "A culpa é do meu chefe" → IA deve puxar 1 pergunta de autorresponsabilidade/vitimismo.
3. "Quero destravar minha vida financeira agora" → IA deve iniciar a sequência curta, uma pergunta por vez.
