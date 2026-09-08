import React from 'react';
import { UserInputs, SchemeCalculation, HyperLocalFeasibilityReport, SupportedLanguage } from './types';
import { translations } from './utils/translations';
import { calculateScaFinancials, formatIndianCurrency } from './utils/calculator';
import { InputForm } from './components/InputForm';
import { FinancialCalculatorView } from './components/FinancialCalculatorView';
import { BusinessFeasibilityView } from './components/BusinessFeasibilityView';
import { DprView } from './components/DprView';
import { AdvisorView } from './components/AdvisorView';
import { DprDocumentModal } from './components/DprDocumentModal';
import { ChatAdvisorModal } from './components/ChatAdvisorModal';
import { isSpeaking, stopSpeaking } from './utils/speech';
import confetti from 'canvas-confetti';
import {
  FileText,
  Calculator,
  Compass,
  ArrowRight,
  Landmark,
  UserCheck,
  Bot,
  VolumeX,
  Languages,
  CheckCircle2,
  ChevronRight,
  Printer,
  Sparkles,
  Menu,
  X,
} from 'lucide-react';

export type AppTab = 'setup' | 'calculator' | 'feasibility' | 'dpr' | 'advisor';

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

export default function App() {
  const [language, setLanguage] = React.useState<SupportedLanguage>('en');

  // Initial entrepreneur inputs
  const [inputs, setInputs] = React.useState<UserInputs>({
    village: 'Rampur Gram Panchayat',
    block: 'Brahmpur Tehsil',
    district: 'Gorakhpur',
    state: 'Uttar Pradesh',
    availableMargin: 14000,
    businessCategory: 'Dairy & Animal Husbandry',
    businessSubtype: 'Milk Collection & Chilling Unit',
    language: 'en',
    experienceYears: 2,
    promoterCategory: 'OBC',
  });

  // Calculate scheme financials reactively
  const calculation: SchemeCalculation = React.useMemo(() => {
    return calculateScaFinancials(inputs.availableMargin);
  }, [inputs.availableMargin]);

  // Feasibility report state
  const [report, setReport] = React.useState<HyperLocalFeasibilityReport | null>(null);
  const [isLoadingReport, setIsLoadingReport] = React.useState(false);
  const [reportError, setReportError] = React.useState<string | null>(null);

  // Active individual tab (controlled from left sidebar)
  const [activeTab, setActiveTab] = React.useState<AppTab>('setup');

  // Modals
  const [isDprOpen, setIsDprOpen] = React.useState(false);
  const [isChatOpen, setIsChatOpen] = React.useState(false);

  // Audio speech status
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

  const t = translations[language] || translations.en;

  // Generate Feasibility API call
  const handleGenerateReport = async () => {
    setIsLoadingReport(true);
    setReportError(null);

    try {
      const res = await fetch('/api/advisory/generate-feasibility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          village: inputs.village,
          block: inputs.block,
          district: inputs.district,
          state: inputs.state,
          availableMargin: inputs.availableMargin,
          businessCategory: inputs.businessCategory,
          businessSubtype: inputs.businessSubtype,
          language,
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        setReport(json.data);
        setActiveTab('feasibility');
        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.7 },
          });
        } catch (_) {}
      } else {
        setReportError(json.error || 'Failed to generate feasibility report.');
      }
    } catch (err: any) {
      console.error('Error generating feasibility report:', err);
      setReportError('Network error while generating feasibility report. Please try again.');
    } finally {
      setIsLoadingReport(false);
    }
  };

  // Generate initial report on first load
  React.useEffect(() => {
    if (!report) {
      handleGenerateReport();
    }
  }, []);

  const locationName = `${inputs.village || 'Local Village'}, ${inputs.block || 'Block'}, ${inputs.district || 'District'}`;

  // Tabs configuration for Left Sidebar
  const TABS = [
    {
      id: 'setup' as AppTab,
      stepNum: '1',
      label: t.tabSetup,
      desc: t.tabSetupDesc,
      icon: UserCheck,
    },
    {
      id: 'calculator' as AppTab,
      stepNum: '2',
      label: t.tabCalculator,
      desc: t.tabCalculatorDesc,
      icon: Calculator,
    },
    {
      id: 'feasibility' as AppTab,
      stepNum: '3',
      label: t.tabFeasibility,
      desc: t.tabFeasibilityDesc,
      icon: Compass,
    },
    {
      id: 'dpr' as AppTab,
      stepNum: '4',
      label: t.tabDpr,
      desc: t.tabDprDesc,
      icon: FileText,
    },
    {
      id: 'advisor' as AppTab,
      stepNum: '5',
      label: t.tabAdvisor,
      desc: t.tabAdvisorDesc,
      icon: Bot,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col lg:flex-row">
      {/* ========================================================================= */}
      {/* LEFT SIDEBAR NAVIGATION (Desktop & Large screens) */}
      {/* ========================================================================= */}
      <aside
        id="left-sidebar-navigation"
        className="hidden lg:flex lg:flex-col lg:w-72 xl:w-80 shrink-0 bg-white border-r border-slate-200 min-h-screen sticky top-0 h-screen overflow-y-auto shadow-xs z-30"
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight text-slate-900">
                {t.appName}
              </h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                {t.ratioBadge}
              </span>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-2 font-medium leading-relaxed">
            {t.appSubtitle}
          </p>
        </div>

        {/* Language Selection Selector (Left Sidebar) */}
        <div className="p-4 border-b border-slate-200 bg-slate-50/60">
          <label
            htmlFor="sidebar-select-language"
            className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5"
          >
            <Languages className="w-3.5 h-3.5 text-emerald-700" />
            <span>{t.selectLanguage}</span>
          </label>
          <div className="relative">
            <select
              id="sidebar-select-language"
              value={language}
              onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
              className="w-full appearance-none bg-white border border-slate-300 hover:border-slate-400 text-slate-900 text-xs font-semibold py-2 pl-3 pr-8 rounded-xl cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-emerald-600 shadow-2xs"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.native} ({lang.label})
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-500">
              <ChevronRight className="w-4 h-4 rotate-90" />
            </div>
          </div>
        </div>

        {/* Sidebar Vertical Tabs */}
        <div className="flex-1 p-3 space-y-1.5 overflow-y-auto">
          <div className="px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-widest text-slate-500">
            {t.navigationTitle}
          </div>

          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                id={`sidebar-tab-${tab.id}`}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-start gap-3 p-3 rounded-xl text-left transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-800 text-white shadow-sm'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                    isActive
                      ? 'bg-emerald-700 text-emerald-100'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-bold truncate">
                      {tab.label}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        isActive
                          ? 'bg-emerald-900/80 text-emerald-200'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {t.stepBadge} {tab.stepNum}
                    </span>
                  </div>
                  <p
                    className={`text-[11px] truncate mt-0.5 ${
                      isActive ? 'text-emerald-100/90' : 'text-slate-500'
                    }`}
                  >
                    {tab.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Audio Stop Button (if active) */}
        {speaking && (
          <div className="p-3 border-t border-slate-200 bg-rose-50">
            <button
              type="button"
              onClick={handleToggleSpeech}
              className="w-full flex items-center justify-center gap-2 p-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              <VolumeX className="w-4 h-4" />
              <span>{t.stopAudio}</span>
            </button>
          </div>
        )}

        {/* Quick 10:90 Financial Summary in Sidebar */}
        <div className="p-4 border-t border-slate-200 bg-slate-50">
          <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">
            {t.liveSummaryTitle}
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-600">{t.margin10Label}:</span>
              <span className="font-bold text-slate-900">
                {formatIndianCurrency(calculation.availableMargin)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-emerald-800 font-medium">{t.loan90Label}:</span>
              <span className="font-black text-emerald-800">
                {formatIndianCurrency(calculation.loanEligibility)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">{t.interestLabelShort}:</span>
              <span className="font-bold text-slate-900">
                {calculation.interestRate}% {t.perAnnum}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">{t.tenureLabel}:</span>
              <span className="font-bold text-slate-900">
                {calculation.tenureYears} {t.yearsUnit} ({calculation.moratoriumMonths} {t.monthsUnit} {t.graceLabelShort})
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* MOBILE TOP NAVIGATION BAR & HORIZONTAL TAB STRIP (< lg screens) */}
      {/* ========================================================================= */}
      <div className="lg:hidden bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        {/* Mobile Brand Row */}
        <div className="p-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-black text-slate-900 leading-tight">
                {t.appName}
              </h1>
              <span className="text-[10px] font-bold text-emerald-800">
                {t.ratioBadge}
              </span>
            </div>
          </div>

          {/* Mobile Language Selector */}
          <div className="flex items-center gap-2">
            <select
              id="mobile-select-language"
              value={language}
              onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
              className="bg-slate-100 border border-slate-300 text-slate-800 text-xs font-semibold py-1.5 px-2 rounded-lg cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
              aria-label="Language"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.native}
                </option>
              ))}
            </select>

            {speaking && (
              <button
                type="button"
                onClick={handleToggleSpeech}
                className="p-1.5 rounded-lg bg-rose-600 text-white"
                title={t.stopAudio}
              >
                <VolumeX className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Mobile Horizontal Tab Strip */}
        <div className="px-3 pb-3 flex items-center gap-2 overflow-x-auto scrollbar-none border-t border-slate-100 pt-2">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                id={`mobile-tab-${tab.id}`}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MAIN VIEW CONTENT AREA */}
      {/* ========================================================================= */}
      <main className="flex-1 flex flex-col min-w-0 min-h-screen">
        <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto space-y-6">
          {/* Tab 1: Setup & Profile */}
          {activeTab === 'setup' && (
            <div className="space-y-6">
              <InputForm
                inputs={inputs}
                onChange={setInputs}
                onSubmit={handleGenerateReport}
                isLoading={isLoadingReport}
                language={language}
                onNext={() => setActiveTab('calculator')}
              />
            </div>
          )}

          {/* Tab 2: Financial Calculator & Amortization */}
          {activeTab === 'calculator' && (
            <div className="space-y-6">
              <FinancialCalculatorView
                calculation={calculation}
                language={language}
                onNext={() => setActiveTab('feasibility')}
              />
            </div>
          )}

          {/* Tab 3: Feasibility Intelligence & 6-Pillar Study */}
          {activeTab === 'feasibility' && (
            <div>
              {isLoadingReport ? (
                <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-4 shadow-xs">
                  <div className="w-12 h-12 border-4 border-emerald-600/30 border-t-emerald-700 rounded-full animate-spin mx-auto" />
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      {t.generatingReport}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                      {locationName}
                    </p>
                  </div>
                </div>
              ) : report ? (
                <div className="space-y-6">
                  <BusinessFeasibilityView
                    report={report}
                    language={language}
                    locationName={locationName}
                    businessCategory={inputs.businessCategory}
                    onNext={() => setActiveTab('dpr')}
                  />
                </div>
              ) : reportError ? (
                <div className="p-8 bg-rose-50 border border-rose-200 rounded-2xl text-center space-y-3">
                  <div className="text-rose-900 font-bold text-sm">{reportError}</div>
                  <button
                    type="button"
                    onClick={handleGenerateReport}
                    className="px-5 py-2.5 rounded-xl bg-rose-700 text-white font-bold text-xs hover:bg-rose-800 transition-colors cursor-pointer"
                  >
                    {t.generateReportBtn}
                  </button>
                </div>
              ) : null}
            </div>
          )}

          {/* Tab 4: Official SCA DPR */}
          {activeTab === 'dpr' && (
            <DprView
              inputs={inputs}
              calculation={calculation}
              report={report}
              language={language}
              onOpenReportTab={() => {
                setActiveTab('feasibility');
                if (!report) handleGenerateReport();
              }}
            />
          )}

          {/* Tab 5: AI Rural Sahayak Advisor */}
          {activeTab === 'advisor' && (
            <AdvisorView
              inputs={inputs}
              calculation={calculation}
              language={language}
            />
          )}
        </div>

        {/* Clean, Simple Footer with Full Translation */}
        <footer className="mt-auto bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
          <div className="max-w-6xl mx-auto px-4 space-y-1">
            <div className="flex items-center justify-center gap-2 font-bold text-slate-800">
              <Landmark className="w-4 h-4 text-emerald-700" />
              <span>{t.appName}</span>
            </div>
            <p className="text-slate-500 max-w-xl mx-auto text-xs">
              {t.footerDesc}
            </p>
            <p className="text-slate-400 text-[11px] pt-1">
              {t.allRightsReserved}
            </p>
          </div>
        </footer>
      </main>

      {/* DPR Printable Modal */}
      <DprDocumentModal
        isOpen={isDprOpen}
        onClose={() => setIsDprOpen(false)}
        inputs={inputs}
        calculation={calculation}
        report={report}
        language={language}
      />

      {/* Chat Advisor Modal */}
      <ChatAdvisorModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        inputs={inputs}
        calculation={calculation}
        language={language}
      />
    </div>
  );
}
