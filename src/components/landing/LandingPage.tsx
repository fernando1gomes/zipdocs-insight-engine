import { Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  HandHeart, Brain, House, Heart, UsersThree, Target,
  ChartLineUp, BookOpen, FlowerLotus, MusicNotes, Heartbeat,
  List, X,
} from "@phosphor-icons/react";
import { RadialWheel } from "@/components/RadialWheel";
import { PILLAR_DEFAULTS, type Pillar } from "@/lib/pillars";
import logoAsset from "@/assets/vida-em-eixo-logo.png.asset.json";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";

const NAV_LINKS = [
  { href: "#metodo", label: "Como funciona" },
  { href: "#pilares", label: "Pilares" },
  { href: "#depoimentos", label: "Depoimentos" },
  { href: "#perguntas", label: "Perguntas" },
];

const STATS = [
  { value: "11", label: "pilares mapeados" },
  { value: "10 min", label: "para começar" },
  { value: "100%", label: "gratuito, sempre" },
];

const STEPS = [
  { n: "01", title: "Autoavaliação",
    text: "Dê uma nota de 0 a 10 para cada um dos 11 pilares e veja sua vida inteira em uma só imagem." },
  { n: "02", title: "Impactos",
    text: "Descubra o efeito dominó: como cada pilar fortalece — ou enfraquece — todos os outros." },
  { n: "03", title: "Plano",
    text: "Transforme consciência em ação com um plano simples, focado no que muda tudo." },
  { n: "04", title: "Check-in",
    text: "Acompanhe sua evolução com check-ins curtos e veja a sua roda girar — viva." },
];

const TESTIMONIALS = [
  { name: "Marina, 34", quote: "Eu achava que o problema era trabalho. A roda me mostrou que era o emocional puxando tudo pra baixo. Em seis semanas, mudei o que importava." },
  { name: "Rafael, 41", quote: "Nunca tinha visto minha vida assim — inteira. É desconfortável e libertador ao mesmo tempo." },
  { name: "Júlia, 28", quote: "O que mais me ajudou foi entender o efeito dominó. Parei de tentar consertar dez coisas ao mesmo tempo." },
];

const FAQ = [
  { q: "É gratuito?", a: "Sim. Você cria sua conta, faz a sua roda completa e usa todas as áreas — autoavaliação, impactos, plano, check-in e IA — sem custo." },
  { q: "Quanto tempo leva para começar?", a: "A autoavaliação inicial leva entre 8 e 15 minutos. Você pode pausar e voltar quando quiser." },
  { q: "Preciso fazer tudo de uma vez?", a: "Não. A roda é um processo vivo. Comece pela autoavaliação e o sistema te guia pelos próximos passos no seu ritmo." },
  { q: "Como a IA me ajuda?", a: "Ela enxerga a sua roda inteira — pontuações, impactos, plano — e conversa com você fazendo perguntas que ajudam a clarear escolhas." },
  { q: "Meus dados são privados?", a: "Sim. Sua roda é só sua. Não compartilhamos suas avaliações, planos ou conversas com ninguém." },
];

const DEMO_PILLARS: Pillar[] = [
  { id: 1,  name: "Contribuição",   shortName: "Contribuição",   icon: "🤝", Icon: HandHeart,   score: 8.2, message: "Exemplo: equilíbrio", impact: 3, impactPillars: [] },
  { id: 2,  name: "Emocional",      shortName: "Emocional",      icon: "❤️", Icon: Brain,       score: 6.4, message: "Exemplo: atenção",    impact: 3, impactPillars: [] },
  { id: 3,  name: "Família",        shortName: "Família",        icon: "🏠", Icon: House,       score: 7.6, message: "Exemplo: equilíbrio", impact: 3, impactPillars: [] },
  { id: 4,  name: "Relacionamento", shortName: "Relacionamento", icon: "💕", Icon: Heart,       score: 4.9, message: "Exemplo: crítico",    impact: 3, impactPillars: [] },
  { id: 5,  name: "Social",         shortName: "Social",         icon: "👥", Icon: UsersThree,  score: 7.1, message: "Exemplo: equilíbrio", impact: 3, impactPillars: [] },
  { id: 6,  name: "Carreira",       shortName: "Carreira",       icon: "🎯", Icon: Target,      score: 6.2, message: "Exemplo: atenção",    impact: 4, impactPillars: [], focus: true },
  { id: 7,  name: "Financeiro",     shortName: "Financeiro",     icon: "💵", Icon: ChartLineUp, score: 8.5, message: "Exemplo: equilíbrio", impact: 3, impactPillars: [] },
  { id: 8,  name: "Intelectual",    shortName: "Intelectual",    icon: "📖", Icon: BookOpen,    score: 7.8, message: "Exemplo: equilíbrio", impact: 3, impactPillars: [] },
  { id: 9,  name: "Espiritualidade",shortName: "Espiritualidade",icon: "🧘", Icon: FlowerLotus, score: 5.3, message: "Exemplo: crítico",    impact: 3, impactPillars: [] },
  { id: 10, name: "Lazer",          shortName: "Lazer",          icon: "🎵", Icon: MusicNotes,  score: 6.8, message: "Exemplo: atenção",    impact: 3, impactPillars: [] },
  { id: 11, name: "Saúde",          shortName: "Saúde",          icon: "🏃", Icon: Heartbeat,   score: 4.3, message: "Exemplo: crítico",    impact: 3, impactPillars: [] },
];

