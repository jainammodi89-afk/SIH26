import React from 'react';
import { SupportedLanguage } from '../types';
import { translations } from '../utils/translations';
import { Landmark, Volume2, VolumeX, Sparkles, FileText, MessageSquare } from 'lucide-react';
import { isSpeaking, stopSpeaking } from '../utils/speech';

interface NavbarProps {
  language: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  onOpenDprModal: () => void;
  onOpenChatModal: () => void;
  hasReport: boolean;
}

const LANGUAGES: { code: SupportedLanguage; label: string; native: string }[] = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'hi', label: 'Hindi', native: 'हिंदी' },
  { code: 'mr', label: 'Marathi', native: 'मराठी' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు' },
  { code: 'bn', label: 'Bengali', native: 'বাংলা' },
  { code: 'gu', label: 'Gujarati', native: 'ગુજરાતી' },
  { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' },
];

export const Navbar: React.FC<NavbarProps> = ({
  language,
  onLanguageChange,
  onOpenDprModal,
  onOpenChatModal,
  hasReport,
}) => {
  const t = translations[language] || translations.en;
  const [speaking, setSpeaking] = React.useState(false);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setSpeaking(isSpeaking());
    }, 400);
    return () => clearInterval(interval);
  }, []);

  const handleToggleSpeech = () => {
    if (speaking) {
      stopSpeaking();
      setSpeaking(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Brand & SCA Agency Badge */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 text-white flex items-center justify-center shadow-md shadow-emerald-900/10">
              <Landmark className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight text-slate-900">
                  {t.appName}
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  SCA 90% Credit
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden md:block">
                {t.appSubtitle}
              </p>
            </div>
          </div>

          {/* Actions & Language Selector */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Ask Sahayak AI */}
            <button
              id="btn-ask-sahayak-top"
              onClick={onOpenChatModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-300 transition-colors"
              title="Ask SCA Sahayak AI Advisor"
            >
              <MessageSquare className="w-4 h-4 text-amber-700" />
              <span className="hidden xs:inline">{t.askSahayak}</span>
            </button>

            {/* DPR Download Button (enabled if report is ready) */}
            {hasReport && (
              <button
                id="btn-dpr-download-nav"
                onClick={onOpenDprModal}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium bg-emerald-50 text-emerald-900 hover:bg-emerald-100 border border-emerald-300 transition-colors"
                title="View & Print Official SCA DPR"
              >
                <FileText className="w-4 h-4 text-emerald-700" />
                <span className="hidden sm:inline">SCA DPR</span>
              </button>
            )}

            {/* Stop Voice speech if active */}
            {speaking && (
              <button
                onClick={handleToggleSpeech}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-rose-100 text-rose-800 animate-pulse border border-rose-300"
                title="Stop Audio"
              >
                <VolumeX className="w-4 h-4" />
                <span>{t.stopAudio}</span>
              </button>
            )}

            {/* Language Selector Dropdown */}
            <div className="relative">
              <select
                id="select-language"
                value={language}
                onChange={(e) => onLanguageChange(e.target.value as SupportedLanguage)}
                className="appearance-none bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 text-xs sm:text-sm font-medium py-1.5 pl-3 pr-8 rounded-lg cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition-colors"
                aria-label="Select Language"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.native} ({lang.label})
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
