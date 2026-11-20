export interface TranslationLanguage {
  code: string;
  name: string;
  nativeName: string;
  dir: 'rtl' | 'ltr';
  aliases?: string;
}

export const WORLD_LANGUAGES: TranslationLanguage[] = [
  { code: 'ar', name: 'Arabo', nativeName: 'العربية', dir: 'rtl', aliases: 'arabic arabe' },
  { code: 'darija', name: 'Darija Marocchino', nativeName: 'الدارجة المغربية', dir: 'rtl', aliases: 'darija maghrebiya moroccan marocchino' },
  { code: 'en', name: 'Inglese', nativeName: 'English', dir: 'ltr', aliases: 'english anglais' },
  { code: 'fr', name: 'Francese', nativeName: 'Français', dir: 'ltr', aliases: 'french francais' },
  { code: 'es', name: 'Spagnolo', nativeName: 'Español', dir: 'ltr', aliases: 'spanish espanol' },
  { code: 'de', name: 'Tedesco', nativeName: 'Deutsch', dir: 'ltr', aliases: 'german deutsch' },
  { code: 'pt', name: 'Portoghese', nativeName: 'Português', dir: 'ltr', aliases: 'portuguese portugues' },
  { code: 'nl', name: 'Olandese', nativeName: 'Nederlands', dir: 'ltr', aliases: 'dutch nederlands' },
  { code: 'tr', name: 'Turco', nativeName: 'Türkçe', dir: 'ltr', aliases: 'turkish turkce' },
  { code: 'ru', name: 'Russo', nativeName: 'Русский', dir: 'ltr', aliases: 'russian russkiy' },
  { code: 'zh', name: 'Cinese', nativeName: '中文', dir: 'ltr', aliases: 'chinese mandarin' },
  { code: 'ja', name: 'Giapponese', nativeName: '日本語', dir: 'ltr', aliases: 'japanese nihongo' },
  { code: 'ko', name: 'Coreano', nativeName: '한국어', dir: 'ltr', aliases: 'korean hangugeo' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', dir: 'ltr', aliases: 'hindi' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', dir: 'rtl', aliases: 'urdu' },
  { code: 'fa', name: 'Persiano', nativeName: 'فارسی', dir: 'rtl', aliases: 'persian farsi' },
  { code: 'id', name: 'Indonesiano', nativeName: 'Bahasa Indonesia', dir: 'ltr', aliases: 'indonesian' },
  { code: 'ms', name: 'Malese', nativeName: 'Bahasa Melayu', dir: 'ltr', aliases: 'malay' },
  { code: 'bn', name: 'Bengalese', nativeName: 'বাংলা', dir: 'ltr', aliases: 'bengali bangla' },
  { code: 'pl', name: 'Polacco', nativeName: 'Polski', dir: 'ltr', aliases: 'polish' },
  { code: 'sv', name: 'Svedese', nativeName: 'Svenska', dir: 'ltr', aliases: 'swedish' },
  { code: 'no', name: 'Norvegese', nativeName: 'Norsk', dir: 'ltr', aliases: 'norwegian' },
  { code: 'da', name: 'Danese', nativeName: 'Dansk', dir: 'ltr', aliases: 'danish' },
  { code: 'fi', name: 'Finlandese', nativeName: 'Suomi', dir: 'ltr', aliases: 'finnish' },
  { code: 'el', name: 'Greco', nativeName: 'Ελληνικά', dir: 'ltr', aliases: 'greek' },
  { code: 'uk', name: 'Ucraino', nativeName: 'Українська', dir: 'ltr', aliases: 'ukrainian' },
  { code: 'ro', name: 'Rumeno', nativeName: 'Română', dir: 'ltr', aliases: 'romanian' },
  { code: 'cs', name: 'Ceco', nativeName: 'Čeština', dir: 'ltr', aliases: 'czech' },
  { code: 'hu', name: 'Ungherese', nativeName: 'Magyar', dir: 'ltr', aliases: 'hungarian' },
  { code: 'th', name: 'Thailandese', nativeName: 'ไทย', dir: 'ltr', aliases: 'thai' },
  { code: 'vi', name: 'Vietnamita', nativeName: 'Tiếng Việt', dir: 'ltr', aliases: 'vietnamese' },
  { code: 'tl', name: 'Filippino', nativeName: 'Filipino', dir: 'ltr', aliases: 'filipino tagalog' },
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili', dir: 'ltr', aliases: 'swahili' },
  { code: 'am', name: 'Amarico', nativeName: 'አማርኛ', dir: 'ltr', aliases: 'amharic' },
  { code: 'ha', name: 'Hausa', nativeName: 'Hausa', dir: 'ltr', aliases: 'hausa' },
  { code: 'he', name: 'Ebraico', nativeName: 'עברית', dir: 'rtl', aliases: 'hebrew' },
  { code: 'ca', name: 'Catalano', nativeName: 'Català', dir: 'ltr', aliases: 'catalan' },
  { code: 'zgh', name: 'Amazigh (Tamazight)', nativeName: 'Tamaziɣt / ⵜⴰⵎⴰⵣⵉⵖⵜ', dir: 'ltr', aliases: 'berber tamazight' },
  { code: 'it-simple', name: 'Italiano Semplice', nativeName: 'Italiano Facile', dir: 'ltr', aliases: 'easy italian simple italiano facile' },
];
