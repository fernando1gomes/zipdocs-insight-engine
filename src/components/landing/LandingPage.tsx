import { Link } from "@tanstack/react-router";
import {
  Briefcase,
  FlowerLotus,
  Plant,
  Heart,
  PersonSimple,
  Sun,
  Star,
  CurrencyDollar,
  Target,
  ListBullets,
  Flag,
  Scales,
  Compass,
  MapTrifold,
  Mountains,
  ChartLineUp,
  EnvelopeSimple,
  WhatsappLogo,
  MapPin,
  InstagramLogo,
  YoutubeLogo,
  LinkedinLogo,
} from "@phosphor-icons/react";
import heroPortrait from "@/assets/hero-portrait.jpg.asset.json";

export function LandingPage() {
  return (
    <div className="landing-root min-h-screen">
      <LandingNav />
      <Hero />
      <LifeWheelSection />
      <Methodology />
      <LandingFooter />
    </div>
  );
}

/* ---------- Brand mark ---------- */
function BrandMark({ tone = "light" }: { tone?: "light" | "dark" }) {
  const color = tone === "light" ? "#F1ECDF" : "#1A3A3A";
  const accent = "#C9A227";
  return (
    <span
      className="font-display select-none"
      style={{ color, letterSpacing: "0.04em", fontSize: "1.35rem", fontWeight: 500 }}
    >
      VIDA <span style={{ fontStyle: "italic", fontWeight: 400, color: accent }}>em</span> EIXO
    </span>
  );
}

/* ---------- Nav ---------- */
function LandingNav() {
  const links = [
    { label: "Sobre", href: "#sobre" },
    { label: "Metodologia", href: "#metodologia" },
    { label: "Depoimentos", href: "#depoimentos" },
    { label: "Contato", href: "#contato" },
  ];
  return (
    <header
      className="absolute inset-x-0 top-0 z-20"
      style={{ background: "transparent" }}
    >
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-6 md:py-7">
        <Link to="/" aria-label="Vida em Eixo — início">
          <BrandMark tone="light" />
        </Link>
        <nav className="hidden items-center gap-10 md:flex">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-[0.72rem] font-medium uppercase tracking-[0.22em] text-[#F1ECDF]/85 transition hover:text-[color:var(--landing-gold)]"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <Link
          to="/auth"
          className="text-[0.72rem] font-medium uppercase tracking-[0.22em] text-[color:var(--landing-gold)] transition hover:text-[color:var(--landing-gold-soft)]"
        >
          Entrar
        </Link>
      </div>
    </header>
  );
}

/* ---------- Hero ---------- */
function Hero() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ background: "var(--landing-deep)" }}
    >
      <div className="mx-auto grid min-h-[680px] max-w-[1200px] grid-cols-1 items-center gap-12 px-6 pb-20 pt-32 md:grid-cols-[1.15fr_1fr] md:gap-16 md:pt-36">
        <div className="text-[#F1ECDF]">
          <span className="landing-rule mb-8 block" />
          <h1
            className="font-display text-[2.6rem] leading-[1.08] md:text-[4rem]"
            style={{ fontWeight: 500, letterSpacing: "-0.015em", color: "#F4EFE2" }}
          >
            Transforme<br />
            sua vida em um<br />
            sistema que funciona
          </h1>
          <p
            className="mt-8 max-w-md text-base leading-[1.7] md:text-[1.05rem]"
            style={{ color: "rgba(241,236,223,0.78)" }}
          >
            A metodologia completa para você sair do piloto automático e construir
            uma vida com propósito, equilíbrio e resultados reais.
          </p>
          <div className="mt-10">
            <Link to="/auth" className="landing-cta landing-cta-gold-outline">
              Comece sua jornada
            </Link>
          </div>
        </div>

        <div className="relative">
          <div
            className="relative mx-auto aspect-[3/4] w-full max-w-[460px] overflow-hidden"
            style={{ borderRadius: 2 }}
          >
            <img
              src={heroPortrait.url}
              alt="Mulher profissional refletindo, em ambiente sofisticado"
              className="h-full w-full object-cover"
              width={1024}
              height={1536}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Life Wheel Section ---------- */
