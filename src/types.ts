export type ScenarioId = 'conversation' | 'airport' | 'work' | 'doctor' | 'meeting';

export type ProficiencyLevel = 'beginner' | 'intermediate' | 'advanced';

export interface MistakeCorrection {
  correctedFrench: string;
  explanation: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'claire';
  text: string;
  translations?: Record<string, string>;
  timestamp: string;
  correction?: MistakeCorrection;
  suggestedNextReply?: string;
}

export interface KeyPhrase {
  id: string;
  french: string;
  meaning: string;
  usageNote: string;
  memorized?: boolean;
}

export interface ScenarioMeta {
  id: ScenarioId;
  title: string;
  subtitle: string;
  roleDescription: string;
  accentBg: string;
  accentText: string;
}

export interface LevelMeta {
  id: ProficiencyLevel;
  label: string;
  description: string;
}

export interface ConversationThread {
  messages: ChatMessage[];
  phrases: KeyPhrase[];
  lastUpdated: number;
}
