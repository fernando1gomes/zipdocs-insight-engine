## Reforçar o agrupamento por pilar em `/acoes`

O código já separa as ações por pilar, mas visualmente o agrupamento está discreto demais — o cabeçalho do grupo (`text-sm` cinza, fundo quase igual ao da ação) se confunde com os próprios cards e o usuário não percebe que cada bloco é um pilar diferente.

### Mudanças (apenas visuais, em `src/routes/_authenticated/acoes.tsx`)

1. **Cabeçalho do pilar mais forte**
   - Aumentar para `text-lg font-extrabold`.
   - Ícone do pilar maior (`text-3xl`).
   - Barra colorida à esquerda usando a cor de status do pilar (verde/amarelo/vermelho/cinza, via `statusFromScore` + tokens `--balanced/--attention/--critical/--empty`).
   - Mostrar contagem como badge (`x pendentes` / `y concluídas`).

2. **Separação visual entre grupos**
   - Remover o `border` externo da `section` e usar apenas o cabeçalho + lista, com `gap-8` entre seções.
   - Adicionar um `<Separator />` ou linha sutil entre grupos.
   - Cards de ação ficam com fundo neutro (`bg-card`) e o agrupamento é dado pelo cabeçalho destacado, não por moldura.

3. **Ordenação consistente**
   - Manter ordem dos pilares pelo `id` do `PILLAR_DEFAULTS` (já é assim).
   - Dentro de cada pilar: pendentes/atrasadas primeiro, depois concluídas.

4. **Estado vazio por filtro**
   - Quando o filtro não retorna nada, mostrar mensagem clara ("Nenhuma ação pendente em nenhum pilar.") em vez de só sumir com a lista.

### Fora de escopo

- Não mexer em dados, server functions, schema, ou rotas.
- Sem alterar a página de Plano de Ação.
