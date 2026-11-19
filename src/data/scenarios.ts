import { KeyPhrase, LevelMeta, ProficiencyLevel, ScenarioId, ScenarioMeta } from '../types';
import appLogo from '../assets/images/french_app_logo_1795081299674.jpg';

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
    description: 'Natural everyday French',
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
    title: 'Français par la conversation',
    subtitle: 'Free talk & daily French practice',
    roleDescription: 'Practice natural everyday French conversations on any topic you choose.',
    accentBg: 'bg-indigo-50',
    accentText: 'text-[#1E3A8A]',
  },
  {
    id: 'airport',
    title: 'At the Airport',
    subtitle: 'Check-in, security & boarding gate',
    roleDescription: 'Practice check-in counters, baggage questions, security, and boarding gates in French.',
    accentBg: 'bg-sky-50',
    accentText: 'text-sky-800',
  },
  {
    id: 'work',
    title: 'At Work',
    subtitle: 'Team check-ins & project updates',
    roleDescription: 'Practice office updates, discussing deadlines, and collaborating with French colleagues.',
    accentBg: 'bg-amber-50',
    accentText: 'text-amber-800',
  },
  {
    id: 'doctor',
    title: 'At the Doctor',
    subtitle: 'Symptoms, checkup & prescriptions',
    roleDescription: 'Practice explaining how you feel, asking about medicine, and following medical advice in French.',
    accentBg: 'bg-rose-50',
    accentText: 'text-rose-800',
  },
  {
    id: 'meeting',
    title: 'Meeting Someone New',
    subtitle: 'Introductions, hobbies & plans',
    roleDescription: 'Practice breaking the ice, talking about yourself, and making French-speaking friends.',
    accentBg: 'bg-teal-50',
    accentText: 'text-teal-800',
  },
];

