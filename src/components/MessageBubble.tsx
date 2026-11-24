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
    /* Force physical LTR alignment so User is on the RIGHT and Marco is on the LEFT */
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
              ? 'bg-[#0F5E4B] border-[#0F5E4B] text-white rounded-tr-[4px] shadow-[0_2px_6px_rgba(15,94,75,0.16)]'
              : 'bg-white border-[#DCE4DD] text-[#111C18] rounded-tl-[4px] shadow-[0_1px_3px_rgba(17,28,24,0.06)]'
          }`}
        >
          <p
            dir="auto"
            className="text-[15px] leading-[1.55] whitespace-pre-wrap break-words"
          >
            {message.text}
          </p>

          {/* Translation revealed inside Marco's bubble */}
          {!isUser && selectedLanguage && showTranslation && (
            <div
              dir={selectedLanguage.dir}
              className={`mt-2.5 pt-2.5 border-t border-[#DCE4DD] text-[13.5px] leading-relaxed text-[#35463F] ${
                selectedLanguage.dir === 'rtl' ? 'font-arabic' : ''
              }`}
            >
              {isTranslating && !activeTranslation ? (
                <span dir="ltr" className="inline-flex items-center gap-1.5 text-xs text-[#64766E]">
                  <Languages className="w-3.5 h-3.5 text-[#0F5E4B]" />
                  <span>Traduzione in {selectedLanguage.name}</span>
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
                      ? 'bg-[#0F5E4B] text-white'
                      : 'bg-[#EEF3EF] text-[#111C18] hover:bg-[#E2EAE4]'
                  }`}
                >
                  {isLoadingMain ? (
                    <Volume2 className="w-3.5 h-3.5 text-[#0F5E4B]" />
                  ) : isPlayingMain ? (
                    <Square className="w-3 h-3 fill-current" />
                  ) : (
                    <Volume2 className="w-3.5 h-3.5 text-[#0F5E4B]" />
                  )}
                  <span>{isPlayingMain ? 'Ferma' : 'Ascolta'}</span>
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
                    title="Ascolta lentamente"
                    className={`min-h-[34px] px-2.5 py-1 rounded-lg text-[11px] font-medium flex items-center gap-1 transition-colors cursor-pointer ${
                      isPlayingSlow
                        ? 'bg-[#0F5E4B] text-white'
                        : 'bg-[#EEF3EF] text-[#4A5C55] hover:bg-[#E2EAE4]'
                    }`}
                  >
                    {isPlayingSlow ? (
                      <Square className="w-2.5 h-2.5 fill-current" />
                    ) : (
                      <span>Lento</span>
                    )}
                  </button>
                )}

                {/* Translate + Language Selector Control */}
                {!selectedLanguage ? (
                  <button
                    type="button"
                    onClick={() => onOpenLanguagePicker(message.id)}
                    className="min-h-[34px] px-2.5 py-1 rounded-lg border border-[#DCE4DD] bg-[#EEF3EF] hover:bg-[#E2EAE4] text-[#4A5C55] text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Languages className="w-3.5 h-3.5 shrink-0 text-[#0F5E4B]" />
                    <span>Scegli lingua di traduzione</span>
                    <ChevronDown className="w-3 h-3 shrink-0" />
                  </button>
                ) : (
                  <div className="inline-flex items-center rounded-lg overflow-hidden border border-[#DCE4DD]">
                    <button
                      type="button"
                      onClick={handleToggleTranslation}
                      className={`min-h-[34px] px-2.5 py-1 text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer ${
                        showTranslation
                          ? 'bg-[#E8F4F0] text-[#0F5E4B]'
                          : 'bg-[#EEF3EF] text-[#4A5C55] hover:bg-[#E2EAE4]'
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
                      title="Scegli lingua di traduzione"
                      aria-label="Scegli lingua di traduzione"
                      className="min-h-[34px] px-1.5 py-1 bg-[#E4ECE6] hover:bg-[#D6E2D9] text-[#4A5C55] flex items-center gap-0.5 transition-colors border-l border-[#DCE4DD] cursor-pointer"
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
              <span className={`text-[11px] tabular-nums ${isUser ? 'text-emerald-100/85' : 'text-[#64766E]'}`}>
                {message.timestamp}
              </span>
              {isUser && <CheckCheck className="w-3.5 h-3.5 text-emerald-200" />}
            </div>
          </div>
        </div>

        {/* Italian Correction & Tip Card (shown below user's message if Marco spotted a mistake) */}
        {isUser && message.correction && (
          <div className="mt-1.5 w-full bg-[#FFFDF9] border border-[#E6D5B8] rounded-2xl p-3.5 shadow-[0_1px_3px_rgba(17,28,24,0.05)]">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-1.5 text-amber-900">
                <CheckCircle2 className="w-4 h-4 text-[#0F5E4B] shrink-0" />
                <span className="text-xs font-bold">
                  Correzione e consiglio
                </span>
              </div>
            </div>

            {/* Corrected Italian Sentence with Audio Button */}
            <div className="flex items-center justify-between gap-2 bg-[#F4F7F5] border border-[#DCE4DD] rounded-xl px-3 py-2 mb-2">
              <p className="text-[14px] font-semibold text-[#0F5E4B] leading-snug">
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
                aria-label="Ascolta la correzione"
                className={`min-w-[36px] min-h-[36px] rounded-lg flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
                  isPlayingCorr
                    ? 'bg-[#0F5E4B] text-white'
                    : 'bg-white border border-[#DCE4DD] text-[#0F5E4B] hover:bg-[#E8F4F0]'
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

            {/* Concise Italian Explanation */}
            <p className="text-[13.5px] leading-relaxed text-[#35463F]">
              {message.correction.explanation}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
