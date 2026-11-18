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
    description: 'Natural everyday conversation',
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
    roleDescription: 'Practice standup updates, discussing deadlines, and collaborating with coworkers.',
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
        id: 'conv-b-1',
        english: 'How is your day going?',
        meaning: 'Friendly way to ask someone how their day is.',
        usageNote: 'Works great at the start of almost any English conversation.',
      },
      {
        id: 'conv-b-2',
        english: 'Could you say that again, please?',
        meaning: 'Politely asking someone to repeat what they said.',
        usageNote: 'Very useful whenever someone speaks too fast.',
      },
      {
        id: 'conv-b-3',
        english: 'What does that word mean?',
        meaning: 'Asking for the definition of a new English word.',
        usageNote: 'Great habit for learning new vocabulary naturally.',
      },
      {
        id: 'conv-b-4',
        english: 'I like talking about sports and travel.',
        meaning: 'Sharing topics you enjoy discussing.',
        usageNote: 'Swap "sports and travel" with your own hobbies.',
      },
      {
        id: 'conv-b-5',
        english: 'That sounds really interesting!',
        meaning: 'Showing curiosity and positive reaction.',
        usageNote: 'Keeps the conversation friendly and flowing.',
      },
    ],
    intermediate: [
      {
        id: 'conv-i-1',
        english: 'What have you been up to lately?',
        meaning: 'Asking someone what they have been doing recently.',
        usageNote: 'Very common, relaxed greeting between friends.',
      },
      {
        id: 'conv-i-2',
        english: 'To be honest, I completely agree with you.',
        meaning: 'Expressing strong agreement politely.',
        usageNote: '"To be honest" makes your opinion sound conversational.',
      },
      {
        id: 'conv-i-3',
        english: 'That reminds me of something similar.',
        meaning: 'Connecting the current topic to your own story.',
        usageNote: 'Smooth transition when you want to share an experience.',
      },
      {
        id: 'conv-i-4',
        english: 'How do you usually spend your weekends?',
        meaning: 'Asking about someone\'s free-time routine.',
        usageNote: 'Easy open-ended question to keep chatting.',
      },
      {
        id: 'conv-i-5',
        english: 'I did not quite catch that last part.',
        meaning: 'Polite way to say you missed the end of a sentence.',
        usageNote: 'More natural than simply saying "What?"',
      },
    ],
    advanced: [
      {
        id: 'conv-a-1',
        english: 'That is a really compelling point you just made.',
        meaning: 'Complimenting someone on a strong, persuasive idea.',
        usageNote: 'Great in thoughtful discussions and debates.',
      },
      {
        id: 'conv-a-2',
        english: 'Speaking of which, have you seen the latest update?',
        meaning: 'Shifting smoothly to a closely related topic.',
        usageNote: '"Speaking of which" links two ideas effortlessly.',
      },
      {
        id: 'conv-a-3',
        english: 'I can definitely see where you are coming from.',
        meaning: 'Showing you understand someone\'s perspective.',
        usageNote: 'Respectful even when you have a slightly different opinion.',
      },
      {
        id: 'conv-a-4',
        english: 'Long story short, everything worked out in the end.',
        meaning: 'Summarizing a complicated story quickly.',
        usageNote: 'Very common American phrasing to get to the point.',
      },
      {
        id: 'conv-a-5',
        english: 'It slipped my mind completely—thanks for the reminder!',
        meaning: 'Admitting politely that you forgot something.',
        usageNote: '"Slipped my mind" sounds much softer than "I forgot."',
      },
    ],
  },
  airport: {
    beginner: [
      {
        id: 'air-b-1',
        english: 'Here is my passport.',
        meaning: 'Handing over your passport at check-in or security.',
        usageNote: 'Simple and polite when an agent asks for your ID.',
      },
      {
        id: 'air-b-2',
        english: 'Where is gate 12?',
        meaning: 'Asking for directions to your boarding gate.',
        usageNote: 'Replace 12 with your actual gate number on the boarding pass.',
      },
      {
        id: 'air-b-3',
        english: 'I have one suitcase.',
        meaning: 'Telling the agent how many bags you are checking.',
        usageNote: 'Useful right at the airline check-in desk.',
      },
      {
        id: 'air-b-4',
        english: 'Can I have a window seat?',
        meaning: 'Politely requesting a seat next to the window.',
        usageNote: 'You can swap "window" for "aisle" if you prefer walking room.',
      },
      {
        id: 'air-b-5',
        english: 'What time does the plane leave?',
        meaning: 'Asking when your flight departs.',
        usageNote: 'Clear everyday question for departure times.',
      },
    ],
    intermediate: [
      {
        id: 'air-i-1',
        english: "I'd like to check in for my flight.",
        meaning: 'Starting the check-in process at the counter.',
        usageNote: '"I\'d like to..." sounds smoother and more polite than "I want to...".',
      },
      {
        id: 'air-i-2',
        english: 'Is the flight on time?',
        meaning: 'Checking whether your flight is delayed or on schedule.',
        usageNote: 'Great to ask at the gate desk before boarding.',
      },
      {
        id: 'air-i-3',
        english: 'Where is baggage claim?',
        meaning: 'Asking where to pick up checked luggage after landing.',
        usageNote: 'Follow signs labeled "Baggage Claim" after you exit the plane.',
      },
      {
        id: 'air-i-4',
        english: 'Do I need to take off my shoes?',
        meaning: 'Asking about airport security screening rules.',
        usageNote: 'Rules vary by airport and lane, so it is always helpful to ask.',
      },
      {
        id: 'air-i-5',
        english: 'How long is the layover?',
        meaning: 'Asking how much time you wait between connecting flights.',
        usageNote: 'A "layover" is the stop between two flights.',
      },
    ],
    advanced: [
      {
        id: 'air-a-1',
        english: 'Any chance there is an aisle seat available?',
        meaning: 'Casually asking if an aisle seat is still open.',
        usageNote: '"Any chance..." softens a request and sounds very natural.',
      },
      {
        id: 'air-a-2',
        english: 'My connecting flight is pretty tight.',
        meaning: 'Saying there is very little time before your next flight.',
        usageNote: '"Tight connection" is common American travel phrasing.',
      },
      {
        id: 'air-a-3',
        english: 'Could you tag my bag all the way through?',
        meaning: 'Asking if checked luggage goes straight to your final destination.',
        usageNote: 'Saves you from collecting and re-checking bags during a layover.',
      },
      {
        id: 'air-a-4',
        english: 'Looks like we are boarding in ten minutes.',
        meaning: 'Noticing that boarding is about to start soon.',
        usageNote: '"Looks like..." is a natural way to share an observation.',
      },
      {
        id: 'air-a-5',
        english: "My luggage didn't make it onto the carousel.",
        meaning: 'Reporting that your suitcase did not arrive on the belt.',
        usageNote: 'Use this at the airline baggage office if a bag is delayed.',
      },
    ],
  },
  work: {
    beginner: [
      {
        id: 'wrk-b-1',
        english: 'I am working on this task.',
        meaning: 'Telling coworkers what you are currently doing.',
        usageNote: 'Clear answer during morning team check-ins.',
      },
      {
        id: 'wrk-b-2',
        english: 'Can you help me, please?',
        meaning: 'Asking a teammate for support.',
        usageNote: 'Direct and polite whenever you get stuck.',
      },
      {
        id: 'wrk-b-3',
        english: 'I finished my work.',
        meaning: 'Letting someone know your part is done.',
        usageNote: 'Great for updating a manager or teammate.',
      },
      {
        id: 'wrk-b-4',
        english: 'Sorry, I did not understand.',
        meaning: 'Asking someone to repeat or clarify.',
        usageNote: 'Always okay to ask for clarity at work.',
      },
      {
        id: 'wrk-b-5',
        english: 'Let us have a short break.',
        meaning: 'Suggesting a quick rest during work.',
        usageNote: 'Friendly phrasing during long meetings or work sessions.',
      },
    ],
    intermediate: [
      {
        id: 'wrk-i-1',
        english: 'Let me double-check and get back to you.',
        meaning: 'Promising to verify details and reply soon.',
        usageNote: 'Very professional in both meetings and chat messages.',
      },
      {
        id: 'wrk-i-2',
        english: 'I ran into a small issue.',
        meaning: 'Explaining that you encountered an unexpected problem.',
        usageNote: '"Run into" means to encounter something unexpectedly.',
      },
      {
        id: 'wrk-i-3',
        english: 'Are we still on track for Friday?',
        meaning: 'Checking if the deadline for Friday will be met.',
        usageNote: '"On track" means progressing according to plan.',
      },
      {
        id: 'wrk-i-4',
        english: 'Could you share your screen?',
        meaning: 'Asking someone to show their screen on a video call.',
        usageNote: 'Essential phrase for remote work meetings.',
      },
      {
        id: 'wrk-i-5',
        english: 'Sounds like a solid plan.',
        meaning: 'Agreeing enthusiastically with an idea.',
        usageNote: 'Positive, natural way to confirm alignment.',
      },
    ],
    advanced: [
      {
        id: 'wrk-a-1',
        english: "Let's circle back on this tomorrow morning.",
        meaning: 'Agreeing to revisit a topic later.',
        usageNote: '"Circle back" is one of the most common US workplace phrases.',
      },
      {
        id: 'wrk-a-2',
        english: 'Do you have the bandwidth to take this on?',
        meaning: 'Asking if someone has enough time and capacity for a new task.',
        usageNote: '"Bandwidth" in business means available time or energy.',
      },
      {
        id: 'wrk-a-3',
        english: 'Just wanted to give you a quick heads-up.',
        meaning: 'Giving someone an advance notice or warning.',
        usageNote: 'A "heads-up" helps teammates prepare early.',
      },
      {
        id: 'wrk-a-4',
        english: "We're aligned on the next steps.",
        meaning: 'Confirming everyone agrees on what happens next.',
        usageNote: 'Used to wrap up meetings clearly.',
      },
      {
        id: 'wrk-a-5',
        english: 'Let me loop Sarah in on this thread.',
        meaning: 'Adding a coworker to an email or chat conversation.',
        usageNote: '"Loop someone in" means bring them into the discussion.',
      },
    ],
  },
  doctor: {
    beginner: [
      {
        id: 'doc-b-1',
        english: 'I have a headache.',
        meaning: 'Saying your head hurts.',
        usageNote: 'Swap "head" with "stomachache" or "backache" as needed.',
      },
      {
        id: 'doc-b-2',
        english: 'I feel very tired.',
        meaning: 'Describing low energy or fatigue.',
        usageNote: 'Simple way to explain general exhaustion.',
      },
      {
        id: 'doc-b-3',
        english: 'Since yesterday.',
        meaning: 'Explaining when your symptoms started.',
        usageNote: 'Quick answer when the doctor asks "How long?"',
      },
      {
        id: 'doc-b-4',
        english: 'I need some medicine.',
        meaning: 'Asking for medication to feel better.',
        usageNote: 'Clear and easy to understand at a clinic or pharmacy.',
      },
      {
        id: 'doc-b-5',
        english: 'How many times a day?',
        meaning: 'Asking how often to take medicine.',
        usageNote: 'Important question so you follow the dosage safely.',
      },
    ],
    intermediate: [
      {
        id: 'doc-i-1',
        english: "I've had a sore throat for three days.",
        meaning: 'Describing a painful throat that started three days ago and continues.',
        usageNote: 'Use "I\'ve had..." for symptoms that are still ongoing.',
      },
      {
        id: 'doc-i-2',
        english: 'Should I take this with food?',
        meaning: 'Asking if medicine needs to be taken alongside a meal.',
        usageNote: 'Great question for both doctors and pharmacists.',
      },
      {
        id: 'doc-i-3',
        english: "I'm allergic to penicillin.",
        meaning: 'Warning medical staff about a drug allergy.',
        usageNote: 'Always mention any medication allergies before getting a prescription.',
      },
      {
        id: 'doc-i-4',
        english: 'It hurts when I swallow.',
        meaning: 'Explaining sharp pain when eating or drinking.',
        usageNote: 'Helps the doctor pinpoint throat inflammation.',
      },
      {
        id: 'doc-i-5',
        english: 'Do I need a prescription for this?',
        meaning: "Asking if a doctor's note is required to buy the medicine.",
        usageNote: 'Over-the-counter items do not need a prescription.',
      },
    ],
    advanced: [
      {
        id: 'doc-a-1',
        english: "I've been feeling under the weather all week.",
        meaning: 'Saying you have felt mildly sick for days.',
        usageNote: '"Under the weather" is a classic, gentle way to say unwell.',
      },
      {
        id: 'doc-a-2',
        english: 'The pain comes and goes throughout the day.',
        meaning: 'Describing pain that is intermittent rather than constant.',
        usageNote: 'Accurate phrasing to help a doctor diagnose patterns.',
      },
      {
        id: 'doc-a-3',
        english: 'Are there any side effects I should watch out for?',
        meaning: 'Asking about possible unwanted reactions to a treatment.',
        usageNote: '"Watch out for" means pay close attention to.',
      },
      {
        id: 'doc-a-4',
        english: "I'm hoping it's just a mild viral bug.",
        meaning: 'Guessing it might be a light, temporary virus.',
        usageNote: '"Bug" in casual English often means a common cold or stomach virus.',
      },
      {
        id: 'doc-a-5',
        english: 'When should I follow up if it does not clear up?',
        meaning: 'Asking when to return if symptoms do not improve.',
        usageNote: '"Clear up" means heal or go away completely.',
      },
    ],
  },
  meeting: {
    beginner: [
      {
        id: 'met-b-1',
        english: 'Nice to meet you!',
        meaning: 'Friendly greeting when meeting someone for the first time.',
        usageNote: 'Used everywhere in casual and professional introductions.',
      },
      {
        id: 'met-b-2',
        english: 'I am from Morocco.',
        meaning: 'Sharing your home country.',
        usageNote: 'Replace with your city or country anytime.',
      },
      {
        id: 'met-b-3',
        english: 'What do you like to do?',
        meaning: 'Asking someone about their hobbies or free-time activities.',
        usageNote: 'An easy question that keeps conversation flowing.',
      },
      {
        id: 'met-b-4',
        english: 'I love learning English.',
        meaning: 'Sharing your interest in practicing English.',
        usageNote: 'People appreciate hearing about your goals!',
      },
      {
        id: 'met-b-5',
        english: 'See you soon!',
        meaning: 'Warm way to say goodbye.',
        usageNote: 'Works great with new friends and acquaintances.',
      },
    ],
    intermediate: [
      {
        id: 'met-i-1',
        english: 'What do you do for a living?',
        meaning: "Asking about someone's job or career.",
        usageNote: 'Sounds much warmer than "What is your job?".',
      },
      {
        id: 'met-i-2',
        english: 'How long have you lived here?',
        meaning: 'Asking how many months or years someone has stayed in the area.',
        usageNote: 'Great conversation starter in a new city.',
      },
      {
        id: 'met-i-3',
        english: 'In my free time, I enjoy cooking.',
        meaning: 'Talking about a hobby you do outside of work.',
        usageNote: 'Swap "cooking" with hiking, reading, or soccer.',
      },
      {
        id: 'met-i-4',
        english: 'We should hang out sometime!',
        meaning: 'Suggesting getting together casually as friends.',
        usageNote: '"Hang out" means spend relaxed time together.',
      },
      {
        id: 'met-i-5',
        english: 'Let me get your Instagram or number.',
        meaning: 'Asking how to stay in touch.',
        usageNote: 'Casual, natural way to exchange contact info.',
      },
    ],
    advanced: [
      {
        id: 'met-a-1',
        english: "It's been great catching up with you!",
        meaning: "Saying you enjoyed hearing someone's news and stories.",
        usageNote: '"Catching up" means updating each other on life.',
      },
      {
        id: 'met-a-2',
        english: 'How did you end up getting into that field?',
        meaning: 'Asking what led someone to their current career or passion.',
        usageNote: 'Encourages people to share interesting personal stories.',
      },
      {
        id: 'met-a-3',
        english: "I'm a huge fan of trying out new food spots.",
        meaning: 'Saying you love discovering new restaurants and cafés.',
        usageNote: '"Huge fan of..." expresses enthusiasm naturally.',
      },
      {
        id: 'met-a-4',
        english: 'No way, small world!',
        meaning: 'Reacting with surprise to an unexpected coincidence.',
        usageNote: 'Say this when you discover you know the same person or place.',
      },
      {
        id: 'met-a-5',
        english: 'Shoot me a text whenever you are free this week.',
        meaning: 'Inviting someone to message you to make plans.',
        usageNote: '"Shoot me a text" is classic casual American English.',
      },
    ],
  },
};
