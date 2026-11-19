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
    <header className="h-14 px-2 sm:px-4 bg-white/95 backdrop-blur-md border-b border-slate-200/80 flex items-center justify-between gap-2 shrink-0 sticky top-0 z-20">
      {/* Left Group: Back button (mobile) + Logo + Title */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <button
          type="button"
          onClick={onBackToScenarios}
          aria-label="Back to topics"
          className="md:hidden min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full text-slate-600 hover:bg-slate-100 active:bg-slate-200 transition-colors cursor-pointer shrink-0"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="relative shrink-0">
          {imgError ? (
            <div className="w-10 h-10 rounded-xl bg-[#1E3A8A] text-white font-display font-bold text-xs flex items-center justify-center border border-slate-200">
              LI
            </div>
          ) : (
            <img
              src={APP_LOGO_URL}
              alt="Learn Italian via Conversation"
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className="w-10 h-10 rounded-xl object-cover border border-slate-200/80 bg-white"
            />
          )}
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <h2 className="font-display text-[14.5px] font-bold text-slate-900 truncate">
              {scenario.id === 'conversation' ? 'Learn Italian via Conversation' : scenario.title}
            </h2>
          </div>
          <p className="text-[11px] text-slate-500 truncate">
            {isTyping ? (
              <span className="text-[#1E3A8A] font-semibold">Replying</span>
            ) : (
              <span>
                {levelMeta.label} · Italian Practice
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
          title={liteMode ? 'Lite mode enabled (instant local Italian speech)' : 'Enable Lite mode for instant speech'}
          aria-label="Toggle Lite mode"
          className={`min-h-[40px] px-2.5 rounded-xl border transition-colors flex items-center gap-1 text-xs font-semibold whitespace-nowrap cursor-pointer ${
            liteMode
              ? 'bg-amber-50 border-amber-300 text-amber-800'
              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
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
              ? 'bg-blue-50 border-[#1E3A8A]/25 text-[#1E3A8A]'
              : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
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
          className="xl:hidden min-h-[40px] px-2.5 sm:px-3 rounded-xl bg-white border border-slate-200 text-[#1E3A8A] hover:bg-blue-50/60 active:scale-[0.98] transition-all flex items-center gap-1.5 text-xs font-semibold whitespace-nowrap cursor-pointer"
        >
          <BookOpen className="w-4 h-4 shrink-0" />
          <span>5 Phrases</span>
          <span className="text-slate-500 tabular-nums">
            {memorizedCount}/{totalPhrases}
          </span>
        </button>

        {confirmReset ? (
          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1">
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
              className="px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg whitespace-nowrap cursor-pointer"
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
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 active:bg-slate-200 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-[18px] h-[18px]" />
          </button>
        )}
      </div>
    </header>
  );
};
