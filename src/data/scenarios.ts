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
        usageNote: 'Great open-ended question to keep a chat going.',
      },
      {
        id: 'it-conv-i-5',
        italian: 'Capisco perfettamente il tuo punto di vista.',
        meaning: 'I completely understand your point of view.',
        usageNote: 'Polite phrase to acknowledge someone else’s opinion.',
      },
    ],
    advanced: [
      {
        id: 'it-conv-a-1',
        italian: 'Guardando il quadro generale, ha perfettamente senso.',
        meaning: 'Looking at the big picture, it makes complete sense.',
        usageNote: 'Articulate expression used in thoughtful Italian discussions.',
      },
      {
        id: 'it-conv-a-2',
        italian: 'Hai centrato proprio il punto!',
        meaning: 'You hit the nail right on the head!',
        usageNote: 'Natural Italian idiom when someone identifies the exact truth.',
      },
      {
        id: 'it-conv-a-3',
        italian: 'Ho sentimenti contrastanti su questa idea.',
        meaning: 'I have mixed feelings about this idea.',
        usageNote: 'Balanced way to express both pros and cons.',
      },
      {
        id: 'it-conv-a-4',
        italian: 'Ad essere onesti, entrambe le parti hanno ragione.',
        meaning: 'To be honest, both sides have a point.',
        usageNote: 'Diplomatic phrasing for debates and nuanced topics.',
      },
      {
        id: 'it-conv-a-5',
        italian: 'Va da sé che la pratica costante fa la differenza.',
        meaning: 'It goes without saying that steady practice makes the difference.',
        usageNote: '"Va da sé" is an elegant C1-C2 connector meaning "obviously".',
      },
    ],
  },
  airport: {
    beginner: [
      {
        id: 'it-air-b-1',
        italian: 'Dov’è il banco del check-in?',
        meaning: 'Where is the check-in desk?',
        usageNote: 'Use as soon as you arrive in the departures hall.',
      },
      {
        id: 'it-air-b-2',
        italian: 'Ecco il mio passaporto e il biglietto.',
        meaning: 'Here is my passport and ticket.',
        usageNote: 'Polite phrase when handing documents at the counter.',
      },
      {
        id: 'it-air-b-3',
        italian: 'Posso avere un posto vicino al finestrino?',
        meaning: 'Can I have a window seat?',
        usageNote: 'Swap "finestrino" with "corridoio" for an aisle seat.',
      },
      {
        id: 'it-air-b-4',
        italian: 'Da quale gate parte il mio volo?',
        meaning: 'Which gate does my flight depart from?',
        usageNote: 'Helpful when checking departure info with staff.',
      },
      {
        id: 'it-air-b-5',
        italian: 'Il mio volo è in orario?',
        meaning: 'Is my flight on time?',
        usageNote: 'Short, essential question at Italian airports.',
      },
    ],
    intermediate: [
      {
        id: 'it-air-i-1',
        italian: 'Vorrei imbarcare questa valigia in stiva.',
        meaning: 'I would like to check this suitcase into the hold.',
        usageNote: '"Vorrei" is the polite standard way to make requests.',
      },
      {
        id: 'it-air-i-2',
        italian: 'Devo ritirare il bagaglio durante lo scalo?',
        meaning: 'Do I need to collect my luggage during the layover?',
        usageNote: 'Crucial question whenever you have a connecting flight.',
      },
      {
        id: 'it-air-i-3',
        italian: 'Quanto tempo ci vuole a piedi per il gate 14?',
        meaning: 'How long does it take to walk to gate 14?',
        usageNote: 'Useful in large hubs like Rome Fiumicino or Milan Malpensa.',
      },
      {
        id: 'it-air-i-4',
        italian: 'Questo bagaglio a mano rispetta le dimensioni?',
        meaning: 'Does this carry-on bag meet the size limits?',
        usageNote: 'Helps avoid extra luggage fees at boarding.',
      },
      {
        id: 'it-air-i-5',
        italian: 'Potrebbe avvisarmi quando inizia l’imbarco?',
        meaning: 'Could you let me know when boarding begins?',
        usageNote: 'Formal polite "Lei" form ("Potrebbe") with airport staff.',
      },
    ],
    advanced: [
      {
        id: 'it-air-a-1',
        italian: 'Temo di poter perdere la coincidenza per questo ritardo.',
        meaning: 'I am afraid I might miss my connecting flight due to this delay.',
        usageNote: '"Temo di..." expresses polite concern smoothly.',
      },
      {
        id: 'it-air-a-2',
        italian: 'Sarebbe possibile riprenotarmi sul prossimo volo disponibile?',
        meaning: 'Would it be possible to rebook me on the next available flight?',
        usageNote: 'Polite, persuasive phrasing at airline customer service.',
      },
      {
        id: 'it-air-a-3',
        italian: 'La mia valigia non è uscita sul nastro bagagli.',
        meaning: 'My suitcase did not come out on the baggage carousel.',
        usageNote: 'Clear phrase for the lost luggage office (Ufficio Bagagli Smarriti).',
      },
      {
        id: 'it-air-a-4',
        italian: 'È previsto un rimborso o un buono pasto per l’attesa?',
        meaning: 'Is a refund or meal voucher provided for the wait?',
        usageNote: 'Practical passenger-rights question in Italy.',
      },
      {
        id: 'it-air-a-5',
        italian: 'Può applicare l’etichetta "fragile" su questa borsa?',
        meaning: 'Can you put a "fragile" tag on this bag?',
        usageNote: 'Useful when checking delicate items or souvenirs.',
      },
    ],
  },
  work: {
    beginner: [
      {
        id: 'it-work-b-1',
        italian: 'Buongiorno! Come è andato il fine settimana?',
        meaning: 'Good morning! How was your weekend?',
        usageNote: 'Friendly office small talk on Monday morning.',
      },
      {
        id: 'it-work-b-2',
        italian: 'Oggi sto lavorando al rapporto.',
        meaning: 'Today I am working on the report.',
        usageNote: 'Swap "rapporto" with "progetto" or "presentazione".',
      },
      {
        id: 'it-work-b-3',
        italian: 'Puoi aiutarmi con questo compito?',
        meaning: 'Can you help me with this task?',
        usageNote: 'Simple, natural way to ask a colleague for help.',
      },
      {
        id: 'it-work-b-4',
        italian: 'Quando è la scadenza?',
        meaning: 'When is the deadline?',
        usageNote: 'Direct question to confirm project timing.',
      },
      {
        id: 'it-work-b-5',
        italian: 'Ti mando il file tra poco.',
        meaning: 'I will send you the file shortly.',
        usageNote: '"Tra poco" means "in a little while".',
      },
    ],
    intermediate: [
      {
        id: 'it-work-i-1',
        italian: 'Piccolo aggiornamento: siamo perfettamente in tabella.',
        meaning: 'Quick update: we are right on schedule.',
        usageNote: '"In tabella (di marcia)" means on track with deadlines.',
      },
      {
        id: 'it-work-i-2',
        italian: 'Hai un minuto per rivedere insieme questa bozza?',
        meaning: 'Do you have a minute to review this draft together?',
        usageNote: 'Polite way to ask for feedback before interrupting.',
      },
      {
        id: 'it-work-i-3',
        italian: 'Aggiorniamoci domani pomeriggio per fare il punto.',
        meaning: 'Let us catch up tomorrow afternoon to touch base.',
        usageNote: '"Fare il punto" is classic Italian office phrasing.',
      },
      {
        id: 'it-work-i-4',
        italian: 'Ho incontrato un piccolo imprevisto con il cliente.',
        meaning: 'I ran into a small unexpected issue with the client.',
        usageNote: 'Calm, professional way to flag a problem early.',
      },
      {
        id: 'it-work-i-5',
        italian: 'Terrò tutto il team aggiornato sui progressi.',
        meaning: 'I will keep the whole team updated on progress.',
        usageNote: 'Shows strong teamwork and accountability.',
      },
    ],
    advanced: [
      {
        id: 'it-work-a-1',
        italian: 'Allineiamoci sulle priorità prima di procedere.',
        meaning: 'Let us align on priorities before moving forward.',
        usageNote: 'Sharp leadership phrase for Italian business meetings.',
      },
      {
        id: 'it-work-a-2',
        italian: 'Dobbiamo risolvere subito questo collo di bottiglia.',
        meaning: 'We need to resolve this bottleneck right away.',
        usageNote: '"Collo di bottiglia" is the exact equivalent of "bottleneck".',
      },
      {
        id: 'it-work-a-3',
        italian: 'Dal punto di vista della fattibilità, i tempi sono stretti.',
        meaning: 'From a feasibility standpoint, the timeline is tight.',
        usageNote: 'Diplomatic way to discuss unrealistic deadlines.',
      },
      {
        id: 'it-work-a-4',
        italian: 'Apprezzo molto il tuo riscontro costruttivo.',
        meaning: 'I really appreciate your constructive feedback.',
        usageNote: 'Polished professional Italian.',
      },
      {
        id: 'it-work-a-5',
        italian: 'Rivalutiamo la proposta non appena avremo i dati definitivi.',
        meaning: 'Let us revisit the proposal as soon as we have the final figures.',
        usageNote: 'Natural executive phrasing for data-driven follow-ups.',
      },
    ],
  },
  doctor: {
    beginner: [
      {
        id: 'it-doc-b-1',
        italian: 'Ho mal di testa e un po’ di febbre.',
        meaning: 'I have a headache and a bit of a fever.',
        usageNote: 'Swap with "mal di gola" (sore throat) or "tosse" (cough).',
      },
      {
        id: 'it-doc-b-2',
        italian: 'È iniziato due giorni fa.',
        meaning: 'It started two days ago.',
        usageNote: 'Every doctor asks when symptoms started.',
      },
      {
        id: 'it-doc-b-3',
        italian: 'Mi fa male proprio qui.',
        meaning: 'It hurts right here.',
        usageNote: 'Simple and direct while pointing during an exam.',
      },
      {
        id: 'it-doc-b-4',
        italian: 'Quante volte al giorno devo prendere questa medicina?',
        meaning: 'How many times a day should I take this medicine?',
        usageNote: 'Essential dosage question at the clinic or pharmacy.',
      },
      {
        id: 'it-doc-b-5',
        italian: 'Grazie dottore, ora mi sento più tranquillo.',
        meaning: 'Thank you doctor, I feel more reassured now.',
        usageNote: 'Polite way to close a medical visit.',
      },
    ],
    intermediate: [
      {
        id: 'it-doc-i-1',
        italian: 'Mi sento molto stanco e giù di forze da tutta la settimana.',
        meaning: 'I have been feeling very tired and worn out all week.',
        usageNote: '"Giù di forze" is very natural Italian for low energy.',
      },
      {
        id: 'it-doc-i-2',
        italian: 'Devo prendere queste compresse prima o dopo i pasti?',
        meaning: 'Should I take these tablets before or after meals?',
        usageNote: 'Very practical question for prescriptions.',
      },
      {
        id: 'it-doc-i-3',
        italian: 'Ci sono effetti collaterali a cui devo fare attenzione?',
        meaning: 'Are there any side effects I should watch out for?',
        usageNote: '"Effetti collaterali" means side effects.',
      },
      {
        id: 'it-doc-i-4',
        italian: 'Sono allergico alla penicillina.',
        meaning: 'I am allergic to penicillin.',
        usageNote: 'Swap with any medication or food allergy you have.',
      },
      {
        id: 'it-doc-i-5',
        italian: 'Tra quanti giorni dovrei iniziare a stare meglio?',
        meaning: 'In how many days should I start feeling better?',
        usageNote: 'Helps you know when to follow up if symptoms continue.',
      },
    ],
    advanced: [
      {
        id: 'it-doc-a-1',
        italian: 'Il fastidio tende a riacutizzarsi soprattutto di notte.',
        meaning: 'The discomfort tends to flare up especially at night.',
        usageNote: '"Riacutizzarsi" accurately describes recurring symptoms.',
      },
      {
        id: 'it-doc-a-2',
        italian: 'Potrebbe essere legato allo stress o a un’allergia stagionale?',
        meaning: 'Could it be related to stress or a seasonal allergy?',
        usageNote: 'Thoughtful question to explore root causes.',
      },
      {
        id: 'it-doc-a-3',
        italian: 'Preferirei un farmaco che non provochi sonnolenza di giorno.',
        meaning: 'I would prefer a medication that does not cause daytime drowsiness.',
        usageNote: 'Important if you need to drive or stay sharp at work.',
      },
      {
        id: 'it-doc-a-4',
        italian: 'Serve l’impegnativa per fare una visita specialistica?',
        meaning: 'Do I need a doctor’s referral to see a specialist?',
        usageNote: '"Impegnativa" is the official term in Italian healthcare.',
      },
      {
        id: 'it-doc-a-5',
        italian: 'Quali segnali richiederebbero un controllo urgente?',
        meaning: 'Which warning signs would require an urgent checkup?',
        usageNote: 'Clear, proactive medical communication.',
      },
    ],
  },
  meeting: {
    beginner: [
      {
        id: 'it-meet-b-1',
        italian: 'Piacere di conoscerti! Mi chiamo Sam.',
        meaning: 'Nice to meet you! My name is Sam.',
        usageNote: 'Warm classic Italian greeting—swap "Sam" with your name.',
      },
      {
        id: 'it-meet-b-2',
        italian: 'Di dove sei?',
        meaning: 'Where are you from?',
        usageNote: 'Friendly icebreaker in any social conversation.',
      },
      {
        id: 'it-meet-b-3',
        italian: 'Cosa ti piace fare nel tempo libero?',
        meaning: 'What do you like doing in your free time?',
        usageNote: 'Great way to ask about hobbies.',
      },
      {
        id: 'it-meet-b-4',
        italian: 'Abiti qui vicino?',
        meaning: 'Do you live nearby?',
        usageNote: 'Easy question when chatting at a cafe or event.',
      },
      {
        id: 'it-meet-b-5',
        italian: 'È stato un piacere parlare con te!',
        meaning: 'It was a pleasure talking with you!',
        usageNote: 'Warm goodbye that leaves a great impression.',
      },
    ],
    intermediate: [
      {
        id: 'it-meet-i-1',
        italian: 'Come conosci tutte queste persone?',
        meaning: 'How do you know everyone here?',
        usageNote: 'Classic friendly icebreaker at Italian gatherings.',
      },
      {
        id: 'it-meet-i-2',
        italian: 'Mi sono trasferito qui solo da qualche mese.',
        meaning: 'I only moved here a few months ago.',
        usageNote: 'Great way to invite local tips and recommendations.',
      },
      {
        id: 'it-meet-i-3',
        italian: 'Conosci qualche buon ristorante in questa zona?',
        meaning: 'Do you know any good restaurants around here?',
        usageNote: 'Italians almost always love recommending great local food!',
      },
      {
        id: 'it-meet-i-4',
        italian: 'Che bello! Come hai iniziato ad appassionarti?',
        meaning: 'How cool! How did you first get into that?',
        usageNote: 'Shows genuine interest in someone’s hobby or career.',
      },
      {
        id: 'it-meet-i-5',
        italian: 'Restiamo assolutamente in contatto!',
        meaning: 'Let us definitely stay in touch!',
        usageNote: 'Natural closing before exchanging contacts.',
      },
    ],
    advanced: [
      {
        id: 'it-meet-a-1',
        italian: 'Qual è stato il momento più bello della tua settimana?',
        meaning: 'What has been the highlight of your week so far?',
        usageNote: 'Sparks much warmer conversation than a routine greeting.',
      },
      {
        id: 'it-meet-a-2',
        italian: 'Sto cercando di ampliare la mia cerchia di conoscenze qui.',
        meaning: 'I am trying to broaden my circle of acquaintances here.',
        usageNote: 'Natural, articulate way to say you enjoy meeting new people.',
      },
      {
        id: 'it-meet-a-3',
        italian: 'Hai davvero un punto di vista originale su questo.',
        meaning: 'You really have an original perspective on this.',
        usageNote: 'Thoughtful compliment that deepens conversation.',
      },
      {
        id: 'it-meet-a-4',
        italian: 'Mi sembra che abbiamo parecchie cose in comune.',
        meaning: 'It feels like we have quite a lot in common.',
        usageNote: 'Builds quick rapport with a new Italian friend.',
      },
      {
        id: 'it-meet-a-5',
        italian: 'Prendiamoci un caffè la settimana prossima se ti va!',
        meaning: 'Let us grab a coffee next week if you feel like it!',
        usageNote: 'Warm, relaxed Italian invitation.',
      },
    ],
  },
};