const WHEEL_PILLARS = [
  { name: "Espiritualidade", Icon: FlowerLotus, angle: -90 },
  { name: "Saúde\ne Bem-estar", Icon: Plant, angle: -45 },
  { name: "Relacionamentos", Icon: Heart, angle: 0 },
  { name: "Desenvolvimento\nPessoal", Icon: PersonSimple, angle: 45 },
  { name: "Lazer e Diversão", Icon: Sun, angle: 90 },
  { name: "Realização\ne Propósito", Icon: Star, angle: 135 },
  { name: "Finanças", Icon: CurrencyDollar, angle: 180 },
  { name: "Carreira", Icon: Briefcase, angle: -135 },
];

const WHEEL_BENEFITS = [
  { Icon: Target, title: "Reconheça", text: "seus pontos fortes e desafios" },
  { Icon: ListBullets, title: "Defina", text: "prioridades com clareza" },
  { Icon: Flag, title: "Trace planos", text: "alinhados ao que realmente importa" },
  { Icon: Scales, title: "Equilibre", text: "suas áreas e avance com consistência" },
];

function EditorialWheel() {
  const SIZE = 460;
  const C = SIZE / 2;
  const R_OUTER = 200;
  const R_INNER = 70;
  const N = WHEEL_PILLARS.length;
  const seg = 360 / N;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const deep = "#1A3A3A";
  const gold = "#C9A227";

  return (
    <div className="relative mx-auto w-full max-w-[460px]">
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="h-auto w-full">
        {/* outer ring */}
        <circle cx={C} cy={C} r={R_OUTER} fill="none" stroke={deep} strokeWidth={1.5} />
        {/* inner ring (hub border) */}
        <circle cx={C} cy={C} r={R_INNER} fill={deep} stroke={gold} strokeWidth={1} />
        {/* dividers */}
        {WHEEL_PILLARS.map((_, i) => {
          const a = toRad(-90 - seg / 2 + i * seg);
          const x1 = C + R_INNER * Math.cos(a);
          const y1 = C + R_INNER * Math.sin(a);
          const x2 = C + R_OUTER * Math.cos(a);
          const y2 = C + R_OUTER * Math.sin(a);
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={gold}
              strokeWidth={0.8}
              opacity={0.7}
            />
          );
        })}
        {/* hub text */}
        <text
          x={C}
          y={C - 10}
          textAnchor="middle"
          dominantBaseline="middle"
          fontFamily='"Playfair Display", serif'
          fontSize="13"
          letterSpacing="2"
          fill="#F1ECDF"
        >
          VIDA
        </text>
        <text
          x={C}
          y={C + 6}
          textAnchor="middle"
          dominantBaseline="middle"
          fontFamily='"Playfair Display", serif'
          fontStyle="italic"
          fontSize="11"
          letterSpacing="1"
          fill={gold}
        >
          em
        </text>
        <text
          x={C}
          y={C + 22}
          textAnchor="middle"
          dominantBaseline="middle"
          fontFamily='"Playfair Display", serif'
          fontSize="13"
          letterSpacing="2"
          fill="#F1ECDF"
        >
          EIXO
        </text>
      </svg>

      {/* labels + icons absolutely positioned around */}
      {WHEEL_PILLARS.map((p) => {
        const labelR = R_OUTER - 56;
        const iconR = R_OUTER - 30;
        const a = toRad(p.angle);
        const lx = C + labelR * Math.cos(a);
        const ly = C + labelR * Math.sin(a);
        const ix = C + iconR * Math.cos(a);
        const iy = C + iconR * Math.sin(a);
        return (
          <div key={p.name} className="pointer-events-none absolute inset-0">
            <div
              className="absolute flex items-center justify-center"
              style={{
                left: `${(ix / SIZE) * 100}%`,
                top: `${(iy / SIZE) * 100}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <p.Icon size={22} weight="light" color={deep} />
            </div>
            <div
              className="absolute text-center"
              style={{
                left: `${(lx / SIZE) * 100}%`,
                top: `${(ly / SIZE) * 100}%`,
                transform: "translate(-50%, -50%)",
                width: 96,
              }}
            >
              <span
                className="block whitespace-pre-line text-[0.62rem] font-medium uppercase leading-[1.3] tracking-[0.14em]"
                style={{ color: deep }}
              >
                {p.name}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function LifeWheelSection() {
  return (
    <section id="sobre" className="bg-[color:var(--landing-bg)] py-24 md:py-32">
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-12 px-6 lg:grid-cols-[1fr_1.1fr_1fr]">
        {/* Left copy */}
        <div>
          <p className="eyebrow">Sua vida, em equilíbrio</p>
          <h2
            className="mt-5 font-display text-[2rem] leading-[1.15] md:text-[2.6rem]"
            style={{ fontWeight: 500, color: "var(--landing-ink)" }}
          >
            Uma visão<br />completa de<br />quem você é.
          </h2>
          <p className="mt-6 max-w-[320px] text-[0.95rem] leading-[1.7] text-[color:var(--landing-ink-soft)]">
            A Roda da Vida mostra onde você está hoje em cada área essencial e
            revela onde pode crescer para viver com mais leveza e realização.
          </p>
          <div className="mt-8">
            <Link to="/auth" className="landing-cta landing-cta-solid">
              Avalie sua roda da vida
            </Link>
          </div>
        </div>

        {/* Center wheel */}
        <div className="order-first lg:order-none">
          <EditorialWheel />
        </div>

        {/* Right benefits */}
        <div className="space-y-7">
          {WHEEL_BENEFITS.map((b) => (
            <div key={b.title} className="flex items-start gap-4">
              <div
                className="flex h-11 w-11 shrink-0 items-center justify-center"
                style={{
                  border: "1px solid var(--landing-gold)",
                  borderRadius: 999,
                  color: "var(--landing-gold-deep)",
                }}
              >
                <b.Icon size={20} weight="light" />
              </div>
              <div>
                <h3
                  className="text-[0.78rem] font-semibold uppercase tracking-[0.18em]"
                  style={{ color: "var(--landing-ink)", fontFamily: "var(--font-sans)" }}
                >
                  {b.title}
                </h3>
                <p className="mt-1 text-[0.92rem] leading-[1.55] text-[color:var(--landing-ink-soft)]">
                  {b.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Methodology ---------- */
const STEPS = [
  {
    n: "01",
    Icon: Compass,
    title: "Diagnóstico\ne Clareza",
    text: "Entenda onde você está hoje e o que precisa mudar para chegar onde deseja.",
  },
  {
    n: "02",
    Icon: MapTrifold,
    title: "Plano\nPersonalizado",
    text: "Criamos um plano estratégico alinhado aos seus objetivos e valores.",
  },
  {
    n: "03",
    Icon: Mountains,
    title: "Ação com\nFoco",
    text: "Você entra em ação com método, foco e acompanhamento contínuo.",
  },
  {
    n: "04",
    Icon: ChartLineUp,
    title: "Resultados\ne Evolução",
    text: "Celebre conquistas, ajuste a rota e continue evoluindo com consistência.",
  },
];

function Methodology() {
  return (
    <section
      id="metodologia"
      className="bg-[color:var(--landing-bg)] pb-28 pt-8 md:pb-32"
    >
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.05fr_1fr] md:items-end">
          <div>
            <p className="eyebrow">Metodologia Vida em Eixo</p>
            <span className="landing-rule mt-4 block" style={{ width: 48 }} />
            <h2
              className="mt-5 font-display text-[2rem] leading-[1.15] md:text-[2.6rem]"
              style={{ fontWeight: 500, color: "var(--landing-ink)" }}
            >
              Um caminho estruturado<br />para resultados reais.
            </h2>
          </div>
          <p className="max-w-md text-[0.95rem] leading-[1.7] text-[color:var(--landing-ink-soft)] md:pb-3">
            Nossa metodologia combina estratégia, autoconhecimento e ação para
            transformar sua vida de dentro para fora.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s) => (
            <article
              key={s.n}
              className="flex flex-col items-center bg-white px-8 py-10 text-center transition hover:-translate-y-1 hover:shadow-[0_18px_40px_-22px_rgba(26,58,58,0.25)]"
              style={{ border: "1px solid var(--landing-line)", borderRadius: 4 }}
            >
              <span
                className="font-display text-[2.25rem] leading-none"
                style={{ color: "var(--landing-gold)", fontWeight: 500 }}
              >
                {s.n}
              </span>
              <s.Icon
                size={36}
                weight="light"
                className="mt-6"
                color="var(--landing-gold)"
              />
              <h3
                className="mt-6 whitespace-pre-line text-[0.82rem] font-semibold uppercase tracking-[0.2em]"
                style={{ color: "var(--landing-ink)", fontFamily: "var(--font-sans)" }}
              >
                {s.title}
              </h3>
              <p className="mt-4 text-[0.88rem] leading-[1.6] text-[color:var(--landing-ink-soft)]">
                {s.text}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Footer ---------- */
function LandingFooter() {
  return (
    <footer
      id="contato"
      className="text-[#F1ECDF]"
      style={{ background: "var(--landing-deep)" }}
    >
      <div className="mx-auto max-w-[1200px] px-6 pb-10 pt-20">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          <div>
            <BrandMark tone="light" />
            <p
              className="mt-5 max-w-[240px] text-[0.85rem] leading-[1.65]"
              style={{ color: "rgba(241,236,223,0.7)" }}
            >
              Coaching e desenvolvimento pessoal para quem quer viver com
              propósito, equilíbrio e liberdade.
            </p>
            <p
              className="mt-5 font-display italic"
              style={{ color: "var(--landing-gold)", fontSize: "0.95rem" }}
            >
              Sua vida. Seu eixo. Suas escolhas.
            </p>
          </div>

          <FooterCol
            title="Navegação"
            items={[
              { label: "Sobre", href: "#sobre" },
              { label: "Metodologia", href: "#metodologia" },
              { label: "Depoimentos", href: "#depoimentos" },
              { label: "Contato", href: "#contato" },
            ]}
          />

          <div>
            <FooterTitle>Contato</FooterTitle>
            <ul className="mt-5 space-y-3 text-[0.88rem]" style={{ color: "rgba(241,236,223,0.78)" }}>
              <li className="flex items-center gap-3">
                <EnvelopeSimple size={16} weight="light" color="#C9A227" />
                contato@vidaemeixo.com.br
              </li>
              <li className="flex items-center gap-3">
                <WhatsappLogo size={16} weight="light" color="#C9A227" />
                (11) 99999-9999
              </li>
              <li className="flex items-center gap-3">
                <MapPin size={16} weight="light" color="#C9A227" />
                Atendimentos online
              </li>
            </ul>
          </div>

          <div>
            <FooterTitle>Siga nas redes</FooterTitle>
            <p className="mt-5 text-[0.88rem]" style={{ color: "rgba(241,236,223,0.78)" }}>
              @vidaemeixo
            </p>
            <div className="mt-5 flex items-center gap-3">
              {[InstagramLogo, YoutubeLogo, LinkedinLogo].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="rede social"
                  className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-[color:var(--landing-gold)] hover:text-[color:var(--landing-deep)]"
                  style={{ border: "1px solid var(--landing-gold)", color: "var(--landing-gold)" }}
                >
                  <Icon size={18} weight="light" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div
          className="mt-16 border-t pt-6 text-center text-[0.78rem]"
          style={{ borderColor: "rgba(241,236,223,0.12)", color: "rgba(241,236,223,0.55)" }}
        >
          © {new Date().getFullYear()} Vida em Eixo. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}

function FooterTitle({ children }: { children: React.ReactNode }) {
  return (
    <h4
      className="text-[0.72rem] font-semibold uppercase tracking-[0.22em]"
      style={{ color: "#F1ECDF", fontFamily: "var(--font-sans)" }}
    >
      {children}
    </h4>
  );
}

function FooterCol({
  title,
  items,
}: {
  title: string;
  items: { label: string; href: string }[];
}) {
  return (
    <div>
      <FooterTitle>{title}</FooterTitle>
      <ul className="mt-5 space-y-3 text-[0.88rem]">
        {items.map((i) => (
          <li key={i.label}>
            <a
              href={i.href}
              className="transition hover:text-[color:var(--landing-gold)]"
              style={{ color: "rgba(241,236,223,0.78)" }}
            >
              {i.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}