## Trocar paleta para "Elegant Teal"

Apenas troca de cores da landing — sem mexer em estrutura, conteúdo ou animações.

### Nova paleta
- Primária: `#1a4d4a` (teal escuro)
- Primária deep (hover): `#143b39`
- Secundária / accent premium: `#d4a574` (ouro)
- Accent suave: `#e8b4a1` (coral claro)
- Texto: `#2c2c2a`
- Texto suave: `#5f5e5a`
- Muted: `#888780`
- Background: `#fdfcf9` (creme quente)
- Background soft: `#f5f0e6`
- Linha/borda: `#e5dfd2`

Dark mode mantém estrutura atual, ajustando para teal/ouro:
- Primária: `#4a8a85`, accent ouro: `#d4a574`, bg `#14161a`, bg soft `#1b1e22`.

### Arquivos alterados
- `src/styles.css` — atualizar variáveis `--ve-*` dentro de `.landing-root` (e `.dark .landing-root`) com os novos hex. Trocar `--ve-accent` (coral → ouro `#d4a574`) e adicionar `--ve-accent-soft: #e8b4a1` para usos pontuais. Botões, cards, nav e CTAs legacy já consomem essas variáveis — herdam automaticamente.

### Fora do escopo
- Estrutura da página, copy, seções, imagens, navbar.
- Tokens globais shadcn (`:root` oklch) — usados pelo app autenticado, não pela landing.
- Cores dos pilares no `RadialWheel` (são dados, não branding).
