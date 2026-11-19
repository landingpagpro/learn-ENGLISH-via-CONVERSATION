import React, { useState } from 'react';
import { ArrowLeft, BookOpen, RotateCcw, Volume2, VolumeX, Wifi } from 'lucide-react';
import { APP_LOGO_URL, LEVELS, SCENARIOS } from '../data/scenarios';
import { ProficiencyLevel, ScenarioId } from '../types';

interface ChatHeaderProps {
  scenarioId: ScenarioId;
  level: ProficiencyLevel;
  isTyping: boolean;
  autoSpeak: boolean;
  liteMode: boolean;
  memorizedCount: number;
  totalPhrases: number;
  onBackToScenarios: () => void;
  onOpenPhrases: () => void;
  onToggleAutoSpeak: () => void;
  onToggleLiteMode: () => void;
  onResetChat: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  scenarioId,
  level,
  isTyping,
  autoSpeak,
  liteMode,
  memorizedCount,
  totalPhrases,
  onBackToScenarios,
  onOpenPhrases,
  onToggleAutoSpeak,
  onToggleLiteMode,
  onResetChat,
}) => {
  const [confirmReset, setConfirmReset] = useState(false);
  const [imgError, setImgError] = useState(false);

  const scenario = SCENARIOS.find((s) => s.id === scenarioId) || SCENARIOS[0];
  const levelMeta = LEVELS.find((l) => l.id === level) || LEVELS[0];

  return (
    <header className="h-14 px-2 sm:px-4 bg-[#F0F2F5] border-b border-black/10 flex items-center justify-between gap-2 shrink-0 sticky top-0 z-20">
      {/* Left Group: Back button (mobile) + Logo + Title */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <button
          type="button"
          onClick={onBackToScenarios}
          aria-label="Back to topics"
          className="md:hidden min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full text-[#54656F] hover:bg-black/5 active:bg-black/10 transition-colors cursor-pointer shrink-0"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="relative shrink-0">
          {imgError ? (
            <div className="w-10 h-10 rounded-xl bg-[#008069] text-white font-bold text-xs flex items-center justify-center border border-black/10">
              LE
            </div>
          ) : (
            <img
              src={APP_LOGO_URL}
              alt="Learn English via Conversation"
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className="w-10 h-10 rounded-xl object-cover border border-black/10 bg-white"
            />
          )}
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <h2 className="text-[14.5px] font-semibold text-[#111B21] truncate">
              {scenario.id === 'conversation' ? 'Learn English via Conversation' : scenario.title}
            </h2>
          </div>
          <p className="text-[11px] text-[#667781] truncate">
            {isTyping ? (
              <span className="text-[#008069] font-medium">Replying</span>
            ) : (
              <span>
                {levelMeta.label} · English Practice
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Right Group: Lite mode + Auto-speak + 5 Phrases Drawer + Reset */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          onClick={onToggleLiteMode}
          title={liteMode ? 'Lite mode enabled (local speech, low data)' : 'Enable Lite mode for slow connections'}
          aria-label="Toggle Lite mode"
          className={`min-h-[40px] px-2.5 rounded-xl border transition-colors flex items-center gap-1 text-xs font-semibold whitespace-nowrap cursor-pointer ${
            liteMode
              ? 'bg-amber-50 border-amber-300 text-amber-800'
              : 'bg-white border-black/10 text-[#667781] hover:bg-[#F7F8FA]'
          }`}
        >
          <Wifi className="w-3.5 h-3.5 shrink-0" />
          <span className="hidden sm:inline">{liteMode ? 'Lite' : 'HD'}</span>
        </button>

        <button
          type="button"
          onClick={onToggleAutoSpeak}
          title={autoSpeak ? 'Auto-speak enabled' : 'Auto-speak muted'}
          aria-label={autoSpeak ? 'Mute auto-speak' : 'Enable auto-speak'}
          className={`min-h-[40px] px-2.5 rounded-xl border transition-colors flex items-center gap-1.5 text-xs font-semibold whitespace-nowrap cursor-pointer ${
            autoSpeak
              ? 'bg-[#E7FCE3] border-[#008069]/25 text-[#008069]'
              : 'bg-white border-black/10 text-[#667781] hover:bg-[#F7F8FA]'
          }`}
        >
          {autoSpeak ? (
            <Volume2 className="w-4 h-4 shrink-0" />
          ) : (
            <VolumeX className="w-4 h-4 shrink-0" />
          )}
          <span className="hidden sm:inline">{autoSpeak ? 'Auto' : 'Muted'}</span>
        </button>

        <button
          type="button"
          onClick={onOpenPhrases}
          className="xl:hidden min-h-[40px] px-2.5 sm:px-3 rounded-xl bg-white border border-black/10 text-[#008069] hover:bg-[#F7F8FA] active:scale-[0.98] transition-all flex items-center gap-1.5 text-xs font-semibold whitespace-nowrap cursor-pointer"
        >
          <BookOpen className="w-4 h-4 shrink-0" />
          <span>5 Phrases</span>
          <span className="text-[#667781] tabular-nums">
            {memorizedCount}/{totalPhrases}
          </span>
        </button>

        {confirmReset ? (
          <div className="flex items-center gap-1 bg-white border border-black/10 rounded-xl p-1">
            <button
              type="button"
              onClick={() => {
                onResetChat();
                setConfirmReset(false);
              }}
              className="px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg whitespace-nowrap cursor-pointer"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => setConfirmReset(false)}
              className="px-2.5 py-1.5 text-xs font-medium text-[#54656F] hover:bg-black/5 rounded-lg whitespace-nowrap cursor-pointer"
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
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full text-[#54656F] hover:bg-black/5 active:bg-black/10 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-[18px] h-[18px]" />
          </button>
        )}
      </div>
    </header>
  );
};