export function LandingPage() {
  return (
    <div className="landing-root min-h-screen">
      <StickyNav />
      <Hero />
      <StatsStrip />
      <DashboardPreview />
      <Method />
      <Pillars />
      <Differentiators />
      <Testimonials />
      <CentralCTA />
      <FAQSection />
      <LandingFooter />
    </div>
  );
}

function StickyNav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="ve-nav">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2.5">
          <img src={logoAsset.url} alt="Vida em Eixo" className="h-8 w-8 rounded-lg object-contain" />
          <span className="text-[15px]" style={{ fontWeight: 500 }}>Vida em Eixo</span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} className="ve-nav-link">{l.label}</a>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <Link to="/auth" className="ve-nav-link">Entrar</Link>
          <Link to="/auth" className="ve-btn">Inicie sua jornada</Link>
        </div>
        <button
          type="button"
          className="md:hidden"
          aria-label="Abrir menu"
          onClick={() => setOpen((v) => !v)}
          style={{ color: "var(--ve-ink)" }}
        >
          {open ? <X size={22} weight="light" /> : <List size={22} weight="light" />}
        </button>
      </div>
      {open && (
        <div className="border-t md:hidden" style={{ borderColor: "var(--ve-line)", borderWidth: "0.5px" }}>
          <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-5">
            {NAV_LINKS.map((l) => (
              <a key={l.href} href={l.href} className="ve-nav-link" onClick={() => setOpen(false)}>{l.label}</a>
            ))}
            <Link to="/auth" className="ve-btn mt-2">Inicie sua jornada</Link>
          </div>
        </div>
      )}
    </header>
  );
}

function Hero() {
  return (
    <section className="px-6 py-20 md:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-16 md:grid-cols-[1.05fr_1fr]">
        <div>
          <span className="ve-eyebrow">Autoconhecimento integrado</span>
          <h1 className="mt-5">
            Veja sua vida inteira <em>em uma só imagem.</em>
          </h1>
          <p className="mt-6 max-w-[560px]" style={{ color: "var(--ve-ink-soft)" }}>
            A Vida em Eixo é um espelho honesto dos onze pilares que sustentam você.
            Você avalia, vê o efeito dominó entre eles e descobre exatamente
            onde mexer primeiro para mudar tudo.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link to="/auth" className="ve-btn">Inicie sua jornada</Link>
            <a href="#metodo" className="ve-btn-outline">Ver como funciona</a>
          </div>
        </div>
        <div className="ve-card" style={{ padding: "1.5rem", boxShadow: "var(--ve-shadow-md)" }}>
          <HeroVisual />
        </div>
      </div>
    </section>
  );
}

function HeroVisual() {
  // Lightweight composition preview (the full RadialWheel lives below in DashboardPreview)
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[420px]">
      <RadialWheelMini />
    </div>
  );
}

