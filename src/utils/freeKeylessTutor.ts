import { KeyPhrase, ProficiencyLevel, ScenarioId } from '../types';

export interface KeylessChatResult {
  replyItalian: string;
  hasMistake: boolean;
  correctedItalian: string;
  explanation: string;
  replyTranslation?: string;
  suggestedNextReply: string;
  engineLabel: string;
}

interface ChromeLanguageModelSession {
  prompt: (input: string) => Promise<string>;
  destroy?: () => void;
}

interface ChromeLanguageModelStatic {
  availability?: () => Promise<'available' | 'readily' | 'after-download' | 'downloadable' | 'no' | 'unavailable'>;
  create: (options?: { systemPrompt?: string }) => Promise<ChromeLanguageModelSession>;
}

interface ChromeTranslatorInstance {
  translate: (text: string) => Promise<string>;
  destroy?: () => void;
}

interface ChromeTranslatorStatic {
  availability?: (opts: { sourceLanguage: string; targetLanguage: string }) => Promise<string>;
  create: (opts: { sourceLanguage: string; targetLanguage: string }) => Promise<ChromeTranslatorInstance>;
}

let lastPollinationsCallAt = 0;
const POLLINATIONS_MIN_INTERVAL_MS = 46_000;

function getChromeLanguageModel(): ChromeLanguageModelStatic | null {
  if (typeof window === 'undefined') return null;
  const g = window as unknown as {
    LanguageModel?: ChromeLanguageModelStatic;
    ai?: { languageModel?: ChromeLanguageModelStatic };
  };
  return g.LanguageModel || g.ai?.languageModel || null;
}

function getChromeTranslator(): ChromeTranslatorStatic | null {
  if (typeof window === 'undefined') return null;
  const g = window as unknown as {
    Translator?: ChromeTranslatorStatic;
    translation?: { createTranslator?: ChromeTranslatorStatic['create'] };
  };
  if (g.Translator) return g.Translator;
  if (g.translation?.createTranslator) {
    return { create: g.translation.createTranslator };
  }
  return null;
}

async function tryChromeBuiltInChat(
  scenarioId: ScenarioId,
  level: ProficiencyLevel,
  history: Array<{ sender: 'user' | 'marco'; text: string }>,
  userMessage: string,
  targetLanguageName?: string
): Promise<KeylessChatResult | null> {
  const LM = getChromeLanguageModel();
  if (!LM) return null;

  try {
    if (LM.availability) {
      const status = await LM.availability();
      if (status === 'no' || status === 'unavailable') return null;
    }

    const systemPrompt = `You are Marco, a friendly native Italian tutor. Scenario: ${scenarioId}. Level: ${level}.
Respond ONLY with valid JSON (no markdown) using these keys:
replyItalian (natural Italian, 1 short sentence + 1 short question, max 25 words),
hasMistake (boolean),
correctedItalian (corrected Italian or empty string),
explanation (1 short tip in simple Italian or empty string),
suggestedNextReply (1 short Italian reply hint, max 12 words)${
      targetLanguageName ? `, replyTranslation (translation of replyItalian into ${targetLanguageName})` : ''
    }.`;

    const session = await LM.create({ systemPrompt });
    try {
      const recent = history
        .slice(-2)
        .map((m) => `${m.sender === 'user' ? 'Studente' : 'Marco'}: ${m.text}`)
        .join('\n');
      const raw = await session.prompt(`${recent ? `${recent}\n` : ''}Studente: ${userMessage}`);
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (!jsonMatch) return null;
      const parsed = JSON.parse(jsonMatch[0]) as Partial<KeylessChatResult>;
      if (!parsed.replyItalian) return null;
      return {
        replyItalian: parsed.replyItalian.trim(),
        hasMistake: Boolean(parsed.hasMistake),
        correctedItalian: (parsed.correctedItalian || '').trim(),
        explanation: (parsed.explanation || '').trim(),
        replyTranslation: (parsed.replyTranslation || '').trim(),
        suggestedNextReply: (parsed.suggestedNextReply || 'Sì, volentieri! E tu?').trim(),
        engineLabel: 'AI Locale Browser',
      };
    } finally {
      session.destroy?.();
    }
  } catch {
    return null;
  }
}

