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
    <aside className="flex flex-col h-full w-full bg-[#F6F8FC] border-r border-[#D5DFEC] select-none">
      {/* Top App Bar */}
      <div className="h-14 px-4 bg-white border-b border-[#D5DFEC] flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          {imgError ? (
            <div className="w-9 h-9 rounded-xl bg-[#1B4D8E] text-white font-bold text-xs flex items-center justify-center border border-[#1B4D8E]/20 shrink-0">
              EN
            </div>
          ) : (
            <img
              src={APP_LOGO_URL}
              alt="Learn English Talking"
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className="w-9 h-9 rounded-xl object-cover border border-[#D5DFEC] shrink-0 bg-white shadow-[0_1px_2px_rgba(15,27,45,0.06)]"
            />
          )}
          <div className="min-w-0">
            <h1 className="font-display text-[14.5px] font-bold text-[#0F1B2D] leading-tight">
              Learn English Talking
            </h1>
            <p className="text-[11px] text-[#4E607A]">
              Interactive speaking practice
            </p>
          </div>
        </div>
        <a
          href="/api/logos/english/download"
          download="learn-english-talking-logo.jpg"
          title="Download logo"
          aria-label="Download logo"
          className="min-w-[36px] min-h-[36px] flex items-center justify-center rounded-xl border border-[#D5DFEC] bg-[#F6F8FC] text-[#1B4D8E] hover:bg-[#EBF2FC] transition-colors shrink-0"
        >
          <Download className="w-4 h-4" />
        </a>
      </div>

      {/* Level Selector (3 Levels) */}
      <div className="px-3.5 py-3 bg-[#EDF2F8] border-b border-[#D5DFEC] shrink-0">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-xs font-semibold text-[#0F1B2D]">Your level</span>
          <span className="text-[11px] text-[#1B4D8E] font-medium">
            {currentLevelMeta.description}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-1 p-1 bg-[#E1E9F4] rounded-xl">
          {LEVELS.map((lvl) => {
            const isActive = lvl.id === activeLevel;
            return (
              <button
                key={lvl.id}
                type="button"
                onClick={() => onSelectLevel(lvl.id)}
                className={`min-h-[40px] px-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-white text-[#1B4D8E] shadow-[0_1px_2px_rgba(15,27,45,0.08)]'
                    : 'text-[#4E607A] hover:text-[#0F1B2D]'
                }`}
              >
                {lvl.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Scenarios List */}
      <div className="px-4 pt-3 pb-1.5 bg-[#F6F8FC] shrink-0">
        <p className="text-xs font-semibold text-[#4E607A]">
          Choose a topic to practice
        </p>
      </div>

      <div className="flex-1 overflow-y-auto chat-scroll bg-[#F6F8FC] px-2.5 pb-3 space-y-1.5">
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
                  ? 'bg-[#EBF2FC] border-[#1B4D8E]/25 shadow-[0_1px_2px_rgba(15,27,45,0.04)]'
                  : 'bg-transparent border-transparent hover:bg-[#E7EEF7]/65'
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
                      isSelected ? 'text-[#1B4D8E]' : 'text-[#0F1B2D]'
                    }`}
                  >
                    {scenario.title}
                  </span>
                  {lastMsg ? (
                    <span className="text-[11px] text-[#647690] tabular-nums shrink-0">
                      {lastMsg.timestamp}
                    </span>
                  ) : null}
                </div>

                <div className="flex items-center justify-between gap-2 mt-0.5">
                  <p className="text-xs text-[#647690] leading-snug">
                    {lastMsg ? lastMsg.text : scenario.subtitle}
                  </p>
                  {msgCount > 0 && (
                    <span className="text-[11px] font-semibold text-[#1B4D8E] tabular-nums shrink-0">
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
