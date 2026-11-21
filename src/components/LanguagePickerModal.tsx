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
        lang.code.toLowerCase().includes(q) ||
        (lang.aliases ? lang.aliases.toLowerCase().includes(q) : false)
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
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#111C18]/45 backdrop-blur-[2px] p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-md h-[82dvh] sm:h-[540px] bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-[#DCE4DD]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-4 py-3 bg-[#F8FAF8] border-b border-[#DCE4DD] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-[#0F5E4B]" />
            <h3 className="text-[15px] font-bold text-[#111C18]">
              Scegli la lingua di traduzione
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Chiudi"
            className="min-w-[44px] min-h-[44px] -mr-2 flex items-center justify-center rounded-xl text-[#4A5C55] hover:bg-[#EFF4F0] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Box */}
        <div className="p-3 border-b border-[#DCE4DD] bg-white shrink-0">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-[#64766E] absolute left-3 pointer-events-none" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cerca una lingua (Arabo, Inglese, Francese, Spagnolo)"
              className="w-full min-h-[44px] bg-[#F4F7F5] border border-[#DCE4DD] rounded-xl pl-9 pr-3 py-2 text-sm text-[#111C18] placeholder:text-[#64766E] focus:outline-none focus:ring-2 focus:ring-[#0F5E4B]/25 focus:border-[#0F5E4B] focus:bg-white"
            />
          </div>
        </div>

        {/* Languages List */}
        <div className="flex-1 overflow-y-auto chat-scroll divide-y divide-[#EFF4F0]">
          {trimmedQuery && !hasExactMatch && (
            <button
              type="button"
              onClick={handleCustomSelect}
              className="w-full px-4 py-3.5 flex items-center justify-between gap-3 bg-[#E8F4F0]/75 hover:bg-[#E8F4F0] transition-colors text-left cursor-pointer"
            >
              <div>
                <p className="text-sm font-semibold text-[#0F5E4B]">
                  Traduci in: &ldquo;{trimmedQuery}&rdquo;
                </p>
                <p className="text-xs text-[#4A5C55]">
                  Usa questa lingua o dialetto
                </p>
              </div>
              <Globe className="w-4 h-4 text-[#0F5E4B] shrink-0" />
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
                  isSelected ? 'bg-[#E8F4F0]/80' : 'hover:bg-[#F8FAF8]'
                }`}
              >
                <div className="min-w-0">
                  <p className="text-[14.5px] font-semibold text-[#111C18] truncate">
                    {lang.name}
                  </p>
                  <p className="text-xs text-[#64766E] truncate">
                    {lang.nativeName}
                  </p>
                </div>
                {isSelected && <Check className="w-5 h-5 text-[#0F5E4B] shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
