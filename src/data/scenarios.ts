import { KeyPhrase, LevelMeta, ProficiencyLevel, ScenarioId, ScenarioMeta } from '../types';
import appLogo from '../assets/images/app_logo_1794924310115.jpg';

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
    description: 'Natural everyday English',
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
    title: 'Learn English via Conversation',
    subtitle: 'Free talk & daily English practice',
    roleDescription: 'Practice natural everyday English conversations on any topic you choose.',
    accentBg: 'bg-emerald-50',
    accentText: 'text-[#008069]',
  },
  {
    id: 'airport',
    title: 'At the Airport',
    subtitle: 'Check-in, security & boarding gate',
    roleDescription: 'Practice check-in counters, baggage questions, security, and boarding gates.',
    accentBg: 'bg-sky-50',
    accentText: 'text-sky-700',
  },
  {
    id: 'work',
    title: 'At Work',
    subtitle: 'Team check-ins & project updates',
    roleDescription: 'Practice office updates, discussing deadlines, and collaborating with coworkers.',
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
    roleDescription: 'Practice breaking the ice, talking about yourself, and making new friends.',
    accentBg: 'bg-amber-50',
    accentText: 'text-amber-700',
  },
];

export const INITIAL_PHRASES: Record<ScenarioId, Record<ProficiencyLevel, KeyPhrase[]>> = {
  conversation: {
    beginner: [
      {
        id: 'en-conv-b-1',
        english: 'How is your day going?',
        meaning: 'A friendly way to ask someone about their day.',
        usageNote: 'Warm everyday question to start almost any English chat.',
      },
      {
        id: 'en-conv-b-2',
        english: 'Could you say that again, please?',
        meaning: 'Polite way to ask someone to repeat something.',
        usageNote: 'Very useful whenever someone speaks a bit too fast.',
      },
      {
        id: 'en-conv-b-3',
        english: 'What does this word mean?',
        meaning: 'Ask for the meaning of an unfamiliar word.',
        usageNote: 'Great habit for learning new vocabulary naturally.',
      },
      {
        id: 'en-conv-b-4',
        english: 'I like talking about sports and travel.',
        meaning: 'Share your favorite conversation topics.',
        usageNote: 'Swap "sports and travel" with any hobby you enjoy.',
      },
      {
        id: 'en-conv-b-5',
        english: 'That sounds really interesting!',
        meaning: 'Show enthusiasm for what the other person said.',
        usageNote: 'Natural reaction that keeps the conversation friendly.',
      },
    ],
    intermediate: [
      {
        id: 'en-conv-i-1',
        english: 'What have you been up to lately?',
        meaning: 'Ask what someone has been doing recently.',
        usageNote: 'Natural, casual greeting between friends or coworkers.',
      },
      {
        id: 'en-conv-i-2',
        english: 'Honestly, I completely agree with you.',
        meaning: 'Express strong agreement in a natural way.',
        usageNote: '"Honestly" makes your opinion sound warm and conversational.',
      },
      {
        id: 'en-conv-i-3',
        english: 'That reminds me of a similar story.',
        meaning: 'Connect your own experience to the topic.',
        usageNote: 'Smooth transition when you want to share an example.',
      },
      {
        id: 'en-conv-i-4',
        english: 'How do you usually spend your weekends?',
        meaning: 'Ask about someone’s regular weekend routine.',
        usageNote: 'Great open-ended question to keep a chat going.',
      },
      {
        id: 'en-conv-i-5',
        english: 'I see where you are coming from.',
        meaning: 'Show that you understand someone’s point of view.',
        usageNote: 'Polite phrase to validate someone’s opinion.',
      },
    ],
    advanced: [
      {
        id: 'en-conv-a-1',
        english: 'Looking at the bigger picture, it makes sense.',
        meaning: 'Consider the overall situation rather than small details.',
        usageNote: 'Common idiomatic expression in thoughtful discussions.',
      },
      {
        id: 'en-conv-a-2',
        english: 'You hit the nail right on the head.',
        meaning: 'You described the exact issue or truth accurately.',
        usageNote: 'Classic native idiom when someone makes a spot-on point.',
      },
      {
        id: 'en-conv-a-3',
        english: 'I have mixed feelings about that idea.',
        meaning: 'You see both advantages and drawbacks.',
        usageNote: 'Balanced way to express a nuanced opinion.',
      },
      {
        id: 'en-conv-a-4',
        english: 'To be perfectly fair, both sides have a point.',
        meaning: 'Acknowledge valid arguments from different perspectives.',
        usageNote: 'Sounds diplomatic and articulate in debates.',
      },
      {
        id: 'en-conv-a-5',
        english: 'It goes without saying that practice pays off.',
        meaning: 'Something is obvious and widely understood.',
        usageNote: 'Strong connector to emphasize an important truth.',
      },
    ],
  },
  airport: {
    beginner: [
      {
        id: 'en-air-b-1',
        english: 'Where is the check-in desk?',
        meaning: 'Ask for directions to check in for your flight.',
        usageNote: 'Use as soon as you enter the departure hall.',
      },
      {
        id: 'en-air-b-2',
        english: 'Here is my passport and ticket.',
        meaning: 'Hand your travel documents to the airline agent.',
        usageNote: 'Simple, polite phrase at check-in or security.',
      },
      {
        id: 'en-air-b-3',
        english: 'Can I have a window seat, please?',
        meaning: 'Request a seat next to the airplane window.',
        usageNote: 'Replace "window" with "aisle" if you prefer the walkway.',
      },
      {
        id: 'en-air-b-4',
        english: 'Which gate is my flight leaving from?',
        meaning: 'Ask where to go to board your plane.',
        usageNote: 'Helpful if the departure screen is unclear.',
      },
      {
        id: 'en-air-b-5',
        english: 'Is my flight on time?',
        meaning: 'Check whether the flight is delayed or on schedule.',
        usageNote: 'Short, direct question for airport staff.',
      },
    ],
    intermediate: [
      {
        id: 'en-air-i-1',
        english: 'I would like to check in one suitcase.',
        meaning: 'Tell the agent you have luggage to put in the hold.',
        usageNote: '"I would like to" sounds polite and natural.',
      },
      {
        id: 'en-air-i-2',
        english: 'Do I need to pick up my bag during the layover?',
        meaning: 'Ask if luggage transfers automatically between flights.',
        usageNote: 'Essential question when you have a connecting flight.',
      },
      {
        id: 'en-air-i-3',
        english: 'How long does it take to walk to Gate 14?',
        meaning: 'Ask about walking distance to your boarding gate.',
        usageNote: 'Helps you manage your time in a big terminal.',
      },
      {
        id: 'en-air-i-4',
        english: 'Is this carry-on bag within the size limit?',
        meaning: 'Confirm your hand luggage is allowed in the cabin.',
        usageNote: 'Saves surprise fees at the boarding gate.',
      },
      {
        id: 'en-air-i-5',
        english: 'Could you let me know when boarding starts?',
        meaning: 'Ask staff to notify or confirm boarding time.',
        usageNote: 'Polite way to double-check near the gate desk.',
      },
    ],
    advanced: [
      {
        id: 'en-air-a-1',
        english: 'I am afraid I might miss my connecting flight.',
        meaning: 'Politely express concern about a tight connection.',
        usageNote: '"I am afraid" softens urgency while remaining clear.',
      },
      {
        id: 'en-air-a-2',
        english: 'Would it be possible to rebook me on the next flight?',
        meaning: 'Request an alternative flight after a delay.',
        usageNote: 'Very polite, effective phrasing at customer service.',
      },
      {
        id: 'en-air-a-3',
        english: 'My luggage did not show up on the carousel.',
        meaning: 'Report a missing suitcase at baggage claim.',
        usageNote: '"Show up" is natural spoken English for "appear".',
      },
      {
        id: 'en-air-a-4',
        english: 'Are passengers compensated for overnight delays?',
        meaning: 'Ask about hotel or meal vouchers during long delays.',
        usageNote: 'Clear, professional question for airline desks.',
      },
      {
        id: 'en-air-a-5',
        english: 'Could you tag my bag as fragile, please?',
        meaning: 'Ask staff to mark delicate luggage for careful handling.',
        usageNote: 'Useful when traveling with electronics or glass.',
      },
    ],
  },
  work: {
    beginner: [
      {
        id: 'en-work-b-1',
        english: 'Good morning! How was your weekend?',
        meaning: 'Friendly greeting for colleagues on Monday morning.',
        usageNote: 'Easy small talk before starting work.',
      },
      {
        id: 'en-work-b-2',
        english: 'I am working on the report today.',
        meaning: 'Explain your main task for the day.',
        usageNote: 'Swap "report" with "presentation" or "project".',
      },
      {
        id: 'en-work-b-3',
        english: 'Could you help me with this task?',
        meaning: 'Politely ask a coworker for assistance.',
        usageNote: '"Could you" is always polite in an office.',
      },
      {
        id: 'en-work-b-4',
        english: 'When is the deadline for this?',
        meaning: 'Ask when a task needs to be finished.',
        usageNote: 'Clear question to confirm priorities.',
      },
      {
        id: 'en-work-b-5',
        english: 'I will send you the file soon.',
        meaning: 'Promise to share a document shortly.',
        usageNote: 'Useful in team chats and quick check-ins.',
      },
    ],
    intermediate: [
      {
        id: 'en-work-i-1',
        english: 'Quick update: we are right on schedule.',
        meaning: 'Let the team know work is progressing on time.',
        usageNote: 'Crisp, positive status update for standup meetings.',
      },
      {
        id: 'en-work-i-2',
        english: 'Do you have a minute to go over this?',
        meaning: 'Ask if a colleague has a brief moment to review something.',
        usageNote: 'Polite before interrupting someone at work.',
      },
      {
        id: 'en-work-i-3',
        english: 'Let us touch base again tomorrow afternoon.',
        meaning: 'Suggest checking in together tomorrow.',
        usageNote: '"Touch base" is a very common workplace idiom.',
      },
      {
        id: 'en-work-i-4',
        english: 'I ran into a small issue with the client file.',
        meaning: 'Mention an unexpected problem calmly.',
        usageNote: '"Ran into" sounds much more natural than "encountered".',
      },
      {
        id: 'en-work-i-5',
        english: 'I will keep everyone posted on our progress.',
        meaning: 'Promise to share regular updates with the team.',
        usageNote: 'Shows strong ownership and communication.',
      },
    ],
    advanced: [
      {
        id: 'en-work-a-1',
        english: 'Let us align on priorities before moving forward.',
        meaning: 'Make sure everyone agrees on what matters most first.',
        usageNote: 'Great leadership phrase for planning meetings.',
      },
      {
        id: 'en-work-a-2',
        english: 'We need to address a potential bottleneck early.',
        meaning: 'Solve a slowdown point before it delays the project.',
        usageNote: 'Strong professional vocabulary for operations.',
      },
      {
        id: 'en-work-a-3',
        english: 'From a feasibility standpoint, this timeline is tight.',
        meaning: 'Point out respectfully that a deadline is challenging.',
        usageNote: 'Diplomatic way to push back on unrealistic dates.',
      },
      {
        id: 'en-work-a-4',
        english: 'I appreciate your constructive feedback on the draft.',
        meaning: 'Thank a colleague for helpful critique.',
        usageNote: 'Builds positive collaboration on teams.',
      },
      {
        id: 'en-work-a-5',
        english: 'Let us circle back once we have the final numbers.',
        meaning: 'Revisit the discussion after collecting the data.',
        usageNote: 'Everyday executive English for follow-ups.',
      },
    ],
  },
  doctor: {
    beginner: [
      {
        id: 'en-doc-b-1',
        english: 'I have a headache and a fever.',
        meaning: 'Describe two common symptoms clearly.',
        usageNote: 'Swap with "sore throat" or "cough" as needed.',
      },
      {
        id: 'en-doc-b-2',
        english: 'It started two days ago.',
        meaning: 'Tell the doctor when your symptoms began.',
        usageNote: 'Important detail every doctor will ask for.',
      },
      {
        id: 'en-doc-b-3',
        english: 'It hurts right here.',
        meaning: 'Point to the area where you feel pain.',
        usageNote: 'Simple and direct during a physical exam.',
      },
      {
        id: 'en-doc-b-4',
        english: 'How often should I take this medicine?',
        meaning: 'Ask about the dosage schedule for your prescription.',
        usageNote: 'Always confirm how many times a day to take pills.',
      },
      {
        id: 'en-doc-b-5',
        english: 'Thank you, doctor. I feel relieved.',
        meaning: 'Express gratitude after receiving medical advice.',
        usageNote: 'Warm closing at the end of an appointment.',
      },
    ],
    intermediate: [
      {
        id: 'en-doc-i-1',
        english: 'I have been feeling pretty run down all week.',
        meaning: 'Say you have felt tired and unwell for several days.',
        usageNote: '"Run down" is natural everyday English for low energy.',
      },
      {
        id: 'en-doc-i-2',
        english: 'Should I take these pills before or after meals?',
        meaning: 'Check whether medication requires food.',
        usageNote: 'Practical question for the doctor or pharmacist.',
      },
      {
        id: 'en-doc-i-3',
        english: 'Are there any side effects I should watch out for?',
        meaning: 'Ask about possible reactions to the medicine.',
        usageNote: '"Watch out for" means pay attention to.',
      },
      {
        id: 'en-doc-i-4',
        english: 'I am allergic to penicillin.',
        meaning: 'Inform medical staff about a drug allergy.',
        usageNote: 'Replace "penicillin" with any allergy you have.',
      },
      {
        id: 'en-doc-i-5',
        english: 'How soon should I start feeling better?',
        meaning: 'Ask about the expected recovery time.',
        usageNote: 'Helps you know when to return if symptoms persist.',
      },
    ],
    advanced: [
      {
        id: 'en-doc-a-1',
        english: 'The discomfort tends to flare up at night.',
        meaning: 'Explain that symptoms worsen during specific hours.',
        usageNote: '"Flare up" describes pain or symptoms suddenly increasing.',
      },
      {
        id: 'en-doc-a-2',
        english: 'Could this be related to stress or a seasonal allergy?',
        meaning: 'Ask the doctor about possible underlying causes.',
        usageNote: 'Helpful for narrowing down recurring symptoms.',
      },
      {
        id: 'en-doc-a-3',
        english: 'I would prefer to avoid drowsiness during the day.',
        meaning: 'Ask for non-drowsy medication options.',
        usageNote: 'Useful if you need to drive or work while recovering.',
      },
      {
        id: 'en-doc-a-4',
        english: 'Do I need a referral to see a specialist?',
        meaning: 'Ask if formal doctor paperwork is required for another clinic.',
        usageNote: 'Standard healthcare term in English-speaking countries.',
      },
      {
        id: 'en-doc-a-5',
        english: 'What warning signs would mean I need a follow-up?',
        meaning: 'Ask which symptoms mean you should come back promptly.',
        usageNote: 'Clear, proactive health communication.',
      },
    ],
  },
  meeting: {
    beginner: [
      {
        id: 'en-meet-b-1',
        english: 'Nice to meet you! My name is Sam.',
        meaning: 'Warm, classic introduction when meeting someone.',
        usageNote: 'Smile and replace "Sam" with your own name.',
      },
      {
        id: 'en-meet-b-2',
        english: 'Where are you from?',
        meaning: 'Ask about someone’s hometown or country.',
        usageNote: 'Easy icebreaker in social settings.',
      },
      {
        id: 'en-meet-b-3',
        english: 'What do you like to do for fun?',
        meaning: 'Ask about someone’s hobbies and interests.',
        usageNote: 'Friendly way to learn more about a new person.',
      },
      {
        id: 'en-meet-b-4',
        english: 'Do you live near here?',
        meaning: 'Ask if they live in the local neighborhood.',
        usageNote: 'Simple question when chatting at an event or cafe.',
      },
      {
        id: 'en-meet-b-5',
        english: 'It was great talking with you!',
        meaning: 'Friendly goodbye after a nice conversation.',
        usageNote: 'Leaves a warm impression when parting ways.',
      },
    ],
    intermediate: [
      {
        id: 'en-meet-i-1',
        english: 'How do you know everyone here?',
        meaning: 'Ask how someone is connected to a party or group.',
        usageNote: 'One of the best social icebreakers at gatherings.',
      },
      {
        id: 'en-meet-i-2',
        english: 'I just moved here a few months ago.',
        meaning: 'Share that you are relatively new to the area.',
        usageNote: 'Great way to invite local recommendations.',
      },
      {
        id: 'en-meet-i-3',
        english: 'Have you tried any good restaurants around here?',
        meaning: 'Ask for local food spots as a fun topic.',
        usageNote: 'Almost everyone enjoys talking about favorite places to eat.',
      },
      {
        id: 'en-meet-i-4',
        english: 'That is really cool—how did you get into that?',
        meaning: 'Show genuine curiosity about someone’s hobby or job.',
        usageNote: '"Get into" means start enjoying or doing something.',
      },
      {
        id: 'en-meet-i-5',
        english: 'We should definitely stay in touch!',
        meaning: 'Suggest exchanging contacts or meeting again.',
        usageNote: 'Friendly, natural way to wrap up a great chat.',
      },
    ],
    advanced: [
      {
        id: 'en-meet-a-1',
        english: 'What has been the highlight of your week so far?',
        meaning: 'Ask a thoughtful, positive question beyond small talk.',
        usageNote: 'Sparks much richer conversations than "How are you?".',
      },
      {
        id: 'en-meet-a-2',
        english: 'I am actually trying to branch out and meet new people.',
        meaning: 'Explain warmly that you are expanding your social circle.',
        usageNote: '"Branch out" means explore new activities or circles.',
      },
      {
        id: 'en-meet-a-3',
        english: 'You have such an interesting perspective on that.',
        meaning: 'Compliment someone’s unique way of thinking.',
        usageNote: 'Makes the other person feel genuinely heard.',
      },
      {
        id: 'en-meet-a-4',
        english: 'It feels like we have quite a lot in common.',
        meaning: 'Note shared tastes, values, or experiences.',
        usageNote: 'Naturally deepens rapport with a new acquaintance.',
      },
      {
        id: 'en-meet-a-5',
        english: 'Let us grab coffee sometime next week if you are free.',
        meaning: 'Make a warm, low-pressure invitation to hang out.',
        usageNote: '"Grab coffee" is relaxed, friendly native phrasing.',
      },
    ],
  },
};
