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
  onUseInChat: (french: string) => void;
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
    <div className="flex flex-col h-full bg-[#F6F4EF]">
      {/* Header */}
      <div className="h-14 px-4 bg-[#EEF2F7] border-b border-[#1E3A8A]/10 flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <BookOpen className="w-4 h-4 text-[#1E3A8A] shrink-0" />
          <h3 className="font-display text-[15px] font-bold text-[#141B2D] truncate">
            5 Key Phrases
          </h3>
          <span className="text-xs font-medium text-[#64748B] tabular-nums shrink-0">
            {memorizedCount}/{phrases.length}
          </span>
        </div>

        {onCloseMobile && (
          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="Close"
            className="min-w-[44px] min-h-[44px] -mr-2 flex items-center justify-center rounded-lg text-[#475569] hover:bg-black/5 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Refresh Phrases Action */}
      <div className="px-4 py-3 border-b border-slate-900/8 bg-white flex items-center justify-between gap-2 shrink-0">
        <p className="text-xs text-[#64748B]">
          Practice and use these in chat
        </p>
        <button
          type="button"
          onClick={onRefreshPhrases}
          disabled={isGenerating}
          className="min-h-[36px] px-3 py-1.5 rounded-lg bg-[#EEF2FF] text-[#1E3A8A] hover:bg-[#E0E7FF] disabled:opacity-60 text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
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
              className={`rounded-xl p-3.5 border transition-colors ${
                phrase.memorized
                  ? 'bg-[#EEF2FF]/75 border-[#1E3A8A]/30'
                  : 'bg-white border-slate-900/10'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <span className="text-[11px] font-semibold text-[#64748B] tabular-nums">
                  0{index + 1}.
                </span>
                <button
                  type="button"
                  onClick={() => onToggleMemorized(phrase.id)}
                  className={`min-h-[32px] px-2.5 py-1 rounded-md text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                    phrase.memorized
                      ? 'bg-[#1E3A8A] text-white'
                      : 'bg-[#EEF2F7] text-[#475569] hover:bg-[#E2E8F0]'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{phrase.memorized ? 'Memorized' : 'Mark memorized'}</span>
                </button>
              </div>

              <p className="font-display text-[15.5px] font-semibold text-[#141B2D] leading-snug mb-1.5">
                {phrase.french}
              </p>

              <p className="text-[13px] font-medium text-[#1E3A8A] leading-snug mb-1">
                {phrase.meaning}
              </p>

              <p className="text-xs text-[#64748B] leading-relaxed mb-3">
                {phrase.usageNote}
              </p>

              <div className="flex items-center gap-2 pt-2 border-t border-slate-900/8">
                <button
                  type="button"
                  onClick={() =>
                    onPlayAudio({
                      id: audioId,
                      text: phrase.french,
                      level,
                      slow: level === 'beginner',
                    })
                  }
                  className={`flex-1 min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                    isPlaying
                      ? 'bg-[#1E3A8A] text-white'
                      : 'bg-[#EEF2F7] text-[#141B2D] hover:bg-[#E2E8F0]'
                  }`}
                >
                  {isLoading ? (
                    <Volume2 className="w-3.5 h-3.5 text-[#1E3A8A] animate-pulse" />
                  ) : isPlaying ? (
                    <Square className="w-3 h-3 fill-current" />
                  ) : (
                    <Volume2 className="w-3.5 h-3.5 text-[#1E3A8A]" />
                  )}
                  <span>{isPlaying ? 'Stop' : 'Listen'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => onUseInChat(phrase.french)}
                  className="flex-1 min-h-[38px] px-3 py-1.5 rounded-lg bg-[#EEF2F7] text-[#141B2D] hover:bg-[#E2E8F0] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <CornerDownLeft className="w-3.5 h-3.5 text-[#1E3A8A]" />
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
