import { Link } from "@tanstack/react-router";
import { PILLAR_DEFAULTS } from "@/lib/pillars";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const STEPS = [
  { n: "01", title: "Autoavaliação", text: "Dê uma nota de 0 a 10 para cada um dos 11 pilares da sua vida e veja sua roda inteira numa só imagem." },
  { n: "02", title: "Impactos", text: "Descubra o efeito dominó: como cada pilar fortalece (ou enfraquece) os outros — e onde mexer primeiro." },
  { n: "03", title: "Plano", text: "Transforme consciência em ação: um plano simples, focado nos pilares de maior impacto agora." },
  { n: "04", title: "Check-in", text: "Acompanhe sua evolução com check-ins curtos e veja a roda da sua vida girar — viva." },
];

const DIFFERENTIATORS = [
  { icon: "🌊", title: "Efeito dominó", text: "Nenhum pilar adoece — ou floresce — sozinho. Mostramos as conexões reais entre eles." },
  { icon: "🧭", title: "Autorresponsabilidade ativa", text: "Não é coaching motivacional. É um espelho honesto que devolve a você o leme da sua vida." },
  { icon: "✨", title: "IA orientadora", text: "Uma orientadora que conhece sua roda e te faz as perguntas certas no momento certo." },
];

const TESTIMONIALS = [
  { name: "Marina, 34", quote: "Eu achava que o problema era trabalho. A Roda me mostrou que era o emocional puxando tudo pra baixo. Em 6 semanas, mudei o que importava." },
  { name: "Rafael, 41", quote: "Nunca tinha visto minha vida assim — inteira. É desconfortável e libertador ao mesmo tempo." },
  { name: "Júlia, 28", quote: "O que mais me ajudou foi entender o efeito dominó. Parei de tentar consertar dez coisas ao mesmo tempo." },
];

const FAQ = [
  { q: "É gratuito?", a: "Sim. Você cria sua conta, faz sua Roda da Vida completa e usa todas as áreas — autoavaliação, impactos, plano, check-in e IA — sem custo." },
  { q: "Quanto tempo leva pra começar?", a: "A autoavaliação inicial leva entre 8 e 15 minutos. Você pode pausar e voltar quando quiser." },
  { q: "Preciso fazer tudo de uma vez?", a: "Não. A Roda é um processo vivo. Comece pela autoavaliação, e o sistema te guia pelos próximos passos no seu ritmo." },
  { q: "Como a IA me ajuda?", a: "Ela enxerga sua roda inteira — pontuações, impactos, plano — e conversa com você fazendo perguntas que ajudam a clarear escolhas e próximos passos." },
  { q: "Meus dados são privados?", a: "Sim. Sua roda é só sua. Não compartilhamos suas avaliações, planos ou conversas com a IA com ninguém." },
];

export function LandingPage() {
  return (
    <div className="landing-root min-h-screen">
      <LandingNav />
      <Hero />
      <PillarsSection />
      <HowItWorks />
      <Differentiators />
      <Testimonials />
      <FAQSection />
      <FinalCTA />
      <LandingFooter />
    </div>
  );
}

