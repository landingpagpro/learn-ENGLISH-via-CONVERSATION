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

const PHRASES_KEY = 'le_it_phrases_v1';
const AUTOSPEAK_KEY = 'le_it_autospeak_v1';
const LITEMODE_KEY = 'le_it_litemode_v1';
const TRANSLANG_KEY = 'le_it_trans_lang_v1';
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

export default function App() {
  const [activeScenario, setActiveScenario] = useState<ScenarioId>('conversation');
  const [activeLevel, setActiveLevel] = useState<ProficiencyLevel>('beginner');
  const [mobileView, setMobileView] = useState<'list' | 'chat'>('chat');
  const [phrasesDrawerOpen, setPhrasesDrawerOpen] = useState(false);

  // Automatically clear any old stored conversations on startup & warm up server health
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
      ].forEach((k) => localStorage.removeItem(k));
    } catch {
      // Ignore storage errors
    }
    fetch('/api/health').catch(() => {});
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
    return true;
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
  const handleSlowNetwork = useCallback(() => {
    setLiteMode(true);
  }, []);
  const { loadingId, playingId, audioError, play: rawPlay, stop, unlockAudio } = useSpeechAudio(handleSlowNetwork);

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
                  sender: 'marco' as const,
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

      const applyCompletedReply = (payload: {
        replyItalian?: string;
        hasMistake?: boolean;
        correctedItalian?: string;
        explanation?: string;
        replyTranslation?: string;
        suggestedNextReply?: string;
      }) => {
        setIsTyping(false);
        const finalReply = payload.replyItalian || '';
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
            if (m.id === userMsgId && payload.hasMistake && payload.correctedItalian) {
              return {
                ...m,
                correction: {
                  correctedItalian: payload.correctedItalian,
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
                sender: 'marco',
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
        setIsTyping(false);
      }, 24000);

      const sendStreamRequest = async (): Promise<boolean> => {
        const res = await fetch('/api/chat/stream', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: requestBody,
          signal: AbortSignal.timeout(20000),
        });

        if (!res.ok || !res.body) {
          throw new Error('Stream unavailable');
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let streamedReply = '';
        let completed = false;

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          const events = buffer.split('\n\n');
          buffer = events.pop() || '';

          for (const rawEvent of events) {
            const lines = rawEvent.split('\n');
            for (const line of lines) {
              if (!line.startsWith('data: ')) continue;
              const jsonStr = line.slice(6).trim();
              if (!jsonStr) continue;
              let evt: {
                type: string;
                delta?: string;
                replyItalian?: string;
                hasMistake?: boolean;
                correctedItalian?: string;
                explanation?: string;
                replyTranslation?: string;
                suggestedNextReply?: string;
                status?: number;
                error?: string;
              };
              try {
                evt = JSON.parse(jsonStr);
              } catch {
                continue;
              }

              if (evt.type === 'reply_delta' && evt.delta) {
                streamedReply += evt.delta;
                updateStreamedReplyText(streamedReply);
              } else if (evt.type === 'reply' && evt.replyItalian) {
                streamedReply = evt.replyItalian;
                updateStreamedReplyText(streamedReply);
              } else if (evt.type === 'reply_complete' && evt.replyItalian) {
                streamedReply = evt.replyItalian;
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
                applyCompletedReply({
                  replyItalian: evt.replyItalian || streamedReply,
                  hasMistake: evt.hasMistake,
                  correctedItalian: evt.correctedItalian,
                  explanation: evt.explanation,
                  replyTranslation: evt.replyTranslation,
                  suggestedNextReply: evt.suggestedNextReply,
                });
              } else if (evt.type === 'error') {
                const err = new Error(evt.error || 'Connection error') as Error & { noRetry?: boolean };
                if (evt.status && evt.status >= 400 && evt.status < 500) {
                  err.noRetry = true;
                }
                throw err;
              }
            }
          }
        }

        if (!completed && streamedReply) {
          applyCompletedReply({ replyItalian: streamedReply });
          return true;
        }
        return completed;
      };

      const sendChatRequest = async () => {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: requestBody,
          signal: AbortSignal.timeout(20000),
        });
        const data = (await res.json()) as {
          replyItalian?: string;
          hasMistake?: boolean;
          correctedItalian?: string;
          explanation?: string;
          replyTranslation?: string;
          suggestedNextReply?: string;
          error?: string;
        };
        if (!res.ok || !data.replyItalian) {
          const err = new Error(data.error || 'Connection error') as Error & { noRetry?: boolean };
          if (res.status >= 400 && res.status < 500) {
            err.noRetry = true;
          }
          throw err;
        }
        return data;
      };

      try {
        let handled = false;
        try {
          handled = await sendStreamRequest();
        } catch (streamErr: unknown) {
          if (typeof navigator !== 'undefined' && !navigator.onLine) {
            throw new Error('You appear to be offline.');
          }
          if (streamErr instanceof Error && (streamErr as Error & { noRetry?: boolean }).noRetry) {
            throw streamErr;
          }
        }
        if (!handled) {
          const chatData = await sendChatRequest();
          applyCompletedReply(chatData);
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Please check your internet connection.';
        setFailedMessage(text);
        setChatError(msg);
      } finally {
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
        throw new Error(data.error || 'Could not generate new phrases.');
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
      const msg = err instanceof Error ? err.message : 'Failed to refresh phrases.';
      setChatError(msg);
    } finally {
      setIsGeneratingPhrases(false);
    }
  }, [activeLevel, activeScenario, currentThread, threadKey]);

  const handleUsePhraseInChat = useCallback((italian: string) => {
    setInputText(italian);
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
      if (currentThread.messages[i].sender === 'marco') {
        return currentThread.messages[i];
      }
    }
    return null;
  }, [currentThread.messages]);

  const activeScenarioMeta = SCENARIOS.find((s) => s.id === activeScenario) || SCENARIOS[0];
  const activeLevelMeta = LEVELS.find((l) => l.id === activeLevel) || LEVELS[0];
  const memorizedCount = currentThread.phrases.filter((p) => p.memorized).length;

  return (
    <div className="h-dvh w-full overflow-hidden flex bg-[#F1F4F9]">
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
        } md:flex flex-1 min-w-0 flex-col h-full studio-canvas relative`}
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
        <div className="md:hidden bg-white/95 backdrop-blur-xs border-b border-slate-200/80 px-3 py-1.5 flex items-center justify-between gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setMobileView('list')}
            className="text-xs font-semibold text-[#1E3A8A] truncate cursor-pointer py-1"
          >
            {activeScenarioMeta.title} ▾
          </button>
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg shrink-0">
            {LEVELS.map((lvl) => (
              <button
                key={lvl.id}
                type="button"
                onClick={() => handleSelectLevel(lvl.id)}
                className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
                  lvl.id === activeLevel
                    ? 'bg-white text-[#1E3A8A] shadow-2xs'
                    : 'text-slate-600'
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
            <div className="bg-white/90 border border-slate-200/80 text-slate-600 rounded-xl px-3.5 py-2 text-xs text-center max-w-md shadow-2xs leading-relaxed">
              <span className="font-semibold text-slate-900">
                {activeScenarioMeta.title} · {activeLevelMeta.label}
              </span>
              <span className="mx-1.5" aria-hidden="true">
                —
              </span>
              <span>
                Chat naturally in Italian. If you make a mistake, you&apos;ll get instant corrections and tips.
              </span>
            </div>
          </div>

          {/* Clean Empty State with App Logo */}
          {currentThread.messages.length === 0 && !isTyping && (
            <div className="flex justify-center pt-6 pb-2">
              <div className="bg-white border border-slate-200/80 rounded-2xl p-6 max-w-sm w-full text-center shadow-xs">
                <div className="flex justify-center mb-3.5">
                  {logoError ? (
                    <div className="w-20 h-20 rounded-2xl bg-[#1E3A8A] text-white font-display font-bold text-lg flex items-center justify-center border border-slate-200">
                      LI
                    </div>
                  ) : (
                    <img
                      src={APP_LOGO_URL}
                      alt="Learn Italian via Conversation"
                      referrerPolicy="no-referrer"
                      onError={() => setLogoError(true)}
                      className="w-20 h-20 rounded-2xl object-cover border border-slate-200/80 bg-white shadow-2xs"
                    />
                  )}
                </div>
                <h3 className="font-display text-[16px] font-bold text-slate-900 mb-1">
                  {activeScenarioMeta.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  {activeScenarioMeta.roleDescription}
                </p>
                <button
                  type="button"
                  onClick={() => handleSendMessage("Ciao! Vorrei fare pratica con l'italiano.")}
                  className="w-full min-h-[44px] px-4 py-2 rounded-xl bg-[#1E3A8A] hover:bg-[#1E40AF] text-white text-xs font-semibold inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Start Conversation</span>
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
                    aria-label="Dismiss error"
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
      <aside className="hidden xl:flex xl:w-[350px] shrink-0 h-full border-l border-slate-200/80">
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
          className="xl:hidden fixed inset-0 z-50 flex items-end sm:items-center sm:justify-end bg-slate-900/45 backdrop-blur-[2px]"
          onClick={() => setPhrasesDrawerOpen(false)}
        >
          <div
            className="w-full sm:w-[400px] h-[84dvh] sm:h-full bg-[#F8FAFC] rounded-t-3xl sm:rounded-none overflow-hidden shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile Sheet Drag Handle */}
            <div className="sm:hidden pt-2.5 pb-1 bg-white flex justify-center shrink-0">
              <div className="w-10 h-1 rounded-full bg-slate-300" />
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
