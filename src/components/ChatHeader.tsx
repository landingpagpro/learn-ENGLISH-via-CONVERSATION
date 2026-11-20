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
    <header className="h-14 px-2 sm:px-4 bg-white border-b border-slate-200 flex items-center justify-between gap-2 shrink-0 sticky top-0 z-20">
      {/* Left Group: Back button (mobile) + Logo (desktop/tablet) + Title */}
      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
        <button
          type="button"
          onClick={onBackToScenarios}
          aria-label="Back to topics"
          className="md:hidden min-w-[40px] min-h-[40px] flex items-center justify-center rounded-lg text-[#475569] hover:bg-black/5 active:bg-black/10 transition-colors cursor-pointer shrink-0"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="relative shrink-0 hidden sm:block">
          {imgError ? (
            <div className="w-10 h-10 rounded-lg bg-[#1E40AF] text-white font-bold text-xs flex items-center justify-center border border-[#1E40AF]/20">
              LE
            </div>
          ) : (
            <img
              src={APP_LOGO_URL}
              alt="Learn English via Conversation"
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className="w-10 h-10 rounded-lg object-cover border border-slate-200 bg-white"
            />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            {scenario.id === 'conversation' ? (
              <h2 className="text-[14.5px] sm:text-[15px] font-semibold text-[#0F172A] leading-tight">
                <span className="sm:hidden">Learn English</span>
                <span className="hidden sm:inline">Learn English via Conversation</span>
              </h2>
            ) : (
              <h2 className="text-[14.5px] sm:text-[15px] font-semibold text-[#0F172A] leading-tight">
                {scenario.title}
              </h2>
            )}
          </div>
          <p className="text-[11px] text-[#475569] leading-tight">
            {isTyping ? (
              <span className="text-[#1E40AF] font-medium">Replying</span>
            ) : scenario.id === 'conversation' ? (
              <>
                <span className="sm:hidden">via Conversation · {levelMeta.label}</span>
                <span className="hidden sm:inline">{levelMeta.label} · English Practice</span>
              </>
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
          title={liteMode ? 'Lite mode active (local voice, low data)' : 'Enable Lite mode for slow connections'}
          aria-label="Toggle Lite mode"
          className={`min-h-[38px] sm:min-h-[40px] px-2 sm:px-2.5 rounded-lg border transition-colors flex items-center gap-1 text-xs font-semibold whitespace-nowrap cursor-pointer ${
            liteMode
              ? 'bg-amber-50 border-amber-300 text-amber-800'
              : 'bg-white border-slate-200 text-[#475569] hover:bg-[#F8FAFC]'
          }`}
        >
          <Wifi className="w-3.5 h-3.5 shrink-0" />
          <span className="hidden sm:inline">{liteMode ? 'Lite' : 'HD'}</span>
        </button>

        <button
          type="button"
          onClick={onToggleAutoSpeak}
          title={autoSpeak ? 'Auto-speak active' : 'Auto-speak muted'}
          aria-label={autoSpeak ? 'Mute auto-speak' : 'Enable auto-speak'}
          className={`min-h-[38px] sm:min-h-[40px] px-2 sm:px-2.5 rounded-lg border transition-colors flex items-center gap-1.5 text-xs font-semibold whitespace-nowrap cursor-pointer ${
            autoSpeak
              ? 'bg-[#EFF6FF] border-[#1E40AF]/25 text-[#1E40AF]'
              : 'bg-white border-slate-200 text-[#475569] hover:bg-[#F8FAFC]'
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
          className="xl:hidden min-h-[38px] sm:min-h-[40px] px-2 sm:px-3 rounded-lg bg-white border border-slate-200 text-[#1E40AF] hover:bg-[#F8FAFC] active:scale-[0.98] transition-all flex items-center gap-1 text-xs font-semibold whitespace-nowrap cursor-pointer"
        >
          <BookOpen className="w-4 h-4 shrink-0" />
          <span className="hidden sm:inline">5 Phrases</span>
          <span className="text-[#64748B] tabular-nums">
            {memorizedCount}/{totalPhrases}
          </span>
        </button>

        {confirmReset ? (
          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-1">
            <button
              type="button"
              onClick={() => {
                onResetChat();
                setConfirmReset(false);
              }}
              className="px-2.5 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50 rounded-md whitespace-nowrap cursor-pointer"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => setConfirmReset(false)}
              className="px-2.5 py-1.5 text-xs font-medium text-[#475569] hover:bg-black/5 rounded-md whitespace-nowrap cursor-pointer"
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
            className="min-w-[38px] sm:min-w-[44px] min-h-[38px] sm:min-h-[44px] flex items-center justify-center rounded-lg text-[#475569] hover:bg-black/5 active:bg-black/10 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-[18px] h-[18px]" />
          </button>
        )}
      </div>
    </header>
  );
};
