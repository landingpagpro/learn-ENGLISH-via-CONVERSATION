import { KeyPhrase, LevelMeta, ProficiencyLevel, ScenarioId, ScenarioMeta } from '../types';
import italianLogo from '../assets/images/italian_app_logo_1795030718095.jpg';

export const APP_LOGO_URL = italianLogo;

export const LEVELS: LevelMeta[] = [
  {
    id: 'beginner',
    label: 'Beginner',
    description: 'Simple words & short sentences',
  },
  {
    id: 'intermediate',
    label: 'Intermediate',
    description: 'Natural everyday Italian',
  },
  {
    id: 'advanced',
    label: 'Advanced',
    description: 'Native idioms & fluent depth',
  },
];

export const SCENARIOS: ScenarioMeta[] = [
  {
    id: 'conversation',
    title: 'Learn Italian via Conversation',
    subtitle: 'Free talk & daily Italian practice',
    roleDescription: 'Practice natural everyday Italian conversations on any topic you choose.',
    accentBg: 'bg-blue-50',
    accentText: 'text-[#1E3A8A]',
  },
  {
    id: 'airport',
    title: 'At the Airport',
    subtitle: 'Check-in, security & boarding gate',
    roleDescription: 'Practice check-in counters, baggage questions, security, and boarding gates in Italy.',
    accentBg: 'bg-sky-50',
    accentText: 'text-sky-700',
  },
  {
    id: 'work',
    title: 'At Work',
    subtitle: 'Team check-ins & project updates',
    roleDescription: 'Practice office updates, discussing deadlines, and collaborating with Italian colleagues.',
    accentBg: 'bg-indigo-50',
    accentText: 'text-indigo-700',
  },
  {
    id: 'doctor',
    title: 'At the Doctor',
    subtitle: 'Symptoms, checkup & prescriptions',
    roleDescription: 'Practice explaining how you feel, asking about medicine, and following medical advice.',
    accentBg: 'bg-rose-50',
    accentText: 'text-rose-700',
  },
  {
    id: 'meeting',
    title: 'Meeting Someone New',
    subtitle: 'Introductions, hobbies & plans',
    roleDescription: 'Practice breaking the ice, talking about yourself, and making new Italian friends.',
    accentBg: 'bg-amber-50',
    accentText: 'text-amber-700',
  },
];

