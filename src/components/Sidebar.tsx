import React from 'react';
import { Briefcase, MessageSquare, Plane, Stethoscope, Users } from 'lucide-react';
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
    <aside className="flex flex-col h-full w-full bg-[#FCFBF8] border-r border-slate-900/10 select-none">
      {/* Top App Bar */}
      <div className="h-14 px-4 bg-[#EEF2F7] border-b border-[#1E3A8A]/10 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          {imgError ? (
            <div className="w-9 h-9 rounded-lg bg-[#1E3A8A] text-white font-display font-bold text-xs flex items-center justify-center border border-[#1E3A8A]/20 shrink-0">
              LF
            </div>
          ) : (
            <img
              src={APP_LOGO_URL}
              alt="Français par la conversation"
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className="w-9 h-9 rounded-lg object-cover border border-[#1E3A8A]/15 shrink-0 bg-white"
            />
          )}
          <div className="min-w-0">
            <h1 className="font-display text-[15px] font-bold text-[#141B2D] leading-tight truncate">
              Français par la conversation
            </h1>
            <p className="text-[11px] text-[#475569] truncate">
              Parisian Speaking Studio
            </p>
          </div>
        </div>
      </div>

      {/* Level Selector (3 Levels) */}
      <div className="px-3.5 py-3 bg-[#F6F4EF] border-b border-slate-900/8 shrink-0">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-xs font-semibold text-[#141B2D]">Your Level</span>
          <span className="text-[11px] text-[#1E3A8A] font-medium truncate">
            {currentLevelMeta.description}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-1 p-1 bg-[#E5E9F0] rounded-lg">
          {LEVELS.map((lvl) => {
            const isActive = lvl.id === activeLevel;
            return (
              <button
                key={lvl.id}
                type="button"
                onClick={() => onSelectLevel(lvl.id)}
                className={`min-h-[40px] px-2 py-1.5 rounded-md text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-white text-[#1E3A8A] shadow-2xs'
                    : 'text-[#475569] hover:text-[#141B2D]'
                }`}
              >
                {lvl.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Scenarios List */}
      <div className="px-4 pt-3 pb-1.5 bg-[#FCFBF8] shrink-0">
        <p className="text-xs font-semibold text-[#475569]">
          Choose a topic to practice
        </p>
      </div>

      <div className="flex-1 overflow-y-auto chat-scroll bg-[#FCFBF8] px-2.5 pb-3 space-y-1">
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
              className={`w-full text-left px-3 py-3 min-h-[70px] rounded-xl flex items-center gap-3 border transition-colors cursor-pointer ${
                isSelected
                  ? 'bg-[#EEF2FF] border-[#1E3A8A]/20'
                  : 'bg-transparent border-transparent hover:bg-[#F3EFE6]/70'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border border-black/5 ${scenario.accentBg} ${scenario.accentText}`}
              >
                <Icon className="w-5 h-5" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`text-[14px] font-semibold truncate ${
                      isSelected ? 'text-[#1E3A8A]' : 'text-[#141B2D]'
                    }`}
                  >
                    {scenario.title}
                  </span>
                  {lastMsg ? (
                    <span className="text-[11px] text-[#64748B] tabular-nums shrink-0">
                      {lastMsg.timestamp}
                    </span>
                  ) : null}
                </div>

                <div className="flex items-center justify-between gap-2 mt-0.5">
                  <p className="text-xs text-[#64748B] truncate">
                    {lastMsg ? lastMsg.text : scenario.subtitle}
                  </p>
                  {msgCount > 0 && (
                    <span className="text-[11px] font-semibold text-[#1E3A8A] tabular-nums shrink-0">
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
