import React from 'react';
import {
  BookOpen,
  Check,
  CornerDownLeft,
  RefreshCw,
  Square,
  Volume2,
  X,
} from 'lucide-react';
import { KeyPhrase, ProficiencyLevel } from '../types';

interface PhrasesPanelProps {
  phrases: KeyPhrase[];
  level: ProficiencyLevel;
  isGenerating: boolean;
  playingId: string | null;
  loadingAudioId: string | null;
  onPlayAudio: (opts: { id: string; text: string; level: ProficiencyLevel; slow?: boolean }) => void;
  onToggleMemorized: (phraseId: string) => void;
  onUseInChat: (english: string) => void;
  onRefreshPhrases: () => void;
  onCloseMobile?: () => void;
}

export const PhrasesPanel: React.FC<PhrasesPanelProps> = ({
  phrases,
  level,
  isGenerating,
  playingId,
  loadingAudioId,
  onPlayAudio,
  onToggleMemorized,
  onUseInChat,
  onRefreshPhrases,
  onCloseMobile,
}) => {
  const memorizedCount = phrases.filter((p) => p.memorized).length;

  return (
    <div className="flex flex-col h-full bg-[#F7F8FA]">
      {/* Header */}
      <div className="h-14 px-4 bg-[#F0F2F5] border-b border-black/10 flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <BookOpen className="w-4 h-4 text-[#008069] shrink-0" />
          <h3 className="text-[15px] font-bold text-[#111B21] truncate">
            5 Key Phrases
          </h3>
          <span className="text-xs font-medium text-[#667781] tabular-nums shrink-0">
            {memorizedCount}/{phrases.length}
          </span>
        </div>

        {onCloseMobile && (
          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="Close"
            className="min-w-[44px] min-h-[44px] -mr-2 flex items-center justify-center rounded-full text-[#54656F] hover:bg-black/5 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Refresh Phrases Action */}
      <div className="px-4 py-3 border-b border-black/8 bg-white flex items-center justify-between gap-2 shrink-0">
        <p className="text-xs text-[#667781]">
          Practice and use these in chat
        </p>
        <button
          type="button"
          onClick={onRefreshPhrases}
          disabled={isGenerating}
          className="min-h-[36px] px-3 py-1.5 rounded-xl bg-[#E7FCE3] text-[#008069] hover:bg-[#D9FDD3] disabled:opacity-60 text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-pulse' : ''}`} />
          <span>New Phrases</span>
        </button>
      </div>

      {/* 5 Phrase Cards */}
      <div className="flex-1 overflow-y-auto chat-scroll p-3.5 space-y-3">
        {phrases.map((phrase, index) => {
          const audioId = `phrase-${phrase.id}`;
          const isPlaying = playingId === audioId;
          const isLoading = loadingAudioId === audioId;

          return (
            <div
              key={phrase.id}
              className={`rounded-2xl p-3.5 border transition-colors ${
                phrase.memorized
                  ? 'bg-[#F0FDF4] border-[#008069]/30'
                  : 'bg-white border-black/8'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <span className="text-[11px] font-semibold text-[#667781] tabular-nums">
                  0{index + 1}.
                </span>
                <button
                  type="button"
                  onClick={() => onToggleMemorized(phrase.id)}
                  className={`min-h-[32px] px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                    phrase.memorized
                      ? 'bg-[#008069] text-white'
                      : 'bg-[#F0F2F5] text-[#54656F] hover:bg-[#E2E6EA]'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{phrase.memorized ? 'Memorized' : 'Mark memorized'}</span>
                </button>
              </div>

              <p className="text-[15px] font-semibold text-[#111B21] leading-snug mb-1.5">
                {phrase.english}
              </p>

              <p className="text-[13px] font-medium text-[#008069] leading-snug mb-1">
                {phrase.meaning}
              </p>

              <p className="text-xs text-[#667781] leading-relaxed mb-3">
                {phrase.usageNote}
              </p>

              <div className="flex items-center gap-2 pt-2 border-t border-black/6">
                <button
                  type="button"
                  onClick={() =>
                    onPlayAudio({
                      id: audioId,
                      text: phrase.english,
                      level,
                      slow: level === 'beginner',
                    })
                  }
                  className={`flex-1 min-h-[38px] px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                    isPlaying
                      ? 'bg-[#008069] text-white'
                      : 'bg-[#F0F2F5] text-[#111B21] hover:bg-[#E2E6EA]'
                  }`}
                >
                  {isLoading ? (
                    <Volume2 className="w-3.5 h-3.5 text-[#008069] animate-pulse" />
                  ) : isPlaying ? (
                    <Square className="w-3 h-3 fill-current" />
                  ) : (
                    <Volume2 className="w-3.5 h-3.5 text-[#008069]" />
                  )}
                  <span>{isPlaying ? 'Stop' : 'Listen'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => onUseInChat(phrase.english)}
                  className="flex-1 min-h-[38px] px-3 py-1.5 rounded-xl bg-[#F0F2F5] text-[#111B21] hover:bg-[#E2E6EA] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <CornerDownLeft className="w-3.5 h-3.5 text-[#008069]" />
                  <span>Use in chat</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
