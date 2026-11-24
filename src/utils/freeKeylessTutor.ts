import { KeyPhrase, ProficiencyLevel, ScenarioId } from '../types';

export interface KeylessChatResult {
  replyEnglish: string;
  hasMistake: boolean;
  correctedEnglish: string;
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

function isPollinationsLimitBody(status: number, bodyText: string): boolean {
  return status === 402 || /free limit reached|retry after/i.test(bodyText);
}

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
  history: Array<{ sender: 'user' | 'alex'; text: string }>,
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

    const systemPrompt = `You are Alex, a friendly native American English tutor. Scenario: ${scenarioId}. Level: ${level}.
Respond ONLY with valid JSON (no markdown) using these keys:
replyEnglish (natural English, 1 short sentence + 1 short question directly answering the learner, max 28 words),
hasMistake (boolean),
correctedEnglish (corrected English sentence or empty string),
explanation (1 short tip in simple English or empty string),
suggestedNextReply (1 short English reply hint, max 12 words)${
      targetLanguageName ? `, replyTranslation (translation of replyEnglish into ${targetLanguageName})` : ''
    }.`;

    const session = await LM.create({ systemPrompt });
    try {
      const recent = history
        .slice(-4)
        .map((m) => `${m.sender === 'user' ? 'Learner' : 'Alex'}: ${m.text}`)
        .join('\n');
      const raw = await session.prompt(`${recent ? `${recent}\n` : ''}Learner: ${userMessage}`);
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (!jsonMatch) return null;
      const parsed = JSON.parse(jsonMatch[0]) as Partial<KeylessChatResult>;
      if (!parsed.replyEnglish) return null;
      return {
        replyEnglish: parsed.replyEnglish.trim(),
        hasMistake: Boolean(parsed.hasMistake),
        correctedEnglish: (parsed.correctedEnglish || '').trim(),
        explanation: (parsed.explanation || '').trim(),
        replyTranslation: (parsed.replyTranslation || '').trim(),
        suggestedNextReply: (parsed.suggestedNextReply || 'Yes, sure! How about you?').trim(),
        engineLabel: 'Browser Local AI',
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
  history: Array<{ sender: 'user' | 'alex'; text: string }>,
  userMessage: string,
  targetLanguageName?: string
): Promise<KeylessChatResult | null> {
  try {
    const historyMessages = history
      .slice(-6)
      .filter((m) => m.text && m.text.trim())
      .map((m) => ({
        role: m.sender === 'user' ? ('user' as const) : ('assistant' as const),
        content: m.text.trim(),
      }));

    const res = await fetch('https://text.pollinations.ai/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(5500),
      body: JSON.stringify({
        model: 'openai',
        jsonMode: true,
        messages: [
          {
            role: 'system',
            content: `You are Alex, a friendly native American English tutor in scenario "${scenarioId}" at level "${level}".
CRITICAL RULE: Stay 100% focused on the EXACT topic, question, or situation the learner just brought up in their latest message (and conversation history). Answer their actual point directly. NEVER change the subject or jump to unrelated topics (like coffee, travel, or random cities) unless the learner mentioned them.
Respond ONLY with valid JSON containing these keys:
- "replyEnglish": Alex's conversational reply directly responding to what the learner just said (1 short natural sentence + 1 follow-up question on the SAME topic, max 28 words; NEVER echo the learner's own sentence).
- "hasMistake": boolean (true if the learner made a real English grammar/spelling mistake or used a non-English word).
- "correctedEnglish": corrected version of the learner's sentence (or "" if hasMistake is false).
- "explanation": 1 brief tip in simple English explaining the fix (or "" if hasMistake is false).
- "suggestedNextReply": 1 short English reply idea the learner could say next on the same topic (max 12 words).${
              targetLanguageName ? `\n- "replyTranslation": natural translation of replyEnglish into ${targetLanguageName}.` : ''
            }`,
          },
          ...historyMessages,
          {
            role: 'user',
            content: userMessage.trim(),
          },
        ],
      }),
    });

    const rawText = await res.text();
    if (!res.ok || isPollinationsLimitBody(res.status, rawText)) {
      return null;
    }

    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0]) as Partial<KeylessChatResult>;
        if (parsed.replyEnglish && !isPollinationsLimitBody(200, parsed.replyEnglish)) {
          const localCheck = analyzeEnglishMessage(userMessage);
          const hasMistake = Boolean(parsed.hasMistake) || localCheck.hasMistake;
          const correctedEnglish =
            (parsed.correctedEnglish || '').trim() || (hasMistake ? localCheck.correctedEnglish : '');
          const explanation =
            (parsed.explanation || '').trim() || (hasMistake ? localCheck.explanation : '');
          let replyEnglish = parsed.replyEnglish.trim();
          let suggestedNextReply = (parsed.suggestedNextReply || 'Sounds great, let us keep going!').trim();
          const normalizedReply = replyEnglish.toLowerCase().replace(/[.!?]+$/g, '').trim();
          const normalizedCorr = correctedEnglish.toLowerCase().replace(/[.!?]+$/g, '').trim();
          const normalizedUser = userMessage.toLowerCase().replace(/[.!?]+$/g, '').trim();
          if (
            !replyEnglish ||
            normalizedReply === normalizedCorr ||
            normalizedReply === normalizedUser
          ) {
            const coachFallback = buildLocalCoachReply(scenarioId, level, history, userMessage);
            replyEnglish = coachFallback.replyEnglish;
            suggestedNextReply = coachFallback.suggestedNextReply;
          }
          return {
            replyEnglish,
            hasMistake,
            correctedEnglish,
            explanation,
            replyTranslation: (parsed.replyTranslation || '').trim(),
            suggestedNextReply,
            engineLabel: 'Free Browser AI',
          };
        }
      } catch {
        // Fall through to plain-text check
      }
    }

    const cleanedPlain = rawText.trim().replace(/^["']|["']$/g, '').trim();
    if (
      cleanedPlain.length >= 3 &&
      cleanedPlain.length <= 400 &&
      !cleanedPlain.startsWith('{') &&
      !cleanedPlain.startsWith('<') &&
      !/error|rate limit|quota|unauthorized|free limit/i.test(cleanedPlain)
    ) {
      const localCheck = analyzeEnglishMessage(userMessage);
      return {
        replyEnglish: cleanedPlain,
        hasMistake: localCheck.hasMistake,
        correctedEnglish: localCheck.correctedEnglish,
        explanation: localCheck.explanation,
        suggestedNextReply: 'Yes, I agree! What do you think?',
        engineLabel: 'Free Browser AI',
      };
    }

    return null;
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
    pattern: /\b(bonjour|salut)\b/i,
    replace: (s) => s.replace(/\b(bonjour|salut)\b/gi, 'Hello'),
    explanation: 'In English, say "Hello" or "Hi" to greet someone naturally.',
  },
  {
    pattern: /\b(ciao|buongiorno|buonasera)\b/i,
    replace: (s) => s.replace(/\b(ciao|buongiorno|buonasera)\b/gi, 'Hello'),
    explanation: 'In English, use "Hello" or "Good morning" as a greeting.',
  },
  {
    pattern: /\b(merci|grazie|shukran)\b/i,
    replace: (s) => s.replace(/\b(merci|grazie|shukran)\b/gi, 'thank you'),
    explanation: 'In English, say "Thank you" or "Thanks".',
  },
  {
    pattern: /\b(s'il vous plaît|s'il te plaît|per favore)\b/i,
    replace: (s) => s.replace(/\b(s'il vous plaît|s'il te plaît|per favore)\b/gi, 'please'),
    explanation: 'Use "please" in English to make a polite request.',
  },
  {
    pattern: /\bcomment ça va\b|\bcome stai\b/i,
    replace: (s) => s.replace(/\b(comment ça va|come stai)\b/gi, 'how are you'),
    explanation: 'In English, ask "How are you?" to check how someone is doing.',
  },
  {
    pattern: /\bi am agree\b/i,
    replace: (s) => s.replace(/\bi am agree\b/gi, 'I agree'),
    explanation: '"Agree" is a verb, so say "I agree" (not "I am agree").',
  },
  {
    pattern: /\bi no understand\b|\bi not understand\b/i,
    replace: (s) => s.replace(/\b(i no understand|i not understand)\b/gi, "I don't understand"),
    explanation: 'Use "don\'t" for present negative verbs: "I don\'t understand."',
  },
  {
    pattern: /\bi have (\d+|twenty|thirty|forty|twenty-five) years\b/i,
    replace: (s) => s.replace(/\bi have (\d+|twenty|thirty|forty|twenty-five) years\b/gi, 'I am $1 years old'),
    explanation: 'In English, use the verb "be" for age: "I am ... years old."',
  },
  {
    pattern: /\bexplain me\b/i,
    replace: (s) => s.replace(/\bexplain me\b/gi, 'explain to me'),
    explanation: 'With "explain", add "to": "explain to me" or "explain this to me."',
  },
  {
    pattern: /\bi am boring\b/i,
    replace: (s) => s.replace(/\bi am boring\b/gi, 'I am bored'),
    explanation: 'Say "I am bored" for your feeling; "boring" describes something uninteresting.',
  },
  {
    pattern: /\bmore better\b/i,
    replace: (s) => s.replace(/\bmore better\b/gi, 'much better'),
    explanation: '"Better" is already comparative, so say "much better" (never "more better").',
  },
  {
    pattern: /\bi am go\b|\bi going\b/i,
    replace: (s) => s.replace(/\b(i am go|i going)\b/gi, 'I am going'),
    explanation: 'Use "am + -ing" for present continuous actions: "I am going."',
  },
  {
    pattern: /\b(he|she) go\b/i,
    replace: (s) => s.replace(/\b(he|she) go\b/gi, '$1 goes'),
    explanation: 'With "he" or "she" in simple present, add -es: "goes".',
  },
  {
    pattern: /\b(he|she) have\b/i,
    replace: (s) => s.replace(/\b(he|she) have\b/gi, '$1 has'),
    explanation: 'With "he" or "she", use "has" instead of "have".',
  },
  {
    pattern: /\bi (don't|do not) has\b/i,
    replace: (s) => s.replace(/\bi (don't|do not) has\b/gi, "I don't have"),
    explanation: 'After "don\'t", always use the base verb "have": "I don\'t have."',
  },
  {
    pattern: /\byesterday i go\b/i,
    replace: (s) => s.replace(/\byesterday i go\b/gi, 'yesterday I went'),
    explanation: 'For past actions like "yesterday", use the past tense "went".',
  },
  {
    pattern: /\bi very like\b/i,
    replace: (s) => s.replace(/\bi very like\b/gi, 'I really like'),
    explanation: 'Use "really" or "very much" with verbs: "I really like..."',
  },
  {
    pattern: /\bi want that you\b/i,
    replace: (s) => s.replace(/\bi want that you\b/gi, 'I want you to'),
    explanation: 'In English, say "I want you to..." instead of "I want that you...".',
  },
  {
    pattern: /\b(peoples|informations|advices|furnitures)\b/i,
    replace: (s) =>
      s
        .replace(/\bpeoples\b/gi, 'people')
        .replace(/\binformations\b/gi, 'information')
        .replace(/\badvices\b/gi, 'advice')
        .replace(/\bfurnitures\b/gi, 'furniture'),
    explanation: 'Words like "people", "information", and "advice" do not take a final -s here.',
  },
  {
    pattern: /\bi\b(?=\s+[a-z])/,
    replace: (s) => s.replace(/(^|\s)i(\s|$)/g, '$1I$2'),
    explanation: 'The pronoun "I" is always capitalized in English.',
  },
];

function analyzeEnglishMessage(input: string): {
  hasMistake: boolean;
  correctedEnglish: string;
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

  if (notes.length > 0 && corrected !== input.trim()) {
    return {
      hasMistake: true,
      correctedEnglish: corrected,
      explanation: notes[0],
    };
  }

  return {
    hasMistake: false,
    correctedEnglish: '',
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
        reply: 'Hi there! Great to chat with you today. How is your day going so far?',
        hint: 'It is going great, thanks! How about yours?',
      },
      {
        reply: 'Nice! What do you usually like to do in your free time?',
        hint: 'In my free time I like listening to music and traveling.',
      },
      {
        reply: 'Awesome! Do you enjoy cooking at home or eating out with friends?',
        hint: 'I love homemade food, and sometimes I eat out with friends!',
      },
      {
        reply: 'Great choice! Your English sounds very natural. What new topic would you like to practice next?',
        hint: 'I want to practice travel and everyday conversation.',
      },
    ],
    intermediate: [
      {
        reply: 'Hey! Good to catch up with you. What have you been up to lately?',
        hint: 'I have been working a lot, and last night I met some friends.',
      },
      {
        reply: 'Sounds fun! Is there a city or country you would love to visit soon?',
        hint: 'I would really love to visit London and New York someday.',
      },
      {
        reply: 'Both have amazing food and culture. Do you prefer relaxing by the beach or exploring big cities?',
        hint: 'Honestly, I prefer the beach, especially in the summer.',
      },
      {
        reply: 'I agree! How do you plan to practice your English over the next few days?',
        hint: 'I want to speak with you for ten minutes every day.',
      },
    ],
    advanced: [
      {
        reply: 'Hey! Great to dive into a real conversation with you. What thought-provoking topic is on your mind today?',
        hint: 'I would like to talk about how technology is reshaping remote work.',
      },
      {
        reply: 'Very relevant topic! What do you see as the biggest benefit compared to ten years ago?',
        hint: 'Definitely flexibility, though maintaining work-life balance takes discipline.',
      },
      {
        reply: 'You hit the nail on the head. Do you think hybrid work will stay the standard long term?',
        hint: 'Yes, I think a hybrid model offers the best of both worlds.',
      },
      {
        reply: 'Sharp analysis, your fluency is impressive! Would you like to switch to another subject?',
        hint: 'Sure, let us talk about movies, culture, and daily habits.',
      },
    ],
  },
  airport: {
    beginner: [
      {
        reply: 'Good morning and welcome to check-in! May I see your passport and ticket, please?',
        hint: 'Sure, here is my passport and my ticket.',
      },
      {
        reply: 'Thank you! Do you have a suitcase to check in, or just a carry-on bag?',
        hint: 'I only have one small carry-on bag today.',
      },
      {
        reply: 'Got it! Would you prefer a window seat or an aisle seat for this flight?',
        hint: 'I would like a window seat, please.',
      },
      {
        reply: 'Here is your boarding pass—your flight leaves from Gate 12. Have a safe flight!',
        hint: 'Thank you! What time does boarding begin?',
      },
    ],
    intermediate: [
      {
        reply: 'Good morning! Are you flying direct today, or do you have a layover?',
        hint: 'I have a direct flight to London leaving in two hours.',
      },
      {
        reply: 'Great, your flight is right on schedule. Would you like to check any luggage?',
        hint: 'Yes, I want to check this suitcase and keep my backpack with me.',
      },
      {
        reply: 'No problem, the weight is within the limit. Do you know the way to security?',
        hint: 'Yes, thanks! How long is the walk to the gate?',
      },
      {
        reply: 'About ten minutes after security screening. Enjoy your flight!',
        hint: 'Thanks for your help, have a wonderful day!',
      },
    ],
    advanced: [
      {
        reply: 'Good morning, welcome to the assistance desk. How can I help with your connection?',
        hint: 'I am worried I might miss my second flight due to our departure delay.',
      },
      {
        reply: 'I understand your concern. Let me check if I can rebook you on the next flight right away.',
        hint: 'That would help a lot, thank you. Will my luggage transfer automatically?',
      },
      {
        reply: 'Yes, your bag will follow the updated itinerary automatically. Would you prefer a seat near the front?',
        hint: 'Yes, if available, that would help me disembark faster.',
      },
      {
        reply: 'Confirmed! Here is your new boarding pass along with a complimentary café voucher while you wait.',
        hint: 'I really appreciate your help—thank you so much!',
      },
    ],
  },
  work: {
    beginner: [
      {
        reply: 'Good morning! How was your weekend?',
        hint: 'It was great, thanks! I got some rest. How about yours?',
      },
      {
        reply: 'Mine was good too! What project are you working on in the office today?',
        hint: 'Today I am preparing the report for our meeting.',
      },
      {
        reply: 'Nice! Do you need any help, or should I send you the files now?',
        hint: 'Could you email me the files? That would be great.',
      },
      {
        reply: 'Sending them in five minutes. See you in the meeting at ten!',
        hint: 'Got it, thanks! Talk to you soon.',
      },
    ],
    intermediate: [
      {
        reply: 'Hey! Let us do a quick check-in: where do we stand on the client document?',
        hint: 'We are almost ready—I just need to verify the final numbers.',
      },
      {
        reply: 'Awesome work! Do you think we are on track to meet Friday’s deadline?',
        hint: 'Yes, definitely. We can touch base tomorrow afternoon to finalize it.',
      },
      {
        reply: 'Perfect! Are there any blockers we should align on before then?',
        hint: 'I would like to review the second half of the slides together.',
      },
      {
        reply: 'Gladly—let us block fifteen minutes today at three. I will send the invite!',
        hint: 'Sounds great, I will accept the calendar invite right away.',
      },
    ],
    advanced: [
      {
        reply: 'Morning! Before kicking off the quarter, let us align on our team’s strategic priorities.',
        hint: 'Agreed. In my view, clearing the technical bottleneck should come first.',
      },
      {
        reply: 'I completely agree. Realistically, what timeline do you estimate for wrapping it up?',
        hint: 'With dedicated resources, we can close it out by mid-month.',
      },
      {
        reply: 'Solid estimate. Have you gathered stakeholder feedback on the initial draft yet?',
        hint: 'Yes, feedback is positive overall, though they want clearer cost breakdowns.',
      },
      {
        reply: 'Got it—let us update the roadmap and circle back Thursday with the final numbers.',
        hint: 'Sounds like a plan, I will prepare the revised version for Thursday.',
      },
    ],
  },
  doctor: {
    beginner: [
      {
        reply: 'Good morning, please have a seat. How are you feeling today?',
        hint: 'Good morning doctor, I have a headache and a slight fever.',
      },
      {
        reply: 'I see. How many days have you had these symptoms?',
        hint: 'It started two days ago, mostly in the evening.',
      },
      {
        reply: 'Okay, let me check right away. Do you also have a sore throat or a cough?',
        hint: 'I just have a mild sore throat and feel tired.',
      },
      {
        reply: 'Nothing serious, just a mild cold. Take this medicine twice a day after meals.',
        hint: 'Thank you doctor, I feel much more relieved now!',
      },
    ],
    intermediate: [
      {
        reply: 'Good morning! Tell me what has been bothering you most over the past few days.',
        hint: 'I have felt very drained and had muscle aches since Monday.',
      },
      {
        reply: 'Have you checked your temperature or taken any medication already?',
        hint: 'I had a mild fever last night and took one pain reliever.',
      },
      {
        reply: 'Good call. Do you have any known allergies to medications?',
        hint: 'No allergies at all. Should I take the tablets with food?',
      },
      {
        reply: 'Yes, always after eating, and drink plenty of water. You should feel much better in three days!',
        hint: 'Understood, I will follow every instruction. Thank you!',
      },
    ],
    advanced: [
      {
        reply: 'Good morning, please come in. At what times of day do you notice the discomfort flaring up?',
        hint: 'It tends to worsen in the evening, especially after work.',
      },
      {
        reply: 'Interesting. It could be stress-related or triggered by mild seasonal allergies.',
        hint: 'I suspected that too. Is there a treatment that will not cause drowsiness?',
      },
      {
        reply: 'Certainly—we can prescribe a gentle, non-drowsy second-generation antihistamine.',
        hint: 'Great! Would I also need a referral if we decide on further tests?',
      },
      {
        reply: 'I will prepare a referral just in case. Come back for a checkup if symptoms persist.',
        hint: 'Thank you very much for explaining everything so clearly.',
      },
    ],
  },
  meeting: {
    beginner: [
      {
        reply: 'Hi! Nice to meet you, I am Alex! What is your name?',
        hint: 'Nice to meet you! My name is Sara and I am learning English.',
      },
      {
        reply: 'That is awesome—you already speak well! Where are you from?',
        hint: 'I am from Morocco, and I live nearby.',
      },
      {
        reply: 'Wonderful! What do you usually enjoy doing on weekends?',
        hint: 'I like walking in the park and grabbing coffee with friends.',
      },
      {
        reply: 'I love coffee too! It was really great chatting with you today.',
        hint: 'Same here! See you soon, Alex!',
      },
    ],
    intermediate: [
      {
        reply: 'Hey! I do not think we have met yet—I am Alex. How do you know everyone here?',
        hint: 'Hi Alex! I work in the same office as Sam.',
      },
      {
        reply: 'Oh nice, Sam is a great friend! Have you lived in this city for long?',
        hint: 'Only a few months—I am still discovering the best spots around town.',
      },
      {
        reply: 'I can recommend some awesome local cafés nearby. What kind of food do you like?',
        hint: 'I love Mediterranean food and cozy coffee shops!',
      },
      {
        reply: 'Let me share my top three favorite spots! We should definitely stay in touch.',
        hint: 'Sounds great, let us grab coffee next week!',
      },
    ],
    advanced: [
      {
        reply: 'Hey! Great getting a chance to chat. What has been the highlight of your week so far?',
        hint: 'Definitely a photography exhibition I visited yesterday afternoon.',
      },
      {
        reply: 'No way, I love photography too! How did you get into it?',
        hint: 'I started while traveling and trying to capture cities through everyday portraits.',
      },
      {
        reply: 'What an authentic perspective! Sounds like we share quite a few creative interests.',
        hint: 'True! I have been hoping to meet more creative people around town.',
      },
      {
        reply: 'Count me in—let us grab coffee next week and swap travel stories!',
        hint: 'Love that idea! Here is my contact info.',
      },
    ],
  },
};

function buildLocalCoachReply(
  scenarioId: ScenarioId,
  level: ProficiencyLevel,
  history: Array<{ sender: 'user' | 'alex'; text: string }>,
  userMessage: string
): KeylessChatResult {
  const analysis = analyzeEnglishMessage(userMessage);
  const lower = userMessage.toLowerCase().trim();
  const turns = SCENARIO_TURNS[scenarioId]?.[level] || SCENARIO_TURNS.conversation.beginner;
  const recentAlexTexts = new Set(
    history.filter((m) => m.sender === 'alex').map((m) => m.text.trim())
  );

  const pickFresh = (candidates: TurnReply[]): TurnReply => {
    const unused = candidates.find((c) => !recentAlexTexts.has(c.reply.trim()));
    return unused || candidates[0];
  };

  let selected: TurnReply | null = null;

  // 1. Direct language help / questions
  if (/\b(how do you say|what does .* mean|what is the meaning|mean in english)\b/.test(lower)) {
    selected = pickFresh([
      {
        reply: 'Great question! In everyday English, keeping it simple and natural works best. Want to try putting that word into a short sentence?',
        hint: 'Yes! Let me try writing a short example sentence.',
      },
      {
        reply: 'Happy to help! You can also tap the Translate button on any message to see the exact meaning in your own language. Want another example?',
        hint: 'Thanks Alex, now let me try using it myself!',
      },
    ]);
  } else if (/\b(don't understand|do not understand|speak slower|slow down|repeat|too fast|difficult|help me)\b/.test(lower)) {
    selected = pickFresh([
      {
        reply: 'No problem at all—let us slow down! I will use shorter, simpler words. What do you enjoy doing every day?',
        hint: 'Thanks! Every day I work and practice a little English.',
      },
      {
        reply: 'Take your time—you are doing great! Would you like to practice with short, easy questions?',
        hint: 'Yes please, short and simple sentences help me a lot.',
      },
    ]);
  } else if (/\b(how are you|how's it going|how are things|how you doing|what's up|whats up)\b/.test(lower)) {
    selected = pickFresh([
      {
        reply: 'I am doing great, thanks for asking! Today has been really productive. How are you feeling and how is your day going?',
        hint: 'I am doing well too, thanks! Today is a good day.',
      },
      {
        reply: 'Everything is going awesome, thank you! I always enjoy practicing English with you. What have you done today so far?',
        hint: 'Today I had coffee and now I am practicing English.',
      },
    ]);
  } else if (/\b(who are you|where do you live|where are you from|what do you do|how old|about you|and you)\b/.test(lower)) {
    selected = pickFresh([
      {
        reply: 'I am Alex, your friendly English tutor! I love coffee, travel, and helping learners speak confidently. Which city do you live in right now?',
        hint: 'I live in Casablanca, and I would love to travel more!',
      },
      {
        reply: 'In my free time I enjoy cooking, listening to music, and reading. What hobbies make you happiest?',
        hint: 'I also love music and spending time outdoors!',
      },
    ]);
  } else if (/\bmy name is\b|\bi am ([A-Z][a-z]+)\b/.test(userMessage)) {
    const nameMatch = userMessage.match(/(?:my name is|i'm|i am)\s+([A-Za-z'-]{2,20})/i);
    const extractedName =
      nameMatch && !/happy|tired|fine|good|great|sad|ready|learning|from|here/i.test(nameMatch[1])
        ? nameMatch[1]
        : '';
    selected = {
      reply: extractedName
        ? `Nice to meet you, ${extractedName}! What a great name. How long have you been learning English?`
        : 'Nice to meet you! How long have you been practicing English?',
      hint: 'Nice to meet you too! I have been learning English for a few months.',
    };
  } else if (/\b(i am from|i'm from|i come from|i live in)\b/.test(lower)) {
    selected = pickFresh([
      {
        reply: 'Oh awesome, that is a wonderful place! Have you visited any English-speaking countries yet, or is there somewhere on your wish list?',
        hint: 'I would love to visit London or New York next year!',
      },
    ]);
  } else if (/\b(tired|exhausted|sleepy|stressed|bad|sad|sick)\b/.test(lower)) {
    selected = pickFresh([
      {
        reply: 'I hear you—we all have days like that! Make sure you get some rest soon. Did you have a busy day today?',
        hint: 'Yes, it was a long day, so now I just want to relax.',
      },
      {
        reply: 'Sorry to hear that! I hope you recharge soon. What usually helps you unwind after a tough day?',
        hint: 'I usually drink warm tea and listen to calm music.',
      },
    ]);
  } else if (/\b(happy|glad|excited|good|great|awesome|wonderful|fantastic|fine)\b/.test(lower)) {
    selected = pickFresh([
      {
        reply: 'That is great to hear! Keeping a positive mood makes speaking English even easier. What has been the best part of your day?',
        hint: 'I caught up with friends and learned some new English words!',
      },
    ]);
  } else if (/\b(coffee|tea|cafe|pizza|food|eat|drink|water|restaurant|dinner|lunch|breakfast|hungry|thirsty|cook)\b/.test(lower)) {
    selected = pickFresh([
      {
        reply: 'Delicious choice! Good food and coffee always start great conversations. What is your absolute favorite meal to eat or cook?',
        hint: 'I love grilled chicken, fresh salads, and homemade pasta!',
      },
      {
        reply: 'Now I am getting hungry too! Do you prefer grabbing coffee at a café or making it at home?',
        hint: 'I prefer sitting at a cozy café with friends.',
      },
    ]);
  } else if (/\b(weather|rain|sunny|hot|cold|time is it|what time)\b/.test(lower)) {
    selected = pickFresh([
      {
        reply: 'The weather feels really pleasant here today—great for a walk outside! Is it warm or cool where you are right now?',
        hint: 'It is sunny and comfortable here today.',
      },
    ]);
  } else if (
    /\b(airport|passport|ticket|luggage|suitcase|flight|plane|train|station|hotel|room|vacation|trip|travel|london|new york|usa|uk)\b/.test(
      lower
    )
  ) {
    selected = pickFresh([
      {
        reply: 'Sounds like an exciting trip! Do you usually travel light with just a carry-on, or do you check a big suitcase?',
        hint: 'I usually travel light with only a small carry-on bag.',
      },
      {
        reply: 'Great destination! Have you checked your departure time and boarding gate number yet?',
        hint: 'Yes, my flight departs at ten from Gate 12.',
      },
    ]);
  } else if (/\b(headache|fever|cough|throat|pain|hurt|stomach|medicine|pharmacy|doctor|clinic|symptoms)\b/.test(lower)) {
    selected = pickFresh([
      {
        reply: 'I understand. How long have you had those symptoms, and have you taken any medicine yet?',
        hint: 'It started last night, and I have not taken anything yet.',
      },
      {
        reply: 'Be sure to drink plenty of water and rest. Should we practice what to say at the pharmacy next?',
        hint: 'Yes, tell me how to ask for pain medicine politely.',
      },
    ]);
  } else if (/\b(work|office|meeting|project|coworker|boss|email|job|study|school|university|exam)\b/.test(lower)) {
    selected = pickFresh([
      {
        reply: 'Sounds like you are staying focused! What is your biggest priority at work or school this week?',
        hint: 'I need to finish a presentation for tomorrow’s meeting.',
      },
      {
        reply: 'Great mindset! Good communication helps everything move faster. Do you enjoy collaborating with your team?',
        hint: 'Yes, I love working with my team and learning new skills.',
      },
    ]);
  } else if (/\b(music|movie|movies|film|sport|football|soccer|basketball|tennis|game|games|book|read|friends|family|home|weekend|gym|workout|exercise|run|running|swim)\b/.test(lower)) {
    selected = pickFresh([
      {
        reply: 'That sounds awesome—it is such a fun way to spend your time! How often do you usually do it?',
        hint: 'I try to do it every week whenever I have free time.',
      },
      {
        reply: 'I love that too! What is your favorite thing about it, or who do you usually enjoy it with?',
        hint: 'I usually do it with my friends, and we always have a great time.',
      },
    ]);
  } else if (/\b(car|cars|drive|driving|bus|taxi|bike|motorcycle|road|traffic)\b/.test(lower)) {
    selected = pickFresh([
      {
        reply: 'Getting around easily makes such a difference! Do you enjoy driving yourself, or do you prefer taking public transport?',
        hint: 'I prefer driving when the traffic is not too bad.',
      },
    ]);
  } else if (/\b(phone|computer|laptop|app|internet|website|tech|technology|ai|video|photo)\b/.test(lower)) {
    selected = pickFresh([
      {
        reply: 'Technology changes so fast nowadays! How do you use that the most in your daily routine?',
        hint: 'I mostly use it for work, learning English, and messaging friends.',
      },
    ]);
  } else if (/\b(shop|shopping|buy|bought|price|expensive|cheap|store|market|clothes|shoes)\b/.test(lower)) {
    selected = pickFresh([
      {
        reply: 'Nice! Do you enjoy shopping in local stores, or do you usually prefer ordering things online?',
        hint: 'I like checking things out in person first before buying.',
      },
    ]);
  } else if (/\b(english|practice|practicing|learn|learning|speak|speaking|word|grammar|pronunciation|accent)\b/.test(lower)) {
    selected = pickFresh([
      {
        reply: 'You are doing great with your English! Keep talking with me about whatever interests you—what would you like to talk about right now?',
        hint: 'I want to talk about my daily life and practice real conversations.',
      },
    ]);
  } else if (/\b(thank|thanks|see you|goodbye|bye|good night|goodnight)\b/.test(lower)) {
    selected = pickFresh([
      {
        reply: 'You are very welcome! It has been great talking with you—feel free to keep chatting anytime. What else is on your mind?',
        hint: 'Thanks Alex! Let us keep talking for a few more minutes.',
      },
    ]);
  } else if (/^(hi|hello|hey|good morning|good afternoon|good evening|salam)[\s!.,?]*$/i.test(lower)) {
    selected = pickFresh([
      {
        reply: 'Hey! So glad you are here. How is your day going, and what would you like to talk about?',
        hint: 'Hi Alex! Things are going well—let us talk about my week.',
      },
    ]);
  } else if (lower.includes('practice speaking english with you') && history.length === 0) {
    selected = turns[0];
  }

  // Keep topic continuity from the immediately preceding turns when the learner gives a short/brand/follow-up answer
  if (!selected && history.length > 0) {
    const prevContext = history
      .slice(-2)
      .map((m) => m.text.toLowerCase())
      .join(' ');
    if (/\b(car|cars|toyota|honda|ford|bmw|mercedes|drive|driving|vehicle)\b/.test(`${lower} ${prevContext}`)) {
      selected = pickFresh([
        {
          reply: 'Nice choice—reliability really matters! Have you test-driven one yet, or looked at specific features you want?',
          hint: 'Not yet, I am comparing fuel efficiency and prices first.',
        },
        {
          reply: 'That makes a lot of sense! Are you planning to buy it new or used?',
          hint: 'I am leaning toward a reliable used model in good condition.',
        },
      ]);
    } else if (/\b(food|eat|coffee|tea|dinner|lunch|breakfast|cook|cooking|restaurant|pizza)\b/.test(prevContext)) {
      selected = pickFresh([
        {
          reply: 'Sounds tasty! Do you have it often, or is it more of a special treat?',
          hint: 'I usually enjoy it on weekends with family or friends.',
        },
      ]);
    } else if (/\b(work|office|job|meeting|project|study|school|exam)\b/.test(prevContext)) {
      selected = pickFresh([
        {
          reply: 'Got it! How is that going for you so far—do you enjoy working on it?',
          hint: 'Yes, it keeps me busy, and I am learning a lot.',
        },
      ]);
    } else if (/\b(trip|travel|flight|airport|hotel|vacation|visit)\b/.test(prevContext)) {
      selected = pickFresh([
        {
          reply: 'That sounds like a great plan! How many days are you hoping to stay?',
          hint: 'Probably around a week so I have time to explore.',
        },
      ]);
    } else if (/\b(sport|football|soccer|gym|workout|movie|music|book|game)\b/.test(prevContext)) {
      selected = pickFresh([
        {
          reply: 'Nice! What do you enjoy most about it?',
          hint: 'I love relaxing and having fun without checking my phone.',
        },
      ]);
    }
  }

  if (!selected) {
    const trailingStop = new Set([
      'a', 'an', 'the', 'is', 'are', 'was', 'were', 'it', 'its', 'to', 'of',
      'in', 'on', 'at', 'for', 'with', 'and', 'or', 'but', 'because', 'so', 'that', 'this', 'my',
    ]);
    const words = (analysis.correctedEnglish || userMessage)
      .replace(/[.!?]+$/g, '')
      .trim()
      .split(/\s+/)
      .slice(0, 6);
    while (words.length > 2 && trailingStop.has(words[words.length - 1].toLowerCase())) {
      words.pop();
    }
    const cleanSnippet = words.join(' ');
    const isQuestion =
      userMessage.trim().endsWith('?') ||
      /^(what|why|how|when|where|who|can|could|do|did|is|are|will|would)\b/i.test(lower);
    if (isQuestion) {
      selected = pickFresh([
        {
          reply: `Good question! What made you curious about "${cleanSnippet}"?`,
          hint: 'I was curious because it comes up a lot in everyday English.',
        },
        {
          reply: 'That is a really thoughtful question! What is your own opinion on it?',
          hint: 'I think it depends on the situation, to be honest.',
        },
      ]);
    } else {
      selected = pickFresh([
        {
          reply: `That makes total sense! Tell me a bit more—what do you like most about it?`,
          hint: 'Well, the best part for me is how practical it is.',
        },
        {
          reply: `I see what you mean! How did you get into "${cleanSnippet}"?`,
          hint: 'Let me explain how it started for me.',
        },
        {
          reply: 'Got it, thanks for sharing! What are you planning to do next with that?',
          hint: 'Next, I want to take it one step at a time.',
        },
      ]);
    }
  }

  return {
    replyEnglish: selected.reply,
    hasMistake: analysis.hasMistake,
    correctedEnglish: analysis.correctedEnglish,
    explanation: analysis.explanation,
    suggestedNextReply: selected.hint,
    engineLabel: 'Keyless English Coach',
  };
}

export async function generateKeylessChatReply(params: {
  scenarioId: ScenarioId;
  level: ProficiencyLevel;
  history: Array<{ sender: 'user' | 'alex'; text: string }>;
  userMessage: string;
  targetLanguageName?: string;
}): Promise<KeylessChatResult> {
  const { scenarioId, level, history, userMessage, targetLanguageName } = params;

  const chromeRes = await tryChromeBuiltInChat(scenarioId, level, history, userMessage, targetLanguageName);
  if (chromeRes) return chromeRes;

  const pollRes = await tryClientPollinationsChat(scenarioId, level, history, userMessage, targetLanguageName);
  if (pollRes) return pollRes;

  return buildLocalCoachReply(scenarioId, level, history, userMessage);
}

const EXTRA_FREE_PHRASES: Record<ScenarioId, KeyPhrase[]> = {
  conversation: [
    {
      id: 'free-conv-1',
      english: 'Could we speak a little slower, please?',
      meaning: 'Please speak slightly more slowly so I can follow.',
      usageNote: 'Polite way to keep the chat comfortable.',
    },
    {
      id: 'free-conv-2',
      english: 'I have been learning English for a few months.',
      meaning: 'I started practicing English recently.',
      usageNote: 'Sets expectations warmly right at the start.',
    },
    {
      id: 'free-conv-3',
      english: 'How do you say this word in English?',
      meaning: 'What is the right English expression for this?',
      usageNote: 'Perfect for expanding your vocabulary live.',
    },
    {
      id: 'free-conv-4',
      english: 'I think that is a wonderful idea.',
      meaning: 'I really like what you just suggested.',
      usageNote: 'Natural phrase to show agreement and warmth.',
    },
    {
      id: 'free-conv-5',
      english: 'Talk to you again very soon!',
      meaning: 'Let us chat again in the near future!',
      usageNote: 'Friendly everyday goodbye.',
    },
  ],
  airport: [
    {
      id: 'free-air-1',
      english: 'Where is passport control?',
      meaning: 'Which direction do I go to show my passport?',
      usageNote: 'Essential at international terminals.',
    },
    {
      id: 'free-air-2',
      english: 'Can I bring this bag into the cabin?',
      meaning: 'Is this allowed as carry-on luggage?',
      usageNote: 'Ask at check-in before heading through security.',
    },
    {
      id: 'free-air-3',
      english: 'Has the boarding gate changed?',
      meaning: 'Is the flight still leaving from the same gate?',
      usageNote: 'Always double-check departure boards near the gates.',
    },
    {
      id: 'free-air-4',
      english: 'Where can I pick up my baggage?',
      meaning: 'Which carousel has luggage from my flight?',
      usageNote: 'Key question right after landing.',
    },
    {
      id: 'free-air-5',
      english: 'Is there a train or bus to the city center?',
      meaning: 'What is the easiest transport from the airport?',
      usageNote: 'Useful as soon as you exit arrivals.',
    },
  ],
  work: [
    {
      id: 'free-work-1',
      english: 'Can we hop on a quick call today?',
      meaning: 'Do you have a few minutes for a short call?',
      usageNote: 'Natural, friendly phrasing in modern workplaces.',
    },
    {
      id: 'free-work-2',
      english: 'I will update you as soon as I hear back.',
      meaning: 'Once I get news, I will message you right away.',
      usageNote: 'Very common in professional emails and Slack.',
    },
    {
      id: 'free-work-3',
      english: 'I have already sent the revised document.',
      meaning: 'The updated file is waiting in your inbox.',
      usageNote: 'Clear confirmation that a task is complete.',
    },
    {
      id: 'free-work-4',
      english: 'What are our next action items?',
      meaning: 'What tasks should we focus on next?',
      usageNote: 'Great way to wrap up a productive meeting.',
    },
    {
      id: 'free-work-5',
      english: 'Thank you so much for your collaboration!',
      meaning: 'I appreciate working together smoothly.',
      usageNote: 'Warm closing with teammates and clients.',
    },
  ],
  doctor: [
    {
      id: 'free-doc-1',
      english: 'I would like to book a medical appointment.',
      meaning: 'I need to schedule a visit with a doctor.',
      usageNote: 'Use this over the phone or at reception.',
    },
    {
      id: 'free-doc-2',
      english: 'I need a prescription for this medication.',
      meaning: 'I need a doctor’s note to buy this medicine.',
      usageNote: 'Required for many pharmacy treatments.',
    },
    {
      id: 'free-doc-3',
      english: 'I barely slept because of the pain.',
      meaning: 'The discomfort kept me awake overnight.',
      usageNote: 'Helps your doctor judge symptom severity.',
    },
    {
      id: 'free-doc-4',
      english: 'Is it safe to exercise while recovering?',
      meaning: 'Can I keep working out during this treatment?',
      usageNote: 'Smart question before leaving the clinic.',
    },
    {
      id: 'free-doc-5',
      english: 'Where is the nearest open pharmacy?',
      meaning: 'Which pharmacy is closest and open right now?',
      usageNote: 'Handy right after receiving a prescription.',
    },
  ],
  meeting: [
    {
      id: 'free-meet-1',
      english: 'How long have you lived in this city?',
      meaning: 'How many months or years have you spent here?',
      usageNote: 'Easy, warm question when meeting someone new.',
    },
    {
      id: 'free-meet-2',
      english: 'Would you like to grab a coffee together?',
      meaning: 'Want to go to a café for a drink and chat?',
      usageNote: 'Simple, friendly invitation.',
    },
    {
      id: 'free-meet-3',
      english: 'What do you do for work or study?',
      meaning: 'What field are you in?',
      usageNote: 'Natural follow-up after introductions.',
    },
    {
      id: 'free-meet-4',
      english: 'I love traveling just as much as you do!',
      meaning: 'We share the exact same passion for trips!',
      usageNote: 'Instantly builds connection during small talk.',
    },
    {
      id: 'free-meet-5',
      english: 'Let us stay connected on WhatsApp!',
      meaning: 'Let us message soon and keep in touch!',
      usageNote: 'Modern, casual way to exchange contacts.',
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

function normalizeIsoCode(code: string): string {
  const clean = code.toLowerCase().trim();
  if (clean === 'darija') return 'ar';
  if (clean === 'zgh') return 'fr';
  if (clean === 'en-simple') return 'en';
  if (clean.startsWith('custom:')) return '';
  return clean.split('-')[0];
}

export async function translateKeylessText(
  text: string,
  targetLanguageCode: string,
  targetLanguageName: string
): Promise<string | null> {
  const sourceLang = 'en';
  const isoTarget = normalizeIsoCode(targetLanguageCode);
  const trimmed = text.trim();
  if (!trimmed) return null;

  // 1. Try Chrome Built-in Translator API if supported
  const Translator = getChromeTranslator();
  if (Translator && isoTarget && isoTarget !== sourceLang) {
    try {
      if (Translator.availability) {
        const avail = await Translator.availability({ sourceLanguage: sourceLang, targetLanguage: isoTarget });
        if (avail !== 'no' && avail !== 'unavailable') {
          const instance = await Translator.create({ sourceLanguage: sourceLang, targetLanguage: isoTarget });
          try {
            const translated = await instance.translate(trimmed);
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

  // 2. Try Chrome Built-in LanguageModel (supports dialects like Darija too)
  const LM = getChromeLanguageModel();
  if (LM) {
    try {
      const avail = LM.availability ? await LM.availability() : 'available';
      if (avail !== 'no' && avail !== 'unavailable') {
        const session = await LM.create({
          systemPrompt: `Translate the English text into ${targetLanguageName}. Return ONLY the translated text without quotes.`,
        });
        try {
          const out = (await session.prompt(trimmed)).trim();
          if (out) return out;
        } finally {
          session.destroy?.();
        }
      }
    } catch {
      // Fall through
    }
  }

  // 3. Try Pollinations right away for dialect/custom (e.g. Darija) without any waiting limit
  const isSpecialDialect =
    targetLanguageCode === 'darija' ||
    targetLanguageCode === 'zgh' ||
    targetLanguageCode === 'en-simple' ||
    targetLanguageCode.startsWith('custom:');

  if (isSpecialDialect) {
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
              content: `Translate the English text naturally into ${targetLanguageName}. Return ONLY the translated text.`,
            },
            { role: 'user', content: trimmed },
          ],
        }),
      });
      const out = (await res.text()).trim();
      if (res.ok && out && !isPollinationsLimitBody(res.status, out)) {
        return out;
      }
    } catch {
      // Fall through
    }
  }

  // 4. Direct browser-side Google GTX (free, zero API key, instant)
  if (isoTarget) {
    if (isoTarget === sourceLang && targetLanguageCode !== 'en-simple') {
      return trimmed;
    }
    try {
      const gtxUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${encodeURIComponent(
        isoTarget
      )}&dt=t&q=${encodeURIComponent(trimmed)}`;
      const res = await fetch(gtxUrl, { signal: AbortSignal.timeout(5000) });
      if (res.ok) {
        const data = (await res.json()) as unknown[];
        if (Array.isArray(data) && Array.isArray(data[0])) {
          const joined = (data[0] as Array<[string]>)
            .map((seg) => (Array.isArray(seg) ? seg[0] || '' : ''))
            .join('')
            .trim();
          if (joined) return joined;
        }
      }
    } catch {
      // Fall through
    }

    // 5. Direct browser-side MyMemory API (CORS *, instant)
    try {
      const mmUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
        trimmed.slice(0, 480)
      )}&langpair=${encodeURIComponent(`en|${isoTarget}`)}`;
      const res = await fetch(mmUrl, { signal: AbortSignal.timeout(5000) });
      if (res.ok) {
        const data = (await res.json()) as {
          responseStatus?: number;
          responseData?: { translatedText?: string };
        };
        const out = data?.responseData?.translatedText?.trim();
        if (out && !/MYMEMORY WARNING|QUERY LENGTH LIMIT/i.test(out)) {
          return out;
        }
      }
    } catch {
      // Fall through
    }
  }

  // 6. Pollinations fallback without any waiting limit
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
            content: `Translate the English text into ${targetLanguageName}. Return ONLY the translated text.`,
          },
          { role: 'user', content: trimmed },
        ],
      }),
    });
    const out = (await res.text()).trim();
    if (res.ok && out && !isPollinationsLimitBody(res.status, out)) {
      return out;
    }
  } catch {
    // Fall through
  }

  return null;
}