export const INITIAL_PHRASES: Record<ScenarioId, Record<ProficiencyLevel, KeyPhrase[]>> = {
  conversation: {
    beginner: [
      {
        id: 'it-conv-b-1',
        italian: 'Come va la tua giornata?',
        meaning: 'How is your day going?',
        usageNote: 'Warm everyday question to start almost any Italian conversation.',
      },
      {
        id: 'it-conv-b-2',
        italian: 'Puoi ripetere, per favore?',
        meaning: 'Could you repeat that, please?',
        usageNote: 'Very helpful whenever someone speaks a bit too fast.',
      },
      {
        id: 'it-conv-b-3',
        italian: 'Cosa significa questa parola?',
        meaning: 'What does this word mean?',
        usageNote: 'Great habit for learning new Italian vocabulary naturally.',
      },
      {
        id: 'it-conv-b-4',
        italian: 'Mi piace parlare di sport e viaggi.',
        meaning: 'I like talking about sports and travel.',
        usageNote: 'Swap "sport e viaggi" with your own hobbies.',
      },
      {
        id: 'it-conv-b-5',
        italian: 'Sembra davvero interessante!',
        meaning: 'That sounds really interesting!',
        usageNote: 'Shows curiosity and keeps the chat friendly.',
      },
    ],
    intermediate: [
      {
        id: 'it-conv-i-1',
        italian: 'Cosa hai fatto di bello ultimamente?',
        meaning: 'What have you been up to lately?',
        usageNote: 'Very natural, friendly greeting between Italian friends.',
      },
      {
        id: 'it-conv-i-2',
        italian: 'Sinceramente, sono completamente d’accordo.',
        meaning: 'Honestly, I completely agree.',
        usageNote: '"Sinceramente" makes your opinion sound conversational.',
      },
      {
        id: 'it-conv-i-3',
        italian: 'Questo mi ricorda una storia simile.',
        meaning: 'That reminds me of a similar story.',
        usageNote: 'Smooth transition when sharing your own experience.',
      },
      {
        id: 'it-conv-i-4',
        italian: 'Come passi di solito il fine settimana?',
        meaning: 'How do you usually spend the weekend?',
        usageNote: 'Easy open-ended question to keep talking.',
      },
      {
        id: 'it-conv-i-5',
        italian: 'Non ho sentito bene l’ultima parte.',
        meaning: 'I did not quite catch the last part.',
        usageNote: 'Politer than just saying "Come?" when you miss a phrase.',
      },
    ],
    advanced: [
      {
        id: 'it-conv-a-1',
        italian: 'È davvero un’osservazione molto acuta.',
        meaning: 'That is a really sharp point.',
        usageNote: 'Great in thoughtful discussions and debates.',
      },
      {
        id: 'it-conv-a-2',
        italian: 'A proposito, hai visto l’ultimo aggiornamento?',
        meaning: 'Speaking of which, have you seen the latest update?',
        usageNote: '"A proposito" shifts smoothly to a related topic.',
      },
      {
        id: 'it-conv-a-3',
        italian: 'Capisco perfettamente il tuo punto di vista.',
        meaning: 'I completely understand your perspective.',
        usageNote: 'Respectful even when you hold a slightly different view.',
      },
      {
        id: 'it-conv-a-4',
        italian: 'Per farla breve, alla fine è andato tutto bene.',
        meaning: 'Long story short, everything worked out in the end.',
        usageNote: '"Per farla breve" is very common when summarizing a story.',
      },
      {
        id: 'it-conv-a-5',
        italian: 'Mi è proprio passato di mente, grazie per avermelo ricordato!',
        meaning: 'It completely slipped my mind, thanks for reminding me!',
        usageNote: '"Passare di mente" sounds much softer than "Ho dimenticato".',
      },
    ],
  },
  airport: {
    beginner: [
      {
        id: 'it-air-b-1',
        italian: 'Ecco il mio passaporto.',
        meaning: 'Here is my passport.',
        usageNote: 'Simple and polite at check-in or passport control.',
      },
      {
        id: 'it-air-b-2',
        italian: 'Dov’è il gate 12?',
        meaning: 'Where is gate 12?',
        usageNote: 'Replace 12 with your gate number on the boarding pass.',
      },
      {
        id: 'it-air-b-3',
        italian: 'Ho una valigia da imbarcare.',
        meaning: 'I have one suitcase to check in.',
        usageNote: 'Useful right at the airline check-in counter.',
      },
      {
        id: 'it-air-b-4',
        italian: 'Posso avere un posto finestrino?',
        meaning: 'Can I have a window seat?',
        usageNote: 'Swap "finestrino" with "corridoio" for an aisle seat.',
      },
      {
        id: 'it-air-b-5',
        italian: 'A che ora parte l’aereo?',
        meaning: 'What time does the plane leave?',
        usageNote: 'Clear everyday question for departure times.',
      },
    ],
    intermediate: [
      {
        id: 'it-air-i-1',
        italian: 'Vorrei fare il check-in per il mio volo.',
        meaning: 'I would like to check in for my flight.',
        usageNote: '"Vorrei..." sounds polite and natural everywhere in Italy.',
      },
      {
        id: 'it-air-i-2',
        italian: 'Il volo è in orario?',
        meaning: 'Is the flight on time?',
        usageNote: 'Great to ask at the gate desk before boarding.',
      },
      {
        id: 'it-air-i-3',
        italian: 'Dov’è il ritiro bagagli?',
        meaning: 'Where is baggage claim?',
        usageNote: 'Follow signs marked "Ritiro Bagagli" after landing.',
      },
      {
        id: 'it-air-i-4',
        italian: 'Devo togliere le scarpe ai controlli?',
        meaning: 'Do I need to take off my shoes at security?',
        usageNote: 'Always helpful to ask security staff quickly.',
      },
      {
        id: 'it-air-i-5',
        italian: 'Quanto dura lo scalo?',
        meaning: 'How long is the layover?',
        usageNote: '"Lo scalo" means the connection stop between two flights.',
      },
    ],
    advanced: [
      {
        id: 'it-air-a-1',
        italian: 'C’è per caso un posto lato corridoio disponibile?',
        meaning: 'Any chance there is an aisle seat available?',
        usageNote: '"Per caso" softens a request naturally in Italian.',
      },
      {
        id: 'it-air-a-2',
        italian: 'Ho una coincidenza molto stretta.',
        meaning: 'My connecting flight is very tight.',
        usageNote: '"Coincidenza" is the standard Italian word for connection.',
      },
      {
        id: 'it-air-a-3',
        italian: 'Il bagaglio arriva direttamente a destinazione finale?',
        meaning: 'Will my luggage go straight to the final destination?',
        usageNote: 'Confirms whether you need to re-check bags during a layover.',
      },
      {
        id: 'it-air-a-4',
        italian: 'Sembra che l’imbarco inizi tra dieci minuti.',
        meaning: 'Looks like boarding starts in ten minutes.',
        usageNote: '"L’imbarco" means boarding.',
      },
      {
        id: 'it-air-a-5',
        italian: 'La mia valigia non è uscita sul nastro.',
        meaning: 'My suitcase did not come out on the belt.',
        usageNote: 'Use this at the lost-baggage desk ("Ufficio Bagagli Smarriti").',
      },
    ],
  },
  work: {
    beginner: [
      {
        id: 'it-wrk-b-1',
        italian: 'Sto lavorando su questo progetto.',
        meaning: 'I am working on this project.',
        usageNote: 'Clear update during morning team check-ins.',
      },
      {
        id: 'it-wrk-b-2',
        italian: 'Puoi aiutarmi, per favore?',
        meaning: 'Can you help me, please?',
        usageNote: 'Direct and polite whenever you need a teammate.',
      },
      {
        id: 'it-wrk-b-3',
        italian: 'Ho finito il mio lavoro.',
        meaning: 'I finished my work.',
        usageNote: 'Great for updating a manager or colleague.',
      },
      {
        id: 'it-wrk-b-4',
        italian: 'Scusa, non ho capito bene.',
        meaning: 'Sorry, I did not understand clearly.',
        usageNote: 'Always okay to ask for clarity in Italian meetings.',
      },
      {
        id: 'it-wrk-b-5',
        italian: 'Facciamo una piccola pausa caffè.',
        meaning: 'Let us take a short coffee break.',
        usageNote: 'A very Italian workplace classic!',
      },
    ],
    intermediate: [
      {
        id: 'it-wrk-i-1',
        italian: 'Controllo subito e ti faccio sapere.',
        meaning: 'Let me check right away and let you know.',
        usageNote: 'Professional and natural in office chats and calls.',
      },
      {
        id: 'it-wrk-i-2',
        italian: 'Ho incontrato un piccolo problema.',
        meaning: 'I ran into a small issue.',
        usageNote: 'Clear way to flag a blocker early.',
      },
      {
        id: 'it-wrk-i-3',
        italian: 'Siamo ancora in tempo per venerdì?',
        meaning: 'Are we still on track for Friday?',
        usageNote: 'Useful to check project deadlines politely.',
      },
      {
        id: 'it-wrk-i-4',
        italian: 'Puoi condividere lo schermo?',
        meaning: 'Could you share your screen?',
        usageNote: 'Essential phrase for Italian video calls.',
      },
      {
        id: 'it-wrk-i-5',
        italian: 'Mi sembra un ottimo piano.',
        meaning: 'Sounds like a great plan.',
        usageNote: 'Positive, natural way to agree with a colleague.',
      },
    ],
    advanced: [
      {
        id: 'it-wrk-a-1',
        italian: 'Aggiorniamoci domattina su questo punto.',
        meaning: 'Let us catch up tomorrow morning on this point.',
        usageNote: 'Natural Italian business phrasing for following up.',
      },
      {
        id: 'it-wrk-a-2',
        italian: 'Hai margine per occuparti di questa attività?',
        meaning: 'Do you have bandwidth to take on this task?',
        usageNote: '"Avere margine" means having available time or capacity.',
      },
      {
        id: 'it-wrk-a-3',
        italian: 'Volevo solo darti un piccolo preavviso.',
        meaning: 'Just wanted to give you a quick heads-up.',
        usageNote: 'Great when alerting teammates ahead of schedule.',
      },
      {
        id: 'it-wrk-a-4',
        italian: 'Siamo tutti allineati sui prossimi passi.',
        meaning: 'We are all aligned on the next steps.',
        usageNote: 'Used to wrap up team meetings cleanly.',
      },
      {
        id: 'it-wrk-a-5',
        italian: 'Coinvolgo anche Marco in questa conversazione.',
        meaning: 'Let me loop Marco into this thread.',
        usageNote: '"Coinvolgere" means bringing a colleague into the discussion.',
      },
    ],
  },
  doctor: {
    beginner: [
      {
        id: 'it-doc-b-1',
        italian: 'Ho mal di testa.',
        meaning: 'I have a headache.',
        usageNote: 'Swap "testa" with "stomaco" or "schiena" as needed.',
      },
      {
        id: 'it-doc-b-2',
        italian: 'Mi sento molto stanco.',
        meaning: 'I feel very tired.',
        usageNote: 'Use "stanca" if speaking as a woman.',
      },
      {
        id: 'it-doc-b-3',
        italian: 'Da ieri sera.',
        meaning: 'Since last night.',
        usageNote: 'Quick answer when the doctor asks "Da quando?"',
      },
      {
        id: 'it-doc-b-4',
        italian: 'Ho bisogno di una medicina.',
        meaning: 'I need some medicine.',
        usageNote: 'Clear and easy at a clinic or "farmacia".',
      },
      {
        id: 'it-doc-b-5',
        italian: 'Quante volte al giorno?',
        meaning: 'How many times a day?',
        usageNote: 'Important question so you follow the dosage safely.',
      },
    ],
    intermediate: [
      {
        id: 'it-doc-i-1',
        italian: 'Ho mal di gola da tre giorni.',
        meaning: 'I have had a sore throat for three days.',
        usageNote: 'Italian uses the present tense + "da" for ongoing symptoms.',
      },
      {
        id: 'it-doc-i-2',
        italian: 'Devo prenderlo a stomaco pieno?',
        meaning: 'Should I take this with food?',
        usageNote: '"A stomaco pieno" literally means on a full stomach.',
      },
      {
        id: 'it-doc-i-3',
        italian: 'Sono allergico alla penicillina.',
        meaning: 'I am allergic to penicillin.',
        usageNote: 'Always mention drug allergies before a prescription.',
      },
      {
        id: 'it-doc-i-4',
        italian: 'Mi fa male quando deglutisco.',
        meaning: 'It hurts when I swallow.',
        usageNote: 'Helps the doctor pinpoint throat pain.',
      },
      {
        id: 'it-doc-i-5',
        italian: 'Serve la ricetta medica per questo?',
        meaning: 'Do I need a doctor’s prescription for this?',
        usageNote: '"Ricetta medica" is the Italian term for prescription.',
      },
    ],
    advanced: [
      {
        id: 'it-doc-a-1',
        italian: 'È tutta la settimana che non mi sento in forma.',
        meaning: 'I have been feeling under the weather all week.',
        usageNote: 'Natural everyday Italian for feeling mildly unwell.',
      },
      {
        id: 'it-doc-a-2',
        italian: 'Il dolore va e viene durante la giornata.',
        meaning: 'The pain comes and goes during the day.',
        usageNote: 'Accurate phrasing to help a doctor diagnose patterns.',
      },
      {
        id: 'it-doc-a-3',
        italian: 'Ci sono effetti collaterali a cui fare attenzione?',
        meaning: 'Are there any side effects I should watch out for?',
        usageNote: '"Effetti collaterali" means side effects.',
      },
      {
        id: 'it-doc-a-4',
        italian: 'Spero sia solo un leggero malanno di stagione.',
        meaning: 'I hope it is just a mild seasonal bug.',
        usageNote: 'Idiomatic expression for a common seasonal cold.',
      },
      {
        id: 'it-doc-a-5',
        italian: 'Quando dovrei tornare se non passa?',
        meaning: 'When should I come back if it does not clear up?',
        usageNote: '"Se non passa" means if symptoms do not go away.',
      },
    ],
  },
  meeting: {
    beginner: [
      {
        id: 'it-met-b-1',
        italian: 'Piacere di conoscerti!',
        meaning: 'Nice to meet you!',
        usageNote: 'Classic friendly greeting when meeting someone new.',
      },
      {
        id: 'it-met-b-2',
        italian: 'Sono del Marocco.',
        meaning: 'I am from Morocco.',
        usageNote: 'Swap with your own country or city anytime.',
      },
      {
        id: 'it-met-b-3',
        italian: 'Cosa ti piace fare nel tempo libero?',
        meaning: 'What do you like doing in your free time?',
        usageNote: 'Easy question that keeps conversation flowing.',
      },
      {
        id: 'it-met-b-4',
        italian: 'Mi piace molto imparare l’italiano.',
        meaning: 'I really love learning Italian.',
        usageNote: 'Italians always appreciate hearing your interest!',
      },
      {
        id: 'it-met-b-5',
        italian: 'A presto!',
        meaning: 'See you soon!',
        usageNote: 'Warm, casual way to say goodbye.',
      },
    ],
    intermediate: [
      {
        id: 'it-met-i-1',
        italian: 'Di cosa ti occupi nella vita?',
        meaning: 'What do you do for a living?',
        usageNote: 'Warmer and more natural than "Qual è il tuo lavoro?".',
      },
      {
        id: 'it-met-i-2',
        italian: 'Da quanto tempo vivi qui?',
        meaning: 'How long have you lived here?',
        usageNote: 'Great conversation starter in a new city.',
      },
      {
        id: 'it-met-i-3',
        italian: 'Nel tempo libero mi piace cucinare.',
        meaning: 'In my free time, I enjoy cooking.',
        usageNote: 'Swap "cucinare" with viaggiare, leggere, or calcio.',
      },
      {
        id: 'it-met-i-4',
        italian: 'Dovremmo prendere un caffè insieme qualche volta!',
        meaning: 'We should grab a coffee sometime!',
        usageNote: 'The ultimate Italian way to suggest hanging out.',
      },
      {
        id: 'it-met-i-5',
        italian: 'Mi lasci il tuo numero o Instagram?',
        meaning: 'Can I get your number or Instagram?',
        usageNote: 'Casual, natural way to stay in touch.',
      },
    ],
    advanced: [
      {
        id: 'it-met-a-1',
        italian: 'È stato un vero piacere fare due chiacchiere con te!',
        meaning: 'It has been a real pleasure chatting with you!',
        usageNote: '"Fare due chiacchiere" means having a friendly chat.',
      },
      {
        id: 'it-met-a-2',
        italian: 'Come ti sei appassionato a questo settore?',
        meaning: 'How did you get passionate about this field?',
        usageNote: 'Encourages people to share personal stories.',
      },
      {
        id: 'it-met-a-3',
        italian: 'Adoro scoprire nuovi posticini dove mangiare.',
        meaning: 'I love discovering cozy new places to eat.',
        usageNote: '"Posticini" adds warm, authentic Italian flavor.',
      },
      {
        id: 'it-met-a-4',
        italian: 'Ma dai, com’è piccolo il mondo!',
        meaning: 'No way, what a small world!',
        usageNote: 'Say this when you find an unexpected coincidence.',
      },
      {
        id: 'it-met-a-5',
        italian: 'Scrivimi pure quando sei libero questa settimana.',
        meaning: 'Feel free to text me whenever you are free this week.',
        usageNote: '"Scrivimi pure" sounds warm and inviting.',
      },
    ],
  },
};
