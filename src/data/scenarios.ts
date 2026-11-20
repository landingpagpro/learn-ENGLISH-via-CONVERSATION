import { KeyPhrase, LevelMeta, ProficiencyLevel, ScenarioId, ScenarioMeta } from '../types';
import appLogo from '../assets/images/learn_english_conv_logo_1795184299171.jpg';

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
    description: 'Idioms & native fluency',
  },
];

export const SCENARIOS: ScenarioMeta[] = [
  {
    id: 'conversation',
    title: 'Learn English via Conversation',
    subtitle: 'Free-flow daily dialogue practice',
    roleDescription: 'Practice natural English conversations on any topic you want.',
    accentBg: 'bg-blue-50',
    accentText: 'text-[#1E40AF]',
  },
  {
    id: 'airport',
    title: 'At the Airport',
    subtitle: 'Check-in, security & boarding',
    roleDescription: 'Practice check-in counters, security screening, and boarding gates in English.',
    accentBg: 'bg-sky-50',
    accentText: 'text-sky-700',
  },
  {
    id: 'work',
    title: 'At Work',
    subtitle: 'Meetings, tasks & updates',
    roleDescription: 'Discuss projects, deadlines, and teamwork smoothly with coworkers.',
    accentBg: 'bg-indigo-50',
    accentText: 'text-indigo-700',
  },
  {
    id: 'doctor',
    title: 'At the Doctor',
    subtitle: 'Symptoms, visits & advice',
    roleDescription: 'Describe how you feel, ask about medicine, and understand instructions.',
    accentBg: 'bg-rose-50',
    accentText: 'text-rose-700',
  },
  {
    id: 'meeting',
    title: 'Meeting New People',
    subtitle: 'Introductions, hobbies & plans',
    roleDescription: 'Break the ice, share interests, and make new friends in English.',
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
        usageNote: 'A friendly and easy way to start any conversation.',
      },
      {
        id: 'en-conv-b-2',
        english: 'Could you repeat that, please?',
        meaning: 'Can you say that one more time?',
        usageNote: 'Very helpful whenever someone speaks a little too fast.',
      },
      {
        id: 'en-conv-b-3',
        english: 'What does this word mean?',
        meaning: 'Can you explain this word to me?',
        usageNote: 'Great question for learning new English vocabulary every day.',
      },
      {
        id: 'en-conv-b-4',
        english: 'I enjoy talking about sports and travel.',
        meaning: 'I like chatting about sports and trips.',
        usageNote: 'Swap "sports" and "travel" for any hobby you enjoy.',
      },
      {
        id: 'en-conv-b-5',
        english: 'That sounds really interesting!',
        meaning: 'That is cool and exciting to hear!',
        usageNote: 'A natural reaction that keeps the conversation flowing.',
      },
    ],
    intermediate: [
      {
        id: 'en-conv-i-1',
        english: 'What have you been up to lately?',
        meaning: 'What have you been doing recently?',
        usageNote: 'A relaxed, natural greeting among friends or coworkers.',
      },
      {
        id: 'en-conv-i-2',
        english: 'To be honest, I completely agree with you.',
        meaning: 'Truthfully, I think the exact same way.',
        usageNote: '"To be honest" makes your opinion sound warm and sincere.',
      },
      {
        id: 'en-conv-i-3',
        english: 'That reminds me of a similar story.',
        meaning: 'Your point makes me think of something like that.',
        usageNote: 'Smooth transition before sharing your own experience.',
      },
      {
        id: 'en-conv-i-4',
        english: 'How do you usually spend your weekends?',
        meaning: 'What do you normally do on Saturdays and Sundays?',
        usageNote: 'Great open-ended question to keep the dialogue going.',
      },
      {
        id: 'en-conv-i-5',
        english: 'I totally see where you are coming from.',
        meaning: 'I understand your point of view very well.',
        usageNote: 'Polite phrase that shows you are listening carefully.',
      },
    ],
    advanced: [
      {
        id: 'en-conv-a-1',
        english: 'Looking at the bigger picture, it makes complete sense.',
        meaning: 'Considering everything overall, it is very logical.',
        usageNote: 'Great phrase for thoughtful, deeper conversations.',
      },
      {
        id: 'en-conv-a-2',
        english: 'You hit the nail right on the head!',
        meaning: 'You described the exact point perfectly!',
        usageNote: 'Classic native idiom when someone is completely right.',
      },
      {
        id: 'en-conv-a-3',
        english: 'I have mixed feelings about that approach.',
        meaning: 'I see both pros and cons in that idea.',
        usageNote: 'Balanced way to share a nuanced opinion politely.',
      },
      {
        id: 'en-conv-a-4',
        english: 'Fair enough, both sides make a valid point.',
        meaning: 'That is reasonable; both views have merit.',
        usageNote: 'Sounds diplomatic and reflective during a discussion.',
      },
      {
        id: 'en-conv-a-5',
        english: 'It goes without saying that steady practice pays off.',
        meaning: 'Everyone knows consistent practice brings great results.',
        usageNote: 'Strong expression for introducing a clear truth.',
      },
    ],
  },
  airport: {
    beginner: [
      {
        id: 'en-air-b-1',
        english: 'Where is the check-in counter?',
        meaning: 'Where do I go to check in for my flight?',
        usageNote: 'Use this right when you walk into departures.',
      },
      {
        id: 'en-air-b-2',
        english: 'Here is my passport and ticket.',
        meaning: 'Please take my travel documents.',
        usageNote: 'Simple and polite at check-in or boarding.',
      },
      {
        id: 'en-air-b-3',
        english: 'Can I have a window seat, please?',
        meaning: 'I would like to sit next to the window.',
        usageNote: 'Swap "window" with "aisle" if you prefer easy walking access.',
      },
      {
        id: 'en-air-b-4',
        english: 'Which gate is my flight leaving from?',
        meaning: 'What is the boarding gate number for my plane?',
        usageNote: 'Useful if the departure boards are far away.',
      },
      {
        id: 'en-air-b-5',
        english: 'Is my flight on time?',
        meaning: 'Is the plane leaving at the scheduled time?',
        usageNote: 'Short and clear question for airline staff.',
      },
    ],
    intermediate: [
      {
        id: 'en-air-i-1',
        english: 'I would like to check one suitcase.',
        meaning: 'I need to put one large bag in the cargo hold.',
        usageNote: '"I would like to" always sounds polite and natural.',
      },
      {
        id: 'en-air-i-2',
        english: 'Do I need to collect my bag during the layover?',
        meaning: 'Should I pick up my luggage at the connecting airport?',
        usageNote: 'Essential question whenever you have a connecting flight.',
      },
      {
        id: 'en-air-i-3',
        english: 'How long is the walk to Gate 14?',
        meaning: 'How many minutes does it take to reach that gate?',
        usageNote: 'Helps you manage your time in big terminals.',
      },
      {
        id: 'en-air-i-4',
        english: 'Does this carry-on bag meet the size limit?',
        meaning: 'Is my hand luggage small enough for the cabin?',
        usageNote: 'Avoids surprise gate fees before boarding.',
      },
      {
        id: 'en-air-i-5',
        english: 'Could you let me know when boarding begins?',
        meaning: 'Please tell me once passengers can get on the plane.',
        usageNote: 'Polite way to ask gate agents for updates.',
      },
    ],
    advanced: [
      {
        id: 'en-air-a-1',
        english: 'I am worried I might miss my connection due to this delay.',
        meaning: 'This late departure could make me miss my next flight.',
        usageNote: '"I am worried I might..." expresses urgency calmly.',
      },
      {
        id: 'en-air-a-2',
        english: 'Would it be possible to rebook me on the next available flight?',
        meaning: 'Can you move my ticket to the following plane?',
        usageNote: 'Clear and effective phrasing at customer service desks.',
      },
      {
        id: 'en-air-a-3',
        english: 'My suitcase never came out on the baggage carousel.',
        meaning: 'My checked luggage did not arrive at baggage claim.',
        usageNote: 'Key sentence for reporting delayed bags.',
      },
      {
        id: 'en-air-a-4',
        english: 'Are passengers eligible for a hotel voucher tonight?',
        meaning: 'Does the airline cover a hotel room for this delay?',
        usageNote: 'Confident, polite phrasing with airport agents.',
      },
      {
        id: 'en-air-a-5',
        english: 'Could you attach a fragile tag to this bag?',
        meaning: 'Please mark this suitcase as containing breakable items.',
        usageNote: 'Helpful when carrying electronics or glass.',
      },
    ],
  },
  work: {
    beginner: [
      {
        id: 'en-work-b-1',
        english: 'Good morning! How was your weekend?',
        meaning: 'Hello! Did you enjoy Saturday and Sunday?',
        usageNote: 'Friendly Monday greeting before starting work.',
      },
      {
        id: 'en-work-b-2',
        english: 'I am working on the report today.',
        meaning: 'My main task today is preparing that document.',
        usageNote: 'Swap "report" with "project" or "presentation".',
      },
      {
        id: 'en-work-b-3',
        english: 'Can you help me with this task?',
        meaning: 'Could you give me a hand with this work?',
        usageNote: 'Direct, friendly, and clear among teammates.',
      },
      {
        id: 'en-work-b-4',
        english: 'When is the deadline for this project?',
        meaning: 'Which day does this work need to be finished?',
        usageNote: 'Clear question to confirm team priorities.',
      },
      {
        id: 'en-work-b-5',
        english: 'I will send you the file soon.',
        meaning: 'I will email or message the document shortly.',
        usageNote: 'Very common in everyday workplace chats.',
      },
    ],
    intermediate: [
      {
        id: 'en-work-i-1',
        english: 'Quick update: we are right on schedule.',
        meaning: 'Brief check-in: everything is moving along on time.',
        usageNote: 'Confident and clear way to give a status update.',
      },
      {
        id: 'en-work-i-2',
        english: 'Do you have a minute to review this together?',
        meaning: 'Can we check this work quickly together?',
        usageNote: 'Polite opener before asking a coworker for feedback.',
      },
      {
        id: 'en-work-i-3',
        english: 'Let us touch base tomorrow afternoon.',
        meaning: 'Let us reconnect tomorrow for a quick update.',
        usageNote: '"Touch base" is one of the most common office idioms.',
      },
      {
        id: 'en-work-i-4',
        english: 'I ran into a small issue with the client file.',
        meaning: 'I noticed a problem in the client document.',
        usageNote: '"Ran into an issue" sounds calm and professional.',
      },
      {
        id: 'en-work-i-5',
        english: 'I will keep everyone posted on our progress.',
        meaning: 'I will share updates as the work moves forward.',
        usageNote: 'Shows strong ownership and teamwork.',
      },
    ],
    advanced: [
      {
        id: 'en-work-a-1',
        english: 'Let us align on the key priorities before we move forward.',
        meaning: 'Let us agree on the most important goals first.',
        usageNote: 'Great way to lead a planning meeting.',
      },
      {
        id: 'en-work-a-2',
        english: 'We need to address this bottleneck right away.',
        meaning: 'We must fix whatever is slowing the whole team down.',
        usageNote: '"Bottleneck" is widely used in project management.',
      },
      {
        id: 'en-work-a-3',
        english: 'Realistically, that timeline feels a bit tight.',
        meaning: 'Honestly, we may not have enough time for that date.',
        usageNote: 'Diplomatic phrasing for pushing back on a deadline.',
      },
      {
        id: 'en-work-a-4',
        english: 'I really appreciate your constructive feedback on the draft.',
        meaning: 'Thank you for the helpful suggestions on my work.',
        usageNote: 'Builds warm collaboration with colleagues.',
      },
      {
        id: 'en-work-a-5',
        english: 'Let us circle back once we have the final numbers.',
        meaning: 'We can revisit this topic after the data is ready.',
        usageNote: 'Natural executive phrasing to wrap up an item.',
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
        usageNote: 'One of the first details every doctor asks for.',
      },
      {
        id: 'en-doc-b-3',
        english: 'It hurts right here.',
        meaning: 'I feel pain in this exact spot.',
        usageNote: 'Simple and clear during a physical exam.',
      },
      {
        id: 'en-doc-b-4',
        english: 'How many times a day should I take this medicine?',
        meaning: 'What is the daily dose for this medication?',
        usageNote: 'Always double-check your schedule before leaving.',
      },
      {
        id: 'en-doc-b-5',
        english: 'Thank you, doctor. I feel much calmer now.',
        meaning: 'Thanks for helping me feel reassured.',
        usageNote: 'Polite way to wrap up your appointment.',
      },
    ],
    intermediate: [
      {
        id: 'en-doc-i-1',
        english: 'I have been feeling very run down all week.',
        meaning: 'I have been tired and low on energy for days.',
        usageNote: '"Run down" is a very natural English expression.',
      },
      {
        id: 'en-doc-i-2',
        english: 'Should I take these pills with food or on an empty stomach?',
        meaning: 'Do I take them before or after eating a meal?',
        usageNote: 'Important practical question at the clinic or pharmacy.',
      },
      {
        id: 'en-doc-i-3',
        english: 'Are there any side effects I should watch out for?',
        meaning: 'Could this medicine cause any unwanted reactions?',
        usageNote: 'Smart check before starting a new prescription.',
      },
      {
        id: 'en-doc-i-4',
        english: 'I am allergic to penicillin.',
        meaning: 'My body has a bad reaction to that antibiotic.',
        usageNote: 'Swap "penicillin" for any allergy you have.',
      },
      {
        id: 'en-doc-i-5',
        english: 'How soon should I start feeling better?',
        meaning: 'How many days before the symptoms improve?',
        usageNote: 'Helps you know when to follow up if needed.',
      },
    ],
    advanced: [
      {
        id: 'en-doc-a-1',
        english: 'The discomfort tends to flare up later in the evening.',
        meaning: 'The pain usually gets stronger near the end of the day.',
        usageNote: '"Flare up" describes symptoms that come back or worsen.',
      },
      {
        id: 'en-doc-a-2',
        english: 'Could this be triggered by stress or seasonal allergies?',
        meaning: 'Might tiredness or pollen be causing these symptoms?',
        usageNote: 'Helps discuss possible causes thoughtfully.',
      },
      {
        id: 'en-doc-a-3',
        english: 'I would prefer something that does not cause drowsiness.',
        meaning: 'Please prescribe medicine that will not make me sleepy.',
        usageNote: 'Crucial if you drive or work during the day.',
      },
      {
        id: 'en-doc-a-4',
        english: 'Do I need a referral to see a specialist?',
        meaning: 'Do I need a doctor note before booking a specialist?',
        usageNote: 'Standard healthcare term ("referral") in clinics.',
      },
      {
        id: 'en-doc-a-5',
        english: 'What warning signs mean I should come back right away?',
        meaning: 'Which symptoms mean I need urgent follow-up?',
        usageNote: 'Clear, proactive communication about your health.',
      },
    ],
  },
  meeting: {
    beginner: [
      {
        id: 'en-meet-b-1',
        english: 'Nice to meet you! My name is Alex.',
        meaning: 'Hello! I am glad to meet you.',
        usageNote: 'Classic, friendly way to introduce yourself.',
      },
      {
        id: 'en-meet-b-2',
        english: 'Where are you from?',
        meaning: 'Which city or country do you come from?',
        usageNote: 'One of the easiest questions to start chatting.',
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
        meaning: 'Do you live in this neighborhood or nearby?',
        usageNote: 'Casual and natural at a cafe or social event.',
      },
      {
        id: 'en-meet-b-5',
        english: 'It was really great talking with you!',
        meaning: 'I truly enjoyed our chat!',
        usageNote: 'Leaves a warm impression when saying goodbye.',
      },
    ],
    intermediate: [
      {
        id: 'en-meet-i-1',
        english: 'How do you know everyone else here?',
        meaning: 'How did you meet the people in this group?',
        usageNote: 'Great icebreaker at parties or meetups.',
      },
      {
        id: 'en-meet-i-2',
        english: 'I just moved to this city a few months ago.',
        meaning: 'I am fairly new to living around here.',
        usageNote: 'Naturally invites people to share local tips.',
      },
      {
        id: 'en-meet-i-3',
        english: 'Do you know any good restaurants around here?',
        meaning: 'Can you recommend a nice place to eat nearby?',
        usageNote: 'Almost everyone loves recommending favorite spots.',
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
        meaning: 'Let us keep messaging or hang out again soon!',
        usageNote: 'Warm closing after a good conversation.',
      },
    ],
    advanced: [
      {
        id: 'en-meet-a-1',
        english: 'What has been the highlight of your week so far?',
        meaning: 'What is the best thing that happened to you this week?',
        usageNote: 'Sparks much better stories than just "How are you?".',
      },
      {
        id: 'en-meet-a-2',
        english: 'I am trying to branch out and meet more locals.',
        meaning: 'I want to expand my circle and make new friends here.',
        usageNote: 'Honest, friendly explanation at social events.',
      },
      {
        id: 'en-meet-a-3',
        english: 'That is actually a really refreshing perspective.',
        meaning: 'That is a unique and thoughtful way to see it.',
        usageNote: 'Makes the listener feel genuinely appreciated.',
      },
      {
        id: 'en-meet-a-4',
        english: 'It sounds like we have quite a bit in common.',
        meaning: 'We share a lot of similar tastes and interests.',
        usageNote: 'Builds quick rapport with someone new.',
      },
      {
        id: 'en-meet-a-5',
        english: 'Let us grab coffee sometime next week if you are free.',
        meaning: 'Let us meet up for a coffee when you have time.',
        usageNote: 'Easygoing, natural invitation in English.',
      },
    ],
  },
};
