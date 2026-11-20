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
    /* Force physical LTR alignment so User is on the RIGHT and Alex is on the LEFT */
    <div dir="ltr" className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`flex flex-col max-w-[88%] sm:max-w-[76%] md:max-w-[70%] ${
          isUser ? 'items-end' : 'items-start'
        }`}
      >
        {/* Main Message Bubble */}
        <div
          className={`relative px-3.5 py-2.5 rounded-xl border ${
            isUser
              ? 'bg-[#1E3A8A] border-[#1E3A8A] text-white rounded-tr-[4px]'
              : 'bg-white border-slate-200 text-[#0F172A] rounded-tl-[4px] shadow-[0_1px_2px_rgba(15,23,42,0.05)]'
          }`}
        >
          <p
            dir="auto"
            className="text-[15px] leading-[1.55] whitespace-pre-wrap break-words"
          >
            {message.text}
          </p>

          {/* Translation revealed inside Alex's bubble */}
          {!isUser && selectedLanguage && showTranslation && (
            <div
              dir={selectedLanguage.dir}
              className={`mt-2 pt-2 border-t border-slate-200 text-[13.5px] leading-relaxed text-[#334155] ${
                selectedLanguage.dir === 'rtl' ? 'font-arabic' : ''
              }`}
            >
              {isTranslating && !activeTranslation ? (
                <span dir="ltr" className="inline-flex items-center gap-1.5 text-xs text-[#64748B]">
                  <Languages className="w-3.5 h-3.5 text-[#1E40AF] animate-pulse" />
                  <span>Translating to {selectedLanguage.name}</span>
                </span>
              ) : (
                activeTranslation
              )}
            </div>
          )}

          {/* Bubble Footer: Audio controls + Translation + Language Picker + Timestamp */}
          <div className="mt-2 flex items-center justify-between gap-2 flex-wrap">
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
                  className={`min-h-[34px] px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                    isPlayingMain
                      ? 'bg-[#1E40AF] text-white'
                      : 'bg-[#EEF2F6] text-[#0F172A] hover:bg-[#E2E8F0]'
                  }`}
                >
                  {isLoadingMain ? (
                    <Volume2 className="w-3.5 h-3.5 text-[#1E40AF] animate-pulse" />
                  ) : isPlayingMain ? (
                    <Square className="w-3 h-3 fill-current" />
                  ) : (
                    <Volume2 className="w-3.5 h-3.5 text-[#1E40AF]" />
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
                    className={`min-h-[34px] px-2 py-1 rounded-md text-[11px] font-medium flex items-center gap-1 transition-colors cursor-pointer ${
                      isPlayingSlow
                        ? 'bg-[#1E40AF] text-white'
                        : 'bg-[#EEF2F6] text-[#475569] hover:bg-[#E2E8F0]'
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
                    className="min-h-[34px] px-2.5 py-1 rounded-md border border-slate-200 bg-[#EEF2F6] hover:bg-[#E2E8F0] text-[#475569] text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Languages className="w-3.5 h-3.5 shrink-0 text-[#1E40AF]" />
                    <span>Choose translation language</span>
                    <ChevronDown className="w-3 h-3 shrink-0" />
                  </button>
                ) : (
                  <div className="inline-flex items-center rounded-md overflow-hidden border border-slate-200">
                    <button
                      type="button"
                      onClick={handleToggleTranslation}
                      className={`min-h-[34px] px-2.5 py-1 text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer ${
                        showTranslation
                          ? 'bg-[#EFF6FF] text-[#1E40AF]'
                          : 'bg-[#EEF2F6] text-[#475569] hover:bg-[#E2E8F0]'
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
                      className="min-h-[34px] px-1.5 py-1 bg-[#E2E8F0] hover:bg-[#CBD5E1] text-[#475569] flex items-center gap-0.5 transition-colors border-l border-slate-200 cursor-pointer"
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
              <span className={`text-[11px] tabular-nums ${isUser ? 'text-blue-200' : 'text-[#64748B]'}`}>
                {message.timestamp}
              </span>
              {isUser && <CheckCheck className="w-3.5 h-3.5 text-sky-300" />}
            </div>
          </div>
        </div>

        {/* English Correction & Tip Card (shown below user's message if Alex spotted a mistake) */}
        {isUser && message.correction && (
          <div className="mt-1.5 w-full bg-white border border-amber-300/80 rounded-xl p-3 shadow-[0_1px_2px_rgba(15,23,42,0.05)]">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-1.5 text-amber-900">
                <CheckCircle2 className="w-4 h-4 text-[#1E40AF] shrink-0" />
                <span className="text-xs font-bold">
                  Correction &amp; Tip
                </span>
              </div>
            </div>

            {/* Corrected English Sentence with Audio Button */}
            <div className="flex items-center justify-between gap-2 bg-[#F8FAFC] border border-slate-200 rounded-lg px-3 py-2 mb-2">
              <p className="text-[14px] font-semibold text-[#1E40AF] leading-snug">
                {message.correction.correctedEnglish}
              </p>
              <button
                type="button"
                onClick={() =>
                  onPlayAudio({
                    id: correctionAudioId,
                    text: message.correction!.correctedEnglish,
                    level,
                    slow: level === 'beginner',
                  })
                }
                aria-label="Listen to the correction"
                className={`min-w-[36px] min-h-[36px] rounded-md flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
                  isPlayingCorr
                    ? 'bg-[#1E40AF] text-white'
                    : 'bg-white border border-slate-200 text-[#1E40AF] hover:bg-[#EFF6FF]'
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
            <p className="text-[13.5px] leading-relaxed text-[#334155]">
              {message.correction.explanation}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
