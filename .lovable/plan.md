Alterar a ordem dos links de navegação no cabeçalho autenticado (`AppHeader.tsx`) para refletir a sequência solicitada: Dashboard, Autoavaliação, Plano, Ações, Check-in e IA (Orientadora).

### Detalhes técnicos
- Arquivo: `src/components/AppHeader.tsx`.
- Mover o bloco `<Link to="/autoavaliacao">` para logo após o `<Link to="/dashboard">`.
- Em seguida, manter Plano, Ações, Check-in e IA na ordem exata.
- Não alterar rotas, URLs, labels, ícones, estilos ativos ou comportamento de logout — apenas a ordem dos elementos dentro do `<nav>`.
- Verificar se a ordem final no arquivo será:
  1. Dashboard
  2. Autoavaliação
  3. Plano
  4. Ações
  5. Check-in
  6. IA (Orientadora)
  7. Sair

### Validação
- Conferir visualmente no preview se o menu aparece na nova ordem e se o link ativo continua destacado corretamente.