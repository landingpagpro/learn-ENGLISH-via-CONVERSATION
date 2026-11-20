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
    <aside className="flex flex-col h-full w-full bg-[#F8FAFC] border-r border-slate-200 select-none">
      {/* Top App Bar */}
      <div className="h-14 px-4 bg-white border-b border-slate-200 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          {imgError ? (
            <div className="w-9 h-9 rounded-lg bg-[#1E40AF] text-white font-bold text-xs flex items-center justify-center border border-[#1E40AF]/20 shrink-0">
              LE
            </div>
          ) : (
            <img
              src={APP_LOGO_URL}
              alt="Learn English via Conversation"
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className="w-9 h-9 rounded-lg object-cover border border-slate-200 shrink-0 bg-white"
            />
          )}
          <div className="min-w-0">
            <h1 className="text-[15px] font-bold text-[#0F172A] leading-tight truncate">
              Learn English via Conversation
            </h1>
            <p className="text-[11px] text-[#475569] truncate">
              Interactive Speaking Practice
            </p>
          </div>
        </div>
      </div>

      {/* Level Selector (3 Levels) */}
      <div className="px-3.5 py-3 bg-[#EEF2F6] border-b border-slate-200 shrink-0">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-xs font-semibold text-[#0F172A]">Your Level</span>
          <span className="text-[11px] text-[#1E40AF] font-medium truncate">
            {currentLevelMeta.description}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-1 p-1 bg-[#E2E8F0] rounded-lg">
          {LEVELS.map((lvl) => {
            const isActive = lvl.id === activeLevel;
            return (
              <button
                key={lvl.id}
                type="button"
                onClick={() => onSelectLevel(lvl.id)}
                className={`min-h-[40px] px-2 py-1.5 rounded-md text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-white text-[#1E40AF] shadow-2xs'
                    : 'text-[#475569] hover:text-[#0F172A]'
                }`}
              >
                {lvl.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Scenarios List */}
      <div className="px-4 pt-3 pb-1.5 bg-[#F8FAFC] shrink-0">
        <p className="text-xs font-semibold text-[#475569]">
          Choose a topic to practice
        </p>
      </div>

      <div className="flex-1 overflow-y-auto chat-scroll bg-[#F8FAFC] px-2.5 pb-3 space-y-1">
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
                  ? 'bg-[#EFF6FF] border-[#1E40AF]/20'
                  : 'bg-transparent border-transparent hover:bg-slate-200/50'
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
                      isSelected ? 'text-[#1E40AF]' : 'text-[#0F172A]'
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
                    <span className="text-[11px] font-semibold text-[#1E40AF] tabular-nums shrink-0">
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
