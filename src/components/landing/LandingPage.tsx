import { Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  HandHeart, Brain, House, Heart, UsersThree, Target,
  ChartLineUp, BookOpen, FlowerLotus, MusicNotes, Heartbeat,
  List, X, Star, Check,
} from "@phosphor-icons/react";
import { RadialWheel } from "@/components/RadialWheel";
import { PILLAR_DEFAULTS, type Pillar } from "@/lib/pillars";
import logoAsset from "@/assets/vida-em-eixo-logo.png.asset.json";
import featuredImg from "@/assets/featured-meditation.jpg";
import newsletterImg from "@/assets/newsletter-learning.jpg";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";

const NAV_LINKS = [
  { href: "#metodo", label: "Como funciona" },
  { href: "#pilares", label: "Pilares" },
  { href: "#planos", label: "Planos" },
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
  { name: "Marina", role: "Designer, 34", quote: "Eu achava que o problema era trabalho. A roda me mostrou que era o emocional puxando tudo pra baixo. Em seis semanas, mudei o que importava." },
  { name: "Rafael", role: "Empreendedor, 41", quote: "Nunca tinha visto minha vida assim — inteira. É desconfortável e libertador ao mesmo tempo." },
  { name: "Júlia", role: "Psicóloga, 28", quote: "O que mais me ajudou foi entender o efeito dominó. Parei de tentar consertar dez coisas ao mesmo tempo." },
];

const PLANS = [
  {
    name: "Início",
    price: "Grátis",
    period: "para sempre",
    description: "Tudo que você precisa para ver a sua vida inteira.",
    cta: "Comece grátis",
    featured: false,
    features: [
      "Autoavaliação dos 11 pilares",
      "Roda viva e interativa",
      "Mapa de impactos entre pilares",
      "Check-ins semanais",
    ],
  },
  {
    name: "Pro",
    price: "R$ 39",
    period: "por mês",
    description: "Para quem quer ir mais fundo, com acompanhamento e IA orientadora.",
    cta: "Inicie o Pro",
    featured: true,
    features: [
      "Tudo do Início",
      "IA orientadora ilimitada",
      "Planos de ação personalizados",
      "Histórico completo de evolução",
      "Biblioteca de vídeos curados",
    ],
  },
  {
    name: "VIP",
    price: "Sob consulta",
    period: "1:1 com coach",
    description: "Acompanhamento individual com coach humano e a sua roda no centro.",
    cta: "Fale com a gente",
    featured: false,
    features: [
      "Tudo do Pro",
      "Sessões 1:1 quinzenais",
      "Plano sob medida",
      "Suporte direto pelo WhatsApp",
    ],
  },
];

