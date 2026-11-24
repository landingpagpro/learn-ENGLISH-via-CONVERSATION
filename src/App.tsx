import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { ChatComposer } from './components/ChatComposer';
import { ChatHeader } from './components/ChatHeader';
import { LanguagePickerModal } from './components/LanguagePickerModal';
import { MessageBubble } from './components/MessageBubble';
import { PhrasesPanel } from './components/PhrasesPanel';
import { Sidebar } from './components/Sidebar';
import { TranslationLanguage } from './data/languages';
import { APP_LOGO_URL, INITIAL_PHRASES, LEVELS, SCENARIOS } from './data/scenarios';
import { useSpeechAudio } from './hooks/useSpeechAudio';
import {
  generateKeylessChatReply,
  getNextFreeKeylessPhrases,
  translateKeylessText,
} from './utils/freeKeylessTutor';
import {
  ChatMessage,
  ConversationThread,
  ProficiencyLevel,
  ScenarioId,
} from './types';

const PHRASES_KEY = 'le_en_talking_phrases_v1';
const AUTOSPEAK_KEY = 'le_en_talking_autospeak_v1';
const TRANSLANG_KEY = 'le_en_talking_trans_lang_v1';
const SAVED_LINKS_KEY = 'le_en_talking_saved_links_v1';
const MAX_MESSAGES_PER_THREAD = 30;

const SHORT_SCENARIOS: Record<ScenarioId, string> = {
  conversation: 'Topics',
  airport: 'Airport',
  work: 'Work',
  doctor: 'Doctor',
  meeting: 'People',
};

function persistActiveHostLinks(serverLinks?: { freeUrl?: string | null; domainUrl?: string | null }) {
  try {
    const existingRaw = localStorage.getItem(SAVED_LINKS_KEY);
    const existing = existingRaw
      ? (JSON.parse(existingRaw) as { freeUrl?: string; domainUrl?: string })
      : {};
    const origin = window.location.origin;
    const host = window.location.hostname.toLowerCase();
    const isFree =
      host.endsWith('.onrender.com') ||
      host.endsWith('.vercel.app') ||
      host.endsWith('.run.app') ||
      host.endsWith('.netlify.app') ||
      host.endsWith('.railway.app') ||
      host.endsWith('.fly.dev');
    const isCustomDomain =
      Boolean(host) &&
      host !== 'localhost' &&
      host !== '127.0.0.1' &&
      !/^\d+\.\d+\.\d+\.\d+$/.test(host) &&
      !isFree &&
      host.includes('.');

    const next = {
      freeUrl: serverLinks?.freeUrl || (isFree ? origin : existing.freeUrl) || null,
      domainUrl: serverLinks?.domainUrl || (isCustomDomain ? origin : existing.domainUrl) || null,
      updatedAt: Date.now(),
    };
    localStorage.setItem(SAVED_LINKS_KEY, JSON.stringify(next));
  } catch {
    // Ignore storage errors
  }
}

