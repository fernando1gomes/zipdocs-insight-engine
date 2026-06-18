import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Roda da Vida Viva — Equilíbrio integrado em 11 pilares" },
      { name: "description", content: "SaaS de autogestão pessoal com 11 pilares: visualize, priorize e tome a próxima melhor ação com apoio de IA." },
      { property: "og:title", content: "Roda da Vida Viva" },
      { property: "og:description", content: "Uma visão integrada da sua evolução em 11 pilares da vida." },
    ],
  }),
  component: Landing,
});

const PILLAR_LIST = [
  { i: "🤝", n: "Contribuição e legado" },
  { i: "❤️", n: "Emocional" },
  { i: "👨‍👩‍👧‍👦", n: "Família" },
  { i: "💕", n: "Relacionamento amoroso" },
  { i: "👥", n: "Social e amizades" },
  { i: "💼", n: "Profissional e carreira" },
  { i: "💵", n: "Financeiro" },
  { i: "📖", n: "Intelectual e aprendizado" },
  { i: "🧘", n: "Espiritualidade e sentido" },
  { i: "🌞", n: "Lazer e prazer" },
  { i: "🏃", n: "Saúde e disposição" },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto max-w-6xl px-4 md:px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2 font-extrabold tracking-tight">
          <span className="text-xl">🌱</span> Roda da Vida Viva
        </div>
        <Link to="/auth" className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-95">
          Entrar
        </Link>
      </header>

      <section className="mx-auto max-w-4xl px-4 md:px-8 py-16 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
          Uma visão integrada da <span className="text-primary">sua evolução</span>
        </h1>
        <p className="mt-5 text-lg text-muted-foreground max-w-2xl mx-auto">
          Acompanhe os 11 pilares da sua vida, identifique o que precisa de atenção e
          receba a próxima melhor ação com apoio de inteligência artificial.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link to="/auth" className="rounded-xl bg-primary px-6 py-3 text-base font-semibold text-primary-foreground shadow-md hover:opacity-95">
            Começar grátis
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 md:px-8 pb-20">
        <h2 className="text-xl font-bold text-center mb-6">Os 11 pilares</h2>
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {PILLAR_LIST.map((p) => (
            <div key={p.n} className="rounded-2xl border border-border/60 bg-card p-4 flex items-center gap-3">
              <span className="text-2xl">{p.i}</span>
              <span className="text-sm font-medium">{p.n}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}