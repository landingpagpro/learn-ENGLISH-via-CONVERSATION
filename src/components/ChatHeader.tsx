import React, { useState } from 'react';
import { ArrowLeft, BookOpen, Cpu, RotateCcw, Volume2, VolumeX, Wifi } from 'lucide-react';
import { APP_LOGO_URL, LEVELS, SCENARIOS } from '../data/scenarios';
import { ProficiencyLevel, ScenarioId } from '../types';

interface ChatHeaderProps {
  scenarioId: ScenarioId;
  level: ProficiencyLevel;
  isTyping: boolean;
  autoSpeak: boolean;
  liteMode: boolean;
  keylessMode: boolean;
  memorizedCount: number;
  totalPhrases: number;
  onBackToScenarios: () => void;
  onOpenPhrases: () => void;
  onToggleAutoSpeak: () => void;
  onToggleLiteMode: () => void;
  onToggleKeylessMode: () => void;
  onResetChat: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  scenarioId,
  level,
  isTyping,
  autoSpeak,
  liteMode,
  keylessMode,
  memorizedCount,
  totalPhrases,
  onBackToScenarios,
  onOpenPhrases,
  onToggleAutoSpeak,
  onToggleLiteMode,
  onToggleKeylessMode,
  onResetChat,
}) => {
  const [confirmReset, setConfirmReset] = useState(false);
  const [imgError, setImgError] = useState(false);

  const scenario = SCENARIOS.find((s) => s.id === scenarioId) || SCENARIOS[0];
  const levelMeta = LEVELS.find((l) => l.id === level) || LEVELS[0];

  return (
    <header className="h-14 px-2 sm:px-4 bg-white/95 backdrop-blur-md border-b border-[#DCE4DD] flex items-center justify-between gap-2 shrink-0 sticky top-0 z-20">
      {/* Left Group: Back button (mobile) + Logo (desktop/tablet) + Title */}
      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
        <button
          type="button"
          onClick={onBackToScenarios}
          aria-label="Torna agli argomenti"
          className="md:hidden min-w-[40px] min-h-[40px] flex items-center justify-center rounded-xl text-[#4A5C55] hover:bg-[#EFF4F0] active:bg-[#E4ECE6] transition-colors cursor-pointer shrink-0"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="relative shrink-0 hidden sm:block">
          {imgError ? (
            <div className="w-10 h-10 rounded-xl bg-[#0F5E4B] text-white font-bold text-xs flex items-center justify-center border border-[#0F5E4B]/20">
              IT
            </div>
          ) : (
            <img
              src={APP_LOGO_URL}
              alt="Impara l'Italiano Parlando"
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className="w-10 h-10 rounded-xl object-cover border border-[#DCE4DD] bg-white shadow-[0_1px_2px_rgba(17,28,24,0.06)]"
            />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            {scenario.id === 'conversation' ? (
              <h2 className="text-[14.5px] sm:text-[15px] font-semibold text-[#111C18] leading-tight">
                <span className="sm:hidden">Impara l'Italiano</span>
                <span className="hidden sm:inline">Impara l'Italiano Parlando</span>
              </h2>
            ) : (
              <h2 className="text-[14.5px] sm:text-[15px] font-semibold text-[#111C18] leading-tight">
                {scenario.title}
              </h2>
            )}
          </div>
          <p className="text-[11px] text-[#4A5C55] leading-tight">
            {isTyping ? (
              <span className="text-[#0F5E4B] font-medium">Sta rispondendo</span>
            ) : scenario.id === 'conversation' ? (
              <>
                <span className="sm:hidden">Parlando · {levelMeta.label}</span>
                <span className="hidden sm:inline">{levelMeta.label} · Pratica in Italiano</span>
              </>
            ) : (
              <span>
                {levelMeta.label} · Pratica in Italiano
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Right Group: Keyless mode + Lite mode + Auto-speak + 5 Phrases Drawer + Reset */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          onClick={onToggleKeylessMode}
          title={
            keylessMode
              ? 'Modalità gratuita senza chiave attiva (sempre disponibile)'
              : 'Passa alla modalità gratuita senza chiave API'
          }
          aria-label="Attiva o disattiva modalità gratuita senza chiave"
          className={`min-h-[38px] sm:min-h-[40px] px-2 sm:px-2.5 rounded-xl border transition-colors flex items-center gap-1 text-xs font-semibold whitespace-nowrap cursor-pointer ${
            keylessMode
              ? 'bg-[#E8F4F0] border-[#0F5E4B]/35 text-[#0F5E4B]'
              : 'bg-white border-[#DCE4DD] text-[#4A5C55] hover:bg-[#F8FAF8]'
          }`}
        >
          <Cpu className="w-3.5 h-3.5 shrink-0" />
          <span>{keylessMode ? 'Gratis' : 'Cloud'}</span>
        </button>

        <button
          type="button"
          onClick={onToggleLiteMode}
          title={liteMode ? 'Voce gratuita del browser attiva' : 'Attiva voce gratuita del browser'}
          aria-label="Attiva o disattiva modalità leggera"
          className={`min-h-[38px] sm:min-h-[40px] px-2 sm:px-2.5 rounded-xl border transition-colors flex items-center gap-1 text-xs font-semibold whitespace-nowrap cursor-pointer ${
            liteMode
              ? 'bg-amber-50 border-amber-300 text-amber-900'
              : 'bg-white border-[#DCE4DD] text-[#4A5C55] hover:bg-[#F8FAF8]'
          }`}
        >
          <Wifi className="w-3.5 h-3.5 shrink-0" />
          <span className="hidden sm:inline">{liteMode ? 'Locale' : 'HD'}</span>
        </button>

        <button
          type="button"
          onClick={onToggleAutoSpeak}
          title={autoSpeak ? 'Voce automatica attiva' : 'Voce automatica disattivata'}
          aria-label={autoSpeak ? 'Disattiva voce automatica' : 'Attiva voce automatica'}
          className={`min-h-[38px] sm:min-h-[40px] px-2 sm:px-2.5 rounded-xl border transition-colors flex items-center gap-1.5 text-xs font-semibold whitespace-nowrap cursor-pointer ${
            autoSpeak
              ? 'bg-[#E8F4F0] border-[#0F5E4B]/25 text-[#0F5E4B]'
              : 'bg-white border-[#DCE4DD] text-[#4A5C55] hover:bg-[#F8FAF8]'
          }`}
        >
          {autoSpeak ? (
            <Volume2 className="w-4 h-4 shrink-0" />
          ) : (
            <VolumeX className="w-4 h-4 shrink-0" />
          )}
          <span className="hidden sm:inline">{autoSpeak ? 'Auto' : 'Muto'}</span>
        </button>

        <button
          type="button"
          onClick={onOpenPhrases}
          className="xl:hidden min-h-[38px] sm:min-h-[40px] px-2 sm:px-3 rounded-xl bg-white border border-[#DCE4DD] text-[#0F5E4B] hover:bg-[#E8F4F0]/60 active:scale-[0.98] transition-all flex items-center gap-1 text-xs font-semibold whitespace-nowrap cursor-pointer"
        >
          <BookOpen className="w-4 h-4 shrink-0" />
          <span className="hidden sm:inline">5 Frasi</span>
          <span className="text-[#64766E] tabular-nums">
            {memorizedCount}/{totalPhrases}
          </span>
        </button>

        {confirmReset ? (
          <div className="flex items-center gap-1 bg-white border border-[#DCE4DD] rounded-xl p-1">
            <button
              type="button"
              onClick={() => {
                onResetChat();
                setConfirmReset(false);
              }}
              className="px-2.5 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50 rounded-lg whitespace-nowrap cursor-pointer"
            >
              Svuota
            </button>
            <button
              type="button"
              onClick={() => setConfirmReset(false)}
              className="px-2.5 py-1.5 text-xs font-medium text-[#4A5C55] hover:bg-[#EFF4F0] rounded-lg whitespace-nowrap cursor-pointer"
            >
              Annulla
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmReset(true)}
            title="Nuova conversazione"
            aria-label="Nuova conversazione"
            className="min-w-[38px] sm:min-w-[44px] min-h-[38px] sm:min-h-[44px] flex items-center justify-center rounded-xl text-[#4A5C55] hover:bg-[#EFF4F0] active:bg-[#E4ECE6] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-[18px] h-[18px]" />
          </button>
        )}
      </div>
    </header>
  );
};
