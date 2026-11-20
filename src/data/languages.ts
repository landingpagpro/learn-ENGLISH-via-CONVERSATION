export interface TranslationLanguage {
  code: string;
  name: string;
  nativeName: string;
  dir: 'rtl' | 'ltr';
  aliases?: string;
}

export const WORLD_LANGUAGES: TranslationLanguage[] = [
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', dir: 'rtl', aliases: 'arabo arabe' },
  { code: 'darija', name: 'Moroccan Darija', nativeName: 'الدارجة المغربية', dir: 'rtl', aliases: 'darija maghrebiya marocchino' },
  { code: 'fr', name: 'French', nativeName: 'Français', dir: 'ltr', aliases: 'francais francese' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', dir: 'ltr', aliases: 'italiano italien' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', dir: 'ltr', aliases: 'espanol spagnolo' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', dir: 'ltr', aliases: 'deutsch tedesco' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', dir: 'ltr', aliases: 'portugues portoghese' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', dir: 'ltr', aliases: 'nederlands olandese' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', dir: 'ltr', aliases: 'turkce turco' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', dir: 'ltr', aliases: 'russkiy russo' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', dir: 'ltr', aliases: 'mandarin cinese' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', dir: 'ltr', aliases: 'nihongo giapponese' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', dir: 'ltr', aliases: 'hangugeo coreano' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', dir: 'ltr', aliases: 'hindi' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', dir: 'rtl', aliases: 'urdu' },
  { code: 'fa', name: 'Persian', nativeName: 'فارسی', dir: 'rtl', aliases: 'farsi persiano' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', dir: 'ltr', aliases: 'indonesiano' },
  { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu', dir: 'ltr', aliases: 'malese' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', dir: 'ltr', aliases: 'bangla bengalese' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski', dir: 'ltr', aliases: 'polacco' },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska', dir: 'ltr', aliases: 'svedese' },
  { code: 'no', name: 'Norwegian', nativeName: 'Norsk', dir: 'ltr', aliases: 'norvegese' },
  { code: 'da', name: 'Danish', nativeName: 'Dansk', dir: 'ltr', aliases: 'danese' },
  { code: 'fi', name: 'Finnish', nativeName: 'Suomi', dir: 'ltr', aliases: 'finlandese' },
  { code: 'el', name: 'Greek', nativeName: 'Ελληνικά', dir: 'ltr', aliases: 'greco' },
  { code: 'uk', name: 'Ukrainian', nativeName: 'Українська', dir: 'ltr', aliases: 'ucraino' },
  { code: 'ro', name: 'Romanian', nativeName: 'Română', dir: 'ltr', aliases: 'rumeno' },
  { code: 'cs', name: 'Czech', nativeName: 'Čeština', dir: 'ltr', aliases: 'ceco' },
  { code: 'hu', name: 'Hungarian', nativeName: 'Magyar', dir: 'ltr', aliases: 'ungherese' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย', dir: 'ltr', aliases: 'thailandese' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', dir: 'ltr', aliases: 'vietnamita' },
  { code: 'tl', name: 'Filipino', nativeName: 'Filipino', dir: 'ltr', aliases: 'tagalog filippino' },
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili', dir: 'ltr', aliases: 'swahili' },
  { code: 'am', name: 'Amharic', nativeName: 'አማርኛ', dir: 'ltr', aliases: 'amarico' },
  { code: 'ha', name: 'Hausa', nativeName: 'Hausa', dir: 'ltr', aliases: 'hausa' },
  { code: 'he', name: 'Hebrew', nativeName: 'עברית', dir: 'rtl', aliases: 'ebraico' },
  { code: 'ca', name: 'Catalan', nativeName: 'Català', dir: 'ltr', aliases: 'catalano' },
  { code: 'zgh', name: 'Amazigh (Tamazight)', nativeName: 'Tamaziɣt / ⵜⴰⵎⴰⵣⵉⵖⵜ', dir: 'ltr', aliases: 'berber tamazight' },
  { code: 'en-simple', name: 'Simple English', nativeName: 'Easy English', dir: 'ltr', aliases: 'easy english beginner simple' },
];
