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
    <aside className="flex flex-col h-full w-full bg-white border-r border-slate-200/80 select-none">
      {/* Top App Bar */}
      <div className="h-14 px-4 bg-[#F8FAFC] border-b border-slate-200/80 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          {imgError ? (
            <div className="w-9 h-9 rounded-xl bg-[#1E3A8A] text-white font-display font-bold text-xs flex items-center justify-center border border-slate-200 shrink-0">
              LI
            </div>
          ) : (
            <img
              src={APP_LOGO_URL}
              alt="Learn Italian via Conversation"
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className="w-9 h-9 rounded-xl object-cover border border-slate-200/80 shrink-0 bg-white"
            />
          )}
          <div className="min-w-0">
            <h1 className="font-display text-[14.5px] font-bold text-slate-900 leading-tight truncate">
              Learn Italian via Conversation
            </h1>
            <p className="text-[11px] text-slate-500 truncate">
              Interactive Speaking Practice
            </p>
          </div>
        </div>
      </div>

      {/* Level Selector (3 Levels) */}
      <div className="px-3.5 py-3 bg-[#F8FAFC] border-b border-slate-200/80 shrink-0">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-xs font-semibold text-slate-800">Your Level</span>
          <span className="text-[11px] text-[#1E3A8A] font-medium truncate">
            {currentLevelMeta.description}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-1 p-1 bg-slate-200/75 rounded-xl">
          {LEVELS.map((lvl) => {
            const isActive = lvl.id === activeLevel;
            return (
              <button
                key={lvl.id}
                type="button"
                onClick={() => onSelectLevel(lvl.id)}
                className={`min-h-[40px] px-2 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-white text-[#1E3A8A] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {lvl.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Scenarios List */}
      <div className="px-4 pt-3.5 pb-1.5 bg-white shrink-0">
        <p className="text-xs font-semibold text-slate-500">
          Choose a topic to practice
        </p>
      </div>

      <div className="flex-1 overflow-y-auto chat-scroll bg-white">
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
              className={`w-full text-left px-4 py-3.5 min-h-[72px] flex items-center gap-3.5 border-b border-slate-100 transition-colors cursor-pointer ${
                isSelected ? 'bg-blue-50/70' : 'hover:bg-slate-50'
              }`}
            >
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${scenario.accentBg} ${scenario.accentText}`}
              >
                <Icon className="w-5 h-5" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`text-[14.5px] font-semibold truncate ${
                      isSelected ? 'text-[#1E3A8A]' : 'text-slate-900'
                    }`}
                  >
                    {scenario.title}
                  </span>
                  {lastMsg ? (
                    <span className="text-[11px] text-slate-400 tabular-nums shrink-0">
                      {lastMsg.timestamp}
                    </span>
                  ) : null}
                </div>

                <div className="flex items-center justify-between gap-2 mt-0.5">
                  <p className="text-xs text-slate-500 truncate">
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