function LandingNav() {
  return (
    <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
      <Link to="/" className="flex items-center gap-2.5">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[color:var(--landing-ink)] text-lg text-white">
          🌱
        </div>
        <span className="text-lg font-semibold tracking-tight">Roda da Vida Viva</span>
      </Link>
      <div className="flex items-center gap-2">
        <Link to="/auth" className="landing-cta landing-cta-ghost hidden sm:inline-flex">
          Entrar
        </Link>
        <Link to="/auth" className="landing-cta">
          Começar agora
        </Link>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 md:grid-cols-[1.1fr_1fr] md:py-24">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--landing-line)] bg-[color:var(--landing-bg-soft)] px-3 py-1 text-xs font-medium tracking-wide text-[color:var(--landing-ink-soft)] uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--landing-gold)]" />
            Autoconhecimento integrado
          </span>
          <h1 className="mt-6 text-4xl font-bold leading-[1.05] md:text-6xl">
            Veja sua vida inteira <br className="hidden md:block" />
            <span className="italic text-[color:var(--landing-ink-soft)]">em uma só imagem.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-[color:var(--landing-ink-soft)]">
            A Roda da Vida Viva é um espelho honesto dos 11 pilares que sustentam você.
            Você avalia, vê o efeito dominó entre eles e descobre exatamente onde mexer
            primeiro para mudar tudo.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link to="/auth" className="landing-cta landing-cta-gold">
              Começar agora — é gratuito →
            </Link>
            <a href="#como-funciona" className="text-sm font-medium text-[color:var(--landing-ink-soft)] underline-offset-4 hover:underline">
              ver como funciona
            </a>
          </div>
          <div className="mt-10 flex items-center gap-6 text-xs text-[color:var(--landing-muted)]">
            <span>✓ 11 pilares mapeados</span>
            <span>✓ Sem cobrança</span>
            <span>✓ Comece em 10 min</span>
          </div>
        </div>
        <HeroWheel />
      </div>
    </section>
  );
}

function HeroWheel() {
  const size = 420;
  const cx = size / 2;
  const cy = size / 2;
  const r = 160;
  const n = PILLAR_DEFAULTS.length;
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[420px]">
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[color:var(--landing-bg-soft)] to-transparent blur-2xl" />
      <svg viewBox={`0 0 ${size} ${size}`} className="relative">
        <circle cx={cx} cy={cy} r={r + 30} fill="none" stroke="var(--landing-line)" strokeWidth="1" />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--landing-line)" strokeWidth="1" />
        <circle cx={cx} cy={cy} r={r - 60} fill="none" stroke="var(--landing-line)" strokeWidth="1" />
        {PILLAR_DEFAULTS.map((p, i) => {
          const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
          const scoreR = ((p.score / 10) * (r - 20)) + 20;
          const x = cx + Math.cos(angle) * scoreR;
          const y = cy + Math.sin(angle) * scoreR;
          const lx = cx + Math.cos(angle) * (r + 30);
          const ly = cy + Math.sin(angle) * (r + 30);
          return (
            <g key={p.id}>
              <line x1={cx} y1={cy} x2={cx + Math.cos(angle) * r} y2={cy + Math.sin(angle) * r} stroke="var(--landing-line)" strokeWidth="1" />
              <circle cx={x} cy={y} r="5" fill="var(--landing-gold)" />
              <text x={lx} y={ly} fontSize="11" textAnchor="middle" dominantBaseline="middle" fill="var(--landing-ink-soft)" style={{ fontWeight: 500 }}>{p.icon}</text>
            </g>
          );
        })}
        <polygon
          fill="rgba(201,168,106,0.18)"
          stroke="var(--landing-gold)"
          strokeWidth="1.5"
          points={PILLAR_DEFAULTS.map((p, i) => {
            const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
            const scoreR = ((p.score / 10) * (r - 20)) + 20;
            return `${cx + Math.cos(angle) * scoreR},${cy + Math.sin(angle) * scoreR}`;
          }).join(" ")}
        />
        <circle cx={cx} cy={cy} r="38" fill="var(--landing-ink)" />
        <text x={cx} y={cy + 5} fontSize="14" textAnchor="middle" fill="#FBF8F2" style={{ fontWeight: 600 }}>Você</text>
      </svg>
    </div>
  );
}