async function tryClientPollinationsChat(
  scenarioId: ScenarioId,
  level: ProficiencyLevel,
  history: Array<{ sender: 'user' | 'marco'; text: string }>,
  userMessage: string,
  targetLanguageName?: string
): Promise<KeylessChatResult | null> {
  const now = Date.now();
  if (now - lastPollinationsCallAt < POLLINATIONS_MIN_INTERVAL_MS) {
    return null;
  }

  lastPollinationsCallAt = now;
  try {
    const recent = history
      .slice(-2)
      .map((m) => `${m.sender === 'user' ? 'Learner' : 'Marco'}: ${m.text}`)
      .join('\n');

    const res = await fetch('https://text.pollinations.ai/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(7000),
      body: JSON.stringify({
        model: 'openai',
        jsonMode: true,
        messages: [
          {
            role: 'system',
            content: `You are Marco, a friendly native Italian tutor in scenario "${scenarioId}" at level "${level}".
ALWAYS write replyItalian, correctedItalian, explanation, and suggestedNextReply strictly in Italian.
Return ONLY valid JSON with keys: replyItalian, hasMistake (boolean), correctedItalian, explanation, suggestedNextReply${
              targetLanguageName ? `, replyTranslation (translate replyItalian into ${targetLanguageName})` : ''
            }.`,
          },
          {
            role: 'user',
            content: `${recent ? `${recent}\n` : ''}Learner: "${userMessage}"`,
          },
        ],
      }),
    });

    if (!res.ok) {
      return null;
    }

    const rawText = await res.text();
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;
    const parsed = JSON.parse(jsonMatch[0]) as Partial<KeylessChatResult>;
    if (!parsed.replyItalian || /free limit reached/i.test(parsed.replyItalian)) {
      return null;
    }
    return {
      replyItalian: parsed.replyItalian.trim(),
      hasMistake: Boolean(parsed.hasMistake),
      correctedItalian: (parsed.correctedItalian || '').trim(),
      explanation: (parsed.explanation || '').trim(),
      replyTranslation: (parsed.replyTranslation || '').trim(),
      suggestedNextReply: (parsed.suggestedNextReply || 'Va bene, continuiamo pure!').trim(),
      engineLabel: 'AI Gratuita Browser',
    };
  } catch {
    return null;
  }
}

interface GrammarRule {
  pattern: RegExp;
  replace: (input: string) => string;
  explanation: string;
}

const GRAMMAR_RULES: GrammarRule[] = [
  {
    pattern: /\b(hello|hi|hey)\b/i,
    replace: (s) => s.replace(/\b(hello|hi|hey)\b/gi, 'Ciao'),
    explanation: 'In italiano si dice "Ciao" per salutare in modo amichevole.',
  },
  {
    pattern: /\bhow are you\b/i,
    replace: (s) => s.replace(/\bhow are you\b/gi, 'come stai'),
    explanation: '"How are you" in italiano si traduce "Come stai?".',
  },
  {
    pattern: /\bthank you|thanks|merci|shukran\b/i,
    replace: (s) => s.replace(/\b(thank you|thanks|merci|shukran)\b/gi, 'grazie'),
    explanation: 'In italiano per ringraziare si dice sempre "Grazie" o "Grazie mille".',
  },
  {
    pattern: /\bplease|s'il vous plaît|s'il te plaît\b/i,
    replace: (s) => s.replace(/\b(please|s'il vous plaît|s'il te plaît)\b/gi, 'per favore'),
    explanation: 'Usa "per favore" per chiedere qualcosa con gentilezza.',
  },
  {
    pattern: /\bbonjour\b/i,
    replace: (s) => s.replace(/\bbonjour\b/gi, 'Buongiorno'),
    explanation: 'In italiano il saluto del giorno è "Buongiorno".',
  },
  {
    pattern: /\bje suis\b/i,
    replace: (s) => s.replace(/\bje suis\b/gi, 'io sono'),
    explanation: 'In italiano si usa "io sono" (o semplicemente "sono").',
  },
  {
    pattern: /\bsono bene\b/i,
    replace: (s) => s.replace(/\bsono bene\b/gi, 'sto bene'),
    explanation: 'Per dire come ti senti si usa il verbo "stare": "Sto bene", non "Sono bene".',
  },
  {
    pattern: /\bio essere\b/i,
    replace: (s) => s.replace(/\bio essere\b/gi, 'io sono'),
    explanation: 'Il verbo "essere" alla prima persona singolare è "io sono".',
  },
  {
    pattern: /\bio avere\b/i,
    replace: (s) => s.replace(/\bio avere\b/gi, 'io ho'),
    explanation: 'Il verbo "avere" alla prima persona singolare è "io ho".',
  },
  {
    pattern: /\bio andare\b/i,
    replace: (s) => s.replace(/\bio andare\b/gi, 'io vado'),
    explanation: 'Il verbo "andare" con "io" diventa "vado".',
  },
  {
    pattern: /\bio volere\b/i,
    replace: (s) => s.replace(/\bio volere\b/gi, 'vorrei'),
    explanation: 'Per esprimere un desiderio in modo cortese si usa "vorrei" oppure "voglio".',
  },
  {
    pattern: /\bio piacere\b|\bio piace\b/i,
    replace: (s) => s.replace(/\b(io piacere|io piace)\b/gi, 'mi piace'),
    explanation: 'In italiano si dice "mi piace" (non "io piace").',
  },
  {
    pattern: /\bbuon giorno\b/i,
    replace: (s) => s.replace(/\bbuon giorno\b/gi, 'buongiorno'),
    explanation: '"Buongiorno" in italiano si scrive di solito tutto attaccato.',
  },
  {
    pattern: /\bcaffe\b/i,
    replace: (s) => s.replace(/\bcaffe\b/gi, 'caffè'),
    explanation: 'La parola "caffè" ha l’accento grave sulla lettera finale: è.',
  },
];

