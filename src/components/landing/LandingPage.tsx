import { Link } from "@tanstack/react-router";
import {
  Heartbeat,
  Brain,
  UsersThree,
  BookOpen,
  Briefcase,
  CurrencyDollar,
  FlowerLotus,
  SmileyMeh,
  House,
  HandHeart,
  ClipboardText,
  Sparkle,
  ChartLineUp,
  ChartPieSlice,
  Bell,
  CheckCircle,
  Star,
  ArrowRight,
  CaretLeft,
  CaretRight,
} from "@phosphor-icons/react";
import pcModeloAsset from "@/assets/pc-modelo.png.asset.json";
import type { ComponentType } from "react";

type IconType = ComponentType<{
  size?: number | string;
  weight?: "thin" | "light" | "regular" | "bold" | "fill";
  color?: string;
  className?: string;
}>;

export function LandingPage() {
  return (
    <div className="landing-root min-h-screen">
      <LandingNav />
      <Hero />
      <TrustStrip />
      <Pillars />
      <Tools />
      <Testimonials />
      <FinalCTA />
      <LandingFooter />
    </div>
  );
}

/* ---------- Nav ---------- */
function LandingNav() {
  const links = [
    { label: "Recursos", href: "#recursos" },
    { label: "Pilares", href: "#pilares" },
    { label: "Como Funciona", href: "#como-funciona" },
    { label: "Planos", href: "#planos" },
    { label: "Sobre", href: "#sobre" },
  ];
  return (
    <header className="sticky top-0 z-30 bg-[color:var(--landing-bg)]/95 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-[1200px] items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-3" aria-label="Vida em Eixo — início">
          <img src={logoAsset.url} alt="" className="h-11 w-11 object-contain" />
          <span
            className="font-display leading-[1.05] text-[color:var(--landing-deep)]"
            style={{ fontSize: "1.05rem", fontWeight: 600 }}
          >
            Vida<br />em Eixo
          </span>
        </Link>
        <nav className="hidden items-center gap-9 lg:flex">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-[0.95rem] text-[color:var(--landing-ink-soft)] transition hover:text-[color:var(--landing-deep)]"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-5">
          <Link
            to="/auth"
            className="hidden text-[0.95rem] text-[color:var(--landing-ink-soft)] transition hover:text-[color:var(--landing-deep)] sm:inline"
          >
            Entrar
          </Link>
          <Link
            to="/auth"
            className="rounded-full bg-[color:var(--landing-gold)] px-5 py-2.5 text-[0.92rem] font-semibold text-white shadow-[0_8px_20px_-10px_rgba(201,162,39,0.6)] transition hover:bg-[color:var(--landing-gold-deep)]"
          >
            Começar agora
          </Link>
        </div>
      </div>
    </header>
  );
}

/* ---------- Hero ---------- */
function Hero() {
  return (
    <section className="bg-[color:var(--landing-bg)]">
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-12 px-6 pb-24 pt-12 lg:grid-cols-[1fr_1.05fr] lg:gap-16 lg:pb-32 lg:pt-16">
        {/* Left */}
        <div>
          <span className="inline-flex items-center rounded-full border border-[color:var(--landing-line)] bg-white px-4 py-1.5 text-[0.7rem] font-medium uppercase tracking-[0.18em] text-[color:var(--landing-ink-soft)]">
            Plataforma de Gerenciamento de Vida com IA
          </span>
          <h1
            className="font-display mt-7 text-[3rem] leading-[1.05] tracking-[-0.02em] text-[color:var(--landing-deep)] sm:text-[3.6rem] lg:text-[4.4rem]"
            style={{ fontWeight: 700 }}
          >
            Sua vida.<br />
            Organizada.<br />
            <span
              className="font-display italic"
              style={{ color: "#2D7A7A", fontWeight: 500 }}
            >
              Em eixo.
            </span>
          </h1>
          <p className="mt-7 max-w-md text-[1rem] leading-[1.65] text-[color:var(--landing-ink-soft)]">
            Uma plataforma completa com inteligência artificial para organizar,
            planejar e evoluir nas 11 áreas essenciais da sua vida com clareza
            e propósito.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-6">
            <Link
              to="/auth"
              className="rounded-full bg-[color:var(--landing-gold)] px-7 py-3.5 text-[0.95rem] font-semibold text-white shadow-[0_12px_28px_-12px_rgba(201,162,39,0.6)] transition hover:bg-[color:var(--landing-gold-deep)]"
            >
              Começar gratuitamente
            </Link>
            <a
              href="#como-funciona"
              className="inline-flex items-center gap-2 text-[0.95rem] font-medium text-[color:var(--landing-deep)] transition hover:gap-3"
            >
              Ver como funciona <ArrowRight size={16} weight="regular" />
            </a>
          </div>
          <ul className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-[0.88rem] text-[color:var(--landing-ink-soft)]">
            {["7 dias grátis", "Sem cartão", "Cancelamento fácil"].map((t) => (
              <li key={t} className="inline-flex items-center gap-2">
                <CheckCircle size={18} weight="fill" color="var(--landing-deep)" />
                {t}
              </li>
            ))}
          </ul>
        </div>

        {/* Right — iMac mockup */}
        <div className="relative">
          <IMacMockup />
        </div>
      </div>
    </section>
  );
}

