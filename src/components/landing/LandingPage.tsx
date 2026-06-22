import { Link } from "@tanstack/react-router";
import { type Pillar } from "@/lib/pillars";
import {
  HandHeart,
  Brain,
  House,
  Heart,
  UsersThree,
  Target,
  ChartLineUp,
  BookOpen,
  FlowerLotus,
  MusicNotes,
  Heartbeat,
  Compass,
  MapTrifold,
  Mountains,
  Eye,
  Flag,
  Scales,
  ListChecks,
  EnvelopeSimple,
  WhatsappLogo,
  MapPin,
  InstagramLogo,
  YoutubeLogo,
  LinkedinLogo,
} from "@phosphor-icons/react";
import { RadialWheel } from "@/components/RadialWheel";

const DEMO_PILLARS: Pillar[] = [
  { id: 1,  name: "Contribuição",   shortName: "Contribuição",   icon: "🤝", Icon: HandHeart,   score: 8.2, message: "Exemplo: equilíbrio",  impact: 3, impactPillars: [] },
  { id: 2,  name: "Emocional",      shortName: "Emocional",      icon: "❤️", Icon: Brain,       score: 6.4, message: "Exemplo: atenção",     impact: 3, impactPillars: [] },
  { id: 3,  name: "Família",        shortName: "Família",        icon: "🏠", Icon: House,       score: 7.6, message: "Exemplo: equilíbrio",  impact: 3, impactPillars: [] },
  { id: 4,  name: "Relacionamento", shortName: "Relacionamento", icon: "💕", Icon: Heart,       score: 4.9, message: "Exemplo: crítico",     impact: 3, impactPillars: [] },
  { id: 5,  name: "Social",         shortName: "Social",         icon: "👥", Icon: UsersThree,  score: 7.1, message: "Exemplo: equilíbrio",  impact: 3, impactPillars: [] },
  { id: 6,  name: "Carreira",       shortName: "Carreira",       icon: "🎯", Icon: Target,      score: 6.2, message: "Exemplo: atenção",     impact: 4, impactPillars: [], focus: true },
  { id: 7,  name: "Financeiro",     shortName: "Financeiro",     icon: "💵", Icon: ChartLineUp, score: 8.5, message: "Exemplo: equilíbrio",  impact: 3, impactPillars: [] },
  { id: 8,  name: "Intelectual",    shortName: "Intelectual",    icon: "📖", Icon: BookOpen,    score: 7.8, message: "Exemplo: equilíbrio",  impact: 3, impactPillars: [] },
  { id: 9,  name: "Espiritualidade",shortName: "Espiritualidade",icon: "🧘", Icon: FlowerLotus, score: 5.3, message: "Exemplo: crítico",     impact: 3, impactPillars: [] },
  { id: 10, name: "Lazer",          shortName: "Lazer",          icon: "🎵", Icon: MusicNotes,  score: 6.8, message: "Exemplo: atenção",     impact: 3, impactPillars: [] },
  { id: 11, name: "Saúde",          shortName: "Saúde",          icon: "🏃", Icon: Heartbeat,   score: 4.3, message: "Exemplo: crítico",     impact: 3, impactPillars: [] },
];

const STAGES = [
  { Icon: Eye,        title: "RECONHEÇA",   text: "seus pontos fortes e desafios" },
  { Icon: ListChecks, title: "DEFINA",       text: "prioridades com clareza" },
  { Icon: Flag,       title: "TRACE PLANOS", text: "alinhados ao que realmente importa" },
  { Icon: Scales,     title: "EQUILIBRE",    text: "suas áreas e avance com consistência" },
];

const STEPS = [
  { n: "01", title: "DIAGNÓSTICO E CLAREZA",    Icon: Compass,     text: "Entenda onde você está hoje e o que precisa mudar para chegar onde deseja." },
  { n: "02", title: "PLANO PERSONALIZADO",      Icon: MapTrifold,  text: "Criamos um plano estratégico alinhado aos seus objetivos e valores." },
  { n: "03", title: "AÇÃO COM FOCO",            Icon: Mountains,   text: "Você entra em ação com método, foco e acompanhamento contínuo." },
  { n: "04", title: "RESULTADOS E EVOLUÇÃO",    Icon: ChartLineUp, text: "Celebre conquistas, ajuste a rota e continue evoluindo com consistência." },
];

export function LandingPage() {
  return (
    <div className="landing-root min-h-screen">
      <Hero />
      <LifeWheelSection />
      <Methodology />
      <LandingFooter />
    </div>
  );
}

function BrandMark({ variant = "light" }: { variant?: "light" | "dark" }) {
  const color = variant === "light" ? "var(--landing-bg)" : "var(--landing-ink-dark)";
  return (
    <Link to="/" className="inline-flex items-baseline gap-1.5 select-none" style={{ color }}>
      <span
        style={{ fontFamily: "var(--font-display)" }}
        className="text-[1.35rem] font-semibold tracking-[0.04em]"
      >
        VIDA
      </span>
      <span
        style={{ fontFamily: "var(--font-display)", color: "var(--landing-gold)" }}
        className="text-[1.05rem] italic font-medium"
      >
        em
      </span>
      <span
        style={{ fontFamily: "var(--font-display)" }}
        className="text-[1.35rem] font-semibold tracking-[0.04em]"
      >
        EIXO
      </span>
    </Link>
  );
}

