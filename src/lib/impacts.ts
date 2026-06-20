import { PILLAR_DEFAULTS, type PillarIcon } from "@/lib/pillars";

export type Intensity = "forte" | "medio" | "leve";
export type Influence = "muito_alto" | "alto" | "medio_alto" | "medio" | "baixo";

export interface PillarImpactRow {
  target: string;
  intensity: Intensity;
  reason: string;
}

export interface PillarImpactData {
  systemPillarId: number;
  displayName: string;
  shortDisplay: string;
  icon: string;
  Icon: PillarIcon;
  directCount: number;
  influence: Influence;
  influenceWeight: number;
  intro: string;
  impacts: PillarImpactRow[];
  ifImproves: string[];
  ifWorsens: string[];
}

export const INFLUENCE_WEIGHT: Record<Influence, number> = {
  muito_alto: 4,
  alto: 3,
  medio_alto: 2.5,
  medio: 2,
  baixo: 1,
};

export function influenceLabel(i: Influence): string {
  switch (i) {
    case "muito_alto": return "Muito alto";
    case "alto": return "Alto";
    case "medio_alto": return "Médio alto";
    case "medio": return "Médio";
    case "baixo": return "Baixo";
  }
}

export function intensityLabel(i: Intensity): string {
  return i === "forte" ? "Forte" : i === "medio" ? "Médio" : "Leve";
}

export function intensityClasses(i: Intensity): string {
  switch (i) {
    case "forte":
      return "bg-[color:var(--critical-soft)] text-[color:var(--critical)]";
    case "medio":
      return "bg-[color:var(--attention-soft)] text-[color:var(--attention)]";
    case "leve":
      return "bg-secondary text-muted-foreground";
  }
}

export function influenceClasses(i: Influence): string {
  switch (i) {
    case "muito_alto":
      return "bg-[color:var(--critical-soft)] text-[color:var(--critical)]";
    case "alto":
      return "bg-[color:var(--attention-soft)] text-[color:var(--attention)]";
    case "medio_alto":
      return "bg-[color:var(--focus)]/15 text-[color:var(--focus)]";
    case "medio":
      return "bg-[color:var(--balanced-soft)] text-[color:var(--balanced)]";
    case "baixo":
      return "bg-secondary text-muted-foreground";
  }
}

