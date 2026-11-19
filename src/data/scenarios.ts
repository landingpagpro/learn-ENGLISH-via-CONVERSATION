import { KeyPhrase, LevelMeta, ProficiencyLevel, ScenarioId, ScenarioMeta } from '../types';
import appLogo from '../assets/images/italian_app_logo_1795030718095.jpg';

export const APP_LOGO_URL = appLogo;

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
    accentText: 'text-[#1E40AF]',
  },
  {
    id: 'airport',
    title: 'At the Airport',
    subtitle: 'Check-in, security & boarding gate',
    roleDescription: 'Practice check-in counters, baggage questions, security, and boarding gates in Italian.',
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
    roleDescription: 'Practice explaining how you feel, asking about medicine, and following medical advice in Italian.',
    accentBg: 'bg-rose-50',
    accentText: 'text-rose-700',
  },
  {
    id: 'meeting',
    title: 'Meeting Someone New',
    subtitle: 'Introductions, hobbies & plans',
    roleDescription: 'Practice breaking the ice, talking about yourself, and making Italian-speaking friends.',
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
        usageNote: 'Warm everyday question to start almost any Italian chat.',
      },
      {
        id: 'it-conv-b-2',
        italian: 'Puoi ripetere, per favore?',
        meaning: 'Could you repeat that, please?',
        usageNote: 'Very useful whenever someone speaks a bit too fast.',
      },
      {
        id: 'it-conv-b-3',
        italian: 'Che cosa significa questa parola?',
        meaning: 'What does this word mean?',
        usageNote: 'Great habit for learning new Italian vocabulary naturally.',
      },
      {
        id: 'it-conv-b-4',
        italian: 'Mi piace parlare di sport e viaggi.',
        meaning: 'I like talking about sports and travel.',
        usageNote: 'Swap "sport" and "viaggi" with any hobby you enjoy.',
      },
      {
        id: 'it-conv-b-5',
        italian: 'Sembra davvero interessante!',
        meaning: 'That sounds really interesting!',
        usageNote: 'Natural reaction that keeps the conversation friendly.',
      },
    ],
    intermediate: [
      {
        id: 'it-conv-i-1',
        italian: 'Che hai fatto di bello ultimamente?',
        meaning: 'What have you been up to lately?',
        usageNote: 'Natural, casual greeting between Italian friends.',
      },
      {
        id: 'it-conv-i-2',
        italian: 'Sinceramente, sono completamente d’accordo con te.',
        meaning: 'Honestly, I completely agree with you.',
        usageNote: '"Sinceramente" makes your opinion sound warm and natural.',
      },
      {
        id: 'it-conv-i-3',
        italian: 'Questo mi ricorda una storia simile.',
        meaning: 'That reminds me of a similar story.',
        usageNote: 'Smooth transition when you want to share an example.',
      },
      {
        id: 'it-conv-i-4',
        italian: 'Come passi di solito i tuoi fine settimana?',
        meaning: 'How do you usually spend your weekends?',
        usageNote: 'Great open-ended question to keep a chat going.',
      },
      {
        id: 'it-conv-i-5',
        italian: 'Capisco perfettamente il tuo punto di vista.',
        meaning: 'I completely understand your point of view.',
        usageNote: 'Polite phrase to validate someone’s perspective.',
      },
    ],
    advanced: [
      {
        id: 'it-conv-a-1',
        italian: 'Guardando il quadro generale, ha perfettamente senso.',
        meaning: 'Looking at the bigger picture, it makes complete sense.',
        usageNote: 'Natural expression for thoughtful discussions.',
      },
      {
        id: 'it-conv-a-2',
        italian: 'Hai colto proprio nel segno!',
        meaning: 'You hit the nail right on the head!',
        usageNote: 'Classic Italian idiom when someone makes a spot-on point.',
      },
      {
        id: 'it-conv-a-3',
        italian: 'Ho sentimenti contrastanti su questa idea.',
        meaning: 'I have mixed feelings about that idea.',
        usageNote: 'Balanced way to express a nuanced opinion.',
      },
      {
        id: 'it-conv-a-4',
        italian: 'Ad essere onesti, entrambe le parti hanno ragione.',
        meaning: 'To be fair, both sides have a valid point.',
        usageNote: 'Sounds diplomatic and articulate in debates.',
      },
      {
        id: 'it-conv-a-5',
        italian: 'Va da sé che la pratica ripaga sempre.',
        meaning: 'It goes without saying that practice always pays off.',
        usageNote: 'Strong connector to emphasize an obvious truth.',
      },
    ],
  },
  airport: {
    beginner: [
      {
        id: 'it-air-b-1',
        italian: 'Dov’è il banco del check-in?',
        meaning: 'Where is the check-in desk?',
        usageNote: 'Use as soon as you enter the departure hall.',
      },
      {
        id: 'it-air-b-2',
        italian: 'Ecco il mio passaporto e il biglietto.',
        meaning: 'Here is my passport and ticket.',
        usageNote: 'Simple, polite phrase at check-in or security.',
      },
      {
        id: 'it-air-b-3',
        italian: 'Posso avere un posto finestrino, per favore?',
        meaning: 'Can I have a window seat, please?',
        usageNote: 'Replace "finestrino" with "corridoio" for an aisle seat.',
      },
      {
        id: 'it-air-b-4',
        italian: 'Da quale gate parte il mio volo?',
        meaning: 'Which gate is my flight leaving from?',
        usageNote: 'Helpful if the departure screen is unclear.',
      },
      {
        id: 'it-air-b-5',
        italian: 'Il mio volo è in orario?',
        meaning: 'Is my flight on time?',
        usageNote: 'Short, direct question for airport staff.',
      },
    ],
    intermediate: [
      {
        id: 'it-air-i-1',
        italian: 'Vorrei imbarcare una valigia in stiva.',
        meaning: 'I would like to check in one suitcase.',
        usageNote: '"Vorrei" sounds polite and natural everywhere in Italy.',
      },
      {
        id: 'it-air-i-2',
        italian: 'Devo ritirare il bagaglio durante lo scalo?',
        meaning: 'Do I need to pick up my bag during the layover?',
        usageNote: 'Essential question when you have a connecting flight.',
      },
      {
        id: 'it-air-i-3',
        italian: 'Quanto tempo ci vuole a piedi fino al gate 14?',
        meaning: 'How long does it take to walk to Gate 14?',
        usageNote: 'Helps you manage your time in a big terminal.',
      },
      {
        id: 'it-air-i-4',
        italian: 'Questo bagaglio a mano rispetta le misure?',
        meaning: 'Is this carry-on bag within the size limit?',
        usageNote: 'Saves surprise fees at the boarding gate.',
      },
      {
        id: 'it-air-i-5',
        italian: 'Potrebbe avvisarmi quando inizia l’imbarco?',
        meaning: 'Could you let me know when boarding starts?',
        usageNote: 'Polite way to double-check near the gate desk.',
      },
    ],
    advanced: [
      {
        id: 'it-air-a-1',
        italian: 'Temo di perdere la coincidenza per colpa del ritardo.',
        meaning: 'I am afraid I might miss my connection due to the delay.',
        usageNote: '"Temo di" softens urgency while remaining clear.',
      },
      {
        id: 'it-air-a-2',
        italian: 'Sarebbe possibile riprenotarmi sul prossimo volo?',
        meaning: 'Would it be possible to rebook me on the next flight?',
        usageNote: 'Polite, effective phrasing at customer service.',
      },
      {
        id: 'it-air-a-3',
        italian: 'La mia valigia non è uscita sul nastro bagagli.',
        meaning: 'My suitcase did not show up on the baggage carousel.',
        usageNote: 'Key phrase at the lost luggage counter.',
      },
      {
        id: 'it-air-a-4',
        italian: 'I passeggeri hanno diritto a un rimborso per la notte?',
        meaning: 'Are passengers entitled to overnight compensation?',
        usageNote: 'Clear, professional question for airline desks.',
      },
      {
        id: 'it-air-a-5',
        italian: 'Potrebbe mettere un’etichetta fragile sulla borsa?',
        meaning: 'Could you put a fragile tag on my bag?',
        usageNote: 'Useful when traveling with electronics or glass.',
      },
    ],
  },
  work: {
    beginner: [
      {
        id: 'it-work-b-1',
        italian: 'Buongiorno! Com’è andato il tuo fine settimana?',
        meaning: 'Good morning! How was your weekend?',
        usageNote: 'Friendly Monday small talk before starting work.',
      },
      {
        id: 'it-work-b-2',
        italian: 'Oggi sto lavorando al rapporto.',
        meaning: 'I am working on the report today.',
        usageNote: 'Swap "rapporto" with "progetto" or "presentazione".',
      },
      {
        id: 'it-work-b-3',
        italian: 'Potresti aiutarmi con questo compito?',
        meaning: 'Could you help me with this task?',
        usageNote: '"Potresti" is polite and warm with coworkers.',
      },
      {
        id: 'it-work-b-4',
        italian: 'Qual è la scadenza per questo lavoro?',
        meaning: 'When is the deadline for this?',
        usageNote: 'Clear question to confirm priorities.',
      },
      {
        id: 'it-work-b-5',
        italian: 'Ti mando il file tra poco.',
        meaning: 'I will send you the file shortly.',
        usageNote: 'Useful in team chats and quick check-ins.',
      },
    ],
    intermediate: [
      {
        id: 'it-work-i-1',
        italian: 'Aggiornamento rapido: siamo perfettamente in orario.',
        meaning: 'Quick update: we are right on schedule.',
        usageNote: 'Crisp, positive status update for team meetings.',
      },
      {
        id: 'it-work-i-2',
        italian: 'Hai un minuto per rivedere questo insieme?',
        meaning: 'Do you have a minute to go over this together?',
        usageNote: 'Polite before interrupting a colleague at work.',
      },
      {
        id: 'it-work-i-3',
        italian: 'Aggiorniamoci domani pomeriggio per fare il punto.',
        meaning: 'Let us touch base tomorrow afternoon.',
        usageNote: '"Fare il punto" is a very common Italian office expression.',
      },
      {
        id: 'it-work-i-4',
        italian: 'Ho incontrato un piccolo problema con il file del cliente.',
        meaning: 'I ran into a small issue with the client file.',
        usageNote: 'Calm, professional way to report an unexpected blocker.',
      },
      {
        id: 'it-work-i-5',
        italian: 'Terrò tutti aggiornati sui nostri progressi.',
        meaning: 'I will keep everyone posted on our progress.',
        usageNote: 'Shows strong ownership and team communication.',
      },
    ],
    advanced: [
      {
        id: 'it-work-a-1',
        italian: 'Allineiamoci sulle priorità prima di procedere.',
        meaning: 'Let us align on priorities before moving forward.',
        usageNote: 'Great leadership phrase for planning meetings.',
      },
      {
        id: 'it-work-a-2',
        italian: 'Dobbiamo risolvere questo collo di bottiglia subito.',
        meaning: 'We need to address this bottleneck right away.',
        usageNote: 'Strong professional vocabulary for operations.',
      },
      {
        id: 'it-work-a-3',
        italian: 'Dal punto di vista pratico, questa tempistica è stretta.',
        meaning: 'From a practical standpoint, this timeline is tight.',
        usageNote: 'Diplomatic way to push back on unrealistic dates.',
      },
      {
        id: 'it-work-a-4',
        italian: 'Apprezzo molto il tuo feedback costruttivo sulla bozza.',
        meaning: 'I really appreciate your constructive feedback on the draft.',
        usageNote: 'Builds positive collaboration on teams.',
      },
      {
        id: 'it-work-a-5',
        italian: 'Riprendiamo il discorso appena abbiamo i dati finali.',
        meaning: 'Let us circle back once we have the final figures.',
        usageNote: 'Everyday executive Italian for follow-ups.',
      },
    ],
  },
  doctor: {
    beginner: [
      {
        id: 'it-doc-b-1',
        italian: 'Ho mal di testa e un po’ di febbre.',
        meaning: 'I have a headache and a bit of a fever.',
        usageNote: 'Swap "testa" with "gola" for sore throat.',
      },
      {
        id: 'it-doc-b-2',
        italian: 'È iniziato due giorni fa.',
        meaning: 'It started two days ago.',
        usageNote: 'Important detail every doctor will ask for.',
      },
      {
        id: 'it-doc-b-3',
        italian: 'Mi fa male proprio qui.',
        meaning: 'It hurts right here.',
        usageNote: 'Simple and direct during a physical exam.',
      },
      {
        id: 'it-doc-b-4',
        italian: 'Quante volte al giorno devo prendere questa medicina?',
        meaning: 'How many times a day should I take this medicine?',
        usageNote: 'Always confirm dosage instructions clearly.',
      },
      {
        id: 'it-doc-b-5',
        italian: 'Grazie dottore, ora mi sento più sollevato.',
        meaning: 'Thank you doctor, I feel relieved now.',
        usageNote: 'Warm closing at the end of an appointment.',
      },
    ],
    intermediate: [
      {
        id: 'it-doc-i-1',
        italian: 'Mi sento davvero giù di corda da tutta la settimana.',
        meaning: 'I have been feeling pretty run down all week.',
        usageNote: '"Giù di corda" is natural Italian for low energy.',
      },
      {
        id: 'it-doc-i-2',
        italian: 'Devo prendere queste pillole prima o dopo i pasti?',
        meaning: 'Should I take these pills before or after meals?',
        usageNote: 'Practical question for the doctor or pharmacist.',
      },
      {
        id: 'it-doc-i-3',
        italian: 'Ci sono effetti collaterali a cui fare attenzione?',
        meaning: 'Are there any side effects I should watch out for?',
        usageNote: 'Important check before starting new medication.',
      },
      {
        id: 'it-doc-i-4',
        italian: 'Sono allergico alla penicillina.',
        meaning: 'I am allergic to penicillin.',
        usageNote: 'Replace "penicillina" with any allergy you have.',
      },
      {
        id: 'it-doc-i-5',
        italian: 'Tra quanto tempo dovrei iniziare a stare meglio?',
        meaning: 'How soon should I start feeling better?',
        usageNote: 'Helps you know when to return if symptoms persist.',
      },
    ],
    advanced: [
      {
        id: 'it-doc-a-1',
        italian: 'Il fastidio tende a peggiorare durante la notte.',
        meaning: 'The discomfort tends to flare up at night.',
        usageNote: 'Natural medical phrasing to describe recurring symptoms.',
      },
      {
        id: 'it-doc-a-2',
        italian: 'Potrebbe essere legato allo stress o a un’allergia stagionale?',
        meaning: 'Could this be related to stress or a seasonal allergy?',
        usageNote: 'Helpful for narrowing down underlying causes.',
      },
      {
        id: 'it-doc-a-3',
        italian: 'Preferirei evitare farmaci che causano sonnolenza di giorno.',
        meaning: 'I would prefer to avoid medication that causes daytime drowsiness.',
        usageNote: 'Useful if you need to drive or work while recovering.',
      },
      {
        id: 'it-doc-a-4',
        italian: 'Mi serve un’impegnativa per vedere uno specialista?',
        meaning: 'Do I need a referral to see a specialist?',
        usageNote: 'Standard healthcare term in Italy ("impegnativa").',
      },
      {
        id: 'it-doc-a-5',
        italian: 'Quali segnali indicano che devo tornare per un controllo?',
        meaning: 'What warning signs mean I need a follow-up visit?',
        usageNote: 'Clear, proactive health communication.',
      },
    ],
  },
  meeting: {
    beginner: [
      {
        id: 'it-meet-b-1',
        italian: 'Piacere di conoscerti! Mi chiamo Sam.',
        meaning: 'Nice to meet you! My name is Sam.',
        usageNote: 'Warm, classic introduction when meeting someone in Italy.',
      },
      {
        id: 'it-meet-b-2',
        italian: 'Di dove sei?',
        meaning: 'Where are you from?',
        usageNote: 'Easy icebreaker in social settings.',
      },
      {
        id: 'it-meet-b-3',
        italian: 'Che cosa ti piace fare nel tempo libero?',
        meaning: 'What do you like doing in your free time?',
        usageNote: 'Friendly way to learn about someone’s hobbies.',
      },
      {
        id: 'it-meet-b-4',
        italian: 'Abiti qui vicino?',
        meaning: 'Do you live near here?',
        usageNote: 'Simple question when chatting at a café or event.',
      },
      {
        id: 'it-meet-b-5',
        italian: 'È stato un piacere parlare con te!',
        meaning: 'It was great talking with you!',
        usageNote: 'Leaves a warm impression when saying goodbye.',
      },
    ],
    intermediate: [
      {
        id: 'it-meet-i-1',
        italian: 'Come conosci gli altri qui presenti?',
        meaning: 'How do you know everyone here?',
        usageNote: 'One of the best social icebreakers at gatherings.',
      },
      {
        id: 'it-meet-i-2',
        italian: 'Mi sono trasferito qui solo da qualche mese.',
        meaning: 'I just moved here a few months ago.',
        usageNote: 'Great way to invite local recommendations.',
      },
      {
        id: 'it-meet-i-3',
        italian: 'Conosci qualche buon ristorante in questa zona?',
        meaning: 'Do you know any good restaurants around here?',
        usageNote: 'In Italy, everyone loves talking about great local food.',
      },
      {
        id: 'it-meet-i-4',
        italian: 'Fantastico! Come ti sei appassionato a questo?',
        meaning: 'That is awesome! How did you get into that?',
        usageNote: 'Shows genuine curiosity about someone’s interests.',
      },
      {
        id: 'it-meet-i-5',
        italian: 'Dobbiamo assolutamente restare in contatto!',
        meaning: 'We should definitely stay in touch!',
        usageNote: 'Friendly, natural way to wrap up a great chat.',
      },
    ],
    advanced: [
      {
        id: 'it-meet-a-1',
        italian: 'Qual è stato il momento migliore della tua settimana finora?',
        meaning: 'What has been the highlight of your week so far?',
        usageNote: 'Sparks much richer conversations than a routine "Come stai?".',
      },
      {
        id: 'it-meet-a-2',
        italian: 'Sto cercando di allargare il mio giro e conoscere nuove persone.',
        meaning: 'I am trying to branch out and meet new people.',
        usageNote: 'Warm and authentic way to explain joining a meetup.',
      },
      {
        id: 'it-meet-a-3',
        italian: 'Hai una prospettiva davvero interessante su questo tema.',
        meaning: 'You have such an interesting perspective on that topic.',
        usageNote: 'Makes the other person feel genuinely heard.',
      },
      {
        id: 'it-meet-a-4',
        italian: 'Sembra che abbiamo parecchie cose in comune.',
        meaning: 'It feels like we have quite a lot in common.',
        usageNote: 'Naturally deepens rapport with a new acquaintance.',
      },
      {
        id: 'it-meet-a-5',
        italian: 'Prendiamoci un caffè la settimana prossima se sei libero.',
        meaning: 'Let us grab a coffee next week if you are free.',
        usageNote: '"Prendiamoci un caffè" is relaxed, friendly native Italian.',
      },
    ],
  },
};