export const INITIAL_PHRASES: Record<ScenarioId, Record<ProficiencyLevel, KeyPhrase[]>> = {
  conversation: {
    beginner: [
      {
        id: 'fr-conv-b-1',
        french: 'Comment se passe ta journée ?',
        meaning: 'How is your day going?',
        usageNote: 'Warm everyday question to open a friendly conversation.',
      },
      {
        id: 'fr-conv-b-2',
        french: 'Pouvez-vous répéter, s’il vous plaît ?',
        meaning: 'Could you repeat that, please?',
        usageNote: 'Polite phrase whenever someone speaks a bit too fast.',
      },
      {
        id: 'fr-conv-b-3',
        french: 'Que veut dire ce mot ?',
        meaning: 'What does this word mean?',
        usageNote: 'Great habit for picking up new French vocabulary naturally.',
      },
      {
        id: 'fr-conv-b-4',
        french: 'J’aime parler de sport et de voyages.',
        meaning: 'I like talking about sports and travel.',
        usageNote: 'Swap "sport" and "voyages" for any hobby you enjoy.',
      },
      {
        id: 'fr-conv-b-5',
        french: 'C’est vraiment intéressant !',
        meaning: 'That is really interesting!',
        usageNote: 'Natural reaction that keeps the conversation warm.',
      },
    ],
    intermediate: [
      {
        id: 'fr-conv-i-1',
        french: 'Qu’est-ce que tu as fait de beau récemment ?',
        meaning: 'What have you been up to lately?',
        usageNote: 'Very natural casual greeting used by French friends.',
      },
      {
        id: 'fr-conv-i-2',
        french: 'Franchement, je suis tout à fait d’accord.',
        meaning: 'Honestly, I completely agree.',
        usageNote: '"Franchement" adds warmth and conversational rhythm.',
      },
      {
        id: 'fr-conv-i-3',
        french: 'Ça me rappelle une histoire similaire.',
        meaning: 'That reminds me of a similar story.',
        usageNote: 'Smooth transition when you want to share an anecdote.',
      },
      {
        id: 'fr-conv-i-4',
        french: 'Comment tu passes tes week-ends en général ?',
        meaning: 'How do you usually spend your weekends?',
        usageNote: 'Great open-ended question to keep a chat flowing.',
      },
      {
        id: 'fr-conv-i-5',
        french: 'Je comprends tout à fait ton point de vue.',
        meaning: 'I completely see your point of view.',
        usageNote: 'Polite phrase to validate someone’s perspective.',
      },
    ],
    advanced: [
      {
        id: 'fr-conv-a-1',
        french: 'À bien y réfléchir, ça prend tout son sens.',
        meaning: 'Come to think of it, that makes complete sense.',
        usageNote: 'Refined conversational connector for thoughtful discussions.',
      },
      {
        id: 'fr-conv-a-2',
        french: 'Tu as mis le doigt dessus !',
        meaning: 'You hit the nail right on the head!',
        usageNote: 'Classic idiomatic French when someone spots the exact truth.',
      },
      {
        id: 'fr-conv-a-3',
        french: 'J’ai un avis assez partagé sur la question.',
        meaning: 'I have mixed feelings about that issue.',
        usageNote: 'Articulate way to express a balanced viewpoint.',
      },
      {
        id: 'fr-conv-a-4',
        french: 'Pour être tout à fait juste, les deux points se défendent.',
        meaning: 'To be perfectly fair, both arguments hold merit.',
        usageNote: 'Diplomatic and fluent phrasing in debates.',
      },
      {
        id: 'fr-conv-a-5',
        french: 'Il va sans dire que la pratique finit par payer.',
        meaning: 'It goes without saying that practice pays off.',
        usageNote: 'Elegant connector to emphasize an obvious truth.',
      },
    ],
  },
  airport: {
    beginner: [
      {
        id: 'fr-air-b-1',
        french: 'Où se trouve le comptoir d’enregistrement ?',
        meaning: 'Where is the check-in desk?',
        usageNote: 'Use as soon as you enter the departures hall.',
      },
      {
        id: 'fr-air-b-2',
        french: 'Voici mon passeport et mon billet.',
        meaning: 'Here is my passport and my ticket.',
        usageNote: 'Simple, polite phrase at check-in or security.',
      },
      {
        id: 'fr-air-b-3',
        french: 'Je peux avoir une place côté hublot, s’il vous plaît ?',
        meaning: 'Can I have a window seat, please?',
        usageNote: 'Replace "hublot" with "couloir" if you prefer an aisle seat.',
      },
      {
        id: 'fr-air-b-4',
        french: 'Quelle est la porte d’embarquement ?',
        meaning: 'Which gate is boarding from?',
        usageNote: 'Helpful whenever departure boards feel confusing.',
      },
      {
        id: 'fr-air-b-5',
        french: 'Est-ce que mon vol est à l’heure ?',
        meaning: 'Is my flight on time?',
        usageNote: 'Short, direct question for airport staff.',
      },
    ],
    intermediate: [
      {
        id: 'fr-air-i-1',
        french: 'Je voudrais enregistrer une valise en soute.',
        meaning: 'I would like to check one suitcase.',
        usageNote: '"Je voudrais" is the gold standard for polite requests.',
      },
      {
        id: 'fr-air-i-2',
        french: 'Dois-je récupérer mon bagage pendant l’escale ?',
        meaning: 'Do I need to pick up my bag during the layover?',
        usageNote: 'Essential question when flying with a connection.',
      },
      {
        id: 'fr-air-i-3',
        french: 'Combien de minutes faut-il pour rejoindre la porte 14 ?',
        meaning: 'How many minutes does it take to walk to Gate 14?',
        usageNote: 'Helps you pace your walk inside large terminals.',
      },
      {
        id: 'fr-air-i-4',
        french: 'Est-ce que ce bagage cabine respecte les dimensions ?',
        meaning: 'Is this carry-on bag within the size limits?',
        usageNote: 'Saves surprise fees before boarding starts.',
      },
      {
        id: 'fr-air-i-5',
        french: 'Pourriez-vous m’indiquer quand commence l’embarquement ?',
        meaning: 'Could you let me know when boarding begins?',
        usageNote: 'Polite way to double-check near the gate podium.',
      },
    ],
    advanced: [
      {
        id: 'fr-air-a-1',
        french: 'Je crains de manquer ma correspondance à cause du retard.',
        meaning: 'I am afraid I might miss my connection due to the delay.',
        usageNote: 'Clear, calm phrasing when speaking to airline agents.',
      },
      {
        id: 'fr-air-a-2',
        french: 'Serait-il possible de me réacheminer sur le prochain vol ?',
        meaning: 'Would it be possible to rebook me on the next flight?',
        usageNote: '"Réacheminer" is the exact airline term for rebooking.',
      },
      {
        id: 'fr-air-a-3',
        french: 'Ma valise n’est pas apparue sur le tapis à bagages.',
        meaning: 'My suitcase did not show up on the baggage carousel.',
        usageNote: 'Useful phrase at the lost luggage counter.',
      },
      {
        id: 'fr-air-a-4',
        french: 'Les passagers ont-ils droit à une prise en charge pour la nuit ?',
        meaning: 'Are passengers entitled to overnight assistance?',
        usageNote: 'Natural way to ask about hotel and meal vouchers.',
      },
      {
        id: 'fr-air-a-5',
        french: 'Pourriez-vous apposer une étiquette fragile sur ce sac ?',
        meaning: 'Could you put a fragile tag on this bag?',
        usageNote: 'Handy when checking delicate electronics or gifts.',
      },
    ],
  },
  work: {
    beginner: [
      {
        id: 'fr-work-b-1',
        french: 'Bonjour ! Tu as passé un bon week-end ?',
        meaning: 'Good morning! Did you have a good weekend?',
        usageNote: 'Warm Monday small talk before starting the day.',
      },
      {
        id: 'fr-work-b-2',
        french: 'Je travaille sur le rapport aujourd’hui.',
        meaning: 'I am working on the report today.',
        usageNote: 'Swap "rapport" with "projet" or "présentation".',
      },
      {
        id: 'fr-work-b-3',
        french: 'Peux-tu m’aider avec cette tâche ?',
        meaning: 'Can you help me with this task?',
        usageNote: 'Direct and friendly question for teammates.',
      },
      {
        id: 'fr-work-b-4',
        french: 'C’est pour quand, la date limite ?',
        meaning: 'When is the deadline for this?',
        usageNote: 'Clear way to confirm priorities right away.',
      },
      {
        id: 'fr-work-b-5',
        french: 'Je t’envoie le fichier très vite.',
        meaning: 'I will send you the file very soon.',
        usageNote: 'Everyday office phrase in chats and standups.',
      },
    ],
    intermediate: [
      {
        id: 'fr-work-i-1',
        french: 'Petit point rapide : nous sommes dans les temps.',
        meaning: 'Quick update: we are right on schedule.',
        usageNote: 'Crisp, reassuring status update for team meetings.',
      },
      {
        id: 'fr-work-i-2',
        french: 'Tu as deux minutes pour qu’on regarde ça ensemble ?',
        meaning: 'Do you have a couple of minutes to look over this together?',
        usageNote: 'Polite way to ask for a quick review.',
      },
      {
        id: 'fr-work-i-3',
        french: 'On fait le point demain après-midi si ça te va.',
        meaning: 'Let us check in tomorrow afternoon if that works for you.',
        usageNote: '"Faire le point" is one of the most common French work idioms.',
      },
      {
        id: 'fr-work-i-4',
        french: 'J’ai rencontré un petit blocage sur le dossier client.',
        meaning: 'I ran into a small snag on the client file.',
        usageNote: 'Calm, professional way to flag an issue early.',
      },
      {
        id: 'fr-work-i-5',
        french: 'Je tiens toute l’équipe au courant de l’avancement.',
        meaning: 'I will keep the whole team posted on our progress.',
        usageNote: 'Shows clear ownership and strong communication.',
      },
    ],
    advanced: [
      {
        id: 'fr-work-a-1',
        french: 'Alignons-nous sur les priorités avant de lancer la suite.',
        meaning: 'Let us align on priorities before moving forward.',
        usageNote: 'Strong leadership phrasing in planning meetings.',
      },
      {
        id: 'fr-work-a-2',
        french: 'Il faut anticiper ce goulot d’étranglement dès maintenant.',
        meaning: 'We need to address this bottleneck right away.',
        usageNote: 'Precise business vocabulary for operations.',
      },
      {
        id: 'fr-work-a-3',
        french: 'D’un point de vue réaliste, ce calendrier semble serré.',
        meaning: 'Realistically speaking, this timeline looks tight.',
        usageNote: 'Diplomatic phrasing to negotiate realistic deadlines.',
      },
      {
        id: 'fr-work-a-4',
        french: 'Merci beaucoup pour tes retours constructifs sur le brouillon.',
        meaning: 'Thank you very much for your constructive feedback on the draft.',
        usageNote: 'Strengthens collaboration across the team.',
      },
      {
        id: 'fr-work-a-5',
        french: 'Revenons-y dès que nous aurons les chiffres définitifs.',
        meaning: 'Let us circle back as soon as we have the final figures.',
        usageNote: 'Natural executive French for structured follow-ups.',
      },
    ],
  },
  doctor: {
    beginner: [
      {
        id: 'fr-doc-b-1',
        french: 'J’ai mal à la tête et un peu de fièvre.',
        meaning: 'I have a headache and a bit of a fever.',
        usageNote: 'Swap "à la tête" with "à la gorge" for sore throat.',
      },
      {
        id: 'fr-doc-b-2',
        french: 'Ça a commencé il y a deux jours.',
        meaning: 'It started two days ago.',
        usageNote: 'Key detail every doctor asks during a checkup.',
      },
      {
        id: 'fr-doc-b-3',
        french: 'J’ai mal exactement ici.',
        meaning: 'It hurts right here.',
        usageNote: 'Simple and direct while pointing during an exam.',
      },
      {
        id: 'fr-doc-b-4',
        french: 'Combien de fois par jour dois-je prendre ce médicament ?',
        meaning: 'How many times a day should I take this medicine?',
        usageNote: 'Always confirm dosage instructions clearly.',
      },
      {
        id: 'fr-doc-b-5',
        french: 'Merci docteur, me voilà rassuré.',
        meaning: 'Thank you doctor, I feel reassured now.',
        usageNote: 'Warm closing at the end of a consultation.',
      },
    ],
    intermediate: [
      {
        id: 'fr-doc-i-1',
        french: 'Je me sens vraiment à plat depuis le début de la semaine.',
        meaning: 'I have been feeling completely drained since the start of the week.',
        usageNote: '"Être à plat" is natural everyday French for feeling run down.',
      },
      {
        id: 'fr-doc-i-2',
        french: 'Faut-il prendre ces comprimés avant ou pendant le repas ?',
        meaning: 'Should I take these tablets before or with meals?',
        usageNote: 'Practical question for both doctor and pharmacist.',
      },
      {
        id: 'fr-doc-i-3',
        french: 'Y a-t-il des effets secondaires à surveiller ?',
        meaning: 'Are there any side effects to watch out for?',
        usageNote: 'Important check before starting a new prescription.',
      },
      {
        id: 'fr-doc-i-4',
        french: 'Je suis allergique à la pénicilline.',
        meaning: 'I am allergic to penicillin.',
        usageNote: 'Replace "pénicilline" with any allergy you have.',
      },
      {
        id: 'fr-doc-i-5',
        french: 'Au bout de combien de jours vais-je aller mieux ?',
        meaning: 'After how many days should I start feeling better?',
        usageNote: 'Helps you know when recovery should begin.',
      },
    ],
    advanced: [
      {
        id: 'fr-doc-a-1',
        french: 'La gêne a tendance à s’intensifier en fin de soirée.',
        meaning: 'The discomfort tends to worsen late in the evening.',
        usageNote: 'Natural medical phrasing to describe recurring patterns.',
      },
      {
        id: 'fr-doc-a-2',
        french: 'Est-ce que cela pourrait être lié au stress ou à une allergie ?',
        meaning: 'Could this be linked to stress or an allergy?',
        usageNote: 'Helpful for narrowing down possible root causes.',
      },
      {
        id: 'fr-doc-a-3',
        french: 'Je préférerais éviter un traitement qui provoque de la somnolence.',
        meaning: 'I would prefer to avoid medication that causes drowsiness.',
        usageNote: 'Useful when you need to stay alert for driving or work.',
      },
      {
        id: 'fr-doc-a-4',
        french: 'Ai-je besoin d’une ordonnance pour consulter un spécialiste ?',
        meaning: 'Do I need a referral or prescription to see a specialist?',
        usageNote: 'Standard phrasing within the French healthcare system.',
      },
      {
        id: 'fr-doc-a-5',
        french: 'Quels signes doivent m’amener à revenir vous voir rapidement ?',
        meaning: 'Which warning signs should prompt me to come back quickly?',
        usageNote: 'Clear, proactive communication with your physician.',
      },
    ],
  },
  meeting: {
    beginner: [
      {
        id: 'fr-meet-b-1',
        french: 'Enchanté ! Moi, c’est Sam.',
        meaning: 'Nice to meet you! I am Sam.',
        usageNote: 'Warm, natural French introduction at any gathering.',
      },
      {
        id: 'fr-meet-b-2',
        french: 'Tu viens d’où ?',
        meaning: 'Where are you from?',
        usageNote: 'Easy, friendly icebreaker when chatting casually.',
      },
      {
        id: 'fr-meet-b-3',
        french: 'Qu’est-ce que tu aimes faire pendant ton temps libre ?',
        meaning: 'What do you enjoy doing in your free time?',
        usageNote: 'Great way to discover shared hobbies.',
      },
      {
        id: 'fr-meet-b-4',
        french: 'Tu habites dans le quartier ?',
        meaning: 'Do you live in the neighborhood?',
        usageNote: 'Natural question at a neighborhood café or meetup.',
      },
      {
        id: 'fr-meet-b-5',
        french: 'C’était vraiment sympa de discuter avec toi !',
        meaning: 'It was really nice chatting with you!',
        usageNote: 'Leaves a warm impression when saying goodbye.',
      },
    ],
    intermediate: [
      {
        id: 'fr-meet-i-1',
        french: 'Comment est-ce que tu connais les autres ici ?',
        meaning: 'How do you know everyone else here?',
        usageNote: 'One of the easiest social openers at events.',
      },
      {
        id: 'fr-meet-i-2',
        french: 'Je viens d’emménager ici il y a quelques mois.',
        meaning: 'I just moved here a few months ago.',
        usageNote: 'Invites friendly local tips and recommendations.',
      },
      {
        id: 'fr-meet-i-3',
        french: 'Tu connais de bonnes adresses pour manger dans le coin ?',
        meaning: 'Do you know any good places to eat around here?',
        usageNote: '"De bonnes adresses" is classic Parisian phrasing.',
      },
      {
        id: 'fr-meet-i-4',
        french: 'C’est génial ! Comment tu as découvert cette passion ?',
        meaning: 'That is awesome! How did you get into that?',
        usageNote: 'Shows genuine curiosity about someone’s interests.',
      },
      {
        id: 'fr-meet-i-5',
        french: 'Il faudra absolument qu’on garde le contact !',
        meaning: 'We should definitely stay in touch!',
        usageNote: 'Natural, upbeat way to wrap up a conversation.',
      },
    ],
    advanced: [
      {
        id: 'fr-meet-a-1',
        french: 'Quel a été le meilleur moment de ta semaine jusqu’ici ?',
        meaning: 'What has been the highlight of your week so far?',
        usageNote: 'Sparks much warmer dialogue than a routine "Ça va ?".',
      },
      {
        id: 'fr-meet-a-2',
        french: 'J’essaie justement d’élargir mon cercle et de faire de nouvelles rencontres.',
        meaning: 'I am actually trying to branch out and meet new people.',
        usageNote: 'Warm and authentic way to explain why you joined an event.',
      },
      {
        id: 'fr-meet-a-3',
        french: 'Tu as une vision vraiment originale de ce sujet.',
        meaning: 'You have such a fresh perspective on that topic.',
        usageNote: 'Thoughtful compliment that deepens conversation.',
      },
      {
        id: 'fr-meet-a-4',
        french: 'On dirait qu’on partage pas mal de goûts en commun.',
        meaning: 'It feels like we have quite a lot of tastes in common.',
        usageNote: 'Builds easy rapport with a new acquaintance.',
      },
      {
        id: 'fr-meet-a-5',
        french: 'Ça te dirait qu’on prenne un café la semaine prochaine ?',
        meaning: 'Would you like to grab coffee sometime next week?',
        usageNote: '"Ça te dirait de..." is relaxed, friendly native French.',
      },
    ],
  },
};
