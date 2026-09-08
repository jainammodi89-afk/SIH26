import React from 'react';
import { UserInputs, SupportedLanguage } from '../types';
import { translations } from '../utils/translations';
import { RURAL_PRESETS, BUSINESS_CATEGORIES } from '../data/presets';
import { calculateScaFinancials, formatIndianCurrency } from '../utils/calculator';
import {
  MapPin,
  Coins,
  Briefcase,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Check,
  Info,
  Building,
  User,
  Lightbulb,
} from 'lucide-react';

interface InputFormProps {
  inputs: UserInputs;
  onChange: (inputs: UserInputs) => void;
  onSubmit: () => void;
  isLoading: boolean;
  language: SupportedLanguage;
}

const QUICK_MARGIN_AMOUNTS = [10000, 14000, 25000, 50000, 100000, 250000, 500000];

export const InputForm: React.FC<InputFormProps> = ({
  inputs,
  onChange,
  onSubmit,
  isLoading,
  language,
}) => {
  const t = translations[language] || translations.en;

  // Real-time scheme calculation preview as user edits margin
  const liveCalc = React.useMemo(() => {
    return calculateScaFinancials(inputs.availableMargin);
  }, [inputs.availableMargin]);

  const handleApplyPreset = (preset: typeof RURAL_PRESETS[0]) => {
    onChange({
      ...inputs,
      village: preset.village,
      block: preset.block,
      district: preset.district,
      state: preset.state,
      availableMargin: preset.margin,
      businessCategory: preset.category,
      businessSubtype: preset.subtype,
    });
  };

  const selectedCategoryObj =
    BUSINESS_CATEGORIES.find((c) => c.id === inputs.businessCategory) ||
    BUSINESS_CATEGORIES[0];

  const availableSubtypes =
    selectedCategoryObj.subtypes[language] || selectedCategoryObj.subtypes.en;

  const isMicro = liveCalc.schemeType === 'MICRO_FINANCE';

  return (
    <div className="space-y-6" id="module-setup-form">
      {/* Newcomer Clarity Guide Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/80 border border-emerald-200/90 flex items-start gap-3.5 text-emerald-950 shadow-xs">
        <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
          <Lightbulb className="w-5 h-5" />
        </div>
        <div className="text-xs sm:text-sm leading-relaxed">
          <p className="font-semibold mb-0.5 text-emerald-900">
            {t.newcomerTipSetup}
          </p>
          <p className="text-emerald-800/90 text-xs mt-1">
            {t.marginFormulaNote}
          </p>
        </div>
      </div>

      {/* Verified Rural Business Presets Carousel */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
              {t.presetsTitle}
            </span>
          </div>
          <span className="text-xs text-slate-500 hidden sm:inline">
            {t.presetsSubtitle}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {RURAL_PRESETS.map((preset, idx) => {
            const isMatch =
              inputs.village === preset.village &&
              inputs.availableMargin === preset.margin &&
              inputs.businessCategory === preset.category;
            const presetName = preset.names?.[language] || preset.name;
            const presetTag = preset.tags?.[language] || preset.tag;
            const presetDesc = preset.descriptions?.[language] || preset.description;

            return (
              <button
                key={idx}
                type="button"
                id={`preset-btn-${idx}`}
                onClick={() => handleApplyPreset(preset)}
                className={`text-left p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isMatch
                    ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/30 text-emerald-950 font-medium shadow-xs'
                    : 'border-slate-200 hover:border-emerald-300 hover:bg-slate-50/80 bg-white text-slate-800'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700">
                      {presetTag}
                    </span>
                    {isMatch && <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                  </div>
                  <div className="font-bold text-xs sm:text-sm text-slate-900 line-clamp-1">
                    {presetName}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="truncate">{preset.village}</span>
                  </div>
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-100/90 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">{t.margin10Label}:</span>
                  <span className="font-extrabold text-emerald-800">
                    {formatIndianCurrency(preset.margin)}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="space-y-6"
      >
        {/* Top 2-Column Grid: Location & Margin Money */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 1. Geographic Location */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-900 flex items-center justify-center font-bold text-xs">
                1
              </div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-700" />
                {t.geographicTitle}
              </h3>
            </div>

            <div className="space-y-3.5">
              <div>
                <label
                  htmlFor="input-village"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  {t.villageLabel} <span className="text-rose-500">*</span>
                </label>
                <input
                  id="input-village"
                  type="text"
                  required
                  value={inputs.village}
                  onChange={(e) => onChange({ ...inputs, village: e.target.value })}
                  placeholder={t.villagePlaceholder}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                />
              </div>

              <div>
                <label
                  htmlFor="input-block"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  {t.blockLabel} <span className="text-rose-500">*</span>
                </label>
                <input
                  id="input-block"
                  type="text"
                  required
                  value={inputs.block}
                  onChange={(e) => onChange({ ...inputs, block: e.target.value })}
                  placeholder={t.blockPlaceholder}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="input-district"
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    {t.districtLabel} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="input-district"
                    type="text"
                    required
                    value={inputs.district}
                    onChange={(e) => onChange({ ...inputs, district: e.target.value })}
                    placeholder={t.districtPlaceholder}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                  />
                </div>

                <div>
                  <label
                    htmlFor="input-state"
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    {t.stateLabel} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="input-state"
                    type="text"
                    required
                    value={inputs.state}
                    onChange={(e) => onChange({ ...inputs, state: e.target.value })}
                    placeholder={t.statePlaceholder}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 2. Margin Capital & 10:90 Auto-Router */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 gap-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-xs">
                  2
                </div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Coins className="w-4 h-4 text-amber-700" />
                  {t.marginSectionTitle}
                </h3>
              </div>
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-300">
                {t.ratioBadge}
              </span>
            </div>

            <p className="text-xs text-slate-600">
              {t.marginCapitalHint}
            </p>

            {/* Quick Margin Selection Buttons */}
            <div>
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                {t.quickMarginButtons}
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                {QUICK_MARGIN_AMOUNTS.map((amt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    id={`quick-margin-btn-${idx}`}
                    onClick={() => onChange({ ...inputs, availableMargin: amt })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      inputs.availableMargin === amt
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {formatIndianCurrency(amt)}
                  </button>
                ))}
              </div>
            </div>

            {/* Margin Input Field & Slider */}
            <div className="space-y-2 pt-2">
              <label
                htmlFor="input-margin-amount"
                className="block text-xs font-semibold text-slate-700"
              >
                {t.marginInputLabel}
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500 font-bold text-base">
                  {t.rupeeSymbol}
                </span>
                <input
                  id="input-margin-amount"
                  type="number"
                  min="5000"
                  max="5000000"
                  step="1000"
                  value={inputs.availableMargin || ''}
                  onChange={(e) =>
                    onChange({
                      ...inputs,
                      availableMargin: Number(e.target.value) || 0,
                    })
                  }
                  placeholder="14000"
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-300 text-base font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-white"
                />
              </div>

              <input
                type="range"
                min="5000"
                max="500000"
                step="5000"
                value={inputs.availableMargin || 10000}
                onChange={(e) =>
                  onChange({
                    ...inputs,
                    availableMargin: Number(e.target.value),
                  })
                }
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>

            {/* Instant Visual 10:90 Balance Card */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">{t.youInvestLabel}:</span>
                <span className="font-bold text-slate-900">
                  {formatIndianCurrency(liveCalc.availableMargin)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">{t.govtGivesLabel}:</span>
                <span className="font-extrabold text-emerald-700">
                  {formatIndianCurrency(liveCalc.loanEligibility)}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                <span className="font-bold text-slate-800">{t.totalBusinessLabel}:</span>
                <span className="font-black text-slate-900 text-sm">
                  {formatIndianCurrency(liveCalc.calculatedProjectCost)}
                </span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-slate-500">{t.schemeSelected}:</span>
                <span className="font-bold text-emerald-800">
                  {isMicro ? t.microFinanceTitle : t.termLoanTitle} ({liveCalc.interestRate}%)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Proposed Business Category & Enterprise Details */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-900 flex items-center justify-center font-bold text-xs">
              3
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-blue-700" />
                {t.categorySectionTitle}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {t.categoryHint}
              </p>
            </div>
          </div>

          {/* Trade Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {BUSINESS_CATEGORIES.map((cat) => {
              const isSelected = inputs.businessCategory === cat.id;
              const catTitle = cat.names[language] || cat.names.en;
              const catDesc = cat.descriptions[language] || cat.descriptions.en;
              const firstSub = (cat.subtypes[language] || cat.subtypes.en)[0];

              return (
                <button
                  key={cat.id}
                  type="button"
                  id={`cat-btn-${cat.id.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                  onClick={() =>
                    onChange({
                      ...inputs,
                      businessCategory: cat.id,
                      businessSubtype: firstSub,
                    })
                  }
                  className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/60 shadow-xs ring-2 ring-emerald-500/25'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="font-bold text-slate-900 text-xs sm:text-sm mb-1">
                    {catTitle}
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {catDesc}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Subtype Selection Chips */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <span className="text-xs font-bold text-slate-700">
              {t.subtypeLabel}:
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              {availableSubtypes.map((sub, idx) => (
                <button
                  key={idx}
                  type="button"
                  id={`subtype-chip-${idx}`}
                  onClick={() => onChange({ ...inputs, businessSubtype: sub })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    inputs.businessSubtype === sub
                      ? 'bg-emerald-700 text-white shadow-xs font-semibold'
                      : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          </div>

          {/* Additional details: Category & Experience */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label
                htmlFor="select-promoter-cat"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                {t.promoterCategoryLabel}
              </label>
              <select
                id="select-promoter-cat"
                value={inputs.promoterCategory || 'OBC'}
                onChange={(e) =>
                  onChange({
                    ...inputs,
                    promoterCategory: e.target.value as any,
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              >
                <option value="OBC">OBC (Other Backward Classes - NBCFDC)</option>
                <option value="SC">SC (Scheduled Castes - NSFDC)</option>
                <option value="ST">ST (Scheduled Tribes - NSTFDC)</option>
                <option value="Minority">Minority Communities (NMDFC)</option>
                <option value="SafaiKaramchari">Safai Karamchari (NSKFDC)</option>
                <option value="General">General / Women SHG Member</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="input-experience-years"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                {t.experienceYearsLabel}
              </label>
              <input
                id="input-experience-years"
                type="number"
                min="0"
                max="40"
                value={inputs.experienceYears ?? 2}
                onChange={(e) =>
                  onChange({
                    ...inputs,
                    experienceYears: Number(e.target.value) || 0,
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            id="btn-generate-feasibility"
            disabled={isLoading}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                <span>{t.generatingReport}</span>
              </>
            ) : (
              <>
                <span>{t.generateReportBtn}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
