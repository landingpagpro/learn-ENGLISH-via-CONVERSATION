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
import { ChatMessage, ConversationThread, ProficiencyLevel, ScenarioId } from './types';

const PHRASES_KEY = 'le_en_phrases_v1';
const AUTOSPEAK_KEY = 'le_en_autospeak_v1';
const LITEMODE_KEY = 'le_en_litemode_v2';
const TRANSLANG_KEY = 'le_en_trans_lang_v1';
const MAX_MESSAGES_PER_THREAD = 30;

function formatTimeNow(): string {
  const now = new Date();
  return now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

function createEmptyThread(scenarioId: ScenarioId, level: ProficiencyLevel): ConversationThread {
  const initialPhrases = INITIAL_PHRASES[scenarioId][level].map((p) => ({ ...p, memorized: false }));
  return {
    messages: [],
    phrases: initialPhrases,
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

  // Clear legacy storage keys on startup & keep Render instance warm while tab is visible
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
        'lf_conv_phrases_v1',
        'lf_conv_autospeak_v1',
        'lf_conv_litemode_v1',
        'lf_conv_trans_lang_v1',
        'le_it_phrases_v1',
        'le_it_autospeak_v1',
        'le_it_litemode_v1',
        'le_it_trans_lang_v1',
        'le_en_litemode_v1',
      ].forEach((k) => localStorage.removeItem(k));
    } catch {
      // Ignore storage errors
    }
    fetch('/api/health').catch(() => {});
    const warmTimer = window.setInterval(() => {
      if (document.visibilityState === 'visible') {
        fetch('/api/health').catch(() => {});
      }
    }, 240000);
    return () => window.clearInterval(warmTimer);
  }, []);

  // Keep conversations ephemeral in session memory so old conversations never persist across reloads;
  // only restore memorized phrases state if saved.
  const [threads, setThreads] = useState<Record<string, ConversationThread>>(() => {
    try {
      const savedPhrases = localStorage.getItem(PHRASES_KEY);
      if (savedPhrases) {
        const parsed = JSON.parse(savedPhrases) as Record<string, ConversationThread['phrases']>;
        const restored: Record<string, ConversationThread> = {};
        for (const [key, phrases] of Object.entries(parsed)) {
          const [sc, lv] = key.split(':') as [ScenarioId, ProficiencyLevel];
          if (INITIAL_PHRASES[sc]?.[lv] && Array.isArray(phrases)) {
            restored[key] = {
              messages: [],
              phrases,
              lastUpdated: Date.now(),
            };
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
  const [liteMode, setLiteMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(LITEMODE_KEY);
      if (saved !== null) return saved === 'true';
    } catch {
      // Ignore detection errors
    }
    return false;
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
      setChatError((prev) => (prev?.includes('offline') ? null : prev));
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
  const liteModeRef = useRef(liteMode);
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

  useEffect(() => {
    liteModeRef.current = liteMode;
    try {
      localStorage.setItem(LITEMODE_KEY, String(liteMode));
    } catch {
      // Ignore storage errors
    }
  }, [liteMode]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const { loadingId, playingId, audioError, play: rawPlay, stop, unlockAudio } = useSpeechAudio();

  const play = useCallback(
    (opts: { id: string; text: string; level: ProficiencyLevel; slow?: boolean }) => {
      return rawPlay({ ...opts, liteMode: liteModeRef.current });
    },
    [rawPlay]
  );

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

      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        setFailedMessage(text);
        setChatError('You appear to be offline. Reconnect to the internet and tap Retry.');
        return;
      }

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
      let replyCompleteReceived = false;
      let hardStopped = false;

      const streamController = new AbortController();
      const fallbackController = new AbortController();

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

      const hardStopTimer = window.setTimeout(() => {
        hardStopped = true;
        streamController.abort();
        fallbackController.abort();
        setIsTyping(false);
      }, 28000);

      const sendStreamRequest = async (): Promise<void> => {
        const timer = window.setTimeout(() => streamController.abort(), 14000);
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
                  streamedReply += evt.delta;
                  updateStreamedReplyText(streamedReply);
                } else if (evt.type === 'reply' && evt.replyEnglish) {
                  streamedReply = evt.replyEnglish;
                  updateStreamedReplyText(streamedReply);
                } else if (evt.type === 'reply_complete' && evt.replyEnglish) {
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
                  const err = new Error(evt.error || 'Connection error') as Error & { noRetry?: boolean };
                  if (evt.status && evt.status >= 400 && evt.status < 500 && evt.status !== 408 && evt.status !== 429) {
                    err.noRetry = true;
                  }
                  throw err;
                }
              }
            }
          }

          if (!completed && !winnerLocked) {
            throw new Error('Incomplete reply');
          }
        } finally {
          window.clearTimeout(timer);
        }
      };

      const sendChatRequest = async (attempt = 0): Promise<void> => {
        const controller = attempt === 0 ? fallbackController : new AbortController();
        const timer = window.setTimeout(() => controller.abort(), 14000);
        try {
          const res = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: requestBody,
            signal: controller.signal,
          });
          const rawText = await res.text();
          let data: (ChatPayload & { error?: string }) | null = null;
          try {
            data = JSON.parse(rawText) as ChatPayload & { error?: string };
          } catch {
            data = null;
          }

          if (!res.ok || !data?.replyEnglish) {
            const msg = data?.error || (res.status >= 500 ? 'Temporary server timeout. Tap Retry.' : 'Connection error');
            const err = new Error(msg) as Error & { noRetry?: boolean };
            if (res.status >= 400 && res.status < 500 && res.status !== 408 && res.status !== 429) {
              err.noRetry = true;
            }
            throw err;
          }
          if (!winnerLocked) {
            streamController.abort();
            applyCompletedReply(data);
          }
        } catch (err: unknown) {
          if (
            attempt < 2 &&
            !winnerLocked &&
            !hardStopped &&
            !(err instanceof Error && (err as Error & { noRetry?: boolean }).noRetry) &&
            (typeof navigator === 'undefined' || navigator.onLine)
          ) {
            await new Promise((resolve) => window.setTimeout(resolve, 450 * (attempt + 1)));
            if (!winnerLocked && !hardStopped) {
              return sendChatRequest(attempt + 1);
            }
          }
          throw err;
        } finally {
          window.clearTimeout(timer);
        }
      };

      // Launch SSE stream immediately, and if full reply hasn't arrived within 200ms
      // (e.g. proxy buffering or mid-stream stall), race /api/chat in parallel.
      let fallbackPromise: Promise<void> | null = null;
      const startFallbackOnce = () => {
        if (!fallbackPromise && !winnerLocked && !hardStopped) {
          fallbackPromise = sendChatRequest(0);
        }
        return fallbackPromise;
      };

      const parallelRaceTimer = window.setTimeout(() => {
        if (!replyCompleteReceived && !winnerLocked && !hardStopped) {
          startFallbackOnce()?.catch(() => {});
        }
      }, 1000);

      try {
        try {
          await sendStreamRequest();
        } catch (streamErr: unknown) {
          if (winnerLocked) return;
          if (typeof navigator !== 'undefined' && !navigator.onLine) {
            throw new Error('You appear to be offline.');
          }
          if (streamErr instanceof Error && (streamErr as Error & { noRetry?: boolean }).noRetry) {
            throw streamErr;
          }
          await startFallbackOnce();
        }
      } catch (err: unknown) {
        if (!winnerLocked) {
          const rawMsg = err instanceof Error ? err.message : '';
          const msg =
            !rawMsg || (err instanceof DOMException && err.name === 'AbortError') || /abort/i.test(rawMsg)
              ? 'Connection timed out. Please tap Retry.'
              : rawMsg;
          setFailedMessage(text);
          setChatError(msg);
        }
      } finally {
        window.clearTimeout(parallelRaceTimer);
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
        signal: AbortSignal.timeout(12000),
      });

      const data = (await response.json()) as {
        phrases?: ConversationThread['phrases'];
        error?: string;
      };

      if (!response.ok || !data.phrases?.length) {
        throw new Error(data.error || 'Unable to generate new phrases.');
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
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unable to refresh phrases.';
      setChatError(msg);
    } finally {
      setIsGeneratingPhrases(false);
    }
  }, [activeLevel, activeScenario, currentThread, threadKey]);

  const handleUsePhraseInChat = useCallback((english: string) => {
    setInputText(english);
    setPhrasesDrawerOpen(false);
    setMobileView('chat');
  }, []);

  const handleRequestTranslation = useCallback(
    async (messageId: string, text: string, overrideLang?: TranslationLanguage) => {
      const lang = overrideLang || selectedLangRef.current;
      if (!lang) return;
      setTranslatingIds((prev) => ({ ...prev, [messageId]: true }));
      try {
        const response = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text,
            targetLanguageName: lang.name,
          }),
          signal: AbortSignal.timeout(12000),
        });
        const data = (await response.json()) as { translation?: string; error?: string };
        if (!response.ok || !data.translation) {
          throw new Error(data.error || 'Translation failed');
        }
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
                      translations: { ...(m.translations || {}), [lang.code]: data.translation! },
                    }
                  : m
              ),
            },
          };
        });
      } catch {
        setChatError('Translation failed. Please try again.');
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

  const latestPartnerMessage = useMemo(() => {
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
    <div className="h-dvh w-full overflow-hidden flex bg-[#EEF2F6]">
      {/* Left Sidebar: Topics & 3 Levels (Always visible on md+, toggled on mobile) */}
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
          liteMode={liteMode}
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
          onToggleLiteMode={() => setLiteMode((prev) => !prev)}
          onResetChat={handleResetChat}
        />

        {/* Mobile Quick Level & Topic Strip */}
        <div className="md:hidden bg-white/95 backdrop-blur-xs border-b border-slate-200 px-3 py-1.5 flex items-center justify-between gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setMobileView('list')}
            className="text-xs font-semibold text-[#1E40AF] whitespace-nowrap cursor-pointer py-1 shrink-0"
          >
            {activeScenario === 'conversation'
              ? 'Topics'
              : activeScenario === 'airport'
              ? 'Airport'
              : activeScenario === 'work'
              ? 'Work'
              : activeScenario === 'doctor'
              ? 'Doctor'
              : 'Friends'}{' '}
            ▾
          </button>
          <div className="flex items-center gap-1 bg-[#E2E8F0] p-0.5 rounded-lg shrink-0">
            {LEVELS.map((lvl) => (
              <button
                key={lvl.id}
                type="button"
                onClick={() => handleSelectLevel(lvl.id)}
                className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
                  lvl.id === activeLevel
                    ? 'bg-white text-[#1E40AF] shadow-2xs'
                    : 'text-[#475569]'
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
            <div className="bg-white/95 border border-slate-200 text-[#475569] rounded-xl px-3.5 py-2 text-xs text-center max-w-md shadow-2xs leading-relaxed">
              <span className="font-semibold text-[#0F172A]">
                {activeScenarioMeta.title} · {activeLevelMeta.label}
              </span>
              <span className="mx-1.5" aria-hidden="true">
                —
              </span>
              <span>
                Speak naturally in English with Alex. If you make a mistake, you will get instant corrections and tips.
              </span>
            </div>
          </div>

          {/* Clean Empty State with App Logo */}
          {currentThread.messages.length === 0 && !isTyping && (
            <div className="flex justify-center pt-6 pb-2">
              <div className="bg-white/95 border border-slate-200 rounded-xl p-5 max-w-sm w-full text-center shadow-xs">
                <div className="flex justify-center mb-3">
                  {logoError ? (
                    <div className="w-20 h-20 rounded-xl bg-[#1E40AF] text-white font-bold text-lg flex items-center justify-center border border-[#1E40AF]/20">
                      LE
                    </div>
                  ) : (
                    <img
                      src={APP_LOGO_URL}
                      alt="Learn English via Conversation"
                      referrerPolicy="no-referrer"
                      onError={() => setLogoError(true)}
                      className="w-20 h-20 rounded-xl object-cover border border-slate-200 bg-white"
                    />
                  )}
                </div>
                <h3 className="text-[16px] font-bold text-[#0F172A] mb-1">
                  {activeScenarioMeta.title}
                </h3>
                <p className="text-xs text-[#64748B] leading-relaxed mb-4">
                  {activeScenarioMeta.roleDescription}
                </p>
                <button
                  type="button"
                  onClick={() => handleSendMessage("Hello! I'd like to practice my English.")}
                  className="w-full min-h-[42px] px-4 py-2 rounded-lg bg-[#1E40AF] hover:bg-[#1E3A8A] text-white text-xs font-semibold inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Start conversation</span>
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

          {/* Offline / API / Audio Error Notice with Retry */}
          {(!isOnline || chatError || audioError) && (
            <div className="flex justify-center">
              <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl px-4 py-2 text-xs max-w-md text-center flex items-center justify-center gap-2.5 flex-wrap">
                <span>
                  {!isOnline
                    ? 'You appear to be offline. Waiting for connection'
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
                    aria-label="Close error"
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
          suggestedHint={latestPartnerMessage?.suggestedNextReply}
          onSendMessage={handleSendMessage}
        />
      </main>

      {/* Right Panel on Desktop (xl+): 5 Key Phrases */}
      <aside className="hidden xl:flex xl:w-[350px] shrink-0 h-full border-l border-slate-200">
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
          className="xl:hidden fixed inset-0 z-50 flex items-end sm:items-center sm:justify-end bg-[#0F172A]/45 backdrop-blur-[2px]"
          onClick={() => setPhrasesDrawerOpen(false)}
        >
          <div
            className="w-full sm:w-[400px] h-[84dvh] sm:h-full bg-[#F8FAFC] rounded-t-2xl sm:rounded-none overflow-hidden shadow-2xl flex flex-col"
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
