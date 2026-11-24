import React, { useState } from 'react';
import { ArrowLeft, BookOpen, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { APP_LOGO_URL, LEVELS, SCENARIOS } from '../data/scenarios';
import { ProficiencyLevel, ScenarioId } from '../types';

interface ChatHeaderProps {
  scenarioId: ScenarioId;
  level: ProficiencyLevel;
  isTyping: boolean;
  autoSpeak: boolean;
  memorizedCount: number;
  totalPhrases: number;
  onBackToScenarios: () => void;
  onOpenPhrases: () => void;
  onToggleAutoSpeak: () => void;
  onResetChat: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  scenarioId,
  level,
  isTyping,
  autoSpeak,
  memorizedCount,
  totalPhrases,
  onBackToScenarios,
  onOpenPhrases,
  onToggleAutoSpeak,
  onResetChat,
}) => {
  const [confirmReset, setConfirmReset] = useState(false);
  const [imgError, setImgError] = useState(false);

  const scenario = SCENARIOS.find((s) => s.id === scenarioId) || SCENARIOS[0];
  const levelMeta = LEVELS.find((l) => l.id === level) || LEVELS[0];

  return (
    <header className="h-14 px-2 sm:px-4 bg-white/95 backdrop-blur-md border-b border-[#D5DFEC] flex items-center justify-between gap-2 shrink-0 sticky top-0 z-20">
      {/* Left Group: Back button (mobile) + Logo (desktop/tablet) + Title */}
      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
        <button
          type="button"
          onClick={onBackToScenarios}
          aria-label="Back to topics"
          className="md:hidden min-w-[40px] min-h-[40px] flex items-center justify-center rounded-xl text-[#4E607A] hover:bg-[#EDF2F8] active:bg-[#E1E9F4] transition-colors cursor-pointer shrink-0"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="relative shrink-0 hidden sm:block">
          {imgError ? (
            <div className="w-10 h-10 rounded-xl bg-[#1B4D8E] text-white font-bold text-xs flex items-center justify-center border border-[#1B4D8E]/20">
              EN
            </div>
          ) : (
            <img
              src={APP_LOGO_URL}
              alt="Learn English Talking"
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className="w-10 h-10 rounded-xl object-cover border border-[#D5DFEC] bg-white shadow-[0_1px_2px_rgba(15,27,45,0.06)]"
            />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h2 className="font-display text-[14.5px] sm:text-[15.5px] font-semibold text-[#0F1B2D] leading-tight truncate">
              {scenario.id === 'conversation' ? (
                <>
                  <span className="sm:hidden">Learn English</span>
                  <span className="hidden sm:inline">Learn English Talking</span>
                </>
              ) : (
                scenario.title
              )}
            </h2>
          </div>
          <p className="text-[11px] text-[#4E607A] leading-tight">
            {isTyping ? (
              <span className="text-[#1B4D8E] font-medium">Alex is replying</span>
            ) : (
              <span>
                {levelMeta.label} · English Practice with Alex
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Right Group: Auto-speak + 5 Phrases Drawer + Reset (No Gratis/Cloud buttons) */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          onClick={onToggleAutoSpeak}
          title={autoSpeak ? 'Auto voice enabled' : 'Auto voice muted'}
          aria-label={autoSpeak ? 'Mute auto voice' : 'Enable auto voice'}
          className={`min-h-[38px] sm:min-h-[40px] px-2.5 rounded-xl border transition-colors flex items-center gap-1.5 text-xs font-semibold whitespace-nowrap cursor-pointer ${
            autoSpeak
              ? 'bg-[#EBF2FC] border-[#1B4D8E]/25 text-[#1B4D8E]'
              : 'bg-white border-[#D5DFEC] text-[#4E607A] hover:bg-[#F6F8FC]'
          }`}
        >
          {autoSpeak ? (
            <Volume2 className="w-4 h-4 shrink-0" />
          ) : (
            <VolumeX className="w-4 h-4 shrink-0" />
          )}
          <span className="hidden sm:inline">{autoSpeak ? 'Voice' : 'Muted'}</span>
        </button>

        <button
          type="button"
          onClick={onOpenPhrases}
          className="xl:hidden min-h-[38px] sm:min-h-[40px] px-2.5 sm:px-3 rounded-xl bg-white border border-[#D5DFEC] text-[#1B4D8E] hover:bg-[#EBF2FC]/60 active:scale-[0.98] transition-all flex items-center gap-1 text-xs font-semibold whitespace-nowrap cursor-pointer"
        >
          <BookOpen className="w-4 h-4 shrink-0" />
          <span className="hidden sm:inline">5 Phrases</span>
          <span className="text-[#647690] tabular-nums">
            {memorizedCount}/{totalPhrases}
          </span>
        </button>

        {confirmReset ? (
          <div className="flex items-center gap-1 bg-white border border-[#D5DFEC] rounded-xl p-1">
            <button
              type="button"
              onClick={() => {
                onResetChat();
                setConfirmReset(false);
              }}
              className="px-2.5 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50 rounded-lg whitespace-nowrap cursor-pointer"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => setConfirmReset(false)}
              className="px-2.5 py-1.5 text-xs font-medium text-[#4E607A] hover:bg-[#EDF2F8] rounded-lg whitespace-nowrap cursor-pointer"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmReset(true)}
            title="New conversation"
            aria-label="New conversation"
            className="min-w-[38px] sm:min-w-[44px] min-h-[38px] sm:min-h-[44px] flex items-center justify-center rounded-xl text-[#4E607A] hover:bg-[#EDF2F8] active:bg-[#E1E9F4] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-[18px] h-[18px]" />
          </button>
        )}
      </div>
    </header>
  );
};
