import React, { useMemo, useState } from 'react';
import { Check, Globe, Search, X } from 'lucide-react';
import { TranslationLanguage, WORLD_LANGUAGES } from '../data/languages';

interface LanguagePickerModalProps {
  isOpen: boolean;
  selectedLanguage: TranslationLanguage | null;
  onSelect: (lang: TranslationLanguage) => void;
  onClose: () => void;
}

export const LanguagePickerModal: React.FC<LanguagePickerModalProps> = ({
  isOpen,
  selectedLanguage,
  onSelect,
  onClose,
}) => {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return WORLD_LANGUAGES;
    return WORLD_LANGUAGES.filter(
      (lang) =>
        lang.name.toLowerCase().includes(q) ||
        lang.nativeName.toLowerCase().includes(q) ||
        lang.code.toLowerCase().includes(q)
    );
  }, [query]);

  if (!isOpen) return null;

  const trimmedQuery = query.trim();
  const hasExactMatch = filtered.some(
    (l) =>
      l.name.toLowerCase() === trimmedQuery.toLowerCase() ||
      l.nativeName.toLowerCase() === trimmedQuery.toLowerCase()
  );

  const handleCustomSelect = () => {
    if (!trimmedQuery) return;
    onSelect({
      code: `custom:${trimmedQuery.toLowerCase()}`,
      name: trimmedQuery,
      nativeName: trimmedQuery,
      dir: /[\u0600-\u06FF\u0590-\u05FF]/.test(trimmedQuery) ? 'rtl' : 'ltr',
    });
    setQuery('');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#141B2D]/45 backdrop-blur-[2px] p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-md h-[82dvh] sm:h-[540px] bg-white rounded-t-2xl sm:rounded-xl shadow-2xl flex flex-col overflow-hidden border border-slate-900/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-4 py-3 bg-[#EEF2F7] border-b border-[#1E3A8A]/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-[#1E3A8A]" />
            <h3 className="font-display text-[15px] font-bold text-[#141B2D]">
              Choose translation language
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="min-w-[44px] min-h-[44px] -mr-2 flex items-center justify-center rounded-lg text-[#475569] hover:bg-black/5 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Box */}
        <div className="p-3 border-b border-slate-900/8 bg-white shrink-0">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-[#64748B] absolute left-3 pointer-events-none" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search any language (Arabic, English, Spanish, German)"
              className="w-full min-h-[44px] bg-[#F3F5F9] rounded-lg pl-9 pr-3 py-2 text-sm text-[#141B2D] placeholder:text-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/30"
            />
          </div>
        </div>

        {/* Languages List */}
        <div className="flex-1 overflow-y-auto chat-scroll divide-y divide-slate-900/5">
          {trimmedQuery && !hasExactMatch && (
            <button
              type="button"
              onClick={handleCustomSelect}
              className="w-full px-4 py-3.5 flex items-center justify-between gap-3 bg-[#EEF2FF]/70 hover:bg-[#EEF2FF] transition-colors text-left cursor-pointer"
            >
              <div>
                <p className="text-sm font-semibold text-[#1E3A8A]">
                  Translate to: &ldquo;{trimmedQuery}&rdquo;
                </p>
                <p className="text-xs text-[#475569]">
                  Use this custom language or dialect
                </p>
              </div>
              <Globe className="w-4 h-4 text-[#1E3A8A] shrink-0" />
            </button>
          )}

          {filtered.map((lang) => {
            const isSelected = selectedLanguage ? lang.code === selectedLanguage.code : false;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => {
                  onSelect(lang);
                  setQuery('');
                  onClose();
                }}
                className={`w-full px-4 py-3 min-h-[56px] flex items-center justify-between gap-3 text-left transition-colors cursor-pointer ${
                  isSelected ? 'bg-[#EEF2FF]/80' : 'hover:bg-[#F8FAFC]'
                }`}
              >
                <div className="min-w-0">
                  <p className="text-[14.5px] font-semibold text-[#141B2D] truncate">
                    {lang.name}
                  </p>
                  <p className="text-xs text-[#64748B] truncate">
                    {lang.nativeName}
                  </p>
                </div>
                {isSelected && <Check className="w-5 h-5 text-[#1E3A8A] shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
