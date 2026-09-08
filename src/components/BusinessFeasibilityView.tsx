import React from 'react';
import { HyperLocalFeasibilityReport, SupportedLanguage } from '../types';
import { translations } from '../utils/translations';
import { speakText, stopSpeaking, isSpeaking } from '../utils/speech';
import {
  Compass,
  Users,
  Lightbulb,
  ShieldAlert,
  Store,
  Tag,
  Volume2,
  VolumeX,
  TrendingUp,
  Truck,
  CheckCircle,
  AlertTriangle,
  FileCheck,
  ChevronRight,
  ArrowUpRight,
  ArrowRight,
  MapPin,
} from 'lucide-react';

interface BusinessFeasibilityViewProps {
  report: HyperLocalFeasibilityReport;
  language: SupportedLanguage;
  locationName: string;
  businessCategory: string;
  onNext?: () => void;
}

export const BusinessFeasibilityView: React.FC<BusinessFeasibilityViewProps> = ({
  report,
  language,
  locationName,
  businessCategory,
  onNext,
}) => {
  const t = translations[language] || translations.en;
  const [activeSpeechSection, setActiveSpeechSection] = React.useState<string | null>(null);

  const handleSpeak = (text: string, sectionKey: string) => {
    if (activeSpeechSection === sectionKey && isSpeaking()) {
      stopSpeaking();
      setActiveSpeechSection(null);
      return;
    }
    stopSpeaking();
    setActiveSpeechSection(sectionKey);
    speakText(text, language, () => {
      setActiveSpeechSection(null);
    });
  };

  return (
    <div className="space-y-6" id="module-business-feasibility">
      {/* Newcomer Clarity Guide Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/80 border border-emerald-200/90 flex items-start gap-3.5 text-emerald-950 shadow-xs">
        <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
          <Lightbulb className="w-5 h-5" />
        </div>
        <div className="text-xs sm:text-sm leading-relaxed">
          <p className="font-semibold text-emerald-900 mb-0.5">
            {t.newcomerTipFeasibility}
          </p>
          <div className="flex items-center gap-2 mt-1 text-emerald-800 text-xs">
            <MapPin className="w-3.5 h-3.5" />
            <span>{locationName}</span>
          </div>
        </div>
      </div>

      {/* Header Banner */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
              {t.tabFeasibility}
            </span>
            <span className="text-xs text-slate-500 font-medium">{locationName}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
            {t.feasibilityReportTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            {t.feasibilityReportSubtitle}
          </p>
        </div>

        {/* Listen to Summary in Voice */}
        <button
          type="button"
          onClick={() => handleSpeak(report.executiveSummary, 'summary')}
          className={`shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeSpeechSection === 'summary'
              ? 'bg-rose-600 text-white animate-pulse'
              : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300'
          }`}
        >
          {activeSpeechSection === 'summary' ? (
            <>
              <VolumeX className="w-4 h-4" />
              <span>{t.stopAudio}</span>
            </>
          ) : (
            <>
              <Volume2 className="w-4 h-4 text-emerald-700" />
              <span>{t.listenReport}</span>
            </>
          )}
        </button>
      </div>

      {/* Executive Summary Card */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
          {t.executiveSummaryTitle}
        </h3>
        <p className="text-sm sm:text-base text-slate-800 leading-relaxed font-medium">
          {report.executiveSummary}
        </p>
      </div>

      {/* Grid: Pillar 1 (Market Reach) & Pillar 2 (Opportunities) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Market Reach */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-900 flex items-center justify-center font-bold text-xs">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    {t.marketReachTitle}
                  </h3>
                  <span className="text-[11px] text-slate-500">5–10 km</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  handleSpeak(
                    `${t.marketReachTitle}: ${t.catchmentPopulationLabel}: ${report.marketReach.population5to10km}. ${t.targetHouseholdsLabel}: ${report.marketReach.estimatedTargetHouseholds}. ${report.marketReach.dailyWeeklyDemandUnits}`,
                    'marketReach'
                  )
                }
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
                title={t.listenReport}
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-100">
                <div className="text-[11px] text-blue-800 font-semibold">{t.catchmentPopulationLabel}</div>
                <div className="text-lg font-black text-blue-950 mt-0.5">
                  {report.marketReach.population5to10km.toLocaleString()}
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-100">
                <div className="text-[11px] text-emerald-800 font-semibold">{t.targetHouseholdsLabel}</div>
                <div className="text-lg font-black text-emerald-950 mt-0.5">
                  {report.marketReach.estimatedTargetHouseholds.toLocaleString()}
                </div>
              </div>
            </div>

            <div className="text-xs text-slate-600 mb-3">
              <span className="font-semibold text-slate-800">{t.dailyDemandLabel}: </span>
              {report.marketReach.dailyWeeklyDemandUnits}
            </div>

            {/* Distribution Channels */}
            <div className="space-y-2 mb-3">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                {t.distributionChannelsTitle}:
              </span>
              {report.marketReach.primaryDistributionChannels.map((ch, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-start justify-between gap-3"
                >
                  <div>
                    <div className="font-bold text-slate-900">{ch.channel}</div>
                    <div className="text-slate-500 mt-0.5 text-[11px]">{ch.description}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="px-2 py-0.5 rounded-md font-extrabold bg-blue-100 text-blue-900 text-[11px]">
                      {ch.reachShare}
                    </span>
                    <div className="text-[10px] text-slate-400 mt-1">{ch.frequency}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-100 text-xs text-slate-700 flex items-center gap-2">
            <Truck className="w-4 h-4 text-slate-600 shrink-0" />
            <span>{report.marketReach.logisticsFeasibility}</span>
          </div>
        </div>

        {/* 2. Opportunity Analysis */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-xs">
                  <Lightbulb className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    {t.opportunityTitle}
                  </h3>
                  <span className="text-[11px] text-slate-500">{t.underservedNichesTitle}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  handleSpeak(
                    `${t.opportunityTitle}: ${report.opportunityAnalysis.underservedNiches.join('. ')}. ${report.opportunityAnalysis.valueAdditionPotential}`,
                    'opportunities'
                  )
                }
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
                title={t.listenReport}
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            {/* Underserved Niches List */}
            <div className="space-y-2 mb-4">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                {t.underservedNichesTitle}:
              </span>
              {report.opportunityAnalysis.underservedNiches.map((niche, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-amber-50/60 border border-amber-200 text-xs flex items-start gap-2 text-slate-800"
                >
                  <ArrowUpRight className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <span className="font-medium leading-relaxed">{niche}</span>
                </div>
              ))}
            </div>

            {/* Value Addition Potential */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1 mb-3">
              <span className="font-bold text-slate-900 block">{t.valueAdditionTitle}:</span>
              <p className="text-slate-600 leading-relaxed">
                {report.opportunityAnalysis.valueAdditionPotential}
              </p>
            </div>

            {/* Demand Drivers */}
            <div className="text-xs space-y-1">
              <span className="font-bold text-slate-700">{t.demandDriversTitle}:</span>
              <ul className="list-disc list-inside text-slate-600 space-y-1">
                {report.opportunityAnalysis.localDemandDrivers.map((driver, idx) => (
                  <li key={idx}>{driver}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-semibold flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{t.recommendedScaleTitle}: {report.opportunityAnalysis.recommendedInitialScale}</span>
          </div>
        </div>
      </div>

      {/* 3. SWOT Matrix (4-Quadrant Grid) */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-900 flex items-center justify-center font-bold text-xs">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900">
                {t.swotTitle}
              </h3>
              <span className="text-[11px] text-slate-500">10:90 Micro-Enterprise Calibrated</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() =>
              handleSpeak(
                `SWOT: ${t.strengthsLabel}: ${report.swotAnalysis.strengths.join('. ')}. ${t.opportunitiesLabel}: ${report.swotAnalysis.opportunities.join('. ')}.`,
                'swot'
              )
            }
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
            title={t.listenReport}
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Strengths */}
          <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200">
            <div className="flex items-center gap-2 text-xs font-black text-emerald-900 uppercase tracking-wider mb-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              {t.strengthsLabel}
            </div>
            <ul className="space-y-2 text-xs text-slate-700">
              {report.swotAnalysis.strengths.map((s, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-700 font-bold">•</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Weaknesses */}
          <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200">
            <div className="flex items-center gap-2 text-xs font-black text-amber-900 uppercase tracking-wider mb-2.5">
              <span className="w-2 h-2 rounded-full bg-amber-600" />
              {t.weaknessesLabel}
            </div>
            <ul className="space-y-2 text-xs text-slate-700">
              {report.swotAnalysis.weaknesses.map((w, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-amber-700 font-bold">•</span>
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Opportunities */}
          <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-200">
            <div className="flex items-center gap-2 text-xs font-black text-blue-900 uppercase tracking-wider mb-2.5">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              {t.opportunitiesLabel}
            </div>
            <ul className="space-y-2 text-xs text-slate-700">
              {report.swotAnalysis.opportunities.map((o, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-blue-700 font-bold">•</span>
                  <span>{o}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Threats */}
          <div className="p-4 rounded-xl bg-rose-50/50 border border-rose-200">
            <div className="flex items-center gap-2 text-xs font-black text-rose-900 uppercase tracking-wider mb-2.5">
              <span className="w-2 h-2 rounded-full bg-rose-600" />
              {t.threatsLabel}
            </div>
            <ul className="space-y-2 text-xs text-slate-700">
              {report.swotAnalysis.threats.map((th, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-rose-700 font-bold">•</span>
                  <span>{th}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* 4. Threats Identification & Practical Mitigations */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-900 flex items-center justify-center font-bold text-xs">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900">
                {t.threatsMitigationTitle}
              </h3>
              <span className="text-[11px] text-slate-500">{t.mitigationActionLabel}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() =>
              handleSpeak(
                `${t.threatsMitigationTitle}: ${report.threatsIdentification
                  .map((t) => `${t.threat}: ${t.practicalMitigation}`)
                  .join('. ')}`,
                'threats'
              )
            }
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
            title={t.listenReport}
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {report.threatsIdentification.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-xs sm:text-sm">
                  {item.threat}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    item.riskLevel === 'High'
                      ? 'bg-rose-100 text-rose-800 border border-rose-200'
                      : item.riskLevel === 'Moderate'
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  }`}
                >
                  {item.riskLevel}
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {item.impactDescription}
              </p>

              <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 space-y-0.5">
                <span className="font-bold text-emerald-800 block text-[11px]">
                  {t.mitigationActionLabel}:
                </span>
                <span className="text-slate-700 font-medium">
                  {item.practicalMitigation}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Grid: Pillar 5 (Competitor Mapping) & Pillar 6 (Pricing Strategy) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 5. Competitors */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-900 flex items-center justify-center font-bold text-xs">
                  <Store className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    {t.competitorsTitle}
                  </h3>
                  <span className="text-[11px] text-slate-500">{t.marketSaturationLabel}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  handleSpeak(
                    `${t.competitorsTitle}: ${t.blockDensityLabel}: ${report.competitorMapping.blockDensityCount}. ${t.marketSaturationLabel}: ${report.competitorMapping.saturationIndex}. ${report.competitorMapping.competitiveAdvantageAngle}`,
                    'competitors'
                  )
                }
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
                title={t.listenReport}
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            {/* Saturation Gauge Box */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 mb-4 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-600 font-semibold">{t.blockDensityLabel}:</span>
                <span className="font-black text-slate-900 text-base">
                  ~{report.competitorMapping.blockDensityCount}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-600 font-semibold">{t.marketSaturationLabel}:</span>
                <span className="font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                  {report.competitorMapping.saturationIndex}
                </span>
              </div>
            </div>

            {/* Existing Competitor Types */}
            <div className="space-y-1.5 mb-4 text-xs">
              <span className="font-bold text-slate-700 block">{t.keyCompetitorsTitle}:</span>
              <ul className="space-y-1 text-slate-600">
                {report.competitorMapping.keyCompetitorTypes.map((type, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-teal-700 font-bold">›</span>
                    <span>{type}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
            <span className="font-bold text-emerald-950 block mb-0.5">
              {t.competitiveAdvantageTitle}:
            </span>
            <span className="text-emerald-900 leading-relaxed font-medium">
              {report.competitorMapping.competitiveAdvantageAngle}
            </span>
          </div>
        </div>

        {/* 6. Pricing Strategy */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-900 flex items-center justify-center font-bold text-xs">
                  <Tag className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    {t.pricingTitle}
                  </h3>
                  <span className="text-[11px] text-slate-500">{t.grossMarginLabel}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  handleSpeak(
                    `${t.pricingTitle}: ${t.sellingPriceLabel}: ${report.productMarketValue.recommendedSellingPrice}. ${t.grossMarginLabel}: ${report.productMarketValue.estimatedGrossMarginPercent}%. ${t.breakEvenLabel}: ${report.productMarketValue.breakEvenTimeMonths} ${t.monthsUnit}.`,
                    'pricing'
                  )
                }
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
                title={t.listenReport}
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            {/* Pricing Highlights */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200">
                <div className="text-[11px] text-emerald-800 font-semibold">{t.sellingPriceLabel}</div>
                <div className="text-sm font-black text-emerald-950 mt-1">
                  {report.productMarketValue.recommendedSellingPrice}
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-200">
                <div className="text-[11px] text-purple-800 font-semibold">{t.grossMarginLabel}</div>
                <div className="text-lg font-black text-purple-950 mt-0.5">
                  {report.productMarketValue.estimatedGrossMarginPercent}%
                </div>
              </div>
            </div>

            {/* Unit Cost Breakdown */}
            <div className="space-y-2 mb-4 text-xs">
              <span className="font-bold text-slate-700 block">{t.costOfGoodsLabel} & Breakdown:</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-center">
                  <div className="text-[10px] text-slate-500">{t.costOfGoodsLabel}</div>
                  <div className="font-bold text-slate-800 mt-0.5">{report.productMarketValue.unitCostBreakdown.costOfGoods}</div>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-center">
                  <div className="text-[10px] text-slate-500">{t.directLaborLabel}</div>
                  <div className="font-bold text-slate-800 mt-0.5">{report.productMarketValue.unitCostBreakdown.directLabor}</div>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-center">
                  <div className="text-[10px] text-slate-500">{t.overheadTransportLabel}</div>
                  <div className="font-bold text-slate-800 mt-0.5">{report.productMarketValue.unitCostBreakdown.overheadTransport}</div>
                </div>
                <div className="p-2 rounded-lg bg-emerald-100 text-center">
                  <div className="text-[10px] text-emerald-800 font-semibold">{t.netMarginLabel}</div>
                  <div className="font-black text-emerald-950 mt-0.5">{report.productMarketValue.unitCostBreakdown.netMargin}</div>
                </div>
              </div>
            </div>

            <div className="text-xs text-slate-600 space-y-1 mb-2">
              <span className="font-bold text-slate-700">{t.benchmarkRangeLabel}: </span>
              <span>{report.productMarketValue.regionalBenchmarkRange}</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-100 text-xs text-slate-700">
            <span className="font-bold">{t.purchasingPowerTitle}: </span>
            <span>{report.productMarketValue.regionalPurchasingPowerVerdict}</span>
          </div>
        </div>
      </div>

      {/* SCA Loan Officer Checklist */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <FileCheck className="w-5 h-5 text-emerald-600" />
          <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">
            {t.checklistTitle}
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1">
          {report.scaOfficerChecklist.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-start gap-2"
            >
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span className="text-slate-800 font-medium">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Proceed to DPR Button */}
      {onNext && (
        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={onNext}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
          >
            <span>{t.stepNextToDpr}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