function analyzeItalianMessage(input: string): {
  hasMistake: boolean;
  correctedItalian: string;
  explanation: string;
} {
  let corrected = input.trim();
  const notes: string[] = [];

  for (const rule of GRAMMAR_RULES) {
    if (rule.pattern.test(corrected)) {
      corrected = rule.replace(corrected);
      notes.push(rule.explanation);
    }
  }

  if (notes.length > 0) {
    return {
      hasMistake: true,
      correctedItalian: corrected,
      explanation: notes[0],
    };
  }

  return {
    hasMistake: false,
    correctedItalian: '',
    explanation: '',
  };
}

interface TurnReply {
  reply: string;
  hint: string;
}

const SCENARIO_TURNS: Record<ScenarioId, Record<ProficiencyLevel, TurnReply[]>> = {
  conversation: {
    beginner: [
      {
        reply: 'Ciao! Che bello sentirti oggi. Come sta andando la tua giornata?',
        hint: 'Va tutto molto bene, grazie! E la tua?',
      },
      {
        reply: 'Ottimo! Di solito cosa ti piace fare nel tempo libero?',
        hint: 'Nel tempo libero mi piace ascoltare musica e viaggiare.',
      },
      {
        reply: 'Fantastico! Ti piace anche cucinare piatti italiani o preferisci la pizza al ristorante?',
        hint: 'Adoro la pizza margherita e la pasta fatta in casa!',
      },
      {
        reply: 'Ottima scelta! Stai parlando italiano benissimo. Quale parola nuova vuoi imparare oggi?',
        hint: 'Vorrei imparare nuove parole per viaggiare in Italia.',
      },
    ],
    intermediate: [
      {
        reply: 'Ciao! Mi fa davvero piacere chiacchierare con te. Cosa hai fatto di bello questa settimana?',
        hint: 'Ho lavorato molto, ma ieri sera sono uscito con degli amici.',
      },
      {
        reply: 'Bellissimo! C’è qualche città italiana che ti piacerebbe visitare prossimamente?',
        hint: 'Mi piacerebbe tantissimo visitare Firenze e Roma.',
      },
      {
        reply: 'Sono città meravigliose piene di storia e buon cibo. Preferisci il mare o la montagna?',
        hint: 'Sinceramente preferisco il mare, soprattutto d’estate.',
      },
      {
        reply: 'Hai proprio ragione! Come pensi di praticare l’italiano nei prossimi giorni?',
        hint: 'Vorrei parlare ogni giorno per dieci minuti con te.',
      },
    ],
    advanced: [
      {
        reply: 'Ciao! È un piacere confrontarmi con te in italiano. Quale argomento stimolante ti va di esplorare oggi?',
        hint: 'Mi piacerebbe parlare di come la tecnologia sta cambiando il lavoro.',
      },
      {
        reply: 'Tema attualissimo! Secondo te quali sono i vantaggi principali rispetto a dieci anni fa?',
        hint: 'Sicuramente la flessibilità, anche se serve attenzione all’equilibrio personale.',
      },
      {
        reply: 'Hai centrato perfettamente il punto. Pensi che il lavoro da remoto resterà la norma?',
        hint: 'Credo che il modello ibrido sia la soluzione più equilibrata.',
      },
      {
        reply: 'Analisi lucidissima, complimenti per la fluidità! Vuoi approfondire un altro tema?',
        hint: 'Sì, parliamo di cultura e cinema italiano.',
      },
    ],
  },
  airport: {
    beginner: [
      {
        reply: 'Buongiorno e benvenuto al check-in! Posso vedere il suo passaporto e il biglietto?',
        hint: 'Certo, ecco il mio passaporto e il biglietto.',
      },
      {
        reply: 'Perfetto, grazie! Ha un bagaglio da imbarcare in stiva o solo il bagaglio a mano?',
        hint: 'Ho solo una valigia piccola come bagaglio a mano.',
      },
      {
        reply: 'Benissimo! Preferisce un posto finestrino o corridoio per questo volo?',
        hint: 'Vorrei un posto finestrino, per favore.',
      },
      {
        reply: 'Ecco la carta d’imbarco: il gate è il numero 12. Buon viaggio!',
        hint: 'Grazie mille! Da che ora inizia l’imbarco?',
      },
    ],
    intermediate: [
      {
        reply: 'Buongiorno! Sta volando verso Roma o ha uno scalo intermedio?',
        hint: 'Ho un volo diretto per Roma, parto tra due ore.',
      },
      {
        reply: 'Ottimo, il volo è perfettamente in orario. Vuole aggiungere una valigia in stiva?',
        hint: 'Sì, vorrei imbarcare questa valigia e tenere lo zaino con me.',
      },
      {
        reply: 'Nessun problema, il peso rientra nel limite. Conosce già la strada per i controlli di sicurezza?',
        hint: 'Sì, grazie! Quanto tempo ci vuole a piedi fino al gate?',
      },
      {
        reply: 'Circa dieci minuti dopo i controlli. Le auguro un ottimo volo!',
        hint: 'Grazie per l’aiuto, buona giornata!',
      },
    ],
    advanced: [
      {
        reply: 'Buongiorno, benvenuto al banco assistenza. Come posso aiutarla con la sua coincidenza?',
        hint: 'Temo di perdere il secondo volo a causa di un ritardo alla partenza.',
      },
      {
        reply: 'Capisco la preoccupazione. Controllo subito se possiamo riproteggerla sul volo successivo.',
        hint: 'Sarebbe molto utile, grazie. Il bagaglio verrà trasferito in automatico?',
      },
      {
        reply: 'Sì, il bagaglio seguirà la nuova tratta senza doverlo ritirare. Preferisce un posto nelle prime file?',
        hint: 'Sì, se è disponibile, mi aiuterebbe per uscire rapidamente.',
      },
      {
        reply: 'Confermato! Ecco la nuova carta d’imbarco e un voucher per il bar in attesa.',
        hint: 'Apprezzo molto la sua disponibilità, grazie davvero!',
      },
    ],
  },
  work: {
    beginner: [
      {
        reply: 'Buongiorno collega! Come è andato il tuo fine settimana?',
        hint: 'Molto bene, grazie! Mi sono riposato. E tu?',
      },
      {
        reply: 'Anch’io! Su quale progetto stai lavorando oggi in ufficio?',
        hint: 'Oggi sto preparando il rapporto per la riunione.',
      },
      {
        reply: 'Perfetto! Hai bisogno di una mano o ti mando i file subito?',
        hint: 'Se puoi mandarmi i file via email, sarebbe perfetto.',
      },
      {
        reply: 'Te li invio tra cinque minuti. Ci vediamo in riunione alle dieci!',
        hint: 'Ricevuto, grazie! A tra poco.',
      },
    ],
    intermediate: [
      {
        reply: 'Ciao! Facciamo un rapido aggiornamento: a che punto siamo con il documento del cliente?',
        hint: 'Siamo quasi pronti, devo solo controllare gli ultimi numeri.',
      },
      {
        reply: 'Ottimo lavoro! Pensi che riusciremo a rispettare la scadenza di venerdì?',
        hint: 'Sì, assolutamente. Domani pomeriggio possiamo fare il punto insieme.',
      },
      {
        reply: 'Perfetto! C’è qualche criticità su cui dobbiamo allinearci prima?',
        hint: 'Vorrei rivedere insieme la seconda parte della presentazione.',
      },
      {
        reply: 'Volentieri, blocchiamo quindici minuti oggi alle tre. Ti mando l’invito!',
        hint: 'Perfetto, confermo subito la presenza.',
      },
    ],
    advanced: [
      {
        reply: 'Buongiorno! Prima di avviare il trimestre, allineiamoci sulle priorità strategiche del team.',
        hint: 'D’accordo. Secondo me la priorità è sbloccare il collo di bottiglia tecnico.',
      },
      {
        reply: 'Condivido pienamente. Realisticamente, quanto margine temporale stimi per completarlo?',
        hint: 'Con risorse dedicate possiamo chiudere entro metà mese.',
      },
      {
        reply: 'Ottima stima. Hai già raccolto il riscontro degli stakeholder sulla bozza?',
        hint: 'Sì, i feedback sono positivi ma chiedono maggiore chiarezza sui costi.',
      },
      {
        reply: 'Perfetto, aggiorniamo la matrice e torniamoci su giovedì con i dati definitivi.',
        hint: 'Ricevuto, preparo la versione aggiornata per giovedì.',
      },
    ],
  },
  doctor: {
    beginner: [
      {
        reply: 'Buongiorno, si accomodi pure. Come si sente oggi?',
        hint: 'Buongiorno dottore, ho mal di testa e un po’ di febbre.',
      },
      {
        reply: 'Capisco. Da quanti giorni ha questi sintomi?',
        hint: 'È iniziato due giorni fa, soprattutto la sera.',
      },
      {
        reply: 'Va bene, la controllo subito. Ha anche mal di gola o tosse?',
        hint: 'Ho solo un leggero mal di gola e tanta stanchezza.',
      },
      {
        reply: 'Nulla di grave, è un po’ di raffreddore. Prenda questa medicina due volte al giorno dopo i pasti.',
        hint: 'Grazie dottore, ora sono molto più tranquillo!',
      },
    ],
    intermediate: [
      {
        reply: 'Buongiorno! Mi racconti pure qual è il disturbo principale di questi giorni.',
        hint: 'Mi sento molto giù di forze e ho dolori muscolari da lunedì.',
      },
      {
        reply: 'Ha misurato la temperatura o preso già qualche farmaco?',
        hint: 'Avevo trentotto di febbre ieri sera e ho preso una tachipirina.',
      },
      {
        reply: 'Ha fatto bene. Ha qualche allergia nota ai medicinali?',
        hint: 'No, nessuna allergia. Devo prendere le pastiglie a stomaco pieno?',
      },
      {
        reply: 'Sì, sempre dopo mangiato e beva molta acqua. Tra tre giorni dovrebbe stare già meglio!',
        hint: 'Perfetto, seguirò tutte le indicazioni. Grazie!',
      },
    ],
    advanced: [
      {
        reply: 'Buongiorno, si accomodi. In quali momenti della giornata nota che il fastidio si accentua?',
        hint: 'Il fastidio tende ad accentuarsi verso sera, soprattutto dopo il lavoro.',
      },
      {
        reply: 'Interessante. Potrebbe essere legato allo stress oppure a una lieve allergia stagionale.',
        hint: 'Lo sospettavo anch’io. Esiste un trattamento che non provochi sonnolenza diurna?',
      },
      {
        reply: 'Certamente, possiamo scegliere un antistaminico di nuova generazione molto leggero.',
        hint: 'Ottimo! Serve anche un’impegnativa per eventuali analisi approfondite?',
      },
      {
        reply: 'Le preparo subito l’impegnativa per precauzione. Torni al controllo se i sintomi persistono.',
        hint: 'La ringrazio molto per la chiarezza e l’attenzione.',
      },
    ],
  },
  meeting: {
    beginner: [
      {
        reply: 'Ciao! Piacere di conoscerti, io sono Marco! Tu come ti chiami?',
        hint: 'Piacere! Mi chiamo Sara e sto imparando l’italiano.',
      },
      {
        reply: 'Che bello, lo parli già benissimo! Di dove sei e abiti qui vicino?',
        hint: 'Vengo dal Marocco e abito qui vicino da poco.',
      },
      {
        reply: 'Meraviglioso! Cosa ti piace fare di solito nel fine settimana?',
        hint: 'Mi piace camminare al parco e prendere un caffè con gli amici.',
      },
      {
        reply: 'Anch’io adoro il caffè italiano! È stato un piacere parlare con te!',
        hint: 'Anche per me! A presto, Marco!',
      },
    ],
    intermediate: [
      {
        reply: 'Ciao! Non ci siamo ancora presentati, sono Marco. Come conosci gli amici di questa festa?',
        hint: 'Ciao Marco! Lavoro insieme a Luca nello stesso ufficio.',
      },
      {
        reply: 'Ma dai, Luca è un grande amico! Ti sei trasferito in questa città da molto tempo?',
        hint: 'Solo da pochi mesi, sto ancora scoprendo i posti migliori qui in zona.',
      },
      {
        reply: 'Se vuoi posso consigliarti ottimi ristoranti tipici qui vicino. Che cucina preferisci?',
        hint: 'Adoro la cucina mediterranea e le pizzerie tradizionali!',
      },
      {
        reply: 'Allora ti scrivo i miei tre posti preferiti! Dobbiamo restare in contatto!',
        hint: 'Volentieri, prendiamoci un caffè la settimana prossima!',
      },
    ],
    advanced: [
      {
        reply: 'Ciao! Piacere di fare due chiacchiere con te. Qual è stato il momento più bello della tua settimana?',
        hint: 'Sicuramente una mostra fotografica che ho visitato ieri pomeriggio.',
      },
      {
        reply: 'Fantastico, adoro la fotografia! Come ti sei appassionato a questo mondo?',
        hint: 'Ho iniziato viaggiando e cercando di raccontare le città attraverso i volti.',
      },
      {
        reply: 'È un punto di vista davvero autentico! Sembra che abbiamo parecchie passioni in comune.',
        hint: 'Vero! Sto cercando di allargare il giro e conoscere persone creative qui in città.',
      },
      {
        reply: 'Mi farebbe molto piacere: prendiamoci un caffè la settimana prossima per parlarne con calma!',
        hint: 'Ottima idea! Ti lascio volentieri il mio contatto.',
      },
    ],
  },
};