const FAQ = [
  { q: "Posso começar de graça?", a: "Sim. O plano Início é gratuito para sempre e inclui a roda completa, autoavaliação, impactos e check-ins. Os planos Pro e VIP são para quem quer ir mais fundo com IA orientadora e acompanhamento 1:1." },
  { q: "Quanto tempo leva para começar?", a: "A autoavaliação inicial leva entre 8 e 15 minutos. Você pode pausar e voltar quando quiser." },
  { q: "Preciso fazer tudo de uma vez?", a: "Não. A roda é um processo vivo. Comece pela autoavaliação e o sistema te guia pelos próximos passos no seu ritmo." },
  { q: "Como a IA me ajuda?", a: "Ela enxerga a sua roda inteira — pontuações, impactos, plano — e conversa com você fazendo perguntas que ajudam a clarear escolhas." },
  { q: "Meus dados são privados?", a: "Sim. Sua roda é só sua. Não compartilhamos suas avaliações, planos ou conversas com ninguém." },
  { q: "Funciona para qualquer fase da vida?", a: "Sim. Os 11 pilares cobrem áreas universais — emocional, família, carreira, saúde, espiritualidade — e o sistema se adapta ao seu momento atual." },
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
      <FeaturedSection />
      <Pillars />
      <Differentiators />
      <Testimonials />
      <Pricing />
      <Newsletter />
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
          <span className="ve-eyebrow">Coaching de vida inteligente</span>
          <h1 className="mt-5">
            Veja sua vida inteira <em>em uma só imagem.</em>
          </h1>
          <p className="mt-6 max-w-[560px]" style={{ color: "var(--ve-ink-soft)" }}>
            Mapeie seus 11 pilares. Descubra desequilíbrios reais.
            Comece sua transformação com clareza — não com mais uma lista de hábitos.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link to="/auth" className="ve-btn">Inicie sua jornada</Link>
            <a href="#metodo" className="ve-btn-outline">Ver como funciona</a>
          </div>
          <div className="mt-8 flex items-center gap-3 text-sm" style={{ color: "var(--ve-ink-soft)" }}>
            <div className="flex items-center gap-0.5" style={{ color: "var(--ve-accent)" }}>
              {[0,1,2,3,4].map((i) => <Star key={i} size={16} weight="fill" />)}
            </div>
            <span><strong style={{ color: "var(--ve-ink)" }}>4.9/5</strong> · confiado por +500 pessoas</span>
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
    <section
      id="metodo"
      className="px-6 py-20 md:py-28"
      style={{ background: "var(--ve-primary)", color: "#fff" }}
    >
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-[700px] text-center">
          <span className="ve-eyebrow" style={{ color: "rgba(255,255,255,.7)" }}>
            Como funciona
          </span>
          <h2 className="mt-4" style={{ color: "#fff" }}>
            Quatro passos, <em style={{ color: "var(--ve-accent)" }}>uma vida clareada.</em>
          </h2>
        </div>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s) => (
            <article
              key={s.n}
              className="ve-card"
              style={{
                background: "rgba(255,255,255,.04)",
                border: "0.5px solid rgba(255,255,255,.12)",
                borderLeft: "2px solid var(--ve-accent)",
              }}
            >
              <div style={{ fontSize: 13, color: "var(--ve-accent)" }}>{s.n}</div>
              <h3 className="mt-3" style={{ fontSize: 20, color: "#fff" }}>{s.title}</h3>
              <p className="mt-3 text-[15px]" style={{ color: "rgba(255,255,255,.78)" }}>{s.text}</p>
            </article>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link
            to="/auth"
            className="ve-btn"
            style={{ background: "var(--ve-accent)", color: "var(--ve-primary)", borderColor: "var(--ve-accent)" }}
          >
            Comece agora
          </Link>
        </div>
      </div>
    </section>
  );
}

