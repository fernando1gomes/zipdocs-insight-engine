## Objetivo
Permitir, na grade da **Semana em Eixo**, selecionar mais de um slot de 30 min — clicando e arrastando verticalmente dentro de uma mesma coluna do dia — para criar uma ação cuja duração já vem pré-preenchida pelo intervalo selecionado.

## Comportamento
- **Mouse / touch down** num slot vazio: marca o slot como início da seleção.
- **Move com o botão pressionado** sobre outros slots da MESMA coluna do dia: estende a seleção, com um overlay semitransparente cobrindo do slot inicial até o slot atual (suporta arrastar para cima ou para baixo).
- **Up**: abre o `CreateActionDialog` com:
  - dia, hora e minuto do slot inicial (menor),
  - duração calculada = (nº de slots selecionados) × 30 min.
- **Clique simples** (sem arraste, mesmo slot down/up): mantém o comportamento atual — abre o dialog em 30 min.
- **Cancelamento**: ESC ou arrastar para fora da coluna cancela a seleção sem abrir o dialog.
- **Áreas ocupadas**: o início da seleção só funciona em slot vazio; arrastar sobre um bloco existente faz a seleção parar no último slot livre anterior.
- Visual do overlay: usa `--primary` com baixa opacidade e uma borda tracejada, alinhado ao grid de 30 min.

## Mudanças técnicas
- `src/routes/_authenticated/semana.tsx`:
  - No `DayColumn`, trocar os botões de slot por uma camada única com listeners `onPointerDown / Move / Up / Leave` que calcula o índice do slot a partir do `offsetY` (usando `SLOT_HEIGHT_PX`).
  - Estado local `selection: { startIdx, endIdx } | null` para desenhar o overlay e detectar arraste vs clique.
  - Propagar para o pai (`onSlotRangeSelect(day, startHour, startMinute, durationMinutes)`); o pai abre o dialog existente.
- `CreateActionDialog`: aceitar `initialDuration` opcional e usá-la como valor padrão do campo "duração" (que continua editável).
- Sem mudanças de servidor — `createScheduledAction` já recebe `durationMinutes` arbitrário.
- Sem mudanças de banco.

## Acessibilidade
- Mantém clique simples no slot para teclado/toque (cria ação de 30 min).
- O dialog permanece a única forma de confirmação; nenhum dado é gravado só com arraste.

## Fora do escopo
- Redimensionar/arrastar blocos já existentes (reagendar continua pelo botão "Reagendar").
- Seleção que cruza dias.
