# Faixa infinita com os 11 pilares da vida

Substituir, em `src/components/landing/LandingPage.tsx`, a faixa atual de marcas conhecidas (Forbes, EXAME, VOCÊ S/A, Valor, TVCiência, PEGN) por uma faixa horizontal de 11 imagens fotorrealistas com pessoas — uma para cada pilar da vida (padrão Lifebook), com movimento contínuo e infinito da esquerda para a direita.

## Os 11 pilares e cenas representadas

1. **Saúde & Fitness** — pessoa correndo ao ar livre ao amanhecer
2. **Intelectual** — pessoa lendo um livro em uma biblioteca acolhedora
3. **Emocional** — pessoa meditando tranquilamente junto a uma janela com luz natural
4. **Caráter** — pessoa ajudando outra (gesto de apoio/voluntariado)
5. **Espiritual** — pessoa em contemplação na natureza, ao nascer do sol
6. **Amor (relacionamento)** — casal caminhando de mãos dadas, sorrindo
7. **Parentalidade** — pai/mãe brincando com criança em casa
8. **Social (amizades)** — grupo de amigos rindo juntos em um jantar
9. **Financeiro** — pessoa analisando finanças com calma em uma mesa organizada
10. **Carreira** — profissional apresentando ideia em ambiente moderno
11. **Qualidade de vida** — pessoa relaxando em viagem, paisagem inspiradora

Estilo unificado: fotografia realista, luz natural quente, paleta coerente com a hero (tons creme/terrosos), pessoas diversas, sem texto sobreposto, sem logos.

## Implementação técnica

**Geração das imagens**
- Gerar 11 imagens com `imagegen--generate_image` (model `fast`, formato paisagem ~768×512, `.jpg`), salvas em `src/assets/pillars/`.
- Importar cada imagem no componente como ES module (Vite faz hashing/otimização).

**Componente da faixa**
- Remover bloco atual `logos` / `LogoRow` (linhas ~166–180) do `LandingPage.tsx`.
- Criar nova seção `PillarsMarquee` no mesmo lugar, mantendo o espaçamento vertical e o fundo da seção atual.
- Estrutura: contêiner `overflow-hidden` com largura total; dentro, um track flex contendo a lista de 11 imagens duplicada (renderizada 2×) para loop perfeito.
- Cada item: card com `aspect-[4/3]`, `rounded-xl`, `object-cover`, altura ~140–160px, `mx-3`. Sem legenda visível (acessibilidade via `alt`).

**Animação infinita esquerda → direita**
- Keyframe novo em `src/styles.css`:
  ```css
  @keyframes marquee-rtl {
    from { transform: translateX(-50%); }
    to   { transform: translateX(0); }
  }
  .animate-marquee-rtl { animation: marquee-rtl 60s linear infinite; }
  ```
- O track tem `width: max-content` e é deslocado de `-50%` → `0` para fluxo contínuo da esquerda para a direita.
- Pausa no hover (`hover:[animation-play-state:paused]`) para boa UX.
- `prefers-reduced-motion`: desabilitar animação.

**Acessibilidade & performance**
- `alt` descritivo por pilar (ex.: "Pessoa correndo ao amanhecer — pilar Saúde").
- `loading="lazy"` e `decoding="async"` nas imagens.
- Conjunto duplicado marcado como `aria-hidden="true"`.

## Arquivos alterados
- `src/components/landing/LandingPage.tsx` — remover faixa de marcas e inserir `PillarsMarquee`.
- `src/styles.css` — adicionar keyframe `marquee-rtl` e utilitário.
- `src/assets/pillars/*.jpg` — 11 novas imagens geradas.
