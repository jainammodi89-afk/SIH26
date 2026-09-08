import React from 'react';
import { UserInputs, SchemeCalculation, HyperLocalFeasibilityReport, SupportedLanguage } from '../types';
import { translations } from '../utils/translations';
import { formatIndianCurrency } from '../utils/calculator';
import { X, Printer, Landmark, CheckCircle, ShieldCheck } from 'lucide-react';

interface DprDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  inputs: UserInputs;
  calculation: SchemeCalculation;
  report: HyperLocalFeasibilityReport | null;
  language: SupportedLanguage;
}

export const DprDocumentModal: React.FC<DprDocumentModalProps> = ({
  isOpen,
  onClose,
  inputs,
  calculation,
  report,
  language,
}) => {
  if (!isOpen) return null;

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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 print:p-0 print:bg-white">
      <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[92vh] print:max-h-none print:shadow-none print:border-none print:rounded-none">
        {/* Modal Top Bar (hidden during print) */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <Landmark className="w-5 h-5 text-emerald-400" />
            <span className="font-bold text-sm sm:text-base">
              {t.dprHeading}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              id="btn-print-dpr"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>{t.dprPrintButton}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              id="btn-close-dpr"
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* DPR Printable Content Body */}
        <div className="p-6 sm:p-10 overflow-y-auto space-y-6 text-slate-900 text-sm print:overflow-visible print:p-0">
          {/* Header */}
          <div className="border-b-2 border-slate-900 pb-4 text-center space-y-1">
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
            <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider bg-slate-100 p-2 rounded">
              {t.dprSec1}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-2 border border-slate-200 rounded">
                <span className="text-slate-500 block text-[10px]">{t.villageLabel}:</span>
                <span className="font-bold text-slate-900">{inputs.village || 'Local Panchayat'}</span>
              </div>
              <div className="p-2 border border-slate-200 rounded">
                <span className="text-slate-500 block text-[10px]">{t.blockLabel}:</span>
                <span className="font-bold text-slate-900">{inputs.block || 'Local Block'}</span>
              </div>
              <div className="p-2 border border-slate-200 rounded">
                <span className="text-slate-500 block text-[10px]">{t.districtLabel} & {t.stateLabel}:</span>
                <span className="font-bold text-slate-900">{inputs.district}, {inputs.state}</span>
              </div>
              <div className="p-2 border border-slate-200 rounded">
                <span className="text-slate-500 block text-[10px]">{t.categoryLabel}:</span>
                <span className="font-bold text-slate-900">{inputs.businessCategory}</span>
              </div>
            </div>
          </div>

          {/* Section 2: Financial Structuring & Scheme Selection */}
          <div className="space-y-2">
            <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider bg-slate-100 p-2 rounded">
              {t.dprSec2}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-2.5 border border-slate-200 rounded">
                <span className="text-slate-500 block text-[10px]">{t.margin10Label}:</span>
                <span className="text-base font-black text-slate-900">{formatIndianCurrency(calculation.availableMargin)}</span>
              </div>
              <div className="p-2.5 border border-slate-200 rounded">
                <span className="text-slate-500 block text-[10px]">{t.projectCostLabel}:</span>
                <span className="text-base font-black text-slate-900">{formatIndianCurrency(calculation.calculatedProjectCost)}</span>
              </div>
              <div className="p-2.5 border border-emerald-300 bg-emerald-50 rounded">
                <span className="text-emerald-800 block text-[10px] font-bold">{t.loanEligibilityLabel}:</span>
                <span className="text-base font-black text-emerald-950">{formatIndianCurrency(calculation.loanEligibility)}</span>
              </div>
              <div className="p-2.5 border border-slate-200 rounded">
                <span className="text-slate-500 block text-[10px]">{t.schemeSelected}:</span>
                <span className="text-xs font-black text-slate-900">{schemeName}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-xs pt-1">
              <div className="p-2 border border-slate-100 rounded bg-slate-50">
                <span className="text-slate-500">{t.interestRateLabel}:</span> <span className="font-bold">{calculation.interestRate}% {t.perAnnum}</span>
              </div>
              <div className="p-2 border border-slate-100 rounded bg-slate-50">
                <span className="text-slate-500">{t.tenureLabel}:</span> <span className="font-bold">{calculation.tenureYears} {t.yearsUnit} ({calculation.quarterlyInstallments.length} {t.quartersUnit})</span>
              </div>
              <div className="p-2 border border-slate-100 rounded bg-emerald-50 text-emerald-950 font-bold">
                {t.moratoriumLabel}: {calculation.moratoriumMonths} {t.monthsUnit}
              </div>
            </div>
          </div>

          {/* Section 3: Capital Allocation */}
          <div className="space-y-2">
            <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider bg-slate-100 p-2 rounded">
              {t.dprSec3}
            </h2>
            <table className="w-full text-xs border border-slate-200 border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-left">
                  <th className="p-2 font-bold">{t.tableComponent}</th>
                  <th className="p-2 font-bold">{t.tableShare}</th>
                  <th className="p-2 text-right font-bold">{t.tableAmount}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="p-2">{t.machineryAssetsLabel}</td>
                  <td className="p-2">60%</td>
                  <td className="p-2 text-right font-bold">{formatIndianCurrency(calculation.costBreakdown.machineryAssets)}</td>
                </tr>
                <tr>
                  <td className="p-2">{t.workingCapitalLabel}</td>
                  <td className="p-2">22%</td>
                  <td className="p-2 text-right font-bold">{formatIndianCurrency(calculation.costBreakdown.workingCapitalRawMaterial)}</td>
                </tr>
                <tr>
                  <td className="p-2">{t.infrastructureShedLabel}</td>
                  <td className="p-2">12%</td>
                  <td className="p-2 text-right font-bold">{formatIndianCurrency(calculation.costBreakdown.infrastructureShed)}</td>
                </tr>
                <tr>
                  <td className="p-2">{t.contingencyLicensingLabel}</td>
                  <td className="p-2">6%</td>
                  <td className="p-2 text-right font-bold">{formatIndianCurrency(calculation.costBreakdown.licensingContingency)}</td>
                </tr>
                <tr className="bg-slate-50 font-black border-t-2 border-slate-900">
                  <td className="p-2 uppercase">{t.tableTotal}</td>
                  <td className="p-2">100%</td>
                  <td className="p-2 text-right">{formatIndianCurrency(calculation.calculatedProjectCost)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Section 4: Feasibility Summary */}
          {report && (
            <div className="space-y-2">
              <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider bg-slate-100 p-2 rounded">
                {t.dprSec4}
              </h2>
              <div className="p-3 border border-slate-200 rounded text-xs space-y-2">
                <div>
                  <span className="font-bold">{t.catchmentPopulationLabel}: </span>
                  <span>{report.marketReach.population5to10km.toLocaleString()} ({report.marketReach.estimatedTargetHouseholds} {t.targetHouseholdsLabel}).</span>
                </div>
                <div>
                  <span className="font-bold">{t.sellingPriceLabel} & {t.grossMarginLabel}: </span>
                  <span>{report.productMarketValue.recommendedSellingPrice} ({t.grossMarginLabel}: {report.productMarketValue.estimatedGrossMarginPercent}%). {t.breakEvenLabel}: {report.productMarketValue.breakEvenTimeMonths} {t.monthsUnit}.</span>
                </div>
                <div>
                  <span className="font-bold">{t.threatsMitigationTitle}: </span>
                  <span>{report.threatsIdentification[0]?.practicalMitigation || ''}</span>
                </div>
              </div>
            </div>
          )}

          {/* Section 5: Repayment Schedule Summary */}
          <div className="space-y-2">
            <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider bg-slate-100 p-2 rounded">
              {t.dprSec5}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2 border border-slate-100 bg-slate-50 rounded">
                <span className="text-slate-500 block text-[10px]">{t.totalRepaymentLabel}:</span>
                <span className="font-black text-slate-900">{formatIndianCurrency(calculation.totalRepayment)}</span>
              </div>
              <div className="p-2 border border-slate-100 bg-slate-50 rounded">
                <span className="text-slate-500 block text-[10px]">{t.totalInterestLabel}:</span>
                <span className="font-bold text-slate-900">{formatIndianCurrency(calculation.totalInterestPayable)}</span>
              </div>
              <div className="p-2 border border-slate-100 bg-slate-50 rounded">
                <span className="text-slate-500 block text-[10px]">{t.quarterlyInstallmentLabel}:</span>
                <span className="font-bold text-emerald-800">
                  {formatIndianCurrency(activeQuarterlyInstallment)}
                </span>
              </div>
              <div className="p-2 border border-slate-100 bg-slate-50 rounded">
                <span className="text-slate-500 block text-[10px]">{t.monthlyEmiLabel}:</span>
                <span className="font-bold text-slate-900">{formatIndianCurrency(calculation.monthlyEquivalentEMI)} {t.perMonth}</span>
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
    </div>
  );
};
