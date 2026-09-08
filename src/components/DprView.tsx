import React from 'react';
import { UserInputs, SchemeCalculation, HyperLocalFeasibilityReport, SupportedLanguage } from '../types';
import { translations } from '../utils/translations';
import { formatIndianCurrency } from '../utils/calculator';
import { Printer, Landmark, CheckCircle, ShieldCheck, FileText, Lightbulb } from 'lucide-react';

interface DprViewProps {
  inputs: UserInputs;
  calculation: SchemeCalculation;
  report: HyperLocalFeasibilityReport | null;
  language: SupportedLanguage;
  onOpenReportTab: () => void;
}

export const DprView: React.FC<DprViewProps> = ({
  inputs,
  calculation,
  report,
  language,
  onOpenReportTab,
}) => {
  const t = translations[language] || translations.en;

  const handlePrint = () => {
    window.print();
  };

  const isMicro = calculation.schemeType === 'MICRO_FINANCE';
  const schemeName = isMicro ? t.microFinanceTitle : t.termLoanTitle;

  const activeQuarterlyInstallment =
    calculation.quarterlyInstallments.find((q) => !q.isMoratorium)?.totalInstallment ||
    calculation.quarterlyInstallments[0]?.totalInstallment ||
    0;

  return (
    <div className="space-y-6" id="module-dpr-document">
      {/* Newcomer Clarity Guide Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/80 border border-emerald-200/90 flex items-start gap-3.5 text-emerald-950 shadow-xs print:hidden">
        <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
          <Lightbulb className="w-5 h-5" />
        </div>
        <div className="text-xs sm:text-sm leading-relaxed">
          <p className="font-semibold text-emerald-900 mb-0.5">
            {t.newcomerTipDpr}
          </p>
          <p className="text-emerald-800/90 text-xs mt-1">
            {t.dprReadyDesc}
          </p>
        </div>
      </div>

      {/* Top Banner & Print Controls */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
              {t.scaBadge}
            </span>
            <span className="text-xs text-slate-500 font-medium">{t.ratioBadge}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
            {t.dprReadyBanner}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            {t.dprReadyDesc}
          </p>
        </div>

        <button
          type="button"
          onClick={handlePrint}
          id="btn-print-dpr-page"
          className="shrink-0 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>{t.dprPrintButton}</span>
        </button>
      </div>

      {/* Printable Sheet */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-10 space-y-7 print:border-none print:shadow-none print:p-0">
        {/* Document Header */}
        <div className="border-b-2 border-slate-900 pb-5 text-center space-y-2">
          <div className="text-xs font-extrabold tracking-widest text-emerald-800 uppercase">
            {t.dprGovtReference}
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {t.dprHeading}
          </h1>
          <p className="text-xs text-slate-600 max-w-2xl mx-auto">
            {t.dprSubheading}
          </p>
          <div className="text-[11px] text-slate-500 pt-1">
            {t.dprDocRefLabel}: SCA/DPR/{(inputs.village || 'GP').slice(0, 3).toUpperCase()}-{Math.floor(1000 + Math.random() * 9000)} • {t.dprDateLabel}: {new Date().toLocaleDateString()}
          </div>
        </div>

        {/* Section 1: Entrepreneur Profile */}
        <div className="space-y-2">
          <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider bg-slate-100 p-2.5 rounded-lg">
            {t.dprSec1}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 border border-slate-200 rounded-xl">
              <span className="text-slate-500 block text-[11px] font-medium">{t.villageLabel}:</span>
              <span className="font-bold text-slate-900 text-sm mt-0.5 block">{inputs.village || 'Local Panchayat'}</span>
            </div>
            <div className="p-3 border border-slate-200 rounded-xl">
              <span className="text-slate-500 block text-[11px] font-medium">{t.blockLabel}:</span>
              <span className="font-bold text-slate-900 text-sm mt-0.5 block">{inputs.block || 'Local Block'}</span>
            </div>
            <div className="p-3 border border-slate-200 rounded-xl">
              <span className="text-slate-500 block text-[11px] font-medium">{t.districtLabel} & {t.stateLabel}:</span>
              <span className="font-bold text-slate-900 text-sm mt-0.5 block">{inputs.district}, {inputs.state}</span>
            </div>
            <div className="p-3 border border-slate-200 rounded-xl">
              <span className="text-slate-500 block text-[11px] font-medium">{t.categoryLabel}:</span>
              <span className="font-bold text-slate-900 text-sm mt-0.5 block">{inputs.businessCategory}</span>
            </div>
          </div>
        </div>

        {/* Section 2: Financial Structuring & Scheme Selection */}
        <div className="space-y-2">
          <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider bg-slate-100 p-2.5 rounded-lg">
            {t.dprSec2}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 border border-slate-200 rounded-xl bg-slate-50/50">
              <span className="text-slate-500 block text-[11px] font-medium">{t.margin10Label}:</span>
              <span className="text-base font-black text-slate-900 mt-0.5 block">{formatIndianCurrency(calculation.availableMargin)}</span>
            </div>
            <div className="p-3 border border-slate-200 rounded-xl bg-slate-50/50">
              <span className="text-slate-500 block text-[11px] font-medium">{t.projectCostLabel}:</span>
              <span className="text-base font-black text-slate-900 mt-0.5 block">{formatIndianCurrency(calculation.calculatedProjectCost)}</span>
            </div>
            <div className="p-3 border border-emerald-300 bg-emerald-50 rounded-xl">
              <span className="text-emerald-800 block text-[11px] font-bold">{t.loanEligibilityLabel}:</span>
              <span className="text-base font-black text-emerald-950 mt-0.5 block">{formatIndianCurrency(calculation.loanEligibility)}</span>
            </div>
            <div className="p-3 border border-slate-200 rounded-xl bg-slate-50/50">
              <span className="text-slate-500 block text-[11px] font-medium">{t.schemeSelected}:</span>
              <span className="text-xs font-black text-slate-900 mt-1 block">{schemeName}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
            <div className="p-2.5 border border-slate-200 rounded-xl bg-white">
              <span className="text-slate-500">{t.interestRateLabel}:</span> <span className="font-bold text-slate-900">{calculation.interestRate}% {t.perAnnum}</span>
            </div>
            <div className="p-2.5 border border-slate-200 rounded-xl bg-white">
              <span className="text-slate-500">{t.tenureLabel}:</span> <span className="font-bold text-slate-900">{calculation.tenureYears} {t.yearsUnit} ({calculation.quarterlyInstallments.length} {t.quartersUnit})</span>
            </div>
            <div className="p-2.5 border border-emerald-200 rounded-xl bg-emerald-50/60 text-emerald-950 font-bold">
              {t.moratoriumLabel}: {calculation.moratoriumMonths} {t.monthsUnit}
            </div>
          </div>
        </div>

        {/* Section 3: Capital Breakdown */}
        <div className="space-y-2">
          <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider bg-slate-100 p-2.5 rounded-lg">
            {t.dprSec3}
          </h2>
          <table className="w-full text-xs border border-slate-200 border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-left">
                <th className="p-2.5 font-bold text-slate-700">{t.tableComponent}</th>
                <th className="p-2.5 font-bold text-slate-700">{t.tableShare}</th>
                <th className="p-2.5 text-right font-bold text-slate-700">{t.tableAmount}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              <tr>
                <td className="p-2.5">{t.machineryAssetsLabel}</td>
                <td className="p-2.5">60%</td>
                <td className="p-2.5 text-right font-bold">{formatIndianCurrency(calculation.costBreakdown.machineryAssets)}</td>
              </tr>
              <tr>
                <td className="p-2.5">{t.workingCapitalLabel}</td>
                <td className="p-2.5">22%</td>
                <td className="p-2.5 text-right font-bold">{formatIndianCurrency(calculation.costBreakdown.workingCapitalRawMaterial)}</td>
              </tr>
              <tr>
                <td className="p-2.5">{t.infrastructureShedLabel}</td>
                <td className="p-2.5">12%</td>
                <td className="p-2.5 text-right font-bold">{formatIndianCurrency(calculation.costBreakdown.infrastructureShed)}</td>
              </tr>
              <tr>
                <td className="p-2.5">{t.contingencyLicensingLabel}</td>
                <td className="p-2.5">6%</td>
                <td className="p-2.5 text-right font-bold">{formatIndianCurrency(calculation.costBreakdown.licensingContingency)}</td>
              </tr>
              <tr className="bg-slate-100 font-black border-t-2 border-slate-900">
                <td className="p-2.5 uppercase">{t.tableTotal}</td>
                <td className="p-2.5">100%</td>
                <td className="p-2.5 text-right">{formatIndianCurrency(calculation.calculatedProjectCost)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Section 4: Feasibility Summary */}
        {report ? (
          <div className="space-y-2">
            <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider bg-slate-100 p-2.5 rounded-lg">
              {t.dprSec4}
            </h2>
            <div className="p-4 border border-slate-200 rounded-xl text-xs space-y-2.5 bg-slate-50/40">
              <div>
                <span className="font-bold text-slate-900">{t.catchmentPopulationLabel}: </span>
                <span className="text-slate-700">
                  {report.marketReach.population5to10km.toLocaleString()} ({report.marketReach.estimatedTargetHouseholds} {t.targetHouseholdsLabel}).
                </span>
              </div>
              <div>
                <span className="font-bold text-slate-900">{t.sellingPriceLabel} & {t.grossMarginLabel}: </span>
                <span className="text-slate-700">
                  {report.productMarketValue.recommendedSellingPrice} ({t.grossMarginLabel}: {report.productMarketValue.estimatedGrossMarginPercent}%). {t.breakEvenLabel}: {report.productMarketValue.breakEvenTimeMonths} {t.monthsUnit}.
                </span>
              </div>
              <div>
                <span className="font-bold text-slate-900">{t.threatsMitigationTitle}: </span>
                <span className="text-slate-700">
                  {report.threatsIdentification[0]?.practicalMitigation || ''}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-xl border border-dashed border-slate-300 text-center text-xs text-slate-500">
            <button
              type="button"
              onClick={onOpenReportTab}
              className="text-emerald-700 font-bold underline cursor-pointer"
            >
              {t.generateReportBtn}
            </button>
          </div>
        )}

        {/* Section 5: Repayment Schedule Summary */}
        <div className="space-y-2">
          <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider bg-slate-100 p-2.5 rounded-lg">
            {t.dprSec5}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
            <div className="p-2.5 border border-slate-200 bg-slate-50 rounded-xl">
              <span className="text-slate-500 block text-[10px]">{t.totalRepaymentLabel}:</span>
              <span className="font-black text-slate-900 text-sm mt-0.5 block">{formatIndianCurrency(calculation.totalRepayment)}</span>
            </div>
            <div className="p-2.5 border border-slate-200 bg-slate-50 rounded-xl">
              <span className="text-slate-500 block text-[10px]">{t.totalInterestLabel}:</span>
              <span className="font-bold text-slate-900 text-sm mt-0.5 block">{formatIndianCurrency(calculation.totalInterestPayable)}</span>
            </div>
            <div className="p-2.5 border border-slate-200 bg-slate-50 rounded-xl">
              <span className="text-slate-500 block text-[10px]">{t.quarterlyInstallmentLabel}:</span>
              <span className="font-bold text-emerald-800 text-sm mt-0.5 block">
                {formatIndianCurrency(activeQuarterlyInstallment)}
              </span>
            </div>
            <div className="p-2.5 border border-slate-200 bg-slate-50 rounded-xl">
              <span className="text-slate-500 block text-[10px]">{t.monthlyEmiLabel}:</span>
              <span className="font-bold text-slate-900 text-sm mt-0.5 block">{formatIndianCurrency(calculation.monthlyEquivalentEMI)} {t.perMonth}</span>
            </div>
          </div>
        </div>

        {/* Signatures */}
        <div className="pt-8 border-t border-slate-300 grid grid-cols-2 gap-10 text-xs">
          <div className="space-y-8">
            <div className="h-10 border-b border-dashed border-slate-400" />
            <div>
              <div className="font-bold text-slate-900">{t.dprApplicantSignature}</div>
              <div className="text-[11px] text-slate-500">{inputs.village}</div>
            </div>
          </div>
          <div className="space-y-8 text-right">
            <div className="h-10 border-b border-dashed border-slate-400" />
            <div>
              <div className="font-bold text-slate-900">{t.dprOfficerSignature}</div>
              <div className="text-[11px] text-slate-500">{t.dprOfficerDesignation}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