function Hero() {
  const navLinks = [
    { label: "SOBRE", href: "#sobre" },
    { label: "METODOLOGIA", href: "#metodologia" },
    { label: "SOBRE A RODA", href: "#roda" },
    { label: "CONTATO", href: "#contato" },
  ];
  return (
    <section
      className="relative overflow-hidden"
      style={{ background: "var(--landing-green)" }}
    >
      {/* Top nav */}
      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-7 md:px-12">
        <BrandMark variant="light" />
        <nav className="hidden items-center gap-9 md:flex">
          {navLinks.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-[11px] font-medium tracking-[0.22em] text-[color:var(--landing-bg)]/85 transition-colors hover:text-[color:var(--landing-gold)]"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <Link
          to="/auth"
          className="text-[11px] font-medium tracking-[0.22em] text-[color:var(--landing-bg)]/85 transition-colors hover:text-[color:var(--landing-gold)] md:hidden"
        >
          ENTRAR
        </Link>
      </header>

      <div className="mx-auto grid min-h-[82vh] max-w-6xl items-center gap-12 px-6 pb-20 pt-6 md:grid-cols-[5fr_6fr] md:gap-10 md:px-12 md:pb-28">
        {/* Left: editorial copy */}
        <div className="relative z-10">
          <h1
            className="text-[color:var(--landing-bg)] text-[2.6rem] leading-[1.05] md:text-[3.4rem]"
            style={{ fontFamily: "var(--font-display)", fontWeight: 600, letterSpacing: "-0.02em" }}
          >
            Transforme sua vida em um sistema que funciona
          </h1>
          <div className="mt-7 h-px w-12 bg-[color:var(--landing-gold)]" />
          <p className="mt-6 max-w-md text-[15px] leading-[1.7] text-[color:var(--landing-bg)]/80">
            A metodologia completa para você sair do estado atual para o estado
            desejado, equilibrando os 11 pilares da sua vida.
          </p>
          <div className="mt-10">
            <Link to="/auth" className="landing-cta landing-cta-ghost-gold">
              Comece sua jornada
            </Link>
          </div>
        </div>

        {/* Right: live RadialWheel */}
        <div className="relative">
          <div className="hidden sm:block">
            <RadialWheel
              pillars={DEMO_PILLARS}
              balance={68}
              hovered={null}
              onHover={() => {}}
            />
          </div>
          {/* mobile fallback */}
          <div className="rounded-2xl border border-[color:var(--landing-gold)]/30 bg-[color:var(--landing-green)]/40 p-8 text-center backdrop-blur-sm sm:hidden">
            <p
              className="text-xl text-white"
              style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
            >
              Roda da Vida
            </p>
            <p className="mt-2 text-sm text-white/80">
              Visualize seus 11 pilares ao acessar o painel.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function LifeWheelSection() {
  return (
    <section id="roda" className="py-24 md:py-32" style={{ background: "var(--landing-bg)" }}>
      <div className="mx-auto grid max-w-6xl gap-16 px-6 md:grid-cols-[1fr_1fr] md:px-12 lg:gap-24">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.24em] text-[color:var(--landing-gold-deep)] uppercase">
            Sua vida, em equilíbrio
          </p>
          <h2
            className="mt-5 text-[2.2rem] leading-[1.15] text-[color:var(--landing-ink-dark)] md:text-[2.6rem]"
            style={{ fontFamily: "var(--font-display)", fontWeight: 600, letterSpacing: "-0.02em" }}
          >
            Uma visão completa<br />de quem você é.
          </h2>
          <p className="mt-6 max-w-md text-[15px] leading-[1.7] text-[color:var(--landing-ink-soft)]">
            A Roda da Vida mostra onde você está hoje em cada área essencial
            e revela onde pode crescer para viver com mais leveza e realização.
          </p>
          <div className="mt-10">
            <Link to="/auth" className="landing-cta">
              Avalie sua Roda da Vida
            </Link>
          </div>
        </div>

        <ul className="space-y-10">
          {STAGES.map(({ Icon, title, text }) => (
            <li key={title} className="flex items-start gap-5">
              <span
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[color:var(--landing-gold)]/40"
              >
                <Icon size={22} weight="light" className="text-[color:var(--landing-gold)]" />
              </span>
              <div>
                <p
                  className="text-[13px] font-semibold tracking-[0.18em] text-[color:var(--landing-green)]"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  {title}
                </p>
                <p className="mt-1.5 text-[15px] leading-[1.6] text-[color:var(--landing-ink-soft)]">
                  {text}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Methodology() {
  return (
    <section
      id="metodologia"
      className="border-t border-[color:var(--landing-line)] py-24 md:py-32"
      style={{ background: "var(--landing-bg)" }}
    >
      <div className="mx-auto max-w-6xl px-6 md:px-12">
        <div className="grid gap-12 md:grid-cols-[1fr_1fr] md:items-end">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.24em] text-[color:var(--landing-gold-deep)] uppercase">
              Metodologia Vida em Eixo
            </p>
            <h2
              className="mt-5 text-[2.2rem] leading-[1.15] text-[color:var(--landing-ink-dark)] md:text-[2.6rem]"
              style={{ fontFamily: "var(--font-display)", fontWeight: 600, letterSpacing: "-0.02em" }}
            >
              Um caminho estruturado<br />para resultados reais.
            </h2>
          </div>
          <p className="text-[15px] leading-[1.7] text-[color:var(--landing-ink-soft)] md:pb-2">
            Nossa metodologia combina estratégia, autoconhecimento e ação
            para transformar sua vida de dentro para fora.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map(({ n, title, Icon, text }) => (
            <article
              key={n}
              className="group flex flex-col items-center rounded-lg border border-[color:var(--landing-line)] bg-white p-8 text-center transition-shadow duration-300 hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)]"
            >
              <span
                className="text-[1.4rem] text-[color:var(--landing-gold)]"
                style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
              >
                {n}
              </span>
              <Icon size={44} weight="light" className="mt-5 text-[color:var(--landing-green)]" />
              <h3
                className="mt-6 text-[13px] font-semibold tracking-[0.16em] text-[color:var(--landing-ink-dark)]"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                {title}
              </h3>
              <p className="mt-4 text-[13.5px] leading-[1.6] text-[color:var(--landing-ink-soft)]">
                {text}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function LandingFooter() {
  return (
    <footer id="contato" className="text-[color:var(--landing-bg)]" style={{ background: "#1F1F1F" }}>
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-4 md:px-12">
        <div>
          <BrandMark variant="light" />
          <p className="mt-5 max-w-[16rem] text-[13.5px] leading-[1.7] text-[color:var(--landing-bg)]/70">
            Coaching e desenvolvimento pessoal para mulheres que querem viver
            com propósito, equilíbrio e liberdade.
          </p>
          <p
            className="mt-6 text-[15px] italic text-[color:var(--landing-gold)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Sua vida. Seu eixo. Suas escolhas.
          </p>
        </div>

        <FooterColumn title="NAVEGAÇÃO">
          {[
            { label: "Sobre", href: "#roda" },
            { label: "Metodologia", href: "#metodologia" },
            { label: "Sobre a Roda", href: "#roda" },
            { label: "Contato", href: "#contato" },
          ].map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="block text-[13.5px] text-[color:var(--landing-bg)]/70 transition-colors hover:text-[color:var(--landing-gold)]"
            >
              {l.label}
            </a>
          ))}
        </FooterColumn>

        <FooterColumn title="CONTATO">
          <FooterLine Icon={EnvelopeSimple}>contato@vidaemeixo.com.br</FooterLine>
          <FooterLine Icon={WhatsappLogo}>(11) 99999-9999</FooterLine>
          <FooterLine Icon={MapPin}>Atendimentos online</FooterLine>
        </FooterColumn>

        <FooterColumn title="SIGA NO INSTAGRAM">
          <p className="text-[13.5px] text-[color:var(--landing-bg)]/70">@vidaemeixo</p>
          <div className="mt-3 flex items-center gap-3">
            {[InstagramLogo, YoutubeLogo, LinkedinLogo].map((Icon, idx) => (
              <a
                key={idx}
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[color:var(--landing-gold)]/60 text-[color:var(--landing-gold)] transition-colors hover:bg-[color:var(--landing-gold)] hover:text-[#1F1F1F]"
                aria-label="Social"
              >
                <Icon size={16} weight="regular" />
              </a>
            ))}
          </div>
        </FooterColumn>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-6xl px-6 py-6 text-center text-[11px] tracking-[0.2em] text-[color:var(--landing-bg)]/50 md:px-12">
          © {new Date().getFullYear()} VIDA EM EIXO. TODOS OS DIREITOS RESERVADOS.
        </p>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[11px] font-semibold tracking-[0.24em] text-[color:var(--landing-bg)]">{title}</p>
      <div className="mt-5 space-y-3">{children}</div>
    </div>
  );
}

function FooterLine({
  Icon,
  children,
}: {
  Icon: React.ComponentType<{ size?: number | string; weight?: "light" | "regular"; className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <p className="flex items-center gap-3 text-[13.5px] text-[color:var(--landing-bg)]/70">
      <span className="flex h-7 w-7 items-center justify-center rounded-full border border-[color:var(--landing-gold)]/50 text-[color:var(--landing-gold)]">
        <Icon size={14} weight="regular" />
      </span>
      {children}
    </p>
  );
}
