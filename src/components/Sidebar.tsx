import React from 'react';
import { Briefcase, Download, MessageSquare, Plane, Stethoscope, Users } from 'lucide-react';
import { APP_LOGO_URL, LEVELS, SCENARIOS } from '../data/scenarios';
import { ConversationThread, ProficiencyLevel, ScenarioId } from '../types';

interface SidebarProps {
  activeScenario: ScenarioId;
  activeLevel: ProficiencyLevel;
  threads: Record<string, ConversationThread>;
  onSelectScenario: (id: ScenarioId) => void;
  onSelectLevel: (level: ProficiencyLevel) => void;
}

const SCENARIO_ICONS: Record<ScenarioId, React.ComponentType<{ className?: string }>> = {
  conversation: MessageSquare,
  airport: Plane,
  work: Briefcase,
  doctor: Stethoscope,
  meeting: Users,
};

export const Sidebar: React.FC<SidebarProps> = ({
  activeScenario,
  activeLevel,
  threads,
  onSelectScenario,
  onSelectLevel,
}) => {
  const [imgError, setImgError] = React.useState(false);
  const currentLevelMeta = LEVELS.find((l) => l.id === activeLevel) || LEVELS[0];

  return (
    <aside className="flex flex-col h-full w-full bg-[#F8FAF8] border-r border-[#DCE4DD] select-none">
      {/* Top App Bar */}
      <div className="h-14 px-4 bg-white border-b border-[#DCE4DD] flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          {imgError ? (
            <div className="w-9 h-9 rounded-xl bg-[#0F5E4B] text-white font-bold text-xs flex items-center justify-center border border-[#0F5E4B]/20 shrink-0">
              IT
            </div>
          ) : (
            <img
              src={APP_LOGO_URL}
              alt="Impara l'Italiano Parlando"
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className="w-9 h-9 rounded-xl object-cover border border-[#DCE4DD] shrink-0 bg-white shadow-[0_1px_2px_rgba(17,28,24,0.06)]"
            />
          )}
          <div className="min-w-0">
            <h1 className="text-[13.5px] sm:text-[14px] font-bold text-[#111C18] leading-tight">
              Impara l'Italiano Parlando
            </h1>
            <p className="text-[11px] text-[#4A5C55]">
              Pratica interattiva di conversazione
            </p>
          </div>
        </div>
        <a
          href="/api/logos/italian/download"
          download="impara-italiano-parlando-logo.jpg"
          title="Scarica il logo"
          aria-label="Scarica il logo"
          className="min-w-[36px] min-h-[36px] flex items-center justify-center rounded-xl border border-[#DCE4DD] bg-[#F8FAF8] text-[#0F5E4B] hover:bg-[#E8F4F0] transition-colors shrink-0"
        >
          <Download className="w-4 h-4" />
        </a>
      </div>

      {/* Level Selector (3 Levels) */}
      <div className="px-3.5 py-3 bg-[#EFF4F0] border-b border-[#DCE4DD] shrink-0">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-xs font-semibold text-[#111C18]">Il tuo livello</span>
          <span className="text-[11px] text-[#0F5E4B] font-medium">
            {currentLevelMeta.description}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-1 p-1 bg-[#E4ECE6] rounded-xl">
          {LEVELS.map((lvl) => {
            const isActive = lvl.id === activeLevel;
            return (
              <button
                key={lvl.id}
                type="button"
                onClick={() => onSelectLevel(lvl.id)}
                className={`min-h-[40px] px-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-white text-[#0F5E4B] shadow-[0_1px_2px_rgba(17,28,24,0.06)]'
                    : 'text-[#4A5C55] hover:text-[#111C18]'
                }`}
              >
                {lvl.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Scenarios List */}
      <div className="px-4 pt-3 pb-1.5 bg-[#F8FAF8] shrink-0">
        <p className="text-xs font-semibold text-[#4A5C55]">
          Scegli un argomento per fare pratica
        </p>
      </div>

      <div className="flex-1 overflow-y-auto chat-scroll bg-[#F8FAF8] px-2.5 pb-3 space-y-1.5">
        {SCENARIOS.map((scenario) => {
          const Icon = SCENARIO_ICONS[scenario.id];
          const isSelected = scenario.id === activeScenario;
          const threadKey = `${scenario.id}:${activeLevel}`;
          const thread = threads[threadKey];
          const lastMsg = thread?.messages?.[thread.messages.length - 1];
          const msgCount = thread?.messages?.length || 0;

          return (
            <button
              key={scenario.id}
              type="button"
              onClick={() => onSelectScenario(scenario.id)}
              className={`w-full text-left px-3 py-3 min-h-[70px] rounded-2xl flex items-center gap-3 border transition-colors cursor-pointer ${
                isSelected
                  ? 'bg-[#E8F4F0] border-[#0F5E4B]/20 shadow-[0_1px_2px_rgba(17,28,24,0.04)]'
                  : 'bg-transparent border-transparent hover:bg-[#E4ECE6]/55'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-black/5 ${scenario.accentBg} ${scenario.accentText}`}
              >
                <Icon className="w-5 h-5" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`text-[13.5px] font-semibold leading-snug ${
                      isSelected ? 'text-[#0F5E4B]' : 'text-[#111C18]'
                    }`}
                  >
                    {scenario.title}
                  </span>
                  {lastMsg ? (
                    <span className="text-[11px] text-[#64766E] tabular-nums shrink-0">
                      {lastMsg.timestamp}
                    </span>
                  ) : null}
                </div>

                <div className="flex items-center justify-between gap-2 mt-0.5">
                  <p className="text-xs text-[#64766E] leading-snug">
                    {lastMsg ? lastMsg.text : scenario.subtitle}
                  </p>
                  {msgCount > 0 && (
                    <span className="text-[11px] font-semibold text-[#0F5E4B] tabular-nums shrink-0">
                      {msgCount}
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
};
