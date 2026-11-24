import { KeyPhrase, LevelMeta, ProficiencyLevel, ScenarioId, ScenarioMeta } from '../types';
import appLogo from '../assets/images/learn_english_logo_1795183873283.jpg';

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
    title: 'Learn English Talking',
    subtitle: 'Free chat and daily practice',
    roleDescription: 'Practice natural English conversations on any topic you like with Alex.',
    accentBg: 'bg-[#EBF2FC]',
    accentText: 'text-[#1B4D8E]',
  },
  {
    id: 'airport',
    title: 'At the Airport',
    subtitle: 'Check-in, security, and boarding',
    roleDescription: 'Practice speaking at the check-in desk, security screening, and boarding gate.',
    accentBg: 'bg-sky-50',
    accentText: 'text-sky-700',
  },
  {
    id: 'work',
    title: 'At Work',
    subtitle: 'Meetings, updates, and teamwork',
    roleDescription: 'Talk about projects, deadlines, and daily collaboration with coworkers.',
    accentBg: 'bg-indigo-50',
    accentText: 'text-indigo-700',
  },
  {
    id: 'doctor',
    title: 'At the Doctor',
    subtitle: 'Symptoms, visits, and medicine',
    roleDescription: 'Explain how you feel, ask about prescriptions, and understand medical advice.',
    accentBg: 'bg-rose-50',
    accentText: 'text-rose-700',
  },
  {
    id: 'meeting',
    title: 'Meeting New People',
    subtitle: 'Introductions, hobbies, and plans',
    roleDescription: 'Break the ice, talk about your interests, and make new friends in English.',
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
        meaning: 'Are you having a good day today?',
        usageNote: 'A warm, friendly way to start any conversation.',
      },
      {
        id: 'en-conv-b-2',
        english: 'Could you say that again, please?',
        meaning: 'Please repeat what you just said.',
        usageNote: 'Very useful when someone speaks a bit too fast.',
      },
      {
        id: 'en-conv-b-3',
        english: 'What does this word mean?',
        meaning: 'Can you explain this word to me?',
        usageNote: 'Great question for learning new vocabulary naturally.',
      },
      {
        id: 'en-conv-b-4',
        english: 'I enjoy talking about sports and travel.',
        meaning: 'Sports and trips are my favorite topics.',
        usageNote: 'Swap "sports" and "travel" with any hobby you love.',
      },
      {
        id: 'en-conv-b-5',
        english: 'That sounds really interesting!',
        meaning: 'I would love to hear more about that.',
        usageNote: 'Easy reaction to keep a friendly chat moving.',
      },
    ],
    intermediate: [
      {
        id: 'en-conv-i-1',
        english: 'What have you been up to lately?',
        meaning: 'How have you spent your time recently?',
        usageNote: 'Relaxed everyday greeting among friends and coworkers.',
      },
      {
        id: 'en-conv-i-2',
        english: 'Honestly, I completely agree with you.',
        meaning: 'I feel the exact same way.',
        usageNote: 'Starting with "Honestly" makes your tone warm and real.',
      },
      {
        id: 'en-conv-i-3',
        english: 'That reminds me of a similar story.',
        meaning: 'Something just like that happened to me too.',
        usageNote: 'Smooth transition before sharing your own experience.',
      },
      {
        id: 'en-conv-i-4',
        english: 'How do you usually spend your weekends?',
        meaning: 'What do you normally do on Saturday and Sunday?',
        usageNote: 'Open question that invites a detailed answer.',
      },
      {
        id: 'en-conv-i-5',
        english: 'I totally see where you are coming from.',
        meaning: 'I clearly understand your point of view.',
        usageNote: 'Polite phrase showing you are actively listening.',
      },
    ],
    advanced: [
      {
        id: 'en-conv-a-1',
        english: 'Looking at the big picture, it makes total sense.',
        meaning: 'When we consider everything together, it is logical.',
        usageNote: 'Natural expression for deeper discussions.',
      },
      {
        id: 'en-conv-a-2',
        english: 'You hit the nail right on the head!',
        meaning: 'You identified the exact truth of the situation.',
        usageNote: 'Classic idiom when someone is completely right.',
      },
      {
        id: 'en-conv-a-3',
        english: 'I have mixed feelings about that idea.',
        meaning: 'I see both pros and cons in that proposal.',
        usageNote: 'Balanced way to give a nuanced opinion.',
      },
      {
        id: 'en-conv-a-4',
        english: 'To be fair, both sides raise valid points.',
        meaning: 'Both perspectives deserve careful consideration.',
        usageNote: 'Diplomatic and thoughtful phrase during a debate.',
      },
      {
        id: 'en-conv-a-5',
        english: 'It goes without saying that practice pays off.',
        meaning: 'Everyone knows consistent speaking builds fluency.',
        usageNote: 'Smooth opener for stating an obvious truth.',
      },
    ],
  },
  airport: {
    beginner: [
      {
        id: 'en-air-b-1',
        english: 'Where is the check-in counter?',
        meaning: 'Where do I go to check in for my flight?',
        usageNote: 'Use this right when you enter the departures hall.',
      },
      {
        id: 'en-air-b-2',
        english: 'Here is my passport and boarding pass.',
        meaning: 'Please check my travel documents.',
        usageNote: 'Simple and polite at check-in or the gate.',
      },
      {
        id: 'en-air-b-3',
        english: 'Can I have a window seat, please?',
        meaning: 'I would prefer to sit next to the window.',
        usageNote: 'Swap "window" with "aisle" if you prefer easy access.',
      },
      {
        id: 'en-air-b-4',
        english: 'Which gate does my flight leave from?',
        meaning: 'What is the boarding gate number for my plane?',
        usageNote: 'Handy if departure screens are far away.',
      },
      {
        id: 'en-air-b-5',
        english: 'Is my flight on time?',
        meaning: 'Is the plane leaving on schedule?',
        usageNote: 'Short and clear question for airline staff.',
      },
    ],
    intermediate: [
      {
        id: 'en-air-i-1',
        english: 'I would like to check one suitcase.',
        meaning: 'I need to put a large bag in cargo.',
        usageNote: '"I would like" always sounds polite and natural.',
      },
      {
        id: 'en-air-i-2',
        english: 'Do I need to collect my luggage during the layover?',
        meaning: 'Will my bag transfer automatically to the next flight?',
        usageNote: 'Important question whenever you have a connecting flight.',
      },
      {
        id: 'en-air-i-3',
        english: 'How long does it take to walk to Gate 14?',
        meaning: 'How many minutes will it take to reach that gate?',
        usageNote: 'Helps you manage your time in big terminals.',
      },
      {
        id: 'en-air-i-4',
        english: 'Does this carry-on bag fit the size limit?',
        meaning: 'Is my small bag allowed inside the cabin?',
        usageNote: 'Avoid surprise baggage fees before boarding.',
      },
      {
        id: 'en-air-i-5',
        english: 'Could you let me know when boarding starts?',
        meaning: 'Please tell me when passengers can get on the plane.',
        usageNote: 'Polite way to check status at the gate.',
      },
    ],
    advanced: [
      {
        id: 'en-air-a-1',
        english: 'I am worried I might miss my connection due to the delay.',
        meaning: 'I risk missing my second flight because we are late.',
        usageNote: 'Expresses urgency clearly while staying calm.',
      },
      {
        id: 'en-air-a-2',
        english: 'Would it be possible to rebook me on the next flight?',
        meaning: 'Can you move my ticket to the next available plane?',
        usageNote: 'Effective, polite phrasing at the customer service desk.',
      },
      {
        id: 'en-air-a-3',
        english: 'My suitcase did not show up on the baggage carousel.',
        meaning: 'My checked luggage is missing after landing.',
        usageNote: 'Key sentence at the lost baggage counter.',
      },
      {
        id: 'en-air-a-4',
        english: 'Are passengers eligible for a meal or hotel voucher?',
        meaning: 'Does the airline cover food or accommodation for this delay?',
        usageNote: 'Clear, confident question for airline assistance.',
      },
      {
        id: 'en-air-a-5',
        english: 'Could you put a fragile tag on this bag, please?',
        meaning: 'Please mark this bag as containing breakable items.',
        usageNote: 'Useful when checking electronics or glass.',
      },
    ],
  },
  work: {
    beginner: [
      {
        id: 'en-work-b-1',
        english: 'Good morning! How was your weekend?',
        meaning: 'Hello! Did you enjoy your days off?',
        usageNote: 'Friendly small talk on Monday morning.',
      },
      {
        id: 'en-work-b-2',
        english: 'Today I am working on the report.',
        meaning: 'My main task today is preparing this document.',
        usageNote: 'Swap "report" with "project" or "presentation".',
      },
      {
        id: 'en-work-b-3',
        english: 'Can you help me with this task?',
        meaning: 'Could you give me a hand with this work?',
        usageNote: 'Direct and natural among friendly coworkers.',
      },
      {
        id: 'en-work-b-4',
        english: 'When is the deadline for this project?',
        meaning: 'Which day must this work be finished?',
        usageNote: 'Clear question to confirm team priorities.',
      },
      {
        id: 'en-work-b-5',
        english: 'I will send you the file shortly.',
        meaning: 'I am sending the document in just a few minutes.',
        usageNote: 'Common phrase in workplace chats and emails.',
      },
    ],
    intermediate: [
      {
        id: 'en-work-i-1',
        english: 'Quick update: we are right on schedule.',
        meaning: 'Short status check: everything is moving according to plan.',
        usageNote: 'Crisp, positive update for team standups.',
      },
      {
        id: 'en-work-i-2',
        english: 'Do you have a minute to review this together?',
        meaning: 'Can we quickly check this work side by side?',
        usageNote: 'Polite way to ask for a teammate’s feedback.',
      },
      {
        id: 'en-work-i-3',
        english: 'Let us touch base tomorrow afternoon.',
        meaning: 'Let us reconnect tomorrow to share updates.',
        usageNote: '"Touch base" is very common in English offices.',
      },
      {
        id: 'en-work-i-4',
        english: 'I noticed a small issue in the client file.',
        meaning: 'I spotted a mistake that we should fix.',
        usageNote: 'Calm, professional way to report a problem.',
      },
      {
        id: 'en-work-i-5',
        english: 'I will keep everyone posted on our progress.',
        meaning: 'I will share updates as soon as things move forward.',
        usageNote: 'Shows ownership and strong communication.',
      },
    ],
    advanced: [
      {
        id: 'en-work-a-1',
        english: 'Let us align on top priorities before moving forward.',
        meaning: 'Let us agree on the most important goals first.',
        usageNote: 'Strong sentence for leading planning meetings.',
      },
      {
        id: 'en-work-a-2',
        english: 'We need to resolve this bottleneck right away.',
        meaning: 'We must clear this blockage slowing down the team.',
        usageNote: 'Standard business expression in project management.',
      },
      {
        id: 'en-work-a-3',
        english: 'Realistically, that timeline looks pretty tight.',
        meaning: 'In practice, there is very little time before that due date.',
        usageNote: 'Tactful way to negotiate an unrealistic deadline.',
      },
      {
        id: 'en-work-a-4',
        english: 'I really appreciate your constructive feedback on the draft.',
        meaning: 'Thank you for the helpful suggestions on my work.',
        usageNote: 'Builds strong goodwill with colleagues.',
      },
      {
        id: 'en-work-a-5',
        english: 'Let us circle back once we have the final numbers.',
        meaning: 'Let us revisit this topic when the data is ready.',
        usageNote: 'Natural executive phrasing to close a discussion.',
      },
    ],
  },
  doctor: {
    beginner: [
      {
        id: 'en-doc-b-1',
        english: 'I have a headache and a slight fever.',
        meaning: 'My head hurts and my temperature is a bit high.',
        usageNote: 'Swap "headache" with "sore throat" or "cough".',
      },
      {
        id: 'en-doc-b-2',
        english: 'It started two days ago.',
        meaning: 'I began feeling sick the day before yesterday.',
        usageNote: 'One of the first questions every doctor asks.',
      },
      {
        id: 'en-doc-b-3',
        english: 'It hurts right here.',
        meaning: 'I feel pain in this exact spot.',
        usageNote: 'Simple and clear during an exam.',
      },
      {
        id: 'en-doc-b-4',
        english: 'How many times a day should I take this medicine?',
        meaning: 'What is the daily dose for this medication?',
        usageNote: 'Always double-check instructions before leaving.',
      },
      {
        id: 'en-doc-b-5',
        english: 'Thank you, doctor. I feel much calmer now.',
        meaning: 'Thanks for your help, I feel relieved.',
        usageNote: 'Polite closing at the end of a clinic visit.',
      },
    ],
    intermediate: [
      {
        id: 'en-doc-i-1',
        english: 'I have been feeling completely drained all week.',
        meaning: 'I have felt very tired and low on energy for days.',
        usageNote: '"Drained" is a natural everyday word for exhaustion.',
      },
      {
        id: 'en-doc-i-2',
        english: 'Should I take these pills with food or on an empty stomach?',
        meaning: 'Do I take them before or after eating?',
        usageNote: 'Practical question at the clinic or pharmacy.',
      },
      {
        id: 'en-doc-i-3',
        english: 'Are there any side effects I should watch out for?',
        meaning: 'Can this medicine cause any unwanted reactions?',
        usageNote: 'Important check before starting treatment.',
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
        meaning: 'How many days will it take for the symptoms to pass?',
        usageNote: 'Helps you know when to schedule a follow-up.',
      },
    ],
    advanced: [
      {
        id: 'en-doc-a-1',
        english: 'The discomfort tends to flare up late in the evening.',
        meaning: 'The pain usually gets stronger toward night.',
        usageNote: 'Precise phrasing to describe recurring symptoms.',
      },
      {
        id: 'en-doc-a-2',
        english: 'Could this be triggered by stress or seasonal allergies?',
        meaning: 'Might exhaustion or pollen be causing it?',
        usageNote: 'Helps explore root causes with your doctor.',
      },
      {
        id: 'en-doc-a-3',
        english: 'I would prefer something that does not cause drowsiness.',
        meaning: 'Please prescribe a treatment that will not make me sleepy.',
        usageNote: 'Essential if you drive or work during treatment.',
      },
      {
        id: 'en-doc-a-4',
        english: 'Do I need a referral to see a specialist?',
        meaning: 'Do I need a doctor’s note to book a specialist visit?',
        usageNote: 'Standard medical term in English healthcare.',
      },
      {
        id: 'en-doc-a-5',
        english: 'What warning signs mean I should come back right away?',
        meaning: 'Which symptoms require an immediate return visit?',
        usageNote: 'Clear, proactive communication about recovery.',
      },
    ],
  },
  meeting: {
    beginner: [
      {
        id: 'en-meet-b-1',
        english: 'Nice to meet you! My name is...',
        meaning: 'Hello! I am glad to introduce myself.',
        usageNote: 'Classic, friendly way to meet someone new.',
      },
      {
        id: 'en-meet-b-2',
        english: 'Where are you from?',
        meaning: 'Which city or country do you come from?',
        usageNote: 'One of the easiest icebreakers in English.',
      },
      {
        id: 'en-meet-b-3',
        english: 'What do you like doing in your free time?',
        meaning: 'What are your favorite hobbies?',
        usageNote: 'Open question to discover shared interests.',
      },
      {
        id: 'en-meet-b-4',
        english: 'Do you live around here?',
        meaning: 'Do you live in this neighborhood or area?',
        usageNote: 'Spontaneous and warm at a café or social event.',
      },
      {
        id: 'en-meet-b-5',
        english: 'It was really nice talking with you!',
        meaning: 'I truly enjoyed chatting with you.',
        usageNote: 'Leaves a great impression when saying goodbye.',
      },
    ],
    intermediate: [
      {
        id: 'en-meet-i-1',
        english: 'How do you know everyone here tonight?',
        meaning: 'How did you meet the people at this gathering?',
        usageNote: 'Great conversation starter at parties or meetups.',
      },
      {
        id: 'en-meet-i-2',
        english: 'I only moved to this city a few months ago.',
        meaning: 'I have lived here for a short time.',
        usageNote: 'Naturally invites locals to share tips with you.',
      },
      {
        id: 'en-meet-i-3',
        english: 'Do you know any good places to eat nearby?',
        meaning: 'Can you recommend a nice restaurant in this area?',
        usageNote: 'Almost everyone loves sharing favorite food spots.',
      },
      {
        id: 'en-meet-i-4',
        english: 'That is awesome! How did you get into that?',
        meaning: 'Cool! How did your interest in that hobby begin?',
        usageNote: 'Shows genuine curiosity when someone shares a passion.',
      },
      {
        id: 'en-meet-i-5',
        english: 'We should definitely stay in touch!',
        meaning: 'Let us keep messaging or meet up again soon.',
        usageNote: 'Warm closing after a good conversation.',
      },
    ],
    advanced: [
      {
        id: 'en-meet-a-1',
        english: 'What has been the highlight of your week so far?',
        meaning: 'What made you happiest over the past few days?',
        usageNote: 'Sparks much better stories than "How are you?".',
      },
      {
        id: 'en-meet-a-2',
        english: 'I have been trying to expand my circle around town.',
        meaning: 'I am looking to make new friends locally.',
        usageNote: 'Honest, natural line at social or networking events.',
      },
      {
        id: 'en-meet-a-3',
        english: 'That is actually a really refreshing perspective.',
        meaning: 'You have an original and thoughtful way of seeing that.',
        usageNote: 'Makes the other person feel genuinely heard.',
      },
      {
        id: 'en-meet-a-4',
        english: 'It sounds like we have quite a bit in common.',
        meaning: 'We share many of the same tastes and interests.',
        usageNote: 'Builds quick rapport with someone new.',
      },
      {
        id: 'en-meet-a-5',
        english: 'Let us grab coffee sometime next week if you are free.',
        meaning: 'Let us meet for coffee next week when you have time.',
        usageNote: 'Casual, natural invitation in English.',
      },
    ],
  },
};