function buildLocalCoachReply(
  scenarioId: ScenarioId,
  level: ProficiencyLevel,
  history: Array<{ sender: 'user' | 'marco'; text: string }>,
  userMessage: string
): KeylessChatResult {
  const analysis = analyzeItalianMessage(userMessage);
  const lower = userMessage.toLowerCase();
  const turns = SCENARIO_TURNS[scenarioId]?.[level] || SCENARIO_TURNS.conversation.beginner;
  const marcoCount = history.filter((m) => m.sender === 'marco').length;
  let selected = turns[marcoCount % turns.length];

  // Contextual keyword reactions so Marco genuinely responds to what the user said
  if (/\bcaff[eè]\b|\bbar\b|\bpizza\b|\bpasta\b|\bcibo\b/.test(lower) && marcoCount > 0) {
    selected = {
      reply: 'Ottima scelta! La cucina e il caffè italiano sono unici. Tu cucini spesso a casa?',
      hint: 'Sì, mi piace molto cucinare la pasta con gli amici!',
    };
  } else if (/\bpassaporto\b|\bbiglietto\b|\bvaligia\b|\bvolo\b/.test(lower) && scenarioId === 'airport') {
    selected = {
      reply: 'Perfetto, ho controllato tutto ed è in ordine. Preferisce un posto finestrino o corridoio?',
      hint: 'Preferisco un posto vicino al finestrino, grazie!',
    };
  } else if (/\bmal di\b|\bfebbre\b|\btosse\b|\bgola\b|\bdolore\b/.test(lower) && scenarioId === 'doctor') {
    selected = {
      reply: 'Capisco bene. Da quanti giorni ha questi sintomi e ha già preso qualche medicina?',
      hint: 'È iniziato due giorni fa e ho preso solo un po’ di paracetamolo.',
    };
  } else if (/\bmi chiamo\b|\bsono di\b|\bvengo da\b/.test(lower)) {
    selected = {
      reply: 'Che bel nome, piacere mio! Come ti trovi a praticare l’italiano finora?',
      hint: 'Mi trovo benissimo, ogni giorno imparo parole nuove!',
    };
  } else if (/\bgrazie\b|\ba presto\b|\barrivederci\b/.test(lower)) {
    selected = {
      reply: 'Prego, è stato un vero piacere! Continua così, stai andando alla grande. Vuoi provare un altro argomento?',
      hint: 'Grazie mille! Sì, proviamo un’altra situazione insieme.',
    };
  }

  return {
    replyItalian: selected.reply,
    hasMistake: analysis.hasMistake,
    correctedItalian: analysis.correctedItalian,
    explanation: analysis.explanation,
    suggestedNextReply: selected.hint,
    engineLabel: 'Tutor Senza Chiave',
  };
}