function FeaturedSection() {
  const benefits = [
    "Clareza sobre as prioridades reais",
    "Foco em transformação sustentável",
    "Uma comunidade de pessoas como você",
  ];
  return (
    <section className="px-6 py-20 md:py-28" style={{ background: "var(--ve-accent)" }}>
      <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-[1.1fr_1fr]">
        <div className="overflow-hidden" style={{ borderRadius: "var(--ve-radius-lg)", boxShadow: "var(--ve-shadow-lg)" }}>
          <img
            src={featuredImg}
            alt="Pessoa meditando em luz natural"
            loading="lazy"
            width={1024}
            height={1280}
            className="block h-full w-full object-cover"
            style={{ aspectRatio: "4 / 5" }}
          />
        </div>
        <div>
          <span className="ve-eyebrow" style={{ color: "var(--ve-primary)" }}>Transformação real</span>
          <h2 className="mt-4" style={{ color: "var(--ve-primary)" }}>
            De fragmentado <em style={{ color: "var(--ve-primary)" }}>para integrado.</em>
          </h2>
          <p className="mt-5" style={{ color: "var(--ve-primary)", opacity: 0.85 }}>
            A maioria das pessoas não sabe por onde começar. A Vida em Eixo mostra
            o caminho — não com fórmulas prontas, mas com um espelho honesto da
            sua vida inteira.
          </p>
          <ul className="mt-7 space-y-3">
            {benefits.map((b) => (
              <li key={b} className="flex items-start gap-3" style={{ color: "var(--ve-primary)" }}>
                <Check size={20} weight="bold" style={{ marginTop: 2, flexShrink: 0 }} />
                <span>{b}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <Link
              to="/auth"
              className="ve-btn"
              style={{ background: "var(--ve-primary)", color: "#fff", borderColor: "var(--ve-primary)" }}
            >
              Descubra seu panorama
            </Link>
          </div>
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
              <div className="flex items-center gap-0.5" style={{ color: "var(--ve-accent)" }}>
                {[0,1,2,3,4].map((i) => <Star key={i} size={14} weight="fill" />)}
              </div>
              <blockquote className="mt-4 text-[15px]" style={{ color: "var(--ve-ink)", lineHeight: 1.7 }}>
                {t.quote}
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium"
                  style={{ background: "var(--ve-bg-soft)", color: "var(--ve-primary)" }}
                >
                  {t.name[0]}
                </div>
                <div className="text-sm leading-tight">
                  <div style={{ color: "var(--ve-primary)", fontWeight: 500 }}>{t.name}</div>
                  <div style={{ color: "var(--ve-muted)" }}>{t.role}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section id="planos" className="px-6 py-20 md:py-28" style={{ background: "var(--ve-primary)", color: "#fff" }}>
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-[700px] text-center">
          <span className="ve-eyebrow" style={{ color: "rgba(255,255,255,.7)" }}>Escolha seu caminho</span>
          <h2 className="mt-4" style={{ color: "#fff" }}>
            Comece de graça. <em style={{ color: "var(--ve-accent)" }}>Vá mais fundo quando quiser.</em>
          </h2>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {PLANS.map((p) => (
            <article
              key={p.name}
              className="relative flex flex-col"
              style={{
                background: p.featured ? "#fff" : "rgba(255,255,255,.04)",
                color: p.featured ? "var(--ve-ink)" : "#fff",
                border: p.featured ? "2px solid var(--ve-accent)" : "0.5px solid rgba(255,255,255,.14)",
                borderRadius: "var(--ve-radius-lg)",
                padding: "2rem",
              }}
            >
              {p.featured && (
                <span
                  className="absolute right-4 top-4 rounded-full px-3 py-1 text-[11px]"
                  style={{ background: "var(--ve-accent)", color: "var(--ve-primary)", fontWeight: 500 }}
                >
                  Popular
                </span>
              )}
              <h3 style={{ fontSize: 20, color: p.featured ? "var(--ve-primary)" : "#fff" }}>{p.name}</h3>
              <div className="mt-4 flex items-baseline gap-2">
                <span style={{ fontSize: 36, fontWeight: 500, lineHeight: 1, color: p.featured ? "var(--ve-primary)" : "#fff" }}>
                  {p.price}
                </span>
                <span className="text-sm" style={{ color: p.featured ? "var(--ve-muted)" : "rgba(255,255,255,.7)" }}>
                  / {p.period}
                </span>
              </div>
              <p className="mt-3 text-[14px]" style={{ color: p.featured ? "var(--ve-ink-soft)" : "rgba(255,255,255,.78)" }}>
                {p.description}
              </p>
              <ul className="mt-6 flex-1 space-y-2.5 text-[14px]">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check size={16} weight="bold" style={{ marginTop: 3, flexShrink: 0, color: p.featured ? "var(--ve-primary)" : "var(--ve-accent)" }} />
                    <span style={{ color: p.featured ? "var(--ve-ink)" : "rgba(255,255,255,.88)" }}>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/auth"
                className="ve-btn mt-8"
                style={
                  p.featured
                    ? { background: "var(--ve-accent)", color: "var(--ve-primary)", borderColor: "var(--ve-accent)" }
                    : { background: "transparent", color: "#fff", border: "0.5px solid rgba(255,255,255,.5)" }
                }
              >
                {p.cta}
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Newsletter() {
  return (
    <section className="px-6 py-20 md:py-28" style={{ background: "var(--ve-accent)" }}>
      <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
        <div className="order-2 overflow-hidden md:order-1"
             style={{ borderRadius: "var(--ve-radius-lg)", boxShadow: "var(--ve-shadow-lg)" }}>
          <img
            src={newsletterImg}
            alt="Pessoa escrevendo no diário com laptop ao lado"
            loading="lazy"
            width={1280}
            height={1024}
            className="block h-full w-full object-cover"
            style={{ aspectRatio: "5 / 4" }}
          />
        </div>
        <div className="order-1 md:order-2">
          <span className="ve-eyebrow" style={{ color: "var(--ve-primary)" }}>Guia gratuito</span>
          <h3 className="mt-4" style={{ fontSize: 32, fontWeight: 500, color: "var(--ve-primary)", lineHeight: 1.2 }}>
            Receba 7 dias de <em>insights profundos.</em>
          </h3>
          <p className="mt-4" style={{ color: "var(--ve-primary)", opacity: 0.85 }}>
            Um e-mail por dia, com exercícios práticos para começar a enxergar a sua vida inteira — sem custo.
          </p>
          <form
            className="mt-6 flex flex-col gap-3 sm:flex-row"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="text"
              required
              placeholder="Seu nome"
              aria-label="Seu nome"
              className="flex-1 px-4 py-3 text-[15px]"
              style={{
                background: "#fff",
                border: "0.5px solid rgba(0,0,0,.08)",
                borderRadius: "var(--ve-radius-md)",
                color: "var(--ve-ink)",
              }}
            />
            <input
              type="email"
              required
              placeholder="seu@email.com"
              aria-label="Seu e-mail"
              className="flex-1 px-4 py-3 text-[15px]"
              style={{
                background: "#fff",
                border: "0.5px solid rgba(0,0,0,.08)",
                borderRadius: "var(--ve-radius-md)",
                color: "var(--ve-ink)",
              }}
            />
            <button
              type="submit"
              className="ve-btn"
              style={{ background: "var(--ve-primary)", color: "#fff", borderColor: "var(--ve-primary)" }}
            >
              Enviar guia
            </button>
          </form>
          <p className="mt-3 text-xs" style={{ color: "var(--ve-primary)", opacity: 0.7 }}>
            Sem spam. Seu e-mail é seguro com a gente.
          </p>
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
  const year = new Date().getFullYear();
  return (
    <footer
      className="px-6 pt-16 pb-10"
      style={{ background: "var(--ve-primary)", color: "rgba(255,255,255,.78)" }}
    >
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2.5">
            <img src={logoAsset.url} alt="Vida em Eixo" className="h-8 w-8 rounded-lg object-contain" />
            <span className="text-[15px]" style={{ color: "#fff", fontWeight: 500 }}>Vida em Eixo</span>
          </div>
          <p className="mt-4 text-sm max-w-[260px]">
            Um espelho honesto dos onze pilares que sustentam você.
          </p>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wider mb-4" style={{ color: "var(--ve-accent)" }}>Conteúdo</div>
          <ul className="space-y-2 text-sm">
            <li><a href="#metodo" className="hover:text-white">Como funciona</a></li>
            <li><a href="#pilares" className="hover:text-white">Pilares</a></li>
            <li><a href="#planos" className="hover:text-white">Planos</a></li>
            <li><a href="#perguntas" className="hover:text-white">Perguntas</a></li>
          </ul>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wider mb-4" style={{ color: "var(--ve-accent)" }}>Conta</div>
          <ul className="space-y-2 text-sm">
            <li><Link to="/auth" className="hover:text-white">Entrar</Link></li>
            <li><Link to="/auth" className="hover:text-white">Criar conta</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wider mb-4" style={{ color: "var(--ve-accent)" }}>Legal</div>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-white">Privacidade</a></li>
            <li><a href="#" className="hover:text-white">Termos</a></li>
            <li><a href="#" className="hover:text-white">Contato</a></li>
          </ul>
        </div>
      </div>
      <div
        className="mx-auto mt-12 max-w-6xl pt-6 text-xs"
        style={{ borderTop: "0.5px solid rgba(255,255,255,.14)", color: "rgba(255,255,255,.6)" }}
      >
        © {year} Vida em Eixo. Para quem quer ver a vida inteira.
      </div>
    </footer>
  );
}