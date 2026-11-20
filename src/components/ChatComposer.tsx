import React, { useEffect, useRef, useState } from 'react';
import { Lightbulb, Mic, Send, Square, Trash2 } from 'lucide-react';

interface ChatComposerProps {
  inputText: string;
  setInputText: (val: string) => void;
  disabled: boolean;
  suggestedHint?: string;
  onSendMessage: (text: string) => void;
}

export const ChatComposer: React.FC<ChatComposerProps> = ({
  inputText,
  setInputText,
  disabled,
  suggestedHint,
  onSendMessage,
}) => {
  const [showHint, setShowHint] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [micError, setMicError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<number | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
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
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setMicError('Microphone is not supported in this browser.');
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
      setMicError('Please allow microphone access in your browser to speak.');
    }
  };

  const cancelRecording = () => {
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
    const recorder = mediaRecorderRef.current;
    if (!recorder) return;

    recorder.onstop = async () => {
      const mimeType = recorder.mimeType || 'audio/webm';
      const blob = new Blob(chunksRef.current, { type: mimeType });
      chunksRef.current = [];
      cleanupStream();
      setIsRecording(false);
      setRecordingSeconds(0);

      if (blob.size < 400) {
        setMicError('Could not hear you clearly. Try speaking closer to the mic.');
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
          reader.onerror = () => reject(new Error('Failed to read audio'));
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
          throw new Error(data.error || 'Transcription failed');
        }

        const transcript = (data.text || '').trim();
        if (!transcript) {
          setMicError('No speech detected. Move closer to your mic and try again.');
        } else {
          setInputText(inputText ? `${inputText} ${transcript}` : transcript);
          inputRef.current?.focus();
        }
      } catch {
        setMicError('Unable to transcribe audio. Please try again.');
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
    <div className="bg-white border-t border-slate-200 px-2.5 sm:px-4 py-2 pb-safe shrink-0">
      {/* Inline Hint Drawer */}
      {showHint && suggestedHint && (
        <div className="mb-2 bg-[#F8FAFC] border border-[#1E40AF]/15 rounded-xl px-3 py-2 flex items-center justify-between gap-2 shadow-2xs">
          <div className="min-w-0">
            <span className="text-[11px] font-semibold text-[#1E40AF] block">
              Suggested reply:
            </span>
            <p className="text-sm text-[#0F172A] leading-snug break-words">
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
            className="px-3 py-1.5 rounded-lg bg-[#EFF6FF] text-[#1E40AF] text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer hover:bg-[#DBEAFE]"
          >
            Use
          </button>
        </div>
      )}

      {/* Microphone Error Banner */}
      {micError && (
        <div className="mb-2 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl px-3 py-1.5 text-xs flex items-center justify-between gap-2">
          <span>{micError}</span>
          <button
            type="button"
            onClick={() => setMicError(null)}
            className="text-rose-700 font-semibold px-2 py-0.5 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Active Voice Recording Bar vs Standard Composer */}
      {isRecording ? (
        <div className="flex items-center justify-between gap-2 bg-[#F8FAFC] rounded-xl px-3 py-1.5 min-h-[48px] border border-rose-300">
          <button
            type="button"
            onClick={cancelRecording}
            aria-label="Cancel recording"
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
          >
            <Trash2 className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 flex-1 justify-center">
            <Mic className="w-4 h-4 text-rose-600 shrink-0" />
            <span className="text-sm font-semibold text-[#0F172A] tabular-nums">
              {formatTimer(recordingSeconds)}
            </span>
            <span className="text-xs text-[#475569] whitespace-nowrap">
              Speak English
            </span>
          </div>

          <button
            type="button"
            onClick={finishAndTranscribe}
            className="min-h-[44px] px-4 rounded-lg bg-[#1E40AF] text-white text-xs font-semibold flex items-center gap-1.5 hover:bg-[#1E3A8A] active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
            <span>Done</span>
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex items-center gap-1.5 sm:gap-2">
          {suggestedHint && (
            <button
              type="button"
              onClick={() => setShowHint((v) => !v)}
              title="Suggested reply"
              aria-label="Suggested reply"
              className={`min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center transition-colors shrink-0 cursor-pointer ${
                showHint
                  ? 'bg-[#EFF6FF] text-[#1E40AF]'
                  : 'text-[#475569] hover:bg-black/5'
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
              placeholder={
                isTranscribing
                  ? 'Transcribing voice'
                  : 'Type in English'
              }
              className="w-full min-h-[44px] bg-[#F8FAFC] rounded-xl px-4 py-2.5 text-[15px] text-[#0F172A] placeholder:text-[#64748B] border border-slate-200 focus:outline-none focus:border-[#1E40AF] focus:bg-white"
            />
          </div>

          {/* Microphone Button */}
          <button
            type="button"
            onClick={startRecording}
            disabled={disabled || isTranscribing}
            title="Speak with microphone"
            aria-label="Speak with microphone"
            className="min-w-[44px] min-h-[44px] rounded-xl bg-[#F8FAFC] border border-slate-200 text-[#1E40AF] hover:bg-[#EFF6FF] active:scale-[0.96] disabled:opacity-50 flex items-center justify-center transition-all shrink-0 cursor-pointer"
          >
            <Mic className={`w-5 h-5 ${isTranscribing ? 'animate-pulse' : ''}`} />
          </button>

          {/* Send Button */}
          <button
            type="submit"
            disabled={!inputText.trim() || disabled || isTranscribing}
            title="Send"
            aria-label="Send message"
            className="min-w-[44px] min-h-[44px] rounded-xl bg-[#1E40AF] text-white hover:bg-[#1E3A8A] active:scale-[0.96] disabled:bg-[#CBD5E1] disabled:cursor-not-allowed flex items-center justify-center transition-all shrink-0 cursor-pointer"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      )}
    </div>
  );
};