export async function generateKeylessChatReply(params: {
  scenarioId: ScenarioId;
  level: ProficiencyLevel;
  history: Array<{ sender: 'user' | 'marco'; text: string }>;
  userMessage: string;
  targetLanguageName?: string;
}): Promise<KeylessChatResult> {
  const { scenarioId, level, history, userMessage, targetLanguageName } = params;

  // 1. Try Chrome Built-in AI (Gemini Nano) if device supports it (100% local, zero keys)
  const chromeRes = await tryChromeBuiltInChat(scenarioId, level, history, userMessage, targetLanguageName);
  if (chromeRes) return chromeRes;

  // 2. Try Client-Side Keyless AI directly from user's own IP if off 46s rate window
  const pollRes = await tryClientPollinationsChat(scenarioId, level, history, userMessage, targetLanguageName);
  if (pollRes) return pollRes;

  // 3. Always-available local Italian Grammar & Scenario Tutor (zero keys, instant, unlimited)
  return buildLocalCoachReply(scenarioId, level, history, userMessage);
}

const EXTRA_FREE_PHRASES: Record<ScenarioId, KeyPhrase[]> = {
  conversation: [
    {
      id: 'free-conv-1',
      italian: 'Parliamo un po’ più piano, per favore.',
      meaning: 'Puoi parlare leggermente più lentamente?',
      usageNote: 'Utile per capire ogni parola senza stress.',
    },
    {
      id: 'free-conv-2',
      italian: 'Sto imparando l’italiano da qualche mese.',
      meaning: 'Studio questa lingua da poco tempo.',
      usageNote: 'Spiega subito il tuo livello con simpatia.',
    },
    {
      id: 'free-conv-3',
      italian: 'Come si dice questa parola in italiano?',
      meaning: 'Qual è il termine italiano giusto?',
      usageNote: 'Perfetta per arricchire il vocabolario dal vivo.',
    },
    {
      id: 'free-conv-4',
      italian: 'Secondo me è una splendida idea.',
      meaning: 'Penso proprio che sia una buona proposta.',
      usageNote: 'Espressione naturale per mostrare entusiasmo.',
    },
    {
      id: 'free-conv-5',
      italian: 'Ci sentiamo molto presto!',
      meaning: 'Parliamo di nuovo tra poco tempo!',
      usageNote: 'Saluto amichevole e quotidiano.',
    },
  ],
  airport: [
    {
      id: 'free-air-1',
      italian: 'Dove si trova il controllo passaporti?',
      meaning: 'In che direzione vado per mostrare il passaporto?',
      usageNote: 'Molto utile nei voli internazionali.',
    },
    {
      id: 'free-air-2',
      italian: 'Posso portare questa borsa in cabina?',
      meaning: 'È permesso tenerla come bagaglio a mano?',
      usageNote: 'Chiedilo al banco prima di passare i varchi.',
    },
    {
      id: 'free-air-3',
      italian: 'Il gate d’imbarco è cambiato?',
      meaning: 'L’uscita del volo è sempre la stessa?',
      usageNote: 'Controlla sempre gli schermi vicino ai gate.',
    },
    {
      id: 'free-air-4',
      italian: 'Dove posso ritirare il mio bagaglio?',
      meaning: 'Qual è il nastro valigie del mio volo?',
      usageNote: 'Frase essenziale appena atterri.',
    },
    {
      id: 'free-air-5',
      italian: 'C’è un treno o un autobus per il centro?',
      meaning: 'Qual è il mezzo più comodo per lasciare l’aeroporto?',
      usageNote: 'Utile appena esci dagli arrivi.',
    },
  ],
  work: [
    {
      id: 'free-work-1',
      italian: 'Possiamo organizzare una breve chiamata oggi?',
      meaning: 'Hai tempo per sentirci velocemente al telefono o video?',
      usageNote: 'Formula cortese e professionale.',
    },
    {
      id: 'free-work-2',
      italian: 'Ti aggiorno appena ho novità.',
      meaning: 'Appena so qualcosa in più ti scrivo subito.',
      usageNote: 'Comunissima nelle email di lavoro.',
    },
    {
      id: 'free-work-3',
      italian: 'Ho già inviato il documento revisionato.',
      meaning: 'Il file corretto è già nella tua casella di posta.',
      usageNote: 'Chiara e diretta per confermare un compito.',
    },
    {
      id: 'free-work-4',
      italian: 'Quali sono i prossimi passi da seguire?',
      meaning: 'Che cosa facciamo adesso?',
      usageNote: 'Ottima per chiudere una riunione con ordine.',
    },
    {
      id: 'free-work-5',
      italian: 'Grazie mille per la collaborazione!',
      meaning: 'Ti ringrazio per aver lavorato bene insieme.',
      usageNote: 'Chiusura cordiale con colleghi e clienti.',
    },
  ],
  doctor: [
    {
      id: 'free-doc-1',
      italian: 'Vorrei prenotare una visita medica.',
      meaning: 'Devo fissare un appuntamento con il dottore.',
      usageNote: 'Usala al telefono o allo sportello.',
    },
    {
      id: 'free-doc-2',
      italian: 'Ho bisogno di una ricetta medica.',
      meaning: 'Mi serve la prescrizione per la farmacia.',
      usageNote: 'Essenziale per molti farmaci in Italia.',
    },
    {
      id: 'free-doc-3',
      italian: 'Ho dormito poco per colpa del dolore.',
      meaning: 'Il fastidio non mi ha lasciato riposare bene.',
      usageNote: 'Aiuta il medico a valutare l’intensità.',
    },
    {
      id: 'free-doc-4',
      italian: 'Posso continuare a fare sport?',
      meaning: 'È sicuro allenarsi durante la cura?',
      usageNote: 'Domanda pratica prima di uscire dallo studio.',
    },
    {
      id: 'free-doc-5',
      italian: 'Dove si trova la farmacia più vicina?',
      meaning: 'Qual è la farmacia aperta qui intorno?',
      usageNote: 'Utile subito dopo aver ricevuto la ricetta.',
    },
  ],
  meeting: [
    {
      id: 'free-meet-1',
      italian: 'Da quanto tempo vivi in questa città?',
      meaning: 'Quanti mesi o anni hai passato qui?',
      usageNote: 'Domanda naturale per conoscere qualcuno.',
    },
    {
      id: 'free-meet-2',
      italian: 'Ti va di prendere un caffè insieme?',
      meaning: 'Vuoi andare al bar a bere qualcosa?',
      usageNote: 'Invito semplice e tipicamente italiano.',
    },
    {
      id: 'free-meet-3',
      italian: 'Che lavoro fai o cosa studi?',
      meaning: 'Di cosa ti occupi nella vita?',
      usageNote: 'Molto comune dopo le prime presentazioni.',
    },
    {
      id: 'free-meet-4',
      italian: 'Anch’io amo tantissimo viaggiare!',
      meaning: 'Abbiamo la stessa passione per i viaggi!',
      usageNote: 'Crea subito sintonia durante il dialogo.',
    },
    {
      id: 'free-meet-5',
      italian: 'Teniamoci in contatto su WhatsApp!',
      meaning: 'Scriviamoci presto per rivederci!',
      usageNote: 'Espressione modernissima e spontanea in Italia.',
    },
  ],
};

