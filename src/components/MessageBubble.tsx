import React, { useEffect, useState } from 'react';
import {
  CheckCheck,
  CheckCircle2,
  ChevronDown,
  Globe,
  Languages,
  Square,
  Volume2,
} from 'lucide-react';
import { TranslationLanguage } from '../data/languages';
import { ChatMessage, ProficiencyLevel } from '../types';

interface MessageBubbleProps {
  message: ChatMessage;
  level: ProficiencyLevel;
  selectedLanguage: TranslationLanguage | null;
  openSignal?: number;
  isTranslating: boolean;
  playingId: string | null;
  loadingAudioId: string | null;
  onPlayAudio: (opts: { id: string; text: string; level: ProficiencyLevel; slow?: boolean }) => void;
  onRequestTranslation: (messageId: string, text: string) => void;
  onOpenLanguagePicker: (messageId: string) => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  level,
  selectedLanguage,
  openSignal = 0,
  isTranslating,
  playingId,
  loadingAudioId,
  onPlayAudio,
  onRequestTranslation,
  onOpenLanguagePicker,
}) => {
  const [showTranslation, setShowTranslation] = useState(false);

  const isUser = message.sender === 'user';
  const mainAudioId = `msg-${message.id}`;
  const slowAudioId = `msg-slow-${message.id}`;
  const correctionAudioId = `corr-${message.id}`;

  const isPlayingMain = playingId === mainAudioId;
  const isLoadingMain = loadingAudioId === mainAudioId;

  const isPlayingSlow = playingId === slowAudioId;
  const isLoadingSlow = loadingAudioId === slowAudioId;

  const isPlayingCorr = playingId === correctionAudioId;
  const isLoadingCorr = loadingAudioId === correctionAudioId;

  // Look up translation in selected language (only when user has picked a language)
  const activeTranslation = selectedLanguage
    ? message.translations?.[selectedLanguage.code]
    : undefined;

  const lastRequestedLangRef = React.useRef<string | null>(null);

  // Auto-open translation box when user selects a language from this bubble
  useEffect(() => {
    if (openSignal > 0 && selectedLanguage) {
      setShowTranslation(true);
    }
  }, [openSignal, selectedLanguage]);

  // If the user switches language while translation is open and it's not cached yet, fetch it once
  useEffect(() => {
    if (
      !isUser &&
      selectedLanguage &&
      showTranslation &&
      !activeTranslation &&
      !isTranslating &&
      lastRequestedLangRef.current !== selectedLanguage.code
    ) {
      lastRequestedLangRef.current = selectedLanguage.code;
      onRequestTranslation(message.id, message.text);
    }
  }, [
    activeTranslation,
    isTranslating,
    isUser,
    message.id,
    message.text,
    onRequestTranslation,
    selectedLanguage,
    showTranslation,
  ]);

  const handleToggleTranslation = () => {
    if (!selectedLanguage) {
      onOpenLanguagePicker(message.id);
      return;
    }
    if (!showTranslation && !activeTranslation && !isTranslating) {
      lastRequestedLangRef.current = selectedLanguage.code;
      onRequestTranslation(message.id, message.text);
    }
    setShowTranslation((prev) => !prev);
  };

  return (
    /* Force physical LTR alignment so User is on the RIGHT and Marco is on the LEFT */
    <div dir="ltr" className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`flex flex-col max-w-[88%] sm:max-w-[76%] md:max-w-[70%] ${
          isUser ? 'items-end' : 'items-start'
        }`}
      >
        {/* Main Message Bubble */}
        <div
          className={`relative px-4 py-2.5 rounded-2xl shadow-xs ${
            isUser
              ? 'bg-[#1E3A8A] text-white rounded-br-sm'
              : 'bg-white text-slate-900 border border-slate-200/80 rounded-bl-sm'
          }`}
        >
          <p
            dir="auto"
            className="text-[15px] leading-[1.5] whitespace-pre-wrap break-words"
          >
            {message.text}
          </p>

          {/* Translation revealed inside Marco's bubble */}
          {!isUser && selectedLanguage && showTranslation && (
            <div
              dir={selectedLanguage.dir}
              className={`mt-2 pt-2 border-t border-slate-200/80 text-[13.5px] leading-relaxed text-slate-600 ${
                selectedLanguage.dir === 'rtl' ? 'font-arabic' : ''
              }`}
            >
              {isTranslating && !activeTranslation ? (
                <span dir="ltr" className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                  <Languages className="w-3.5 h-3.5 text-[#1E3A8A] animate-pulse" />
                  <span>Translating to {selectedLanguage.name}</span>
                </span>
              ) : (
                activeTranslation
              )}
            </div>
          )}

          {/* Bubble Footer: Audio controls + Translation + Language Picker + Timestamp */}
          <div className="mt-1.5 flex items-center justify-between gap-2 flex-wrap">
            {!isUser ? (
              <div className="flex items-center gap-1 flex-wrap">
                <button
                  type="button"
                  onClick={() =>
                    onPlayAudio({
                      id: mainAudioId,
                      text: message.text,
                      level,
                      slow: false,
                    })
                  }
                  className={`min-h-[34px] px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                    isPlayingMain
                      ? 'bg-[#1E3A8A] text-white'
                      : 'bg-slate-100 text-slate-800 hover:bg-slate-200/80'
                  }`}
                >
                  {isLoadingMain ? (
                    <Volume2 className="w-3.5 h-3.5 text-[#1E3A8A] animate-pulse" />
                  ) : isPlayingMain ? (
                    <Square className="w-3 h-3 fill-current" />
                  ) : (
                    <Volume2 className="w-3.5 h-3.5 text-[#1E3A8A]" />
                  )}
                  <span>{isPlayingMain ? 'Stop' : 'Listen'}</span>
                </button>

                {level !== 'beginner' && (
                  <button
                    type="button"
                    onClick={() =>
                      onPlayAudio({
                        id: slowAudioId,
                        text: message.text,
                        level,
                        slow: true,
                      })
                    }
                    title="Listen slowly"
                    className={`min-h-[34px] px-2 py-1 rounded-lg text-[11px] font-medium flex items-center gap-1 transition-colors cursor-pointer ${
                      isPlayingSlow
                        ? 'bg-[#1E3A8A] text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                    }`}
                  >
                    {isPlayingSlow ? (
                      <Square className="w-2.5 h-2.5 fill-current" />
                    ) : (
                      <span className={isLoadingSlow ? 'animate-pulse' : ''}>Slow</span>
                    )}
                  </button>
                )}

                {/* Translate + Language Selector Control */}
                {!selectedLanguage ? (
                  <button
                    type="button"
                    onClick={() => onOpenLanguagePicker(message.id)}
                    className="min-h-[34px] px-2.5 py-1 rounded-lg border border-slate-200/80 bg-slate-100 hover:bg-slate-200/80 text-slate-600 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Languages className="w-3.5 h-3.5 shrink-0 text-[#1E3A8A]" />
                    <span>Choose translation language</span>
                    <ChevronDown className="w-3 h-3 shrink-0" />
                  </button>
                ) : (
                  <div className="inline-flex items-center rounded-lg overflow-hidden border border-slate-200/80">
                    <button
                      type="button"
                      onClick={handleToggleTranslation}
                      className={`min-h-[34px] px-2.5 py-1 text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer ${
                        showTranslation
                          ? 'bg-blue-50 text-[#1E3A8A]'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                      }`}
                    >
                      <Languages className="w-3.5 h-3.5 shrink-0" />
                      <span className="max-w-[120px] truncate">
                        {selectedLanguage.name}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onOpenLanguagePicker(message.id)}
                      title="Choose translation language"
                      aria-label="Choose translation language"
                      className="min-h-[34px] px-1.5 py-1 bg-slate-200/70 hover:bg-slate-200 text-slate-600 flex items-center gap-0.5 transition-colors border-l border-slate-200 cursor-pointer"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <ChevronDown className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <span />
            )}

            <div className="flex items-center gap-1 ml-auto">
              <span
                className={`text-[11px] tabular-nums ${
                  isUser ? 'text-blue-200' : 'text-slate-400'
                }`}
              >
                {message.timestamp}
              </span>
              {isUser && <CheckCheck className="w-3.5 h-3.5 text-sky-300" />}
            </div>
          </div>
        </div>

        {/* Italian Correction & Tip Card (shown below user's message if Marco spotted a mistake) */}
        {isUser && message.correction && (
          <div className="mt-1.5 w-full bg-amber-50/70 border border-amber-200/90 rounded-2xl p-3 shadow-xs">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-1.5 text-amber-900">
                <CheckCircle2 className="w-4 h-4 text-[#B45309] shrink-0" />
                <span className="text-xs font-bold">
                  Correction &amp; Tip
                </span>
              </div>
            </div>

            {/* Corrected Italian Sentence with Audio Button */}
            <div className="flex items-center justify-between gap-2 bg-white border border-amber-200/70 rounded-xl px-3 py-2 mb-2">
              <p className="text-[14px] font-semibold text-[#1E3A8A] leading-snug">
                {message.correction.correctedItalian}
              </p>
              <button
                type="button"
                onClick={() =>
                  onPlayAudio({
                    id: correctionAudioId,
                    text: message.correction!.correctedItalian,
                    level,
                    slow: level === 'beginner',
                  })
                }
                aria-label="Listen to correction"
                className={`min-w-[36px] min-h-[36px] rounded-lg flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
                  isPlayingCorr
                    ? 'bg-[#1E3A8A] text-white'
                    : 'bg-slate-50 border border-slate-200 text-[#1E3A8A] hover:bg-blue-50'
                }`}
              >
                {isLoadingCorr ? (
                  <Volume2 className="w-4 h-4 animate-pulse" />
                ) : isPlayingCorr ? (
                  <Square className="w-3.5 h-3.5 fill-current" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Concise English Explanation */}
            <p className="text-[13.5px] leading-relaxed text-slate-700">
              {message.correction.explanation}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