function IMacMockup() {
  return (
    <div className="relative mx-auto w-full max-w-[640px]">
      {/* Monitor */}
      <div
        className="relative rounded-[18px] bg-[#E8E8EA] p-[10px] shadow-[0_30px_60px_-25px_rgba(26,77,77,0.25)]"
      >
        <div className="overflow-hidden rounded-[10px] bg-white">
          <DashboardScreen />
        </div>
      </div>
      {/* Stand neck */}
      <div className="mx-auto h-6 w-24 rounded-b-[6px] bg-gradient-to-b from-[#D8D8DA] to-[#BFC0C2]" />
      {/* Stand base */}
      <div className="mx-auto h-2 w-48 rounded-full bg-[#BFC0C2]/80 shadow-[0_8px_18px_-8px_rgba(0,0,0,0.2)]" />
    </div>
  );
}

function DashboardScreen() {
  return (
    <div className="flex h-[360px] bg-[#FBFAF7] text-[color:var(--landing-ink)] sm:h-[400px]">
      {/* Sidebar */}
      <aside className="hidden w-[160px] shrink-0 flex-col bg-[color:var(--landing-deep)] px-4 py-5 text-white sm:flex">
        <div className="flex items-center gap-2">
          <Sparkle size={16} weight="fill" color="#C9A227" />
          <span className="font-display text-[0.8rem] leading-tight" style={{ fontWeight: 600 }}>
            Vida<br />em Eixo
          </span>
        </div>
        <ul className="mt-6 space-y-2 text-[0.7rem]">
          {[
            { label: "Dashboard", active: true },
            { label: "Pilares" },
            { label: "Planejamento" },
            { label: "Hábitos" },
            { label: "Metas" },
            { label: "Reflexões" },
            { label: "Relatórios" },
            { label: "IA Assistente" },
            { label: "Configurações" },
          ].map((item) => (
            <li
              key={item.label}
              className={`rounded-md px-2 py-1.5 ${
                item.active
                  ? "bg-white/12 text-white"
                  : "text-white/70"
              }`}
            >
              {item.label}
            </li>
          ))}
        </ul>
      </aside>

      {/* Main */}
      <div className="flex-1 p-4 sm:p-5">
        <div className="flex items-start justify-between">
          <div>
            <h4 className="font-display text-[0.95rem]" style={{ fontWeight: 600 }}>
              Olá, Camila! <span>👋</span>
            </h4>
            <p className="mt-0.5 text-[0.65rem] text-[color:var(--landing-ink-soft)]">
              Aqui está o resumo da sua vida hoje.
            </p>
          </div>
          <span className="text-[0.6rem] text-[color:var(--landing-ink-soft)]">28 de Maio, 2025</span>
        </div>

        <div className="mt-3 grid grid-cols-[1.2fr_1fr] gap-3">
          {/* Progress card */}
          <div className="flex items-center justify-center rounded-lg border border-[color:var(--landing-line)] bg-white p-3">
            <div className="relative h-20 w-20">
              <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
                <circle cx="50" cy="50" r="42" fill="none" stroke="#EAE6DD" strokeWidth="8" />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="#1A4D4D"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${(68 / 100) * 263.9} 263.9`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-display text-[0.95rem] leading-none" style={{ fontWeight: 700 }}>
                  68%
                </span>
                <span className="mt-0.5 text-[0.5rem] text-[color:var(--landing-ink-soft)]">
                  Progresso geral
                </span>
              </div>
            </div>
          </div>

          {/* Right column cards */}
          <div className="space-y-2">
            <MiniCard
              icon={<Sparkle size={10} weight="fill" color="#C9A227" />}
              title="Foco de hoje"
              line1="Trabalhar no projeto"
              line2="Prioridade alta"
            />
            <MiniCard
              icon={<Bell size={10} weight="fill" color="#C9A227" />}
              title="Próximo hábito"
              line1="Meditar por 10 minutos"
              line2="⏰ 08:00"
            />
          </div>
        </div>

        <div className="mt-3">
          <div className="flex items-center justify-between">
            <span className="text-[0.7rem] font-semibold">Seus Pilares</span>
            <span className="text-[0.55rem] text-[color:var(--landing-ink-soft)]">Ver todos</span>
          </div>
          <div className="mt-1.5 grid grid-cols-4 gap-1.5">
            {[
              { name: "Saúde", v: 75 },
              { name: "Relacionamentos", v: 60 },
              { name: "Desenvolvimento", v: 80 },
              { name: "Propósito", v: 70 },
            ].map((p) => (
              <div
                key={p.name}
                className="rounded-md border border-[color:var(--landing-line)] bg-white px-1.5 py-1.5 text-center"
              >
                <div className="truncate text-[0.5rem] text-[color:var(--landing-ink-soft)]">{p.name}</div>
                <div className="mt-0.5 font-display text-[0.75rem]" style={{ fontWeight: 700, color: "var(--landing-deep)" }}>
                  {p.v}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MiniCard({
  icon,
  title,
  line1,
  line2,
}: {
  icon: React.ReactNode;
  title: string;
  line1: string;
  line2: string;
}) {
  return (
    <div className="rounded-md border border-[color:var(--landing-line)] bg-white px-2 py-1.5">
      <div className="flex items-center gap-1 text-[0.55rem] font-semibold">
        {icon}
        {title}
      </div>
      <div className="mt-0.5 text-[0.55rem]">{line1}</div>
      <div className="text-[0.5rem] text-[color:var(--landing-ink-soft)]">{line2}</div>
    </div>
  );
}

/* ---------- Trust strip ---------- */
function TrustStrip() {
  const logos = ["Forbes", "EXAME", "VOCÊ S/A", "Valor", "TVCiência", "PEGN"];
  return (
    <section className="bg-[#F1EDE4] py-12">
      <div className="mx-auto max-w-[1200px] px-6 text-center">
        <p className="eyebrow" style={{ color: "var(--landing-ink-soft)", letterSpacing: "0.2em" }}>
          Confiado por pessoas e organizações que buscam evolução
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-x-12 gap-y-5 opacity-60">
          {logos.map((l) => (
            <span
              key={l}
              className="font-display text-[1.5rem] text-[color:var(--landing-ink)]"
              style={{ fontWeight: 600, letterSpacing: "-0.01em" }}
            >
              {l}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Pillars ---------- */
const PILLARS_LIST: { name: string; Icon: IconType }[] = [
  { name: "Saúde\nFísica", Icon: Heartbeat },
  { name: "Saúde\nMental", Icon: Brain },
  { name: "Relacionamentos", Icon: UsersThree },
  { name: "Desenvolvimento\nPessoal", Icon: BookOpen },
  { name: "Carreira", Icon: Briefcase },
  { name: "Finanças", Icon: CurrencyDollar },
  { name: "Espiritualidade", Icon: FlowerLotus },
  { name: "Lazer e\nDiversão", Icon: SmileyMeh },
  { name: "Ambiente", Icon: House },
  { name: "Contribuição", Icon: HandHeart },
  { name: "Organização\ne Produtividade", Icon: ClipboardText },
];

function Pillars() {
  return (
    <section id="pilares" className="bg-[color:var(--landing-bg)] py-24 md:py-28">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="text-center">
          <p className="eyebrow">Os 11 pilares da vida</p>
          <h2
            className="font-display mx-auto mt-4 max-w-3xl text-[2.1rem] leading-[1.15] text-[color:var(--landing-deep)] md:text-[2.8rem]"
            style={{ fontWeight: 700 }}
          >
            Uma visão completa do que importa
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-[0.98rem] leading-[1.65] text-[color:var(--landing-ink-soft)]">
            Desenvolva equilíbrio e clareza nas 11 áreas essenciais da sua vida.
            Nossa IA te ajuda a identificar prioridades, criar planos e
            acompanhar seu progresso.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {PILLARS_LIST.slice(0, 6).map((p) => (
            <PillarTile key={p.name} {...p} />
          ))}
        </div>
        <div className="mt-5 grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-5 md:px-[8.5%] lg:px-[12%]">
          {PILLARS_LIST.slice(6).map((p) => (
            <PillarTile key={p.name} {...p} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PillarTile({ name, Icon }: { name: string; Icon: IconType }) {
  return (
    <div
      className="flex flex-col items-center rounded-xl border border-[color:var(--landing-line)] bg-white px-3 py-7 text-center transition hover:-translate-y-1 hover:border-[color:var(--landing-deep)]/30 hover:shadow-[0_14px_30px_-18px_rgba(26,77,77,0.25)]"
    >
      <Icon size={30} weight="light" color="var(--landing-deep)" />
      <p
        className="mt-4 whitespace-pre-line text-[0.78rem] font-medium leading-[1.3] text-[color:var(--landing-ink)]"
      >
        {name}
      </p>
    </div>
  );
}

/* ---------- Tools (dark) ---------- */
const TOOLS: { Icon: IconType; title: string; text: string }[] = [
  {
    Icon: Sparkle,
    title: "IA que entende você",
    text: "Análises inteligentes e recomendações personalizadas com base nos seus dados e objetivos.",
  },
  {
    Icon: ChartLineUp,
    title: "Planejamento inteligente",
    text: "Crie planos realistas, defina metas alcançáveis e receba sugestões de ações diárias personalizadas.",
  },
  {
    Icon: ChartPieSlice,
    title: "Acompanhamento visual",
    text: "Dashboards intuitivos e relatórios completos para você visualizar seu progresso de forma clara e motivadora.",
  },
  {
    Icon: Bell,
    title: "Lembretes e hábitos",
    text: "Construa hábitos consistentes com lembretes inteligentes e acompanhe suas sequências diárias.",
  },
];

function Tools() {
  return (
    <section id="recursos" className="py-24 text-[#F4EFE2]" style={{ background: "var(--landing-deep)" }}>
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="text-center">
          <p className="text-[0.7rem] font-medium uppercase tracking-[0.22em]" style={{ color: "var(--landing-gold)" }}>
            Inteligência Artificial a seu favor
          </p>
          <h2
            className="font-display mx-auto mt-4 max-w-3xl text-[2.1rem] leading-[1.15] text-white md:text-[2.8rem]"
            style={{ fontWeight: 700 }}
          >
            Ferramentas poderosas para sua evolução
          </h2>
        </div>
        <div className="mt-14 grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {TOOLS.map((t) => (
            <div key={t.title}>
              <t.Icon size={28} weight="light" color="var(--landing-gold)" />
              <h3
                className="font-display mt-5 text-[1.1rem] text-white"
                style={{ fontWeight: 600 }}
              >
                {t.title}
              </h3>
              <p
                className="mt-3 text-[0.92rem] leading-[1.65]"
                style={{ color: "rgba(244,239,226,0.7)" }}
              >
                {t.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Testimonials ---------- */
const TESTIMONIALS = [
  {
    name: "Ricardo M.",
    role: "Empresário",
    quote:
      "O Vida em Eixo me ajudou a ter clareza sobre o que realmente importa e a organizar minha vida de forma prática. Nunca fui tão produtivo e equilibrado.",
  },
  {
    name: "Juliana T.",
    role: "Médica",
    quote:
      "A plataforma me mostra onde estou focando minha energia e me ajuda a evoluir todos os dias. A IA é um diferencial incrível!",
  },
  {
    name: "Fernanda A.",
    role: "Consultora",
    quote:
      "Finalmente uma ferramenta completa para gerenciar todas as áreas da vida em um só lugar. Recomendo demais!",
  },
];

function Testimonials() {
  return (
    <section id="sobre" className="bg-[color:var(--landing-bg)] py-24 md:py-28">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="text-center">
          <p className="eyebrow">Depoimentos</p>
          <h2
            className="font-display mx-auto mt-4 max-w-3xl text-[2.1rem] leading-[1.15] text-[color:var(--landing-deep)] md:text-[2.8rem]"
            style={{ fontWeight: 700 }}
          >
            Histórias reais de transformação
          </h2>
        </div>
        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure
              key={t.name}
              className="rounded-xl border border-[color:var(--landing-line)] bg-white p-7"
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-full font-display text-[1rem] text-white"
                  style={{ background: "var(--landing-deep)", fontWeight: 600 }}
                >
                  {t.name.charAt(0)}
                </div>
                <figcaption>
                  <div className="text-[0.92rem] font-semibold">{t.name}</div>
                  <div className="text-[0.78rem] text-[color:var(--landing-ink-soft)]">{t.role}</div>
                </figcaption>
              </div>
              <blockquote className="mt-4 text-[0.92rem] leading-[1.65] text-[color:var(--landing-ink-soft)]">
                “{t.quote}”
              </blockquote>
              <div className="mt-4 flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} weight="fill" color="#C9A227" />
                ))}
              </div>
            </figure>
          ))}
        </div>
        <div className="mt-8 flex items-center justify-center gap-4 text-[color:var(--landing-ink-soft)]">
          <button aria-label="anterior" className="rounded-full border border-[color:var(--landing-line)] p-2 transition hover:text-[color:var(--landing-deep)]">
            <CaretLeft size={14} weight="bold" />
          </button>
          <div className="flex items-center gap-1.5">
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: i === 0 ? "var(--landing-deep)" : "var(--landing-line)" }}
              />
            ))}
          </div>
          <button aria-label="próximo" className="rounded-full border border-[color:var(--landing-line)] p-2 transition hover:text-[color:var(--landing-deep)]">
            <CaretRight size={14} weight="bold" />
          </button>
        </div>
      </div>
    </section>
  );
}

/* ---------- Final CTA ---------- */
function FinalCTA() {
  return (
    <section className="bg-[color:var(--landing-bg)] pb-20">
      <div className="mx-auto max-w-[1200px] px-6">
        <div
          className="grid grid-cols-1 items-center gap-8 rounded-2xl px-10 py-12 md:grid-cols-[1.2fr_1fr] md:px-14"
          style={{ background: "var(--landing-deep)" }}
        >
          <div className="text-white">
            <h2
              className="font-display text-[1.7rem] leading-[1.2] md:text-[2.2rem]"
              style={{ fontWeight: 600 }}
            >
              Pronto para transformar sua vida?
            </h2>
            <p className="mt-4 text-[0.95rem] leading-[1.65]" style={{ color: "rgba(244,239,226,0.78)" }}>
              Comece agora sua jornada de evolução com o Vida em Eixo.<br />
              7 dias gratuitos para você experimentar todas as funcionalidades.
            </p>
          </div>
          <div className="flex flex-col items-start gap-5 md:items-end">
            <Link
              to="/auth"
              className="rounded-full bg-[color:var(--landing-gold)] px-8 py-3.5 text-[0.95rem] font-semibold text-white shadow-[0_12px_28px_-12px_rgba(201,162,39,0.6)] transition hover:bg-[color:var(--landing-gold-deep)]"
            >
              Começar gratuitamente
            </Link>
            <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.82rem]" style={{ color: "rgba(244,239,226,0.85)" }}>
              {["7 dias grátis", "Sem cartão", "Acesso completo"].map((t) => (
                <li key={t} className="inline-flex items-center gap-1.5">
                  <CheckCircle size={14} weight="fill" color="#C9A227" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Footer ---------- */
function LandingFooter() {
  return (
    <footer className="border-t border-[color:var(--landing-line)] bg-[color:var(--landing-bg)] py-8">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-4 px-6 text-[0.85rem] text-[color:var(--landing-ink-soft)]">
        <p>© {new Date().getFullYear()} Vida em Eixo. Todos os direitos reservados.</p>
        <div className="flex items-center gap-5">
          <a href="#" className="transition hover:text-[color:var(--landing-deep)]">Privacidade</a>
          <a href="#" className="transition hover:text-[color:var(--landing-deep)]">Termos</a>
          <Link to="/auth" className="transition hover:text-[color:var(--landing-deep)]">Entrar</Link>
        </div>
      </div>
    </footer>
  );
}