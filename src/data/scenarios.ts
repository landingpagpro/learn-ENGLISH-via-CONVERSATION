import { KeyPhrase, LevelMeta, ProficiencyLevel, ScenarioId, ScenarioMeta } from '../types';
import appLogo from '../assets/images/learn_english_conv_logo_1795184299171.jpg';

export const APP_LOGO_URL = appLogo;

export const LEVELS: LevelMeta[] = [
  {
    id: 'beginner',
    label: 'Beginner',
    description: 'Simple words and short sentences',
  },
  {
    id: 'intermediate',
    label: 'Intermediate',
    description: 'Natural everyday English',
  },
  {
    id: 'advanced',
    label: 'Advanced',
    description: 'Idioms and native fluency',
  },
];

export const SCENARIOS: ScenarioMeta[] = [
  {
    id: 'conversation',
    title: 'Learn English via Conversation',
    subtitle: 'Free chat & everyday practice',
    roleDescription: 'Practice natural English conversations on any topic you choose.',
    accentBg: 'bg-blue-50',
    accentText: 'text-[#1E40AF]',
  },
  {
    id: 'airport',
    title: 'At the Airport',
    subtitle: 'Check-in, security & boarding',
    roleDescription: 'Practice check-in desks, luggage, security checks, and boarding gates in English.',
    accentBg: 'bg-sky-50',
    accentText: 'text-sky-700',
  },
  {
    id: 'work',
    title: 'At Work',
    subtitle: 'Meetings & project updates',
    roleDescription: 'Practice office updates, deadlines, and teamwork with English-speaking coworkers.',
    accentBg: 'bg-indigo-50',
    accentText: 'text-indigo-700',
  },
  {
    id: 'doctor',
    title: 'At the Doctor',
    subtitle: 'Symptoms, checkups & prescriptions',
    roleDescription: 'Practice explaining how you feel, asking about medicine, and following medical advice.',
    accentBg: 'bg-rose-50',
    accentText: 'text-rose-700',
  },
  {
    id: 'meeting',
    title: 'Meeting Someone New',
    subtitle: 'Introductions, hobbies & plans',
    roleDescription: 'Practice breaking the ice, talking about yourself, and making new friends in English.',
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
        meaning: 'Are you having a good day?',
        usageNote: 'A warm, friendly way to start any English conversation.',
      },
      {
        id: 'en-conv-b-2',
        english: 'Could you repeat that, please?',
        meaning: 'Please say that again.',
        usageNote: 'Very helpful when someone speaks a little too fast.',
      },
      {
        id: 'en-conv-b-3',
        english: 'What does this word mean?',
        meaning: 'Can you explain this word?',
        usageNote: 'A great habit for learning new English words naturally.',
      },
      {
        id: 'en-conv-b-4',
        english: 'I like talking about sports and travel.',
        meaning: 'I enjoy chatting about sports and trips.',
        usageNote: 'Swap "sports" and "travel" for any hobby you enjoy.',
      },
      {
        id: 'en-conv-b-5',
        english: 'That sounds really interesting!',
        meaning: 'That seems very cool and fun!',
        usageNote: 'A natural reaction that keeps the conversation friendly.',
      },
    ],
    intermediate: [
      {
        id: 'en-conv-i-1',
        english: 'What have you been up to lately?',
        meaning: 'How have you spent your time recently?',
        usageNote: 'A relaxed, natural greeting between friends.',
      },
      {
        id: 'en-conv-i-2',
        english: 'To be honest, I completely agree with you.',
        meaning: 'Honestly, I share the exact same opinion.',
        usageNote: '"To be honest" makes your opinion sound warm and genuine.',
      },
      {
        id: 'en-conv-i-3',
        english: 'That reminds me of a similar story.',
        meaning: 'That makes me think of a moment like yours.',
        usageNote: 'A smooth transition before sharing your own example.',
      },
      {
        id: 'en-conv-i-4',
        english: 'How do you usually spend your weekends?',
        meaning: 'What do you normally do on Saturday and Sunday?',
        usageNote: 'A great open question to keep the chat going.',
      },
      {
        id: 'en-conv-i-5',
        english: 'I totally see where you are coming from.',
        meaning: 'I completely understand your point of view.',
        usageNote: 'Polite expression that shows you are listening carefully.',
      },
    ],
    advanced: [
      {
        id: 'en-conv-a-1',
        english: 'Looking at the big picture, that makes total sense.',
        meaning: 'Considering everything overall, it is very logical.',
        usageNote: 'Natural expression for deeper discussions and opinions.',
      },
      {
        id: 'en-conv-a-2',
        english: 'You hit the nail right on the head!',
        meaning: 'You described the exact issue perfectly!',
        usageNote: 'Classic English idiom when someone makes a spot-on point.',
      },
      {
        id: 'en-conv-a-3',
        english: 'I have mixed feelings about that idea.',
        meaning: 'I see both pros and cons in that suggestion.',
        usageNote: 'A balanced way to express a nuanced opinion.',
      },
      {
        id: 'en-conv-a-4',
        english: 'To be fair, both sides have a valid point.',
        meaning: 'Looking evenly at the situation, both views make sense.',
        usageNote: 'Sounds diplomatic and thoughtful in a discussion.',
      },
      {
        id: 'en-conv-a-5',
        english: 'It goes without saying that steady practice pays off.',
        meaning: 'Everyone knows consistent practice brings great results.',
        usageNote: 'Strong opening phrase to emphasize an obvious truth.',
      },
    ],
  },
  airport: {
    beginner: [
      {
        id: 'en-air-b-1',
        english: 'Where is the check-in counter?',
        meaning: 'Where do I go to check in for my flight?',
        usageNote: 'Use this as soon as you walk into the departures area.',
      },
      {
        id: 'en-air-b-2',
        english: 'Here is my passport and ticket.',
        meaning: 'Please take my travel documents.',
        usageNote: 'Simple and polite phrase at check-in or boarding.',
      },
      {
        id: 'en-air-b-3',
        english: 'Can I have a window seat, please?',
        meaning: 'I would like to sit next to the window.',
        usageNote: 'Swap "window" with "aisle" if you prefer the walkway seat.',
      },
      {
        id: 'en-air-b-4',
        english: 'Which gate does my flight leave from?',
        meaning: 'What is the boarding gate number for my plane?',
        usageNote: 'Helpful if the departure screen is hard to read.',
      },
      {
        id: 'en-air-b-5',
        english: 'Is my flight on time?',
        meaning: 'Will the plane leave at the scheduled hour?',
        usageNote: 'Short, clear question for any airport staff member.',
      },
    ],
    intermediate: [
      {
        id: 'en-air-i-1',
        english: 'I would like to check one suitcase.',
        meaning: 'I need to put one large bag in the cargo hold.',
        usageNote: '"I would like" always sounds polite and natural.',
      },
      {
        id: 'en-air-i-2',
        english: 'Do I need to pick up my bag during the layover?',
        meaning: 'Do I collect my suitcase at the connecting airport?',
        usageNote: 'Essential question whenever your trip has a stopover.',
      },
      {
        id: 'en-air-i-3',
        english: 'How long does it take to walk to Gate 14?',
        meaning: 'How many minutes is the walk to that gate?',
        usageNote: 'Helps you manage your time in a big terminal.',
      },
      {
        id: 'en-air-i-4',
        english: 'Does this carry-on bag fit the size limit?',
        meaning: 'Is my cabin bag small enough for the plane?',
        usageNote: 'Avoids unexpected extra bag fees at the gate.',
      },
      {
        id: 'en-air-i-5',
        english: 'Could you let me know when boarding starts?',
        meaning: 'Please tell me as soon as passengers can get on.',
        usageNote: 'Polite way to check near the gate desk.',
      },
    ],
    advanced: [
      {
        id: 'en-air-a-1',
        english: 'I am worried I might miss my connection due to the delay.',
        meaning: 'I may not reach my next flight in time because we are late.',
        usageNote: '"I am worried I might" shows urgency while staying polite.',
      },
      {
        id: 'en-air-a-2',
        english: 'Would it be possible to rebook me on the next flight?',
        meaning: 'Can you move my ticket to the following plane?',
        usageNote: 'Polite and effective phrasing at the customer service desk.',
      },
      {
        id: 'en-air-a-3',
        english: 'My suitcase never came out on the baggage carousel.',
        meaning: 'My checked bag did not arrive at baggage claim.',
        usageNote: 'Key sentence to use at the lost luggage counter.',
      },
      {
        id: 'en-air-a-4',
        english: 'Are passengers eligible for an overnight hotel voucher?',
        meaning: 'Does the airline cover accommodation for this delay?',
        usageNote: 'Clear, confident wording for airline customer support.',
      },
      {
        id: 'en-air-a-5',
        english: 'Could you put a fragile tag on this bag?',
        meaning: 'Please mark this luggage as containing delicate items.',
        usageNote: 'Useful when traveling with glass or electronics.',
      },
    ],
  },
  work: {
    beginner: [
      {
        id: 'en-work-b-1',
        english: 'Good morning! How was your weekend?',
        meaning: 'Hello! Did you have a nice weekend?',
        usageNote: 'Friendly Monday greeting before starting work.',
      },
      {
        id: 'en-work-b-2',
        english: 'I am working on the report today.',
        meaning: 'My focus today is finishing this document.',
        usageNote: 'Replace "report" with "project" or "presentation".',
      },
      {
        id: 'en-work-b-3',
        english: 'Could you help me with this task?',
        meaning: 'Can you give me a hand with this piece of work?',
        usageNote: '"Could you" sounds respectful and friendly with coworkers.',
      },
      {
        id: 'en-work-b-4',
        english: 'When is the deadline for this project?',
        meaning: 'What date does this work need to be finished?',
        usageNote: 'Clear question to confirm team priorities.',
      },
      {
        id: 'en-work-b-5',
        english: 'I will send you the file soon.',
        meaning: 'I am going to email or share the document shortly.',
        usageNote: 'Very common in team chats and quick office updates.',
      },
    ],
    intermediate: [
      {
        id: 'en-work-i-1',
        english: 'Quick update: we are right on schedule.',
        meaning: 'Short status check: everything is moving on time.',
        usageNote: 'Crisp and positive update for team meetings.',
      },
      {
        id: 'en-work-i-2',
        english: 'Do you have a minute to review this together?',
        meaning: 'Can we quickly look over this work together?',
        usageNote: 'Polite opener before interrupting a colleague.',
      },
      {
        id: 'en-work-i-3',
        english: 'Let us touch base tomorrow afternoon.',
        meaning: 'Let us have a short check-in tomorrow.',
        usageNote: '"Touch base" is an everyday workplace favorite.',
      },
      {
        id: 'en-work-i-4',
        english: 'I ran into a small issue with the client file.',
        meaning: 'I found a minor problem in the client document.',
        usageNote: 'Calm, professional way to flag a problem early.',
      },
      {
        id: 'en-work-i-5',
        english: 'I will keep everyone posted on our progress.',
        meaning: 'I will share regular updates as things move forward.',
        usageNote: 'Shows ownership and strong teamwork.',
      },
    ],
    advanced: [
      {
        id: 'en-work-a-1',
        english: 'Let us align on our top priorities before moving forward.',
        meaning: 'Let us agree on the most important goals before starting.',
        usageNote: 'Great phrase for leading planning meetings.',
      },
      {
        id: 'en-work-a-2',
        english: 'We need to resolve this bottleneck right away.',
        meaning: 'We must fix this slowdown in the workflow immediately.',
        usageNote: 'Common leadership vocabulary in project management.',
      },
      {
        id: 'en-work-a-3',
        english: 'Realistically speaking, that timeline feels quite tight.',
        meaning: 'In practice, we have very little time to finish on that date.',
        usageNote: 'Diplomatic way to push back on tough deadlines.',
      },
      {
        id: 'en-work-a-4',
        english: 'I really appreciate your constructive feedback on the draft.',
        meaning: 'Thank you for the helpful suggestions on my document.',
        usageNote: 'Builds positive collaboration across a team.',
      },
      {
        id: 'en-work-a-5',
        english: 'Let us circle back once the final numbers come in.',
        meaning: 'Let us return to this topic as soon as we have the data.',
        usageNote: 'Natural executive English for clear follow-ups.',
      },
    ],
  },
  doctor: {
    beginner: [
      {
        id: 'en-doc-b-1',
        english: 'I have a headache and a mild fever.',
        meaning: 'My head hurts and my temperature is a little high.',
        usageNote: 'Swap "headache" with "sore throat" or "cough" when needed.',
      },
      {
        id: 'en-doc-b-2',
        english: 'It started two days ago.',
        meaning: 'I began feeling sick the day before yesterday.',
        usageNote: 'One of the very first details every doctor asks.',
      },
      {
        id: 'en-doc-b-3',
        english: 'It hurts right here.',
        meaning: 'I feel pain in this exact spot.',
        usageNote: 'Simple and clear during a physical exam.',
      },
      {
        id: 'en-doc-b-4',
        english: 'How often should I take this medicine?',
        meaning: 'How many times a day do I need this dose?',
        usageNote: 'Always double-check your dosage before leaving.',
      },
      {
        id: 'en-doc-b-5',
        english: 'Thank you, doctor. I feel much more relieved.',
        meaning: 'Thanks, I feel calmer and reassured now.',
        usageNote: 'Polite closing at the end of a medical visit.',
      },
    ],
    intermediate: [
      {
        id: 'en-doc-i-1',
        english: 'I have been feeling really run down all week.',
        meaning: 'I have felt very tired and low on energy for days.',
        usageNote: '"Run down" is natural everyday English for low energy.',
      },
      {
        id: 'en-doc-i-2',
        english: 'Should I take these pills with food or on an empty stomach?',
        meaning: 'Do I take this medicine before or after eating?',
        usageNote: 'Practical question for your doctor or pharmacist.',
      },
      {
        id: 'en-doc-i-3',
        english: 'Are there any side effects I should watch out for?',
        meaning: 'Can this medicine cause reactions I need to notice?',
        usageNote: 'Important check before starting a new prescription.',
      },
      {
        id: 'en-doc-i-4',
        english: 'I am allergic to penicillin.',
        meaning: 'My body reacts badly to that antibiotic.',
        usageNote: 'Replace "penicillin" with any allergy you have.',
      },
      {
        id: 'en-doc-i-5',
        english: 'How soon should I start feeling better?',
        meaning: 'How many days until these symptoms improve?',
        usageNote: 'Helps you know when to follow up if needed.',
      },
    ],
    advanced: [
      {
        id: 'en-doc-a-1',
        english: 'The discomfort tends to flare up late at night.',
        meaning: 'The pain usually becomes stronger in the evening.',
        usageNote: 'Accurate phrasing for describing recurring symptoms.',
      },
      {
        id: 'en-doc-a-2',
        english: 'Could this be triggered by stress or seasonal allergies?',
        meaning: 'Might tension or pollen be causing this issue?',
        usageNote: 'Helps discuss possible root causes with your doctor.',
      },
      {
        id: 'en-doc-a-3',
        english: 'I would prefer medication that does not cause daytime drowsiness.',
        meaning: 'Please prescribe something that keeps me alert during the day.',
        usageNote: 'Essential if you need to drive or work during treatment.',
      },
      {
        id: 'en-doc-a-4',
        english: 'Do I need a referral to see a specialist?',
        meaning: 'Must you send a note before I book a specialist visit?',
        usageNote: 'Standard healthcare term ("referral") in English.',
      },
      {
        id: 'en-doc-a-5',
        english: 'What warning signs mean I should come back for a checkup?',
        meaning: 'Which symptoms show I need another appointment?',
        usageNote: 'Clear and thoughtful health communication.',
      },
    ],
  },
  meeting: {
    beginner: [
      {
        id: 'en-meet-b-1',
        english: 'Nice to meet you! My name is Sam.',
        meaning: 'Hello! I am glad to meet you; I am Sam.',
        usageNote: 'Classic, friendly way to introduce yourself.',
      },
      {
        id: 'en-meet-b-2',
        english: 'Where are you from?',
        meaning: 'Which city or country do you come from?',
        usageNote: 'One of the easiest ways to start a friendly chat.',
      },
      {
        id: 'en-meet-b-3',
        english: 'What do you like doing in your free time?',
        meaning: 'What are your favorite hobbies?',
        usageNote: 'Warm question to learn about someone’s interests.',
      },
      {
        id: 'en-meet-b-4',
        english: 'Do you live around here?',
        meaning: 'Is your home in this neighborhood?',
        usageNote: 'Natural and relaxed when chatting at a café or event.',
      },
      {
        id: 'en-meet-b-5',
        english: 'It was great talking with you!',
        meaning: 'I really enjoyed our conversation!',
        usageNote: 'Leaves a warm impression when saying goodbye.',
      },
    ],
    intermediate: [
      {
        id: 'en-meet-i-1',
        english: 'How do you know everyone here?',
        meaning: 'How did you meet the people in this group?',
        usageNote: 'One of the easiest icebreakers at parties or events.',
      },
      {
        id: 'en-meet-i-2',
        english: 'I just moved to this city a few months ago.',
        meaning: 'I recently started living here.',
        usageNote: 'Naturally invites people to share local tips with you.',
      },
      {
        id: 'en-meet-i-3',
        english: 'Do you know any good restaurants around here?',
        meaning: 'Can you recommend a nice place to eat nearby?',
        usageNote: 'Almost everyone enjoys sharing favorite food spots.',
      },
      {
        id: 'en-meet-i-4',
        english: 'That is awesome! How did you get into that?',
        meaning: 'Cool! How did you start enjoying that hobby?',
        usageNote: 'Shows genuine curiosity about the other person.',
      },
      {
        id: 'en-meet-i-5',
        english: 'We should definitely stay in touch!',
        meaning: 'Let us keep messaging or meet again soon!',
        usageNote: 'Warm closing line after a good conversation.',
      },
    ],
    advanced: [
      {
        id: 'en-meet-a-1',
        english: 'What has been the highlight of your week so far?',
        meaning: 'What was the best part of your week up to now?',
        usageNote: 'Sparks much richer stories than just "How are you?".',
      },
      {
        id: 'en-meet-a-2',
        english: 'I am trying to branch out and meet more people locally.',
        meaning: 'I want to expand my social circle and make new friends.',
        usageNote: 'Genuine way to explain why you came to a meetup.',
      },
      {
        id: 'en-meet-a-3',
        english: 'That is a really thoughtful perspective on it.',
        meaning: 'You have a very interesting way of looking at this.',
        usageNote: 'Makes the other person feel genuinely heard.',
      },
      {
        id: 'en-meet-a-4',
        english: 'It sounds like we have quite a bit in common.',
        meaning: 'We seem to share many of the same interests.',
        usageNote: 'Deepens rapport smoothly with someone you just met.',
      },
      {
        id: 'en-meet-a-5',
        english: 'Let us grab coffee next week if your schedule allows.',
        meaning: 'Let us meet for coffee soon when you are free.',
        usageNote: '"Grab coffee" is effortless, natural English.',
      },
    ],
  },
};
