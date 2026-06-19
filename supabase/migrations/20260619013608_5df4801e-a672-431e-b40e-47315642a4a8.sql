
DELETE FROM public.pillar_criteria WHERE pillar_id <> 10;

INSERT INTO public.pillar_criteria (pillar_id, key, label, question_text, order_index) VALUES
-- 1 Saúde e disposição
(1,'sono','Sono','Dorme bem e acorda disposto',1),
(1,'alimentacao','Alimentação','Alimenta-se com equilíbrio e consciência',2),
(1,'exercicio','Exercício','Pratica atividade física regularmente',3),
(1,'energia','Energia','Tem disposição para trabalhar, viver e se relacionar',4),
(1,'prevencao','Prevenção','Faz exames, cuida do corpo e não espera adoecer',5),
(1,'habitos','Hábitos','Não vive dominado por vícios, excessos ou negligência',6),
-- 2 Emocional
(2,'autocontrole','Autocontrole','Não explode, não se desespera, não age por impulso',1),
(2,'clareza_emocional','Clareza emocional','Sabe identificar o que sente',2),
(2,'maturidade','Maturidade','Responde com consciência, não apenas reage',3),
(2,'cura_interior','Cura interior','Não vive preso a culpa, mágoa, medo ou rejeição',4),
(2,'resiliencia','Resiliência','Consegue passar por pressão sem se destruir',5),
(2,'responsabilidade','Responsabilidade','Para de culpar os outros e assume sua vida',6),
-- 3 Família
(3,'presenca','Presença','Você participa da vida da família',1),
(3,'dialogo','Diálogo','Há conversa sincera e respeitosa',2),
(3,'perdao','Perdão','Mágoas são tratadas, não acumuladas',3),
(3,'apoio','Apoio','Um fortalece o outro',4),
(3,'ordem','Ordem','Cada um ocupa seu papel: pai, mãe, filho, irmão',5),
(3,'amor_pratico','Amor prático','Amor demonstrado em atitudes, tempo e cuidado',6),
-- 4 Relacionamento amoroso
(4,'respeito','Respeito','Não há humilhação, agressão ou desprezo',1),
(4,'admiracao','Admiração','Um valoriza o outro',2),
(4,'dialogo','Diálogo','Conflitos são conversados com maturidade',3),
(4,'intimidade','Intimidade','Existe conexão emocional, física e espiritual',4),
(4,'parceria','Parceria','Os dois caminham na mesma direção',5),
(4,'fidelidade','Fidelidade','Há lealdade, transparência e confiança',6),
-- 5 Social e amizades
(5,'amizades_saudaveis','Amizades saudáveis','Tem pessoas boas por perto',1),
(5,'troca','Troca','Relações têm apoio, leveza e reciprocidade',2),
(5,'pertencimento','Pertencimento','Você se sente parte de bons ambientes',3),
(5,'influencia_positiva','Influência positiva','Suas relações te aproximam da sua melhor versão',4),
(5,'limites','Limites','Sabe dizer não a relações tóxicas',5),
(5,'presenca','Presença','Cultiva vínculos, não vive isolado',6),
-- 6 Profissional e carreira
(6,'competencia','Competência','É bom no que faz',1),
(6,'crescimento','Crescimento','Está evoluindo profissionalmente',2),
(6,'resultado','Resultado','Gera entrega concreta',3),
(6,'reconhecimento','Reconhecimento','Seu valor é percebido pelo mercado',4),
(6,'prosperidade','Prosperidade','Sua carreira gera retorno financeiro adequado',5),
(6,'proposito','Propósito','Seu trabalho tem sentido para você',6),
-- 7 Financeiro
(7,'organizacao','Organização','Sabe quanto ganha, gasta, deve e investe',1),
(7,'controle','Controle','Não vive no caos financeiro',2),
(7,'reserva','Reserva','Tem segurança para emergências',3),
(7,'prosperidade','Prosperidade','Ganha de forma compatível com seu potencial',4),
(7,'investimento','Investimento','Faz o dinheiro crescer',5),
(7,'mentalidade','Mentalidade','Não tem crenças destrutivas sobre dinheiro',6),
-- 8 Intelectual e aprendizado
(8,'leitura','Leitura','Lê ou estuda com frequência',1),
(8,'aprendizado','Aprendizado','Busca novos conhecimentos',2),
(8,'humildade','Humildade','Reconhece que sempre pode aprender mais',3),
(8,'aplicacao','Aplicação','Coloca em prática o que aprende',4),
(8,'mentalidade','Mentalidade','Tem mente aberta, flexível e evolutiva',5),
(8,'capacitacao','Capacitação','Investe em cursos, mentorias, treinamentos ou experiências',6),
-- 9 Espiritualidade e sentido
(9,'fe_viva','Fé viva','Não é apenas discurso, é prática',1),
(9,'oracao','Oração / meditação','Tem momentos de conexão espiritual',2),
(9,'valores','Valores','Vive de acordo com princípios',3),
(9,'gratidao','Gratidão','Reconhece bênçãos e aprendizados',4),
(9,'servico','Serviço','Usa sua vida para fazer o bem',5),
(9,'paz_interior','Paz interior','Tem confiança, entrega e direção',6),
-- 11 Contribuição e legado
(11,'servico','Serviço','Ajuda pessoas de forma prática',1),
(11,'generosidade','Generosidade','Compartilha tempo, conhecimento ou recursos',2),
(11,'impacto','Impacto','Sua presença melhora ambientes',3),
(11,'legado','Legado','Constrói algo que permanece',4),
(11,'responsabilidade_social','Responsabilidade social','Entende que sua vida influencia outras vidas',5),
(11,'amor_ao_proximo','Amor ao próximo','Contribui sem esperar sempre algo em troca',6);