function RadialWheelMini() {
  // Compact wheel for the hero card.
  const SIZE = 420;
  const CX = SIZE / 2;
  const CY = SIZE / 2;
  const R_OUT = 170;
  const R_IN = 82;
  const N = PILLAR_DEFAULTS.length;
  const seg = 360 / N;
  const rad = (d: number) => (d * Math.PI) / 180;

  return (
    <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="h-full w-full">
      {PILLAR_DEFAULTS.map((p, i) => {
        const a0 = -90 - seg / 2 + i * seg;
        const a1 = a0 + seg;
        const x0o = CX + R_OUT * Math.cos(rad(a0));
        const y0o = CY + R_OUT * Math.sin(rad(a0));
        const x1o = CX + R_OUT * Math.cos(rad(a1));
        const y1o = CY + R_OUT * Math.sin(rad(a1));
        const x0i = CX + R_IN * Math.cos(rad(a1));
        const y0i = CY + R_IN * Math.sin(rad(a1));
        const x1i = CX + R_IN * Math.cos(rad(a0));
        const y1i = CY + R_IN * Math.sin(rad(a0));
        const d = `M ${x0o} ${y0o} A ${R_OUT} ${R_OUT} 0 0 1 ${x1o} ${y1o} L ${x0i} ${y0i} A ${R_IN} ${R_IN} 0 0 0 ${x1i} ${y1i} Z`;
        const fill = i % 3 === 0 ? "var(--ve-primary)" : i % 3 === 1 ? "var(--ve-accent)" : "var(--ve-muted)";
        return (
          <path key={p.id} d={d} fill={fill} fillOpacity={0.85}
                stroke="var(--ve-bg)" strokeWidth={1} />
        );
      })}
      <circle cx={CX} cy={CY} r={R_IN - 4} fill="var(--ve-bg)"
              stroke="var(--ve-primary)" strokeOpacity={0.35} strokeWidth={2}
              className="wheel-hub" />
      <circle cx={CX} cy={CY} r={R_IN + 6} fill="none"
              stroke="var(--ve-primary)" strokeWidth={1.5}
              className="wheel-hub-halo" />
      <text x={CX} y={CY - 8} textAnchor="middle" fontSize="12"
            fill="var(--ve-muted)" fontWeight="400">Equilíbrio</text>
      <text x={CX} y={CY + 22} textAnchor="middle" fontSize="32"
            fontWeight="500" fill="var(--ve-ink)">68%</text>
    </svg>
  );
}