function PillarsSection() {
  return (
    <section className="bg-[color:var(--landing-bg-soft)] py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold tracking-widest text-[color:var(--landing-gold-deep)] uppercase">Os 11 pilares</p>
          <h2 className="mt-3 text-3xl font-bold md:text-4xl">
            Sua vida não é uma lista de tarefas.
            <span className="block text-[color:var(--landing-ink-soft)]">É um sistema vivo.</span>
          </h2>
          <p className="mt-4 text-[color:var(--landing-ink-soft)]">
            Cada pilar conversa com os outros. Quando um adoece, todos sentem.
            Quando um floresce, todos respiram melhor.
          </p>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PILLAR_DEFAULTS.map((p) => (
            <div
              key={p.id}
              className="group rounded-2xl border border-[color:var(--landing-line)] bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[color:var(--landing-line)]"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{p.icon}</span>
                <div>
                  <h3 className="text-base font-semibold">{p.name}</h3>
                  <p className="mt-1 text-sm text-[color:var(--landing-ink-soft)]">
                    Conecta com {p.impactPillars.slice(0, 2).join(" e ")}.
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section id="como-funciona" className="py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold tracking-widest text-[color:var(--landing-gold-deep)] uppercase">Como funciona</p>
          <h2 className="mt-3 text-3xl font-bold md:text-4xl">Quatro passos. Uma vida inteira clareada.</h2>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s) => (
            <div key={s.n} className="relative rounded-2xl border border-[color:var(--landing-line)] bg-[color:var(--landing-bg-soft)] p-6">
              <span className="font-display text-5xl font-bold text-[color:var(--landing-gold)]">{s.n}</span>
              <h3 className="mt-3 text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[color:var(--landing-ink-soft)]">{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Differentiators() {
  return (
    <section className="bg-[color:var(--landing-ink)] py-20 text-[color:#FBF8F2]">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold tracking-widest text-[color:var(--landing-gold)] uppercase">Por que é diferente</p>
          <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">
            Não é mais um app de hábitos. É um espelho que devolve o leme pra você.
          </h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {DIFFERENTIATORS.map((d) => (
            <div key={d.title} className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <span className="text-3xl">{d.icon}</span>
              <h3 className="mt-4 text-lg font-semibold text-white">{d.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/70">{d.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold tracking-widest text-[color:var(--landing-gold-deep)] uppercase">Quem já rodou</p>
          <h2 className="mt-3 text-3xl font-bold md:text-4xl">O que as pessoas descobrem.</h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure key={t.name} className="rounded-2xl border border-[color:var(--landing-line)] bg-white p-6">
              <span className="font-display text-4xl leading-none text-[color:var(--landing-gold)]">"</span>
              <blockquote className="mt-2 text-[color:var(--landing-ink)] leading-relaxed">
                {t.quote}
              </blockquote>
              <figcaption className="mt-4 text-sm font-medium text-[color:var(--landing-ink-soft)]">— {t.name}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  return (
    <section className="bg-[color:var(--landing-bg-soft)] py-20">
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center">
          <p className="text-sm font-semibold tracking-widest text-[color:var(--landing-gold-deep)] uppercase">Perguntas frequentes</p>
          <h2 className="mt-3 text-3xl font-bold md:text-4xl">Tudo que você quer saber antes de começar.</h2>
        </div>
        <Accordion type="single" collapsible className="mt-10">
          {FAQ.map((f, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-b border-[color:var(--landing-line)]">
              <AccordionTrigger className="py-5 text-left text-base font-semibold text-[color:var(--landing-ink)] hover:no-underline">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-[color:var(--landing-ink-soft)] leading-relaxed">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <div className="landing-divider mx-auto mb-12 max-w-xs" />
        <h2 className="text-3xl font-bold md:text-5xl">
          Nenhum pilar muda sozinho.
          <span className="block italic text-[color:var(--landing-ink-soft)]">Comece o seu efeito dominó hoje.</span>
        </h2>
        <p className="mt-6 text-lg text-[color:var(--landing-ink-soft)]">
          Em menos de 15 minutos você terá a primeira imagem honesta da sua vida inteira.
        </p>
        <div className="mt-10">
          <Link to="/auth" className="landing-cta landing-cta-gold text-base">
            Criar minha Roda gratuita →
          </Link>
        </div>
      </div>
    </section>
  );
}

function LandingFooter() {
  return (
    <footer className="border-t border-[color:var(--landing-line)] py-8">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 text-sm text-[color:var(--landing-muted)]">
        <p>© {new Date().getFullYear()} Roda da Vida Viva. Feito para quem quer ver a vida inteira.</p>
        <Link to="/auth" className="hover:text-[color:var(--landing-ink)]">Entrar / Criar conta</Link>
      </div>
    </footer>
  );
}