export function getNextFreeKeylessPhrases(scenarioId: ScenarioId, currentIds: string[]): KeyPhrase[] {
  const pool = EXTRA_FREE_PHRASES[scenarioId] || EXTRA_FREE_PHRASES.conversation;
  const usingExtra = currentIds.some((id) => id.startsWith('free-'));
  if (!usingExtra) {
    return pool.map((p) => ({ ...p, memorized: false }));
  }
  return [];
}

export async function translateKeylessText(
  text: string,
  targetLanguageCode: string,
  targetLanguageName: string
): Promise<string | null> {
  // 1. Try Chrome Built-in Translator API if supported
  const Translator = getChromeTranslator();
  if (Translator) {
    try {
      const targetCode = targetLanguageCode.split('-')[0].toLowerCase();
      if (Translator.availability) {
        const avail = await Translator.availability({ sourceLanguage: 'it', targetLanguage: targetCode });
        if (avail !== 'no' && avail !== 'unavailable') {
          const instance = await Translator.create({ sourceLanguage: 'it', targetLanguage: targetCode });
          try {
            const translated = await instance.translate(text);
            if (translated.trim()) return translated.trim();
          } finally {
            instance.destroy?.();
          }
        }
      }
    } catch {
      // Fall through
    }
  }

  // 2. Try Client Pollinations if off 46s rate window
  const now = Date.now();
  if (now - lastPollinationsCallAt >= POLLINATIONS_MIN_INTERVAL_MS) {
    lastPollinationsCallAt = now;
    try {
      const res = await fetch('https://text.pollinations.ai/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(6500),
        body: JSON.stringify({
          model: 'openai',
          messages: [
            {
              role: 'system',
              content: `Translate the Italian text into ${targetLanguageName}. Return ONLY the translated text.`,
            },
            { role: 'user', content: text },
          ],
        }),
      });
      if (res.ok) {
        const out = (await res.text()).trim();
        if (out && !/free limit reached/i.test(out)) return out;
      }
    } catch {
      // Fall through
    }
  }

  return null;
}