function StatsStrip() {
  return (
    <section className="px-6 py-16">
      <div className="mx-auto grid max-w-5xl gap-10 sm:grid-cols-3">
        {STATS.map((s) => (
          <div key={s.label} className="text-center">
            <div style={{ fontSize: 44, fontWeight: 500, color: "var(--ve-primary)", lineHeight: 1.1 }}>
              {s.value}
            </div>
            <div className="mt-2 text-sm" style={{ color: "var(--ve-muted)" }}>{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function DashboardPreview() {
  return (
    <section className="px-6 py-20 md:py-28" style={{ background: "var(--ve-bg-soft)" }}>
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-[700px] text-center">
          <span className="ve-eyebrow">Prévia do painel</span>
          <h2 className="mt-4">
            Sua vida inteira, <em>viva e em movimento.</em>
          </h2>
          <p className="mt-5" style={{ color: "var(--ve-ink-soft)" }}>
            Uma amostra do painel. Os números abaixo são fictícios — servem
            só para você sentir como a sua roda ganha vida com os seus dados.
          </p>
        </div>
        <div className="mt-14 hidden md:block">
          <RadialWheel pillars={DEMO_PILLARS} balance={68} hovered={null} onHover={() => {}} />
          <p className="mt-6 text-center text-xs italic" style={{ color: "var(--ve-muted)" }}>
            * dados ilustrativos
          </p>
        </div>
      </div>
    </section>
  );
}

function Method() {
  return (
    <section id="metodo" className="px-6 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-[700px] text-center">
          <span className="ve-eyebrow">Como funciona</span>
          <h2 className="mt-4">
            Quatro passos, <em>uma vida clareada.</em>
          </h2>
        </div>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s) => (
            <article key={s.n} className="ve-card">
              <div style={{ fontSize: 13, color: "var(--ve-muted)" }}>{s.n}</div>
              <h3 className="mt-3" style={{ fontSize: 20 }}>{s.title}</h3>
              <p className="mt-3 text-[15px]" style={{ color: "var(--ve-ink-soft)" }}>{s.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pillars() {
  return (
    <section id="pilares" className="px-6 py-20 md:py-28" style={{ background: "var(--ve-bg-soft)" }}>
      <div className="mx-auto max-w-6xl">
        <div className="max-w-[700px]">
          <span className="ve-eyebrow">Os onze pilares</span>
          <h2 className="mt-4">
            Sua vida não é uma lista. <em>É um sistema vivo.</em>
          </h2>
          <p className="mt-5" style={{ color: "var(--ve-ink-soft)" }}>
            Cada pilar conversa com os outros. Quando um adoece, todos sentem.
            Quando um floresce, todos respiram melhor.
          </p>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PILLAR_DEFAULTS.map((p) => (
            <div key={p.id} className="ve-card flex items-start gap-4">
              <p.Icon size={22} weight="light" color="var(--ve-primary)" />
              <div>
                <h3 style={{ fontSize: 17 }}>{p.name}</h3>
                <p className="mt-1 text-[14px]" style={{ color: "var(--ve-muted)" }}>
                  Conecta com {p.impactPillars.slice(0, 2).join(" e ") || "todos os outros pilares"}.
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Differentiators() {
  const items = [
    { title: "Efeito dominó", text: "Nenhum pilar adoece — ou floresce — sozinho. Mostramos as conexões reais entre eles." },
    { title: "Autorresponsabilidade ativa", text: "Não é coaching motivacional. É um espelho honesto que devolve a você o leme da sua vida." },
    { title: "IA orientadora", text: "Uma orientadora que conhece a sua roda e faz as perguntas certas no momento certo." },
  ];
  return (
    <section className="px-6 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-[700px]">
          <span className="ve-eyebrow">Por que é diferente</span>
          <h2 className="mt-4">
            Não é mais um app de hábitos. <em>É um espelho que devolve o leme.</em>
          </h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {items.map((d) => (
            <div key={d.title} className="ve-card">
              <div style={{ width: 28, height: 2, background: "var(--ve-accent)", borderRadius: 2 }} />
              <h3 className="mt-5" style={{ fontSize: 20 }}>{d.title}</h3>
              <p className="mt-3 text-[15px]" style={{ color: "var(--ve-ink-soft)" }}>{d.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section id="depoimentos" className="px-6 py-20 md:py-28" style={{ background: "var(--ve-bg-soft)" }}>
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-[700px] text-center">
          <span className="ve-eyebrow">Quem já rodou</span>
          <h2 className="mt-4">
            O que as pessoas <em>descobrem.</em>
          </h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure key={t.name} className="ve-card">
              <span style={{ color: "var(--ve-accent)", fontSize: 36, lineHeight: 1, fontStyle: "italic" }}>“</span>
              <blockquote className="mt-2 text-[15px]" style={{ color: "var(--ve-ink)", lineHeight: 1.7 }}>
                {t.quote}
              </blockquote>
              <figcaption className="mt-5 text-sm" style={{ color: "var(--ve-muted)" }}>— {t.name}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function CentralCTA() {
  return (
    <section className="px-6 py-20 md:py-28">
      <div
        className="mx-auto max-w-5xl text-center"
        style={{
          background: "var(--ve-primary)",
          color: "#fff",
          borderRadius: "var(--ve-radius-lg)",
          padding: "4rem 2rem",
        }}
      >
        <h2 style={{ color: "#fff" }}>
          Nenhum pilar muda sozinho. <em style={{ color: "rgba(255,255,255,.75)" }}>Comece o seu efeito dominó hoje.</em>
        </h2>
        <p className="mx-auto mt-5 max-w-[560px]" style={{ color: "rgba(255,255,255,.8)" }}>
          Em menos de quinze minutos você terá a primeira imagem honesta da sua vida inteira.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to="/auth"
            className="ve-btn"
            style={{ background: "#fff", color: "var(--ve-primary)", borderColor: "#fff" }}
          >
            Crie a sua roda gratuita
          </Link>
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  return (
    <section id="perguntas" className="px-6 py-20 md:py-28">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <span className="ve-eyebrow">Perguntas frequentes</span>
          <h2 className="mt-4">
            Tudo que você quer saber <em>antes de começar.</em>
          </h2>
        </div>
        <Accordion type="single" collapsible className="mt-12">
          {FAQ.map((f, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              style={{ borderBottom: "0.5px solid var(--ve-line)" }}
            >
              <AccordionTrigger
                className="py-5 text-left hover:no-underline"
                style={{ fontSize: 16, fontWeight: 500, color: "var(--ve-ink)" }}
              >
                {f.q}
              </AccordionTrigger>
              <AccordionContent style={{ color: "var(--ve-ink-soft)", lineHeight: 1.7, fontSize: 15 }}>
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

function LandingFooter() {
  return (
    <footer
      className="px-6 py-10"
      style={{ borderTop: "0.5px solid var(--ve-line)" }}
    >
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 text-sm"
           style={{ color: "var(--ve-muted)" }}>
        <p>© {new Date().getFullYear()} Vida em Eixo. Para quem quer ver a vida inteira.</p>
        <Link to="/auth" className="ve-nav-link">Entrar ou criar conta</Link>
      </div>
    </footer>
  );
}