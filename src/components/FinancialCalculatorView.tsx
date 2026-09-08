import React from 'react';
import { SchemeCalculation, SupportedLanguage } from '../types';
import { translations } from '../utils/translations';
import { formatIndianCurrency } from '../utils/calculator';
import {
  CheckCircle2,
  Calendar,
  Percent,
  Clock,
  HelpCircle,
  TrendingUp,
  AlertCircle,
  PiggyBank,
  Wallet,
  Building,
  Sliders,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';

interface FinancialCalculatorViewProps {
  calculation: SchemeCalculation;
  language: SupportedLanguage;
  onNext?: () => void;
}

export const FinancialCalculatorView: React.FC<FinancialCalculatorViewProps> = ({
  calculation,
  language,
  onNext,
}) => {
  const t = translations[language] || translations.en;
  const [viewMode, setViewMode] = React.useState<'quarterly' | 'monthly'>('quarterly');
  const [showAllQuarters, setShowAllQuarters] = React.useState(false);

  // What-if simulator state
  const [revenueDrop, setRevenueDrop] = React.useState(0); // 0 to 30%
  const [costInflation, setCostInflation] = React.useState(0); // 0 to 20%

  const isMicro = calculation.schemeType === 'MICRO_FINANCE';
  const schemeTitle = isMicro ? t.microFinanceTitle : t.termLoanTitle;

  // Base monthly revenue estimate (approx 22% of project cost for active rural unit)
  const baseMonthlyRevenue = Math.round(calculation.calculatedProjectCost * 0.22);
  const stressedRevenue = Math.round(baseMonthlyRevenue * (1 - revenueDrop / 100));

  const baseMonthlyOpex = Math.round(baseMonthlyRevenue * 0.7);
  const stressedOpex = Math.round(baseMonthlyOpex * (1 + costInflation / 100));

  const stressedNetSurplus = stressedRevenue - stressedOpex;
  const dscrRatio = stressedNetSurplus / Math.max(1, calculation.monthlyEquivalentEMI);

  const displayedQuarters = showAllQuarters
    ? calculation.quarterlyInstallments
    : calculation.quarterlyInstallments.slice(0, 8);

  return (
    <div className="space-y-6" id="module-financial-calculator">
      {/* Newcomer Clarity Tip Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/80 border border-emerald-200/90 flex items-start gap-3.5 text-emerald-950 shadow-xs">
        <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
          <Lightbulb className="w-5 h-5" />
        </div>
        <div className="text-xs sm:text-sm leading-relaxed">
          <p className="font-semibold text-emerald-900 mb-0.5">
            {t.newcomerTipCalc}
          </p>
          <p className="text-emerald-800/90 text-xs mt-1">
            {t.moratoriumNotice}
          </p>
        </div>
      </div>

      {/* Main Loan Structuring Banner */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
              {t.scaBadge}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              {t.ratioBadge}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
            {t.financialStructuringTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            {t.financialStructuringSubtitle}
          </p>
        </div>

        {/* Selected Scheme Badge */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left md:text-right shrink-0">
          <div className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
            {t.schemeSelected}
          </div>
          <div className="text-base sm:text-lg font-black text-slate-900 mt-0.5">
            {schemeTitle}
          </div>
          <div className="text-xs text-slate-500 flex items-center md:justify-end gap-1.5 mt-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              {calculation.interestRate}% {t.interestLabelShort} • {calculation.moratoriumMonths} {t.monthsUnit} {t.graceLabelShort}
            </span>
          </div>
        </div>
      </div>

      {/* 3 Key Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Metric 1: Promoter Margin */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
            <span>{t.margin10Label}</span>
            <PiggyBank className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            {formatIndianCurrency(calculation.availableMargin)}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {t.projectCostLabel}: {formatIndianCurrency(calculation.calculatedProjectCost)}
          </div>
        </div>

        {/* Metric 2: 90% Concessional Credit */}
        <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 shadow-xs">
          <div className="flex items-center justify-between text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
            <span>{t.loan90Label}</span>
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl font-black text-emerald-950">
            {formatIndianCurrency(calculation.loanEligibility)}
          </div>
          <div className="text-xs text-emerald-800 mt-1">
            {calculation.interestRate}% {t.perAnnum} • {calculation.tenureYears} {t.yearsUnit}
          </div>
        </div>

        {/* Metric 3: Monthly Budget Guide (EMI) */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
            <span>{t.monthlyEmiLabel}</span>
            <Wallet className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            {formatIndianCurrency(calculation.monthlyEquivalentEMI)}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {t.monthlyEmiHint}
          </div>
        </div>
      </div>

      {/* Capital Expenditure Allocation (CAPEX / OPEX 60:22:12:6) */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {t.capitalBreakdownTitle}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {t.totalBusinessLabel}: {formatIndianCurrency(calculation.calculatedProjectCost)}
            </p>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="w-full h-4 rounded-full overflow-hidden flex bg-slate-100 p-0.5 gap-0.5">
          <div className="bg-emerald-600 h-full rounded-l-full transition-all" style={{ width: '60%' }} title="Machinery 60%" />
          <div className="bg-blue-600 h-full transition-all" style={{ width: '22%' }} title="Working Capital 22%" />
          <div className="bg-amber-500 h-full transition-all" style={{ width: '12%' }} title="Shed 12%" />
          <div className="bg-purple-600 h-full rounded-r-full transition-all" style={{ width: '6%' }} title="Contingency 6%" />
        </div>

        {/* Breakdown Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-semibold text-slate-700">{t.machineryAssetsLabel}</span>
              <span className="font-bold text-emerald-700">60%</span>
            </div>
            <div className="text-base font-extrabold text-slate-900">
              {formatIndianCurrency(calculation.costBreakdown?.machineryAssets ?? calculation.capitalBreakdown?.machineryAndEquipment ?? 0)}
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-semibold text-slate-700">{t.workingCapitalLabel}</span>
              <span className="font-bold text-blue-700">22%</span>
            </div>
            <div className="text-base font-extrabold text-slate-900">
              {formatIndianCurrency(calculation.costBreakdown?.workingCapitalRawMaterial ?? calculation.capitalBreakdown?.workingCapital ?? 0)}
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-semibold text-slate-700">{t.infrastructureShedLabel}</span>
              <span className="font-bold text-amber-700">12%</span>
            </div>
            <div className="text-base font-extrabold text-slate-900">
              {formatIndianCurrency(calculation.costBreakdown?.infrastructureShed ?? calculation.capitalBreakdown?.shedCivilWorks ?? 0)}
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-semibold text-slate-700">{t.contingencyLicensingLabel}</span>
              <span className="font-bold text-purple-700">6%</span>
            </div>
            <div className="text-base font-extrabold text-slate-900">
              {formatIndianCurrency(calculation.costBreakdown?.licensingContingency ?? calculation.capitalBreakdown?.contingencyAndLicensing ?? 0)}
            </div>
          </div>
        </div>
      </div>

      {/* Repayment Schedule Table */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {t.repaymentScheduleTitle}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {calculation.quarterlyInstallments.length} {t.quartersUnit} ({calculation.tenureYears} {t.yearsUnit}) • {t.moratoriumLabel}: {calculation.moratoriumMonths} {t.monthsUnit}
            </p>
          </div>

          {/* Toggle View */}
          <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs">
            <button
              type="button"
              onClick={() => setViewMode('quarterly')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                viewMode === 'quarterly'
                  ? 'bg-white shadow-xs text-slate-900 font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.scheduleQuarterlyTab}
            </button>
            <button
              type="button"
              onClick={() => setViewMode('monthly')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                viewMode === 'monthly'
                  ? 'bg-white shadow-xs text-slate-900 font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.scheduleMonthlyTab}
            </button>
          </div>
        </div>

        {/* Schedule Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-3.5">{t.quarterLabel}</th>
                <th className="py-3 px-3.5">{t.monthRangeLabel}</th>
                <th className="py-3 px-3.5 text-right">{t.openingBalLabel}</th>
                <th className="py-3 px-3.5 text-right">{t.principalLabel}</th>
                <th className="py-3 px-3.5 text-right">{t.interestLabel}</th>
                <th className="py-3 px-3.5 text-right font-extrabold">{t.totalDueLabel}</th>
                <th className="py-3 px-3.5 text-right">{t.closingBalLabel}</th>
                <th className="py-3 px-3.5 text-center">{t.statusLabel}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayedQuarters.map((q) => {
                const principal = q.principalRepayment ?? q.principalDue ?? 0;
                const interest = q.interestPayment ?? q.interestDue ?? 0;
                const totalDue = q.totalInstallment ?? (principal + interest);
                const isGrace = q.isMoratorium;

                return (
                  <tr
                    key={q.quarter}
                    className={`hover:bg-slate-50/70 transition-colors ${
                      isGrace ? 'bg-amber-50/40 text-amber-950' : 'text-slate-800'
                    }`}
                  >
                    <td className="py-2.5 px-3.5 font-bold">
                      Q{q.quarter}
                    </td>
                    <td className="py-2.5 px-3.5 text-slate-500">
                      {q.monthRange}
                    </td>
                    <td className="py-2.5 px-3.5 text-right text-slate-600">
                      {formatIndianCurrency(q.openingBalance)}
                    </td>
                    <td className="py-2.5 px-3.5 text-right font-semibold text-slate-900">
                      {formatIndianCurrency(principal)}
                    </td>
                    <td className="py-2.5 px-3.5 text-right text-slate-600">
                      {formatIndianCurrency(interest)}
                    </td>
                    <td className="py-2.5 px-3.5 text-right font-extrabold text-emerald-800 text-sm">
                      {formatIndianCurrency(totalDue)}
                    </td>
                    <td className="py-2.5 px-3.5 text-right text-slate-600">
                      {formatIndianCurrency(q.closingBalance)}
                    </td>
                    <td className="py-2.5 px-3.5 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          isGrace
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        }`}
                      >
                        {isGrace ? t.moratoriumGrace : t.activeRepayment}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Show More / Show Less Quarters Button */}
        {calculation.quarterlyInstallments.length > 8 && (
          <div className="pt-2 text-center border-t border-slate-100">
            <button
              type="button"
              id="btn-toggle-all-quarters"
              onClick={() => setShowAllQuarters(!showAllQuarters)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer border border-slate-200"
            >
              {showAllQuarters ? (
                <>
                  <ChevronUp className="w-3.5 h-3.5" />
                  <span>{t.showFewerQuarters}</span>
                </>
              ) : (
                <>
                  <ChevronDown className="w-3.5 h-3.5" />
                  <span>{t.showAllQuarters} ({calculation.quarterlyInstallments.length} {t.quartersUnit})</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Solvency & Cash Flow Stress Testing (DSCR) */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-emerald-700" />
            {t.sensitivityTitle}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {t.sensitivitySubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Sliders */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
                <span>{t.revenueDropLabel}:</span>
                <span className="text-rose-600 font-bold">-{revenueDrop}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="30"
                step="5"
                value={revenueDrop}
                onChange={(e) => setRevenueDrop(Number(e.target.value))}
                className="w-full accent-rose-600 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
                <span>{t.costInflationLabel}:</span>
                <span className="text-amber-600 font-bold">+{costInflation}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="25"
                step="5"
                value={costInflation}
                onChange={(e) => setCostInflation(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer"
              />
            </div>
          </div>

          {/* Result Card: DSCR Metric & Evaluation */}
          <div
            className={`p-4 rounded-xl border text-xs sm:text-sm space-y-2 ${
              dscrRatio >= 1.5
                ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
                : dscrRatio >= 1.2
                ? 'bg-amber-50/70 border-amber-300 text-amber-950'
                : 'bg-rose-50/70 border-rose-300 text-rose-950'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs uppercase tracking-wider">{t.dscrLabel}:</span>
              <span className="text-xl font-black">{dscrRatio.toFixed(2)}x</span>
            </div>
            <p className="font-medium text-xs leading-relaxed">
              {dscrRatio >= 1.5
                ? t.dscrSafe
                : dscrRatio >= 1.2
                ? t.dscrModerate
                : t.dscrStressed}
            </p>
          </div>
        </div>
      </div>

      {/* Proceed to Step 3 */}
      {onNext && (
        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={onNext}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
          >
            <span>{t.stepNextToFeasibility}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
