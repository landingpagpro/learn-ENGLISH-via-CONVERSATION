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
          className={`relative px-3.5 py-2.5 rounded-2xl shadow-[0_1px_1px_rgba(17,27,33,0.08)] ${
            isUser
              ? 'bg-[#D9FDD3] text-[#111B21] rounded-tr-[4px]'
              : 'bg-white text-[#111B21] rounded-tl-[4px]'
          }`}
        >
          <p
            dir="auto"
            className="text-[15px] leading-[1.5] whitespace-pre-wrap break-words"
          >
            {message.text}
          </p>

          {/* Translation revealed inside Alex's bubble */}
          {!isUser && selectedLanguage && showTranslation && (
            <div
              dir={selectedLanguage.dir}
              className={`mt-2 pt-2 border-t border-black/8 text-[13.5px] leading-relaxed text-[#3B4A54] ${
                selectedLanguage.dir === 'rtl' ? 'font-arabic' : ''
              }`}
            >
              {isTranslating && !activeTranslation ? (
                <span dir="ltr" className="inline-flex items-center gap-1.5 text-xs text-[#667781]">
                  <Languages className="w-3.5 h-3.5 text-[#008069] animate-pulse" />
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
                      ? 'bg-[#008069] text-white'
                      : 'bg-[#F0F2F5] text-[#111B21] hover:bg-[#E2E6EA]'
                  }`}
                >
                  {isLoadingMain ? (
                    <Volume2 className="w-3.5 h-3.5 text-[#008069] animate-pulse" />
                  ) : isPlayingMain ? (
                    <Square className="w-3 h-3 fill-current" />
                  ) : (
                    <Volume2 className="w-3.5 h-3.5 text-[#008069]" />
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
                        ? 'bg-[#008069] text-white'
                        : 'bg-[#F0F2F5] text-[#54656F] hover:bg-[#E2E6EA]'
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
                    className="min-h-[34px] px-2.5 py-1 rounded-lg border border-black/6 bg-[#F0F2F5] hover:bg-[#E2E6EA] text-[#54656F] text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Languages className="w-3.5 h-3.5 shrink-0 text-[#008069]" />
                    <span>Choose translation language</span>
                    <ChevronDown className="w-3 h-3 shrink-0" />
                  </button>
                ) : (
                  <div className="inline-flex items-center rounded-lg overflow-hidden border border-black/6">
                    <button
                      type="button"
                      onClick={handleToggleTranslation}
                      className={`min-h-[34px] px-2.5 py-1 text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer ${
                        showTranslation
                          ? 'bg-[#E7FCE3] text-[#008069]'
                          : 'bg-[#F0F2F5] text-[#54656F] hover:bg-[#E2E6EA]'
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
                      className="min-h-[34px] px-1.5 py-1 bg-[#E9EDEF] hover:bg-[#DCE2E6] text-[#54656F] flex items-center gap-0.5 transition-colors border-l border-black/8 cursor-pointer"
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
              <span className="text-[11px] text-[#667781] tabular-nums">
                {message.timestamp}
              </span>
              {isUser && <CheckCheck className="w-3.5 h-3.5 text-[#53BDEB]" />}
            </div>
          </div>
        </div>

        {/* English Correction & Tip Card (shown below user's message if Alex spotted a mistake) */}
        {isUser && message.correction && (
          <div className="mt-1.5 w-full bg-white border border-amber-200/90 rounded-2xl p-3 shadow-[0_1px_2px_rgba(17,27,33,0.06)]">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-1.5 text-amber-800">
                <CheckCircle2 className="w-4 h-4 text-[#008069] shrink-0" />
                <span className="text-xs font-bold">
                  Correction &amp; Tip
                </span>
              </div>
            </div>

            {/* Corrected English Sentence with Audio Button */}
            <div className="flex items-center justify-between gap-2 bg-[#F7F8FA] border border-black/6 rounded-xl px-3 py-2 mb-2">
              <p className="text-[14px] font-semibold text-[#008069] leading-snug">
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
                aria-label="Listen to correction"
                className={`min-w-[36px] min-h-[36px] rounded-lg flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
                  isPlayingCorr
                    ? 'bg-[#008069] text-white'
                    : 'bg-white border border-black/10 text-[#008069] hover:bg-[#E7FCE3]'
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
            <p className="text-[13.5px] leading-relaxed text-[#3B4A54]">
              {message.correction.explanation}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