export const PILLAR_IMPACTS: PillarImpactData[] = [
  {
    systemPillarId: 11,
    displayName: "Saúde e disposição",
    shortDisplay: "Saúde",
    icon: "🏃",
    directCount: 9,
    influence: "muito_alto",
    influenceWeight: INFLUENCE_WEIGHT.muito_alto,
    intro: "Quando este pilar melhora, ele gera força, clareza e energia para outras áreas. Quando piora, gera efeito dominó negativo.",
    impacts: [
      { target: "Equilíbrio emocional", intensity: "forte", reason: "Corpo cansado aumenta irritação, ansiedade e desânimo." },
      { target: "Carreira e profissão", intensity: "forte", reason: "Mais energia melhora produtividade, foco e performance." },
      { target: "Família", intensity: "medio", reason: "Mais disposição aumenta presença, paciência e convivência." },
      { target: "Relacionamento amoroso", intensity: "medio", reason: "Saúde influencia humor, intimidade, carinho e disponibilidade." },
      { target: "Recursos financeiros", intensity: "medio", reason: "Boa saúde melhora capacidade de produzir e reduz custos com doenças." },
      { target: "Desenvolvimento intelectual", intensity: "medio", reason: "Sono, energia e vitalidade melhoram concentração e aprendizado." },
      { target: "Realização e propósito", intensity: "medio", reason: "Vitalidade sustenta a execução de metas e projetos." },
      { target: "Vida social", intensity: "leve", reason: "Mais disposição facilita convivência e participação social." },
      { target: "Espiritualidade", intensity: "leve", reason: "Corpo equilibrado favorece disciplina, silêncio, oração e presença." },
    ],
    ifImproves: ["Mais energia", "Mais clareza", "Mais disciplina", "Mais produtividade", "Mais presença nos relacionamentos"],
    ifWorsens: ["Mais cansaço", "Mais irritação", "Menos foco", "Menos produtividade", "Mais conflitos e desânimo"],
  },
  {
    systemPillarId: 8,
    displayName: "Desenvolvimento intelectual",
    shortDisplay: "Intelectual",
    icon: "📖",
    directCount: 6,
    influence: "medio_alto",
    influenceWeight: INFLUENCE_WEIGHT.medio_alto,
    intro: "Aprender amplia consciência e capacidade de gerar valor. Estagnação limita decisões e oportunidades.",
    impacts: [
      { target: "Carreira e profissão", intensity: "forte", reason: "Conhecimento aplicado aumenta competência e resultado profissional." },
      { target: "Recursos financeiros", intensity: "forte", reason: "Educação melhora decisões financeiras e capacidade de gerar renda." },
      { target: "Equilíbrio emocional", intensity: "medio", reason: "Conhecimento sobre si mesmo amplia consciência e autocontrole." },
      { target: "Realização e propósito", intensity: "medio", reason: "Aprendizado amplia visão de futuro e clareza de direção." },
      { target: "Família", intensity: "medio", reason: "Educação emocional e relacional melhora convivência." },
      { target: "Contribuição social", intensity: "medio", reason: "Quem aprende mais pode ensinar, servir e impactar mais pessoas." },
    ],
    ifImproves: ["Mais competência", "Mais clareza", "Mais oportunidades", "Melhores decisões", "Mais capacidade de gerar valor"],
    ifWorsens: ["Estagnação", "Decisões fracas", "Menos oportunidades", "Menor crescimento profissional", "Repetição de erros antigos"],
  },
  {
    systemPillarId: 2,
    displayName: "Equilíbrio emocional",
    shortDisplay: "Emocional",
    icon: "❤️",
    directCount: 10,
    influence: "muito_alto",
    influenceWeight: INFLUENCE_WEIGHT.muito_alto,
    intro: "A emoção governa decisões, relacionamentos e energia. Equilíbrio emocional acelera todos os outros pilares.",
    impacts: [
      { target: "Saúde e disposição", intensity: "forte", reason: "Emoções desreguladas afetam sono, alimentação, energia e bem-estar." },
      { target: "Desenvolvimento intelectual", intensity: "forte", reason: "Ansiedade, medo e confusão reduzem foco e aprendizado." },
      { target: "Realização e propósito", intensity: "forte", reason: "Instabilidade emocional rouba clareza, direção e constância." },
      { target: "Recursos financeiros", intensity: "forte", reason: "Medo, impulsividade e ansiedade geram decisões financeiras ruins." },
      { target: "Família", intensity: "forte", reason: "Reatividade emocional prejudica diálogo, presença e respeito." },
      { target: "Relacionamento amoroso", intensity: "forte", reason: "Ciúme, raiva, carência e insegurança destroem conexão." },
      { target: "Vida social", intensity: "medio", reason: "Instabilidade emocional gera isolamento, conflitos ou dependência." },
      { target: "Espiritualidade", intensity: "medio", reason: "Culpa, medo e revolta enfraquecem paz interior e fé prática." },
      { target: "Carreira e profissão", intensity: "forte", reason: "Pressão emocional afeta liderança, produtividade e decisões." },
      { target: "Contribuição social", intensity: "medio", reason: "Quem está emocionalmente quebrado tem menos força para servir." },
    ],
    ifImproves: ["Mais autocontrole", "Mais clareza nas decisões", "Mais paz nos relacionamentos", "Mais foco", "Mais constância"],
    ifWorsens: ["Explosões emocionais", "Ansiedade", "Conflitos", "Impulsividade", "Autossabotagem"],
  },
  {
    systemPillarId: 10,
    displayName: "Realização e propósito",
    shortDisplay: "Propósito",
    icon: "🎯",
    directCount: 6,
    influence: "medio_alto",
    influenceWeight: INFLUENCE_WEIGHT.medio_alto,
    intro: "Propósito dá direção. Sem ele as ações perdem sentido; com ele cada esforço se torna coerente.",
    impacts: [
      { target: "Equilíbrio emocional", intensity: "forte", reason: "Propósito gera força interna, esperança e resiliência." },
      { target: "Carreira e profissão", intensity: "forte", reason: "Direção clara melhora escolhas profissionais." },
      { target: "Recursos financeiros", intensity: "medio", reason: "Objetivos claros organizam prioridades financeiras." },
      { target: "Saúde e disposição", intensity: "medio", reason: "Quem tem propósito tende a cuidar melhor da energia." },
      { target: "Espiritualidade", intensity: "medio", reason: "Propósito se conecta com sentido de vida e fé prática." },
      { target: "Contribuição social", intensity: "medio", reason: "Propósito geralmente transborda em serviço e legado." },
    ],
    ifImproves: ["Mais direção", "Mais motivação", "Mais coragem", "Mais foco", "Mais sentido de vida"],
    ifWorsens: ["Sensação de vazio", "Falta de direção", "Desânimo", "Procrastinação", "Escolhas sem coerência"],
  },
  {
    systemPillarId: 7,
    displayName: "Recursos financeiros",
    shortDisplay: "Financeiro",
    icon: "💵",
    directCount: 8,
    influence: "alto",
    influenceWeight: INFLUENCE_WEIGHT.alto,
    intro: "Dinheiro é energia. Bem administrado libera paz e escolhas; mal administrado contamina vários pilares.",
    impacts: [
      { target: "Equilíbrio emocional", intensity: "forte", reason: "Dívidas e descontrole geram medo, vergonha e ansiedade." },
      { target: "Saúde e disposição", intensity: "medio", reason: "Recursos permitem bons cuidados e reduzem estresse financeiro." },
      { target: "Desenvolvimento intelectual", intensity: "medio", reason: "Dinheiro permite investir em cursos, livros e capacitação." },
      { target: "Família", intensity: "forte", reason: "Dinheiro desorganizado gera brigas, insegurança e pressão." },
      { target: "Relacionamento amoroso", intensity: "forte", reason: "Finanças são fonte frequente de conflito no casal." },
      { target: "Vida social", intensity: "medio", reason: "Limitações financeiras afetam convivência, lazer e autoestima." },
      { target: "Carreira e profissão", intensity: "medio", reason: "Recursos permitem investir em ferramentas, imagem e capacitação." },
      { target: "Contribuição social", intensity: "medio", reason: "Quem prospera consegue contribuir mais com pessoas e causas." },
    ],
    ifImproves: ["Mais paz", "Mais segurança", "Mais liberdade", "Mais capacidade de investir", "Mais contribuição"],
    ifWorsens: ["Dívidas", "Ansiedade", "Brigas familiares", "Limitação de escolhas", "Vergonha e isolamento"],
  },
  {
    systemPillarId: 3,
    displayName: "Família",
    shortDisplay: "Família",
    icon: "👨‍👩‍👧‍👦",
    directCount: 8,
    influence: "alto",
    influenceWeight: INFLUENCE_WEIGHT.alto,
    intro: "Família é base emocional e relacional. Fortalecida, sustenta; ferida, drena energia de toda a vida.",
    impacts: [
      { target: "Equilíbrio emocional", intensity: "forte", reason: "Família pode ser fonte de cura, segurança ou feridas profundas." },
      { target: "Saúde e disposição", intensity: "medio", reason: "Ambiente familiar afeta estresse, sono e hábitos." },
      { target: "Realização e propósito", intensity: "medio", reason: "Apoio familiar fortalece direção e coragem." },
      { target: "Recursos financeiros", intensity: "medio", reason: "Família desorganizada pode gerar gastos, conflitos e instabilidade." },
      { target: "Relacionamento amoroso", intensity: "forte", reason: "Padrões familiares influenciam diretamente o casamento." },
      { target: "Vida social", intensity: "medio", reason: "Conflitos familiares podem gerar isolamento ou insegurança social." },
      { target: "Espiritualidade", intensity: "medio", reason: "Família pode fortalecer ou enfraquecer fé, valores e comunhão." },
      { target: "Carreira e profissão", intensity: "medio", reason: "Problemas familiares roubam foco, energia e produtividade." },
    ],
    ifImproves: ["Mais segurança emocional", "Mais apoio", "Mais paz em casa", "Mais força para crescer", "Mais pertencimento"],
    ifWorsens: ["Mágoas", "Conflitos", "Culpa", "Desconexão", "Desgaste emocional"],
  },
  {
    systemPillarId: 4,
    displayName: "Relacionamento amoroso",
    shortDisplay: "Relacionamento",
    icon: "💕",
    directCount: 7,
    influence: "alto",
    influenceWeight: INFLUENCE_WEIGHT.alto,
    intro: "O parceiro é amplificador: amplia o que está bom e expõe o que está mal em outras áreas.",
    impacts: [
      { target: "Equilíbrio emocional", intensity: "forte", reason: "Relação ruim gera dor, ansiedade, frustração e insegurança." },
      { target: "Saúde e disposição", intensity: "medio", reason: "Conflitos afetivos prejudicam sono, energia e bem-estar." },
      { target: "Família", intensity: "forte", reason: "O casal influencia diretamente o clima emocional da casa." },
      { target: "Recursos financeiros", intensity: "medio", reason: "Casal desalinhado tende a brigar por dinheiro e prioridades." },
      { target: "Carreira e profissão", intensity: "medio", reason: "Relação instável rouba foco, energia e produtividade." },
      { target: "Espiritualidade", intensity: "medio", reason: "Falta de paz no relacionamento afeta fé e comunhão." },
      { target: "Vida social", intensity: "medio", reason: "Relacionamento tóxico pode gerar isolamento social." },
    ],
    ifImproves: ["Mais paz emocional", "Mais parceria", "Mais intimidade", "Mais força familiar", "Mais segurança"],
    ifWorsens: ["Brigas", "Distanciamento", "Ciúme", "Insegurança", "Perda de admiração"],
  },
  {
    systemPillarId: 5,
    displayName: "Vida social",
    shortDisplay: "Social",
    icon: "👥",
    directCount: 5,
    influence: "medio",
    influenceWeight: INFLUENCE_WEIGHT.medio,
    intro: "Você se torna parecido com quem convive. Boas conexões aceleram crescimento; más conexões corroem.",
    impacts: [
      { target: "Equilíbrio emocional", intensity: "medio", reason: "Boas amizades fortalecem autoestima, pertencimento e apoio." },
      { target: "Carreira e profissão", intensity: "medio", reason: "Rede de contatos pode abrir oportunidades e parcerias." },
      { target: "Espiritualidade", intensity: "medio", reason: "Comunidade fortalece valores e prática espiritual." },
      { target: "Saúde e disposição", intensity: "leve", reason: "Ambientes sociais influenciam hábitos e estilo de vida." },
      { target: "Realização e propósito", intensity: "medio", reason: "Pessoas certas inspiram crescimento e direção." },
    ],
    ifImproves: ["Mais pertencimento", "Mais apoio", "Mais oportunidades", "Mais leveza", "Mais bons ambientes"],
    ifWorsens: ["Isolamento", "Influências negativas", "Solidão", "Comparação", "Falta de apoio"],
  },
  {
    systemPillarId: 9,
    displayName: "Espiritualidade",
    shortDisplay: "Espiritualidade",
    icon: "🧘",
    directCount: 7,
    influence: "alto",
    influenceWeight: INFLUENCE_WEIGHT.alto,
    intro: "Espiritualidade orienta valores e dá raiz. Sem ela, vida vira reatividade; com ela, vira coerência.",
    impacts: [
      { target: "Equilíbrio emocional", intensity: "forte", reason: "Fé prática gera paz, esperança, perdão e resiliência." },
      { target: "Realização e propósito", intensity: "forte", reason: "Espiritualidade ajuda a dar sentido à vida." },
      { target: "Família", intensity: "medio", reason: "Valores espirituais fortalecem amor, perdão e serviço." },
      { target: "Relacionamento amoroso", intensity: "medio", reason: "Princípios fortalecem compromisso, respeito e fidelidade." },
      { target: "Recursos financeiros", intensity: "medio", reason: "Valores influenciam honestidade, generosidade e administração." },
      { target: "Carreira e profissão", intensity: "medio", reason: "Propósito, ética e serviço afetam decisões profissionais." },
      { target: "Contribuição social", intensity: "forte", reason: "Espiritualidade desperta serviço ao próximo e legado." },
    ],
    ifImproves: ["Mais paz", "Mais esperança", "Mais coerência", "Mais perdão", "Mais sentido"],
    ifWorsens: ["Vazio interior", "Perda de valores", "Culpa", "Falta de direção", "Menos serviço"],
  },
  {
    systemPillarId: 6,
    displayName: "Carreira e profissão",
    shortDisplay: "Carreira",
    icon: "💼",
    directCount: 7,
    influence: "alto",
    influenceWeight: INFLUENCE_WEIGHT.alto,
    intro: "Carreira é vitrine e arena. Reflete competências e expõe o impacto nas outras áreas da vida.",
    impacts: [
      { target: "Recursos financeiros", intensity: "forte", reason: "Carreira é uma das principais fontes de renda." },
      { target: "Equilíbrio emocional", intensity: "forte", reason: "Estagnação ou fracasso profissional afeta autoestima e segurança." },
      { target: "Saúde e disposição", intensity: "medio", reason: "Excesso de trabalho ou insatisfação afetam corpo e energia." },
      { target: "Família", intensity: "medio", reason: "Trabalho desequilibrado rouba presença familiar." },
      { target: "Relacionamento amoroso", intensity: "medio", reason: "Estresse profissional entra no relacionamento." },
      { target: "Realização e propósito", intensity: "forte", reason: "Profissão pode expressar ou bloquear propósito." },
      { target: "Vida social", intensity: "medio", reason: "Carreira amplia ou limita conexões e ambientes." },
    ],
    ifImproves: ["Mais renda", "Mais reconhecimento", "Mais autoestima", "Mais oportunidades", "Mais realização"],
    ifWorsens: ["Estagnação", "Insegurança financeira", "Frustração", "Excesso de estresse", "Perda de motivação"],
  },
  {
    systemPillarId: 1,
    displayName: "Contribuição social",
    shortDisplay: "Contribuição",
    icon: "🤝",
    directCount: 4,
    influence: "medio",
    influenceWeight: INFLUENCE_WEIGHT.medio,
    intro: "Servir devolve sentido. Contribuir conecta sua vida a algo maior que você.",
    impacts: [
      { target: "Espiritualidade", intensity: "forte", reason: "Servir fortalece fé, gratidão e coerência com valores." },
      { target: "Equilíbrio emocional", intensity: "medio", reason: "Ajudar gera significado, pertencimento e senso de utilidade." },
      { target: "Realização e propósito", intensity: "forte", reason: "Contribuição conecta vida a legado." },
      { target: "Vida social", intensity: "medio", reason: "Serviço amplia vínculos, comunidade e pertencimento." },
    ],
    ifImproves: ["Mais significado", "Mais gratidão", "Mais legado", "Mais conexão", "Mais senso de utilidade"],
    ifWorsens: ["Egoísmo", "Vazio", "Falta de legado", "Desconexão", "Menor senso de propósito"],
  },
];

export function getImpactBySystemId(id: number): PillarImpactData | undefined {
  return PILLAR_IMPACTS.find((p) => p.systemPillarId === id);
}

export function getImpactByDisplayName(name: string): PillarImpactData | undefined {
  return PILLAR_IMPACTS.find((p) => p.displayName === name);
}

export function priorityScore(currentScore: number, influence: Influence): number | null {
  if (!currentScore || currentScore <= 0) return null;
  return (10 - currentScore) * INFLUENCE_WEIGHT[influence];
}
