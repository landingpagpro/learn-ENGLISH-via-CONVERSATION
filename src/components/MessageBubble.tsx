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

  const isPlayingCorr = playingId === correctionAudioId;
  const isLoadingCorr = loadingAudioId === correctionAudioId;

  const activeTranslation = selectedLanguage
    ? message.translations?.[selectedLanguage.code]
    : undefined;

  const lastRequestedLangRef = React.useRef<string | null>(null);

  useEffect(() => {
    if (openSignal > 0 && selectedLanguage) {
      setShowTranslation(true);
    }
  }, [openSignal, selectedLanguage]);

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
          className={`relative px-4 py-3 rounded-2xl border ${
            isUser
              ? 'bg-[#1B4D8E] border-[#1B4D8E] text-white rounded-tr-[4px] shadow-[0_2px_6px_rgba(27,77,142,0.18)]'
              : 'bg-white border-[#D5DFEC] text-[#0F1B2D] rounded-tl-[4px] shadow-[0_1px_3px_rgba(15,27,45,0.06)]'
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
              className={`mt-2.5 pt-2.5 border-t border-[#D5DFEC] text-[13.5px] leading-relaxed text-[#334663] ${
                selectedLanguage.dir === 'rtl' ? 'font-arabic' : ''
              }`}
            >
              {isTranslating && !activeTranslation ? (
                <span dir="ltr" className="inline-flex items-center gap-1.5 text-xs text-[#647690]">
                  <Languages className="w-3.5 h-3.5 text-[#1B4D8E]" />
                  <span>Translating to {selectedLanguage.name}</span>
                </span>
              ) : (
                activeTranslation
              )}
            </div>
          )}

          {/* Bubble Footer: Audio controls + Translation + Language Picker + Timestamp */}
          <div className="mt-2.5 flex items-center justify-between gap-2 flex-wrap">
            {!isUser ? (
              <div className="flex items-center gap-1.5 flex-wrap">
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
                      ? 'bg-[#1B4D8E] text-white'
                      : 'bg-[#EDF2F8] text-[#0F1B2D] hover:bg-[#E1E9F4]'
                  }`}
                >
                  {isLoadingMain ? (
                    <Volume2 className="w-3.5 h-3.5 text-[#1B4D8E]" />
                  ) : isPlayingMain ? (
                    <Square className="w-3 h-3 fill-current" />
                  ) : (
                    <Volume2 className="w-3.5 h-3.5 text-[#1B4D8E]" />
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
                    className={`min-h-[34px] px-2.5 py-1 rounded-lg text-[11px] font-medium flex items-center gap-1 transition-colors cursor-pointer ${
                      isPlayingSlow
                        ? 'bg-[#1B4D8E] text-white'
                        : 'bg-[#EDF2F8] text-[#4E607A] hover:bg-[#E1E9F4]'
                    }`}
                  >
                    {isPlayingSlow ? (
                      <Square className="w-2.5 h-2.5 fill-current" />
                    ) : (
                      <span>Slow</span>
                    )}
                  </button>
                )}

                {/* Translate + Language Selector Control */}
                {!selectedLanguage ? (
                  <button
                    type="button"
                    onClick={() => onOpenLanguagePicker(message.id)}
                    className="min-h-[34px] px-2.5 py-1 rounded-lg border border-[#D5DFEC] bg-[#EDF2F8] hover:bg-[#E1E9F4] text-[#4E607A] text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Languages className="w-3.5 h-3.5 shrink-0 text-[#1B4D8E]" />
                    <span>Choose translation language</span>
                    <ChevronDown className="w-3 h-3 shrink-0" />
                  </button>
                ) : (
                  <div className="inline-flex items-center rounded-lg overflow-hidden border border-[#D5DFEC]">
                    <button
                      type="button"
                      onClick={handleToggleTranslation}
                      className={`min-h-[34px] px-2.5 py-1 text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer ${
                        showTranslation
                          ? 'bg-[#EBF2FC] text-[#1B4D8E]'
                          : 'bg-[#EDF2F8] text-[#4E607A] hover:bg-[#E1E9F4]'
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
                      title="Change translation language"
                      aria-label="Change translation language"
                      className="min-h-[34px] px-1.5 py-1 bg-[#E1E9F4] hover:bg-[#D3DFEE] text-[#4E607A] flex items-center gap-0.5 transition-colors border-l border-[#D5DFEC] cursor-pointer"
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
              <span className={`text-[11px] tabular-nums ${isUser ? 'text-sky-100/85' : 'text-[#647690]'}`}>
                {message.timestamp}
              </span>
              {isUser && <CheckCheck className="w-3.5 h-3.5 text-sky-200" />}
            </div>
          </div>
        </div>

        {/* English Correction & Tip Card (shown below user's message if Alex spotted a mistake) */}
        {isUser && message.correction && (
          <div className="mt-1.5 w-full bg-[#FFFDF8] border border-[#E7D8BA] rounded-2xl p-3.5 shadow-[0_1px_3px_rgba(15,27,45,0.05)]">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-1.5 text-amber-900">
                <CheckCircle2 className="w-4 h-4 text-[#1B4D8E] shrink-0" />
                <span className="text-xs font-bold">
                  Correction &amp; tip
                </span>
              </div>
            </div>

            {/* Corrected English Sentence with Audio Button */}
            <div className="flex items-center justify-between gap-2 bg-[#F6F8FC] border border-[#D5DFEC] rounded-xl px-3 py-2 mb-2">
              <p className="text-[14px] font-semibold text-[#1B4D8E] leading-snug">
                {message.correction.correctedEnglish}
              </p>
              <button
                type="button"
                onClick={() =>
                  onPlayAudio({
                    id: correctionAudioId,
                    text: message.correction!.correctedEnglish,
                    level,
                    slow: false,
                  })
                }
                aria-label="Listen to correction"
                className={`min-w-[36px] min-h-[36px] rounded-lg flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
                  isPlayingCorr
                    ? 'bg-[#1B4D8E] text-white'
                    : 'bg-white border border-[#D5DFEC] text-[#1B4D8E] hover:bg-[#EBF2FC]'
                }`}
              >
                {isLoadingCorr ? (
                  <Volume2 className="w-4 h-4" />
                ) : isPlayingCorr ? (
                  <Square className="w-3.5 h-3.5 fill-current" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Concise English Explanation */}
            <p className="text-[13.5px] leading-relaxed text-[#334663]">
              {message.correction.explanation}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