function formatTimeNow(): string {
  const now = new Date();
  return now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

function createEmptyThread(scenarioId: ScenarioId, level: ProficiencyLevel): ConversationThread {
  return {
    messages: [],
    phrases: INITIAL_PHRASES[scenarioId][level].map((p) => ({ ...p, memorized: false })),
    lastUpdated: Date.now(),
  };
}

interface ChatPayload {
  replyEnglish?: string;
  hasMistake?: boolean;
  correctedEnglish?: string;
  explanation?: string;
  replyTranslation?: string;
  suggestedNextReply?: string;
}

export default function App() {
  const [activeScenario, setActiveScenario] = useState<ScenarioId>('conversation');
  const [activeLevel, setActiveLevel] = useState<ProficiencyLevel>('beginner');
  const [mobileView, setMobileView] = useState<'list' | 'chat'>('chat');
  const [phrasesDrawerOpen, setPhrasesDrawerOpen] = useState(false);

  // Clear legacy storage keys on startup, auto-save active links & keep server instance warm
  useEffect(() => {
    try {
      [
        'sahbi_english_threads_v1',
        'sahbi_english_autospeak_v1',
        'sahbi_english_litemode_v1',
        'sahbi_english_trans_lang_v1',
        'sahbi_english_trans_lang_v2',
        'alex_english_threads_v1',
        'alex_english_autospeak_v1',
        'alex_english_litemode_v1',
        'alex_english_trans_lang_v1',
        'le_conv_phrases_v1',
        'le_conv_autospeak_v1',
        'le_conv_litemode_v1',
        'le_conv_trans_lang_v1',
        'le_conv_active_track_v1',
        'lf_conv_phrases_v1',
        'lf_conv_autospeak_v1',
        'lf_conv_litemode_v1',
        'lf_conv_trans_lang_v1',
        'le_it_phrases_v1',
        'le_it_autospeak_v1',
        'le_it_litemode_v1',
        'le_it_trans_lang_v1',
        'le_it_conv_phrases_v2',
        'le_it_conv_autospeak_v2',
        'le_it_conv_litemode_v2',
        'le_it_conv_trans_lang_v2',
        'le_it_parlando_phrases_v3',
        'le_it_parlando_autospeak_v3',
        'le_it_parlando_mode_v5',
        'le_it_parlando_trans_lang_v3',
        'le_it_parlando_saved_links_v1',
      ].forEach((k) => localStorage.removeItem(k));
    } catch {
      // Ignore storage errors
    }
    persistActiveHostLinks();
    const syncHealthAndLinks = () => {
      fetch('/api/health')
        .then((r) => (r.ok ? r.json() : null))
        .then((data: { links?: { freeUrl?: string | null; domainUrl?: string | null } } | null) => {
          if (data?.links) {
            persistActiveHostLinks(data.links);
          }
        })
        .catch(() => {});
    };
    syncHealthAndLinks();
    const warmTimer = window.setInterval(() => {
      if (document.visibilityState === 'visible') {
        syncHealthAndLinks();
      }
    }, 240000);
    return () => window.clearInterval(warmTimer);
  }, []);

  // Keep conversations ephemeral in session memory; restore memorized English phrases per scenario/level
  const [threads, setThreads] = useState<Record<string, ConversationThread>>(() => {
    try {
      const savedPhrases = localStorage.getItem(PHRASES_KEY);
      if (savedPhrases) {
        const parsed = JSON.parse(savedPhrases) as Record<string, ConversationThread['phrases']>;
        const restored: Record<string, ConversationThread> = {};
        for (const [key, phrases] of Object.entries(parsed)) {
          const parts = key.split(':');
          if (parts.length === 2) {
            const [sc, lv] = parts as [ScenarioId, ProficiencyLevel];
            if (INITIAL_PHRASES[sc]?.[lv] && Array.isArray(phrases)) {
              restored[`${sc}:${lv}`] = {
                messages: [],
                phrases,
                lastUpdated: Date.now(),
              };
            }
          }
        }
        return restored;
      }
    } catch {
      // Ignore storage errors
    }
    return {};
  });

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isGeneratingPhrases, setIsGeneratingPhrases] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const [autoSpeak, setAutoSpeak] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(AUTOSPEAK_KEY);
      return saved === null ? true : saved === 'true';
    } catch {
      return true;
    }
  });

  const [selectedLanguage, setSelectedLanguage] = useState<TranslationLanguage | null>(() => {
    try {
      const saved = localStorage.getItem(TRANSLANG_KEY);
      if (saved) return JSON.parse(saved) as TranslationLanguage;
    } catch {
      // Ignore storage errors
    }
    return null;
  });
  const [languagePickerOpen, setLanguagePickerOpen] = useState(false);
  const [pendingTranslateMsgId, setPendingTranslateMsgId] = useState<string | null>(null);
  const [openSignalByMsgId, setOpenSignalByMsgId] = useState<Record<string, number>>({});
  const [translatingIds, setTranslatingIds] = useState<Record<string, boolean>>({});
  const [failedMessage, setFailedMessage] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState<boolean>(() =>
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [logoError, setLogoError] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setChatError((prev) => (prev?.toLowerCase().includes('offline') ? null : prev));
    };
    const handleOffline = () => {
      setIsOnline(false);
    };
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const autoSpeakRef = useRef(autoSpeak);
  const selectedLangRef = useRef<TranslationLanguage | null>(selectedLanguage);

  useEffect(() => {
    selectedLangRef.current = selectedLanguage;
    try {
      if (selectedLanguage) {
        localStorage.setItem(TRANSLANG_KEY, JSON.stringify(selectedLanguage));
      } else {
        localStorage.removeItem(TRANSLANG_KEY);
      }
    } catch {
      // Ignore storage errors
    }
  }, [selectedLanguage]);

  useEffect(() => {
    autoSpeakRef.current = autoSpeak;
    try {
      localStorage.setItem(AUTOSPEAK_KEY, String(autoSpeak));
    } catch {
      // Ignore storage errors
    }
  }, [autoSpeak]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const { loadingId, playingId, audioError, play, stop, unlockAudio } = useSpeechAudio();

  const threadKey = `${activeScenario}:${activeLevel}`;

  const currentThread: ConversationThread = useMemo(() => {
    return threads[threadKey] || createEmptyThread(activeScenario, activeLevel);
  }, [activeLevel, activeScenario, threadKey, threads]);

  // Ensure active thread exists in session state
  useEffect(() => {
    if (!threads[threadKey]) {
      setThreads((prev) => ({
        ...prev,
        [threadKey]: createEmptyThread(activeScenario, activeLevel),
      }));
    }
  }, [activeLevel, activeScenario, threadKey, threads]);

  // Persist only memorized phrases (never persist old chat messages across sessions)
  useEffect(() => {
    try {
      const phrasesMap: Record<string, ConversationThread['phrases']> = {};
      for (const [k, t] of Object.entries(threads) as Array<[string, ConversationThread]>) {
        phrasesMap[k] = t.phrases;
      }
      localStorage.setItem(PHRASES_KEY, JSON.stringify(phrasesMap));
    } catch {
      // Ignore quota errors
    }
  }, [threads]);

  // Auto-scroll to latest message or incoming streamed chunk
  const lastMessageText = currentThread.messages[currentThread.messages.length - 1]?.text || '';
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: isTyping ? 'auto' : 'smooth' });
  }, [currentThread.messages.length, lastMessageText, isTyping, activeScenario, activeLevel]);

  const handleSelectScenario = useCallback(
    (scenarioId: ScenarioId) => {
      stop();
      setChatError(null);
      setActiveScenario(scenarioId);
      setMobileView('chat');
    },
    [stop]
  );

  const handleSelectLevel = useCallback(
    (level: ProficiencyLevel) => {
      stop();
      setChatError(null);
      setActiveLevel(level);
    },
    [stop]
  );

  const handleResetChat = useCallback(() => {
    stop();
    setChatError(null);
    setThreads((prev) => ({
      ...prev,
      [threadKey]: createEmptyThread(activeScenario, activeLevel),
    }));
  }, [activeLevel, activeScenario, stop, threadKey]);

  const handleSendMessage = useCallback(
    async (text: string) => {
      setChatError(null);
      setFailedMessage(null);
      setInputText('');

      if (autoSpeakRef.current) {
        unlockAudio();
      }

      const existingMessages = currentThread.messages;
      const lastMsg = existingMessages[existingMessages.length - 1];
      const isDuplicateRetry = lastMsg && lastMsg.sender === 'user' && lastMsg.text === text;
      const userMsgId = isDuplicateRetry ? lastMsg.id : `user-${Date.now()}`;
      const historyForRequest = isDuplicateRetry ? existingMessages.slice(0, -1) : existingMessages;

      if (!isDuplicateRetry) {
        const userMessage: ChatMessage = {
          id: userMsgId,
          sender: 'user',
          text,
          timestamp: formatTimeNow(),
        };
        const updatedWithUser = [...existingMessages, userMessage].slice(-MAX_MESSAGES_PER_THREAD);

        setThreads((prev) => ({
          ...prev,
          [threadKey]: {
            ...currentThread,
            messages: updatedWithUser,
            lastUpdated: Date.now(),
          },
        }));
      }

      setIsTyping(true);
      const replyMsgId = `reply-${Date.now()}`;
      let autoSpoken = false;
      let winnerLocked = false;
      let streamHasActivity = false;
      let replyCompleteReceived = false;
      let hardStopped = false;

      const streamController = new AbortController();
      const fallbackController = new AbortController();
      let freeFallbackPromise: Promise<void> | null = null;

      const runAutomaticFreeFallback = () => {
        if (freeFallbackPromise) return freeFallbackPromise;
        freeFallbackPromise = (async () => {
          if (winnerLocked) return;
          const result = await generateKeylessChatReply({
            scenarioId: activeScenario,
            level: activeLevel,
            history: historyForRequest.slice(-4).map((m) => ({
              sender: m.sender,
              text: m.text,
            })),
            userMessage: text,
            targetLanguageName: selectedLangRef.current?.name,
          });
          if (winnerLocked) return;
          winnerLocked = true;
          streamController.abort();
          fallbackController.abort();
          setIsTyping(false);
          if (result.replyEnglish && autoSpeakRef.current && !autoSpoken) {
            autoSpoken = true;
            play({
              id: `msg-${replyMsgId}`,
              text: result.replyEnglish,
              level: activeLevel,
              slow: false,
            });
          }
        setThreads((prev) => {
          const latest = prev[threadKey] || currentThread;
          const langCode = selectedLangRef.current?.code;
          const hasPartialReply = latest.messages.some((m) => m.id === replyMsgId);
          let updatedMessages: ChatMessage[] = latest.messages.map((m) => {
            if (m.id === userMsgId && result.hasMistake && result.correctedEnglish) {
              return {
                ...m,
                correction: {
                  correctedEnglish: result.correctedEnglish,
                  explanation: result.explanation || '',
                },
              };
            }
            if (m.id === replyMsgId) {
              return {
                ...m,
                text: result.replyEnglish,
                translations:
                  langCode && result.replyTranslation
                    ? { ...(m.translations || {}), [langCode]: result.replyTranslation }
                    : m.translations,
                suggestedNextReply: result.suggestedNextReply,
              };
            }
            return m;
          });

          if (!hasPartialReply) {
            updatedMessages = [
              ...updatedMessages,
              {
                id: replyMsgId,
                sender: 'alex',
                text: result.replyEnglish,
                translations:
                  langCode && result.replyTranslation
                    ? { [langCode]: result.replyTranslation }
                    : undefined,
                timestamp: formatTimeNow(),
                suggestedNextReply: result.suggestedNextReply,
              },
            ];
          }

          return {
            ...prev,
            [threadKey]: {
              ...latest,
              messages: updatedMessages.slice(-MAX_MESSAGES_PER_THREAD),
              lastUpdated: Date.now(),
            },
          };
        });
        })();
        return freeFallbackPromise;
      };

      const isOfflineNow = typeof navigator !== 'undefined' && !navigator.onLine;
      if (isOfflineNow) {
        try {
          await runAutomaticFreeFallback();
        } finally {
          setIsTyping(false);
        }
        return;
      }

      const updateStreamedReplyText = (partialReply: string) => {
        if (!partialReply) return;
        setThreads((prev) => {
          const latest = prev[threadKey] || currentThread;
          const exists = latest.messages.some((m) => m.id === replyMsgId);
          const messages = exists
            ? latest.messages.map((m) => (m.id === replyMsgId ? { ...m, text: partialReply } : m))
            : [
                ...latest.messages,
                {
                  id: replyMsgId,
                  sender: 'alex' as const,
                  text: partialReply,
                  timestamp: formatTimeNow(),
                },
              ];

          return {
            ...prev,
            [threadKey]: {
              ...latest,
              messages: messages.slice(-MAX_MESSAGES_PER_THREAD),
              lastUpdated: Date.now(),
            },
          };
        });
      };

      const applyCompletedReply = (payload: ChatPayload) => {
        if (winnerLocked) return;
        winnerLocked = true;
        setIsTyping(false);
        const finalReply = payload.replyEnglish || '';
        if (finalReply && autoSpeakRef.current && !autoSpoken) {
          autoSpoken = true;
          play({
            id: `msg-${replyMsgId}`,
            text: finalReply,
            level: activeLevel,
            slow: false,
          });
        }
        setThreads((prev) => {
          const latest = prev[threadKey] || currentThread;
          let messages = latest.messages.map((m) => {
            if (m.id === userMsgId && payload.hasMistake && payload.correctedEnglish) {
              return {
                ...m,
                correction: {
                  correctedEnglish: payload.correctedEnglish,
                  explanation: payload.explanation || '',
                },
              };
            }
            if (m.id === replyMsgId) {
              const langCode = selectedLangRef.current?.code;
              return {
                ...m,
                text: finalReply || m.text,
                translations:
                  langCode && payload.replyTranslation
                    ? { ...(m.translations || {}), [langCode]: payload.replyTranslation }
                    : m.translations,
                suggestedNextReply: payload.suggestedNextReply,
              };
            }
            return m;
          });

          if (!messages.some((m) => m.id === replyMsgId) && finalReply) {
            const langCode = selectedLangRef.current?.code;
            messages = [
              ...messages,
              {
                id: replyMsgId,
                sender: 'alex',
                text: finalReply,
                translations:
                  langCode && payload.replyTranslation
                    ? { [langCode]: payload.replyTranslation }
                    : undefined,
                timestamp: formatTimeNow(),
                suggestedNextReply: payload.suggestedNextReply,
              },
            ];
          }

          return {
            ...prev,
            [threadKey]: {
              ...latest,
              messages: messages.slice(-MAX_MESSAGES_PER_THREAD),
              lastUpdated: Date.now(),
            },
          };
        });
      };

      const requestBody = JSON.stringify({
        scenarioId: activeScenario,
        level: activeLevel,
        history: historyForRequest.slice(-2).map((m) => ({
          sender: m.sender,
          text: m.text,
        })),
        userMessage: text,
        targetLanguageName: selectedLangRef.current?.name,
      });

      const stallFallbackTimer = window.setTimeout(() => {
        if (!streamHasActivity && !replyCompleteReceived && !winnerLocked && !hardStopped) {
          hardStopped = true;
          streamController.abort();
          fallbackController.abort();
        }
      }, 2400);

      const hardStopTimer = window.setTimeout(() => {
        hardStopped = true;
        streamController.abort();
        fallbackController.abort();
      }, 9500);

      const sendStreamRequest = async (): Promise<void> => {
        const timer = window.setTimeout(() => {
          if (!streamHasActivity) {
            streamController.abort();
          }
        }, 2400);
        try {
          const res = await fetch('/api/chat/stream', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: requestBody,
            signal: streamController.signal,
          });

          if (!res.ok || !res.body) {
            const err = new Error('Stream unavailable') as Error & { noRetry?: boolean };
            if (res.status >= 400 && res.status < 500 && res.status !== 408 && res.status !== 429) {
              err.noRetry = true;
            }
            throw err;
          }

          const reader = res.body.getReader();
          const decoder = new TextDecoder();
          let buffer = '';
          let streamedReply = '';
          let completed = false;

          while (true) {
            const { value, done } = await reader.read();
            if (done || winnerLocked) break;
            buffer += decoder.decode(value, { stream: true });

            const events = buffer.split('\n\n');
            buffer = events.pop() || '';

            for (const rawEvent of events) {
              const lines = rawEvent.split('\n');
              for (const line of lines) {
                if (!line.startsWith('data: ')) continue;
                const jsonStr = line.slice(6).trim();
                if (!jsonStr) continue;
                let evt: ChatPayload & {
                  type: string;
                  delta?: string;
                  status?: number;
                  error?: string;
                };
                try {
                  evt = JSON.parse(jsonStr);
                } catch {
                  continue;
                }

                if (winnerLocked) break;

                if (evt.type === 'reply_delta' && evt.delta) {
                  streamHasActivity = true;
                  streamedReply += evt.delta;
                  updateStreamedReplyText(streamedReply);
                } else if (evt.type === 'reply' && evt.replyEnglish) {
                  streamHasActivity = true;
                  streamedReply = evt.replyEnglish;
                  updateStreamedReplyText(streamedReply);
                } else if (evt.type === 'reply_complete' && evt.replyEnglish) {
                  streamHasActivity = true;
                  replyCompleteReceived = true;
                  streamedReply = evt.replyEnglish;
                  updateStreamedReplyText(streamedReply);
                  if (autoSpeakRef.current && !autoSpoken) {
                    autoSpoken = true;
                    play({
                      id: `msg-${replyMsgId}`,
                      text: streamedReply,
                      level: activeLevel,
                      slow: false,
                    });
                  }
                } else if (evt.type === 'done') {
                  streamHasActivity = true;
                  completed = true;
                  replyCompleteReceived = true;
                  fallbackController.abort();
                  applyCompletedReply({
                    replyEnglish: evt.replyEnglish || streamedReply,
                    hasMistake: evt.hasMistake,
                    correctedEnglish: evt.correctedEnglish,
                    explanation: evt.explanation,
                    replyTranslation: evt.replyTranslation,
                    suggestedNextReply: evt.suggestedNextReply,
                  });
                } else if (evt.type === 'error') {
                  const err = new Error(evt.error || 'Connection error') as Error & {
                    noRetry?: boolean;
                  };
                  if (
                    evt.status &&
                    (evt.status === 429 || (evt.status >= 400 && evt.status < 500 && evt.status !== 408))
                  ) {
                    err.noRetry = true;
                  }
                  throw err;
                }
              }
            }
          }

          if (!completed && !winnerLocked) {
            throw new Error('Incomplete response');
          }
        } finally {
          window.clearTimeout(timer);
        }
      };

      const sendChatRequest = async (): Promise<void> => {
        const timer = window.setTimeout(() => fallbackController.abort(), 2400);
        try {
          const res = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: requestBody,
            signal: fallbackController.signal,
          });
          const rawText = await res.text();
          let data: (ChatPayload & { error?: string }) | null = null;
          try {
            data = JSON.parse(rawText) as ChatPayload & { error?: string };
          } catch {
            data = null;
          }

          if (!res.ok || !data?.replyEnglish) {
            const msg = data?.error || 'Connection error';
            const err = new Error(msg) as Error & { noRetry?: boolean };
            if (res.status === 429 || (res.status >= 400 && res.status < 500 && res.status !== 408)) {
              err.noRetry = true;
            }
            throw err;
          }
          if (!winnerLocked) {
            streamController.abort();
            applyCompletedReply(data);
          }
        } finally {
          window.clearTimeout(timer);
        }
      };

      let fallbackPromise: Promise<void> | null = null;
      const startFallbackOnce = () => {
        if (!fallbackPromise && !winnerLocked && !hardStopped) {
          fallbackPromise = sendChatRequest();
        }
        return fallbackPromise;
      };

      const parallelRaceTimer = window.setTimeout(() => {
        if (!streamHasActivity && !replyCompleteReceived && !winnerLocked && !hardStopped) {
          startFallbackOnce()?.catch(() => {});
        }
      }, 650);

      const freeRaceTimer = window.setTimeout(() => {
        if (!streamHasActivity && !replyCompleteReceived && !winnerLocked && !hardStopped) {
          runAutomaticFreeFallback().catch(() => {});
        }
      }, 900);

      try {
        try {
          await sendStreamRequest();
        } catch (streamErr: unknown) {
          if (winnerLocked) return;
          if (typeof navigator !== 'undefined' && !navigator.onLine) {
            throw new Error('You appear to be offline.');
          }
          if (hardStopped || (streamErr instanceof Error && (streamErr as Error & { noRetry?: boolean }).noRetry)) {
            throw streamErr;
          }
          await startFallbackOnce();
        }
      } catch {
        if (!winnerLocked) {
          try {
            await runAutomaticFreeFallback();
          } catch {
            setFailedMessage(text);
            setChatError('Connection failed. Tap Retry.');
          }
        }
      } finally {
        window.clearTimeout(parallelRaceTimer);
        window.clearTimeout(freeRaceTimer);
        window.clearTimeout(stallFallbackTimer);
        window.clearTimeout(hardStopTimer);
        setIsTyping(false);
      }
    },
    [activeLevel, activeScenario, currentThread, play, threadKey, unlockAudio]
  );

  const handleToggleMemorized = useCallback(
    (phraseId: string) => {
      setThreads((prev) => {
        const thread = prev[threadKey] || currentThread;
        return {
          ...prev,
          [threadKey]: {
            ...thread,
            phrases: thread.phrases.map((p) =>
              p.id === phraseId ? { ...p, memorized: !p.memorized } : p
            ),
          },
        };
      });
    },
    [currentThread, threadKey]
  );

  const handleRefreshPhrases = useCallback(async () => {
    setIsGeneratingPhrases(true);
    setChatError(null);

    const applyFreeRotation = () => {
      const currentIds = currentThread.phrases.map((p) => p.id);
      const nextExtra = getNextFreeKeylessPhrases(activeScenario, currentIds);
      const nextSet =
        nextExtra.length > 0
          ? nextExtra
          : INITIAL_PHRASES[activeScenario][activeLevel].map((p) => ({ ...p, memorized: false }));
      setThreads((prev) => {
        const thread = prev[threadKey] || currentThread;
        return {
          ...prev,
          [threadKey]: {
            ...thread,
            phrases: nextSet,
          },
        };
      });
    };

    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      applyFreeRotation();
      setIsGeneratingPhrases(false);
      return;
    }

    try {
      const response = await fetch('/api/phrases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenarioId: activeScenario,
          level: activeLevel,
          recentMessages: currentThread.messages.map((m) => ({
            sender: m.sender,
            text: m.text,
          })),
        }),
        signal: AbortSignal.timeout(8000),
      });

      const data = (await response.json()) as {
        phrases?: ConversationThread['phrases'];
        error?: string;
      };

      if (!response.ok || !data.phrases?.length) {
        throw new Error(data.error || 'Unable to generate new phrases');
      }

      setThreads((prev) => {
        const thread = prev[threadKey] || currentThread;
        return {
          ...prev,
          [threadKey]: {
            ...thread,
            phrases: data.phrases!,
          },
        };
      });
    } catch {
      applyFreeRotation();
    } finally {
      setIsGeneratingPhrases(false);
    }
  }, [activeLevel, activeScenario, currentThread, threadKey]);

  const handleUsePhraseInChat = useCallback((phraseText: string) => {
    setInputText(phraseText);
    setPhrasesDrawerOpen(false);
    setMobileView('chat');
  }, []);

  // Automatic seamless Cloud -> Keyless translation with zero buttons or lockouts
  const handleRequestTranslation = useCallback(
    async (messageId: string, text: string, overrideLang?: TranslationLanguage) => {
      const lang = overrideLang || selectedLangRef.current;
      if (!lang) return;

      setTranslatingIds((prev) => ({ ...prev, [messageId]: true }));
      const saveTranslation = (translated: string) => {
        setThreads((prev) => {
          const thread = prev[threadKey] || currentThread;
          return {
            ...prev,
            [threadKey]: {
              ...thread,
              messages: thread.messages.map((m) =>
                m.id === messageId
                  ? {
                      ...m,
                      translations: { ...(m.translations || {}), [lang.code]: translated },
                    }
                  : m
              ),
            },
          };
        });
      };

      const tryServerCloudTranslate = async (): Promise<string | null> => {
        if (typeof navigator !== 'undefined' && !navigator.onLine) return null;
        try {
          const response = await fetch('/api/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              text,
              targetLanguageName: lang.name,
            }),
            signal: AbortSignal.timeout(3500),
          });
          const data = (await response.json()) as { translation?: string };
          if (response.ok && data.translation?.trim()) {
            return data.translation.trim();
          }
        } catch {
          // Silently fall back to keyless client translation
        }
        return null;
      };

      try {
        const autoCloudTrans = await tryServerCloudTranslate();
        if (autoCloudTrans) {
          saveTranslation(autoCloudTrans);
          return;
        }
        const keylessTrans = await translateKeylessText(text, lang.code, lang.name);
        if (keylessTrans) {
          saveTranslation(keylessTrans);
          return;
        }
        setChatError('Translation is currently unavailable. Please try again.');
      } finally {
        setTranslatingIds((prev) => {
          const next = { ...prev };
          delete next[messageId];
          return next;
        });
      }
    },
    [currentThread, threadKey]
  );

  const latestAlexMessage = useMemo(() => {
    for (let i = currentThread.messages.length - 1; i >= 0; i--) {
      if (currentThread.messages[i].sender === 'alex') {
        return currentThread.messages[i];
      }
    }
    return null;
  }, [currentThread.messages]);

  const activeScenarioMeta = SCENARIOS.find((s) => s.id === activeScenario) || SCENARIOS[0];
  const activeLevelMeta = LEVELS.find((l) => l.id === activeLevel) || LEVELS[0];
  const memorizedCount = currentThread.phrases.filter((p) => p.memorized).length;

  return (
    <div className="h-dvh w-full overflow-hidden flex bg-[#F6F8FC] text-[#0F1B2D]">
      {/* Left Sidebar: Topics & 3 Levels */}
      <div
        className={`${
          mobileView === 'list' ? 'flex w-full' : 'hidden'
        } md:flex md:w-[310px] lg:w-[335px] shrink-0 h-full`}
      >
        <Sidebar
          activeScenario={activeScenario}
          activeLevel={activeLevel}
          threads={threads}
          onSelectScenario={handleSelectScenario}
          onSelectLevel={handleSelectLevel}
        />
      </div>

      {/* Center: Chat Workspace */}
      <main
        className={`${
          mobileView === 'chat' ? 'flex' : 'hidden'
        } md:flex flex-1 min-w-0 flex-col h-full english-wallpaper relative`}
      >
        <ChatHeader
          scenarioId={activeScenario}
          level={activeLevel}
          isTyping={isTyping}
          autoSpeak={autoSpeak}
          memorizedCount={memorizedCount}
          totalPhrases={currentThread.phrases.length}
          onBackToScenarios={() => setMobileView('list')}
          onOpenPhrases={() => setPhrasesDrawerOpen(true)}
          onToggleAutoSpeak={() => {
            setAutoSpeak((prev) => {
              const next = !prev;
              if (!next) {
                stop();
              } else {
                unlockAudio();
              }
              return next;
            });
          }}
          onResetChat={handleResetChat}
        />

        {/* Mobile Quick Level & Topic Strip */}
        <div className="md:hidden bg-white/95 backdrop-blur-md border-b border-[#D5DFEC] px-3 py-1.5 flex items-center justify-between gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setMobileView('list')}
            className="text-xs font-semibold text-[#1B4D8E] whitespace-nowrap cursor-pointer py-1 shrink-0"
          >
            {SHORT_SCENARIOS[activeScenario]} ▾
          </button>
          <div className="flex items-center gap-1 bg-[#EDF2F8] p-0.5 rounded-xl shrink-0">
            {LEVELS.map((lvl) => (
              <button
                key={lvl.id}
                type="button"
                onClick={() => handleSelectLevel(lvl.id)}
                className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                  lvl.id === activeLevel
                    ? 'bg-white text-[#1B4D8E] shadow-[0_1px_2px_rgba(15,27,45,0.06)]'
                    : 'text-[#4E607A]'
                }`}
              >
                {lvl.label}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Messages Feed */}
        <div className="flex-1 overflow-y-auto chat-scroll px-3 sm:px-6 py-4 space-y-3">
          {/* Topic Context Banner */}
          <div className="flex justify-center mb-2">
            <div className="bg-white/95 border border-[#D5DFEC] text-[#4E607A] rounded-2xl px-4 py-2 text-xs text-center max-w-md shadow-[0_1px_2px_rgba(15,27,45,0.04)] leading-relaxed">
              <span className="font-semibold text-[#0F1B2D]">
                {activeScenarioMeta.title} · {activeLevelMeta.label}
              </span>
              <span className="mx-1.5" aria-hidden="true">
                —
              </span>
              <span>
                Practice natural English with Alex. Instant grammar tips and corrections appear automatically.
              </span>
            </div>
          </div>

          {/* Clean Empty State with App Logo */}
          {currentThread.messages.length === 0 && !isTyping && (
            <div className="flex justify-center pt-6 pb-2">
              <div className="bg-white/95 border border-[#D5DFEC] rounded-2xl p-6 max-w-sm w-full text-center shadow-[0_4px_16px_rgba(15,27,45,0.06)]">
                <div className="flex justify-center mb-3.5">
                  {logoError ? (
                    <div className="w-20 h-20 rounded-2xl bg-[#1B4D8E] text-white font-bold text-lg flex items-center justify-center border border-[#1B4D8E]/20 shadow-[0_2px_8px_rgba(27,77,142,0.22)]">
                      EN
                    </div>
                  ) : (
                    <img
                      src={APP_LOGO_URL}
                      alt="Learn English Talking"
                      referrerPolicy="no-referrer"
                      onError={() => setLogoError(true)}
                      className="w-20 h-20 rounded-2xl object-cover border border-[#D5DFEC] bg-white shadow-[0_2px_8px_rgba(27,77,142,0.14)]"
                    />
                  )}
                </div>
                <h3 className="font-display text-[16.5px] font-bold text-[#0F1B2D] mb-1">
                  {activeScenarioMeta.title}
                </h3>
                <p className="text-xs text-[#4E607A] leading-relaxed mb-4">
                  {activeScenarioMeta.roleDescription}
                </p>
                <button
                  type="button"
                  onClick={() =>
                    handleSendMessage("Hi Alex! I'd like to practice speaking English with you.")
                  }
                  className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-[#1B4D8E] hover:bg-[#143B6E] text-white text-xs font-semibold inline-flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-[0_2px_6px_rgba(27,77,142,0.24)]"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Start chatting</span>
                </button>
              </div>
            </div>
          )}

          {currentThread.messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              level={activeLevel}
              selectedLanguage={selectedLanguage}
              openSignal={openSignalByMsgId[msg.id] || 0}
              isTranslating={Boolean(translatingIds[msg.id])}
              playingId={playingId}
              loadingAudioId={loadingId}
              onPlayAudio={play}
              onRequestTranslation={handleRequestTranslation}
              onOpenLanguagePicker={(msgId) => {
                setPendingTranslateMsgId(msgId);
                setLanguagePickerOpen(true);
              }}
            />
          ))}

          {/* Offline / Error Notice with Retry */}
          {(!isOnline || chatError || audioError) && (
            <div className="flex justify-center">
              <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl px-4 py-2 text-xs max-w-md text-center flex items-center justify-center gap-2 flex-wrap">
                <span>
                  {!isOnline
                    ? 'You appear to be offline. Check your internet connection to keep chatting with Alex.'
                    : chatError || audioError}
                </span>
                {failedMessage && isOnline && (
                  <button
                    type="button"
                    onClick={() => handleSendMessage(failedMessage)}
                    className="px-2.5 py-1 rounded-lg bg-rose-700 text-white font-semibold hover:bg-rose-800 transition-colors cursor-pointer"
                  >
                    Retry
                  </button>
                )}
                {isOnline && (
                  <button
                    type="button"
                    onClick={() => {
                      setChatError(null);
                      setFailedMessage(null);
                    }}
                    className="text-rose-600 hover:text-rose-900 font-bold px-1 cursor-pointer"
                    aria-label="Close"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Bottom Composer Bar */}
        <ChatComposer
          inputText={inputText}
          setInputText={setInputText}
          disabled={isTyping}
          suggestedHint={latestAlexMessage?.suggestedNextReply}
          onSendMessage={handleSendMessage}
          onUnlockAudio={() => {
            if (autoSpeakRef.current) {
              unlockAudio();
            }
          }}
        />
      </main>

      {/* Right Panel on Desktop (xl+): 5 Key Phrases */}
      <aside className="hidden xl:flex xl:w-[350px] shrink-0 h-full border-l border-[#D5DFEC]">
        <div className="w-full h-full">
          <PhrasesPanel
            phrases={currentThread.phrases}
            level={activeLevel}
            isGenerating={isGeneratingPhrases}
            playingId={playingId}
            loadingAudioId={loadingId}
            onPlayAudio={play}
            onToggleMemorized={handleToggleMemorized}
            onUseInChat={handleUsePhraseInChat}
            onRefreshPhrases={handleRefreshPhrases}
          />
        </div>
      </aside>

      {/* Mobile / Tablet Bottom Sheet Drawer for 5 Key Phrases */}
      {phrasesDrawerOpen && (
        <div
          className="xl:hidden fixed inset-0 z-50 flex items-end sm:items-center sm:justify-end bg-slate-950/45 backdrop-blur-[2px]"
          onClick={() => setPhrasesDrawerOpen(false)}
        >
          <div
            className="w-full sm:w-[400px] h-[84dvh] sm:h-full bg-[#F6F8FC] rounded-t-2xl sm:rounded-none overflow-hidden shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile Sheet Drag Handle */}
            <div className="sm:hidden pt-2.5 pb-1 bg-white flex justify-center shrink-0">
              <div className="w-10 h-1 rounded-full bg-slate-900/20" />
            </div>
            <div className="flex-1 min-h-0">
              <PhrasesPanel
                phrases={currentThread.phrases}
                level={activeLevel}
                isGenerating={isGeneratingPhrases}
                playingId={playingId}
                loadingAudioId={loadingId}
                onPlayAudio={play}
                onToggleMemorized={handleToggleMemorized}
                onUseInChat={handleUsePhraseInChat}
                onRefreshPhrases={handleRefreshPhrases}
                onCloseMobile={() => setPhrasesDrawerOpen(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* All-Languages Picker Modal */}
      <LanguagePickerModal
        isOpen={languagePickerOpen}
        selectedLanguage={selectedLanguage}
        onSelect={(lang) => {
          setSelectedLanguage(lang);
          if (pendingTranslateMsgId) {
            const targetId = pendingTranslateMsgId;
            setPendingTranslateMsgId(null);
            setOpenSignalByMsgId((prev) => ({ ...prev, [targetId]: (prev[targetId] || 0) + 1 }));
            const targetMsg = currentThread.messages.find((m) => m.id === targetId);
            if (targetMsg) {
              const cached = targetMsg.translations?.[lang.code];
              if (!cached) {
                handleRequestTranslation(targetId, targetMsg.text, lang);
              }
            }
          }
        }}
        onClose={() => {
          setLanguagePickerOpen(false);
          setPendingTranslateMsgId(null);
        }}
      />
    </div>
  );
}
