export type ScenarioId = 'conversation' | 'airport' | 'work' | 'doctor' | 'meeting';

export type ProficiencyLevel = 'beginner' | 'intermediate' | 'advanced';

export interface MistakeCorrection {
  correctedItalian: string;
  explanation: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'marco';
  text: string;
  translations?: Record<string, string>;
  timestamp: string;
  correction?: MistakeCorrection;
  suggestedNextReply?: string;
}

export interface KeyPhrase {
  id: string;
  italian: string;
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
