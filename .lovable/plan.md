## Ajustes no topo e no hero

### 1) Remover o "selo" verde do hero
No `src/components/landing/LandingPage.tsx`, dentro do `Hero`, remover o bloco que renderiza o pill verde-escuro com a logo + "Vida em Eixo" (o que aparece logo acima do `<h1>`). O hero passa a começar direto pelo título "Sua vida. Organizada. Em eixo."

### 2) Trocar o "quadrado branco" do nav pelo ícone PNG enviado
O nav hoje usa `src/assets/vida-em-eixo-logo.png.asset.json` com filtro `brightness-0 invert`, o que está aparecendo como um quadrado branco. Vou:

- Subir o arquivo `icone png.png` enviado como novo asset via `lovable-assets`, salvando o pointer em `src/assets/vida-em-eixo-icone.png.asset.json`.
- No `LandingNav`, importar esse novo asset e usá-lo no `<img>` da logo, removendo o `brightness-0 invert` (o PNG já é branco com fundo transparente, então aparece corretamente sobre o verde-escuro).
- Manter o texto "Vida em Eixo" ao lado, igual está.

### Arquivos afetados

- `src/assets/vida-em-eixo-icone.png.asset.json` (novo pointer de asset)
- `src/components/landing/LandingPage.tsx` (remove badge do hero, troca ícone do nav)

### Fora de escopo

- Não mexer no asset antigo `vida-em-eixo-logo.png.asset.json` (pode estar sendo usado em outros lugares).
- Sem mudanças nas demais seções da landing.
