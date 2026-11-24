import React, { useEffect, useRef, useState } from 'react';
import { Lightbulb, Mic, Send, Trash2 } from 'lucide-react';

interface BrowserSpeechRecognitionEvent {
  resultIndex: number;
  results: {
    length: number;
    [idx: number]: {
      isFinal: boolean;
      [altIdx: number]: { transcript: string };
    };
  };
}

interface BrowserSpeechRecognition {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  maxAlternatives: number;
  onresult: ((event: BrowserSpeechRecognitionEvent) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

interface ChatComposerProps {
  inputText: string;
  setInputText: (val: string) => void;
  disabled: boolean;
  suggestedHint?: string;
  onSendMessage: (text: string) => void;
  onUnlockAudio?: () => void;
}

export const ChatComposer: React.FC<ChatComposerProps> = ({
  inputText,
  setInputText,
  disabled,
  suggestedHint,
  onSendMessage,
  onUnlockAudio,
}) => {
  const [showHint, setShowHint] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [micError, setMicError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const speechRecRef = useRef<BrowserSpeechRecognition | null>(null);
  const speechTranscriptRef = useRef('');
  const speechCanceledRef = useRef(false);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<number | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const inputTextRef = useRef(inputText);

  useEffect(() => {
    inputTextRef.current = inputText;
  }, [inputText]);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      if (speechRecRef.current) {
        try {
          speechRecRef.current.abort();
        } catch {
          // Ignore cleanup errors
        }
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins}:${rem.toString().padStart(2, '0')}`;
  };

  const cleanupStream = () => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    mediaRecorderRef.current = null;
  };

  const startRecording = async () => {
    setMicError(null);
    onUnlockAudio?.();

    const SpeechRecCtor =
      typeof window !== 'undefined'
        ? (
            window as unknown as {
              SpeechRecognition?: new () => BrowserSpeechRecognition;
              webkitSpeechRecognition?: new () => BrowserSpeechRecognition;
            }
          ).SpeechRecognition ||
          (
            window as unknown as {
              webkitSpeechRecognition?: new () => BrowserSpeechRecognition;
            }
          ).webkitSpeechRecognition
        : undefined;

    // Prefer built-in browser Web Speech API (100% free, zero API keys, instant Italian STT)
    if (SpeechRecCtor) {
      try {
        const rec = new SpeechRecCtor();
        rec.lang = 'it-IT';
        rec.interimResults = true;
        rec.continuous = false;
        rec.maxAlternatives = 1;
        speechTranscriptRef.current = '';
        speechCanceledRef.current = false;
        speechRecRef.current = rec;

        setIsRecording(true);
        setRecordingSeconds(0);
        timerRef.current = window.setInterval(() => {
          setRecordingSeconds((s) => s + 1);
        }, 1000);

        rec.onresult = (event: BrowserSpeechRecognitionEvent) => {
          let collected = '';
          for (let i = 0; i < event.results.length; i++) {
            collected += event.results[i][0]?.transcript || '';
          }
          speechTranscriptRef.current = collected.trim();
        };

        rec.onerror = (event: { error: string }) => {
          if (speechCanceledRef.current) return;
          if (timerRef.current) {
            window.clearInterval(timerRef.current);
            timerRef.current = null;
          }
          speechRecRef.current = null;
          setIsRecording(false);
          setRecordingSeconds(0);
          if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
            setMicError('Consenti l’accesso al microfono nel browser per parlare.');
          } else if (event.error === 'no-speech') {
            setMicError('Nessuna voce rilevata. Avvicinati al microfono e riprova.');
          } else if (event.error !== 'aborted') {
            setMicError('Riconoscimento vocale non riuscito. Riprova o scrivi il messaggio.');
          }
        };

        rec.onend = () => {
          if (timerRef.current) {
            window.clearInterval(timerRef.current);
            timerRef.current = null;
          }
          speechRecRef.current = null;
          setIsRecording(false);
          setRecordingSeconds(0);
          if (speechCanceledRef.current) return;

          const transcript = speechTranscriptRef.current.trim();
          if (transcript) {
            const prefix = inputTextRef.current.trim();
            const messageToSend = prefix ? `${prefix} ${transcript}` : transcript;
            setShowHint(false);
            setMicError(null);
            onSendMessage(messageToSend);
          }
        };

        rec.start();
        return;
      } catch {
        speechRecRef.current = null;
        if (timerRef.current) {
          window.clearInterval(timerRef.current);
          timerRef.current = null;
        }
        setIsRecording(false);
      }
    }

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setMicError('Il microfono non è supportato su questo browser.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const preferredMime = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/mp4')
        ? 'audio/mp4'
        : '';

      const recorder = preferredMime
        ? new MediaRecorder(stream, { mimeType: preferredMime, audioBitsPerSecond: 24000 })
        : new MediaRecorder(stream, { audioBitsPerSecond: 24000 });

      chunksRef.current = [];
      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);

      timerRef.current = window.setInterval(() => {
        setRecordingSeconds((s) => s + 1);
      }, 1000);
    } catch {
      cleanupStream();
      setMicError('Consenti l’accesso al microfono nel browser per parlare.');
    }
  };

  const cancelRecording = () => {
    if (speechRecRef.current) {
      speechCanceledRef.current = true;
      try {
        speechRecRef.current.abort();
      } catch {
        // Ignore
      }
      speechRecRef.current = null;
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setIsRecording(false);
      setRecordingSeconds(0);
      return;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.onstop = null;
      mediaRecorderRef.current.stop();
    }
    chunksRef.current = [];
    cleanupStream();
    setIsRecording(false);
    setRecordingSeconds(0);
  };

  const finishAndTranscribe = () => {
    if (speechRecRef.current) {
      onUnlockAudio?.();
      try {
        speechRecRef.current.stop();
      } catch {
        cancelRecording();
      }
      return;
    }

    const recorder = mediaRecorderRef.current;
    if (!recorder) return;
    onUnlockAudio?.();

    recorder.onstop = async () => {
      const mimeType = recorder.mimeType || 'audio/webm';
      const blob = new Blob(chunksRef.current, { type: mimeType });
      chunksRef.current = [];
      cleanupStream();
      setIsRecording(false);
      setRecordingSeconds(0);

      if (blob.size < 400) {
        setMicError('Audio troppo breve. Prova a parlare più vicino al microfono.');
        return;
      }

      setIsTranscribing(true);
      try {
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const result = typeof reader.result === 'string' ? reader.result : '';
            const idx = result.indexOf(',');
            resolve(idx >= 0 ? result.slice(idx + 1) : result);
          };
          reader.onerror = () => reject(new Error('Errore lettura audio'));
          reader.readAsDataURL(blob);
        });

        const response = await fetch('/api/transcribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ audioBase64: base64, mimeType }),
          signal: AbortSignal.timeout(15000),
        });

        const data = (await response.json()) as { text?: string; error?: string };
        if (!response.ok) {
          throw new Error(data.error || 'Trascrizione non riuscita');
        }

        const transcript = (data.text || '').trim();
        if (!transcript) {
          setMicError('Nessuna voce rilevata. Avvicinati al microfono e riprova.');
        } else {
          const prefix = inputTextRef.current.trim();
          const messageToSend = prefix ? `${prefix} ${transcript}` : transcript;
          setShowHint(false);
          setMicError(null);
          onSendMessage(messageToSend);
        }
      } catch {
        setMicError('Impossibile trascrivere la voce. Riprova.');
      } finally {
        setIsTranscribing(false);
      }
    };

    recorder.stop();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputText.trim();
    if (!trimmed || disabled || isRecording || isTranscribing) return;
    setShowHint(false);
    setMicError(null);
    onSendMessage(trimmed);
  };

  return (
    <div className="bg-white/95 backdrop-blur-md border-t border-[#DCE4DD] px-2.5 sm:px-4 py-2 pb-safe shrink-0">
      {/* Inline Hint Drawer */}
      {showHint && suggestedHint && (
        <div className="mb-2 bg-[#F4F7F5] border border-[#0F5E4B]/20 rounded-2xl px-3.5 py-2.5 flex items-center justify-between gap-2 shadow-[0_1px_2px_rgba(17,28,24,0.05)]">
          <div className="min-w-0">
            <span className="text-[11px] font-semibold text-[#0F5E4B] block">
              Risposta suggerita:
            </span>
            <p className="text-sm text-[#111C18] leading-snug break-words">
              {suggestedHint}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setInputText(suggestedHint);
              setShowHint(false);
              inputRef.current?.focus();
            }}
            className="px-3 py-1.5 rounded-xl bg-[#E8F4F0] text-[#0F5E4B] text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer hover:bg-[#D1EAE2]"
          >
            Usa
          </button>
        </div>
      )}

      {/* Microphone Error Banner */}
      {micError && (
        <div className="mb-2 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl px-3 py-1.5 text-xs flex items-center justify-between gap-2">
          <span>{micError}</span>
          <button
            type="button"
            onClick={() => setMicError(null)}
            className="text-rose-700 font-semibold px-2 py-0.5 cursor-pointer"
          >
            Chiudi
          </button>
        </div>
      )}

      {/* Active Voice Recording Bar vs Standard Composer */}
      {isRecording ? (
        <div className="flex items-center justify-between gap-2 bg-[#F4F7F5] rounded-2xl px-3 py-1.5 min-h-[48px] border border-rose-300">
          <button
            type="button"
            onClick={cancelRecording}
            aria-label="Annulla registrazione"
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
          >
            <Trash2 className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 flex-1 justify-center">
            <Mic className="w-4 h-4 text-rose-600 shrink-0" />
            <span className="text-sm font-semibold text-[#111C18] tabular-nums">
              {formatTimer(recordingSeconds)}
            </span>
            <span className="text-xs text-[#4A5C55] whitespace-nowrap">
              Parla in italiano
            </span>
          </div>

          <button
            type="button"
            onClick={finishAndTranscribe}
            className="min-h-[44px] px-4 rounded-xl bg-[#0F5E4B] text-white text-xs font-semibold flex items-center gap-1.5 hover:bg-[#0A4638] active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Invia</span>
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex items-center gap-1.5 sm:gap-2">
          {suggestedHint && (
            <button
              type="button"
              onClick={() => setShowHint((v) => !v)}
              title="Risposta suggerita"
              aria-label="Risposta suggerita"
              className={`min-w-[44px] min-h-[44px] rounded-2xl flex items-center justify-center transition-colors shrink-0 cursor-pointer ${
                showHint
                  ? 'bg-[#E8F4F0] text-[#0F5E4B]'
                  : 'text-[#4A5C55] hover:bg-[#EFF4F0]'
              }`}
            >
              <Lightbulb className="w-5 h-5" />
            </button>
          )}

          <div className="flex-1 min-w-0 relative">
            <input
              ref={inputRef}
              type="text"
              dir="auto"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isTranscribing}
              placeholder={isTranscribing ? 'Invio voce' : 'Scrivi in italiano'}
              className="w-full min-h-[44px] bg-[#F4F7F5] rounded-2xl px-4 py-2.5 text-[15px] text-[#111C18] placeholder:text-[#64766E] border border-[#DCE4DD] focus:outline-none focus:border-[#0F5E4B] focus:bg-white transition-colors"
            />
          </div>

          {/* Microphone Button */}
          <button
            type="button"
            onClick={startRecording}
            disabled={disabled || isTranscribing}
            title="Parla con il microfono"
            aria-label="Parla con il microfono"
            className="min-w-[44px] min-h-[44px] rounded-2xl bg-[#F4F7F5] border border-[#DCE4DD] text-[#0F5E4B] hover:bg-[#E8F4F0] active:scale-[0.96] disabled:opacity-50 flex items-center justify-center transition-all shrink-0 cursor-pointer"
          >
            <Mic className="w-5 h-5" />
          </button>

          {/* Send Button */}
          <button
            type="submit"
            disabled={!inputText.trim() || disabled || isTranscribing}
            title="Invia"
            aria-label="Invia messaggio"
            className="min-w-[44px] min-h-[44px] rounded-2xl bg-[#0F5E4B] text-white hover:bg-[#0A4638] active:scale-[0.96] disabled:bg-[#CBD5CE] disabled:cursor-not-allowed flex items-center justify-center transition-all shrink-0 cursor-pointer shadow-[0_1px_2px_rgba(15,94,75,0.2)]"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      )}
    </div>
  );
};
