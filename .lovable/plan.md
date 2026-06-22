Plano: ajustar cor de fundo da Hero

1. Adicionar um token semântico `--landing-hero-bg` em `src/styles.css` com o tom off-white/cinza claro quente que aparece no fundo da imagem do computador (ex.: `#F5F2EC`).
2. Em `src/components/landing/LandingPage.tsx`, trocar a classe de fundo da `<section>` do Hero de `bg-[color:var(--landing-bg)]` para `bg-[color:var(--landing-hero-bg)]`, garantindo que apenas essa seção mude.
3. Verificar no preview se o fundo da Hero fica uniforme com o fundo da imagem do monitor.