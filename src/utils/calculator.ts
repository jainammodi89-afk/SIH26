import { SchemeCalculation, SchemeType, QuarterlyInstallment } from '../types';

export function calculateScaFinancials(availableMargin: number): SchemeCalculation {
  const margin = Math.max(1000, availableMargin || 10000);
  // Total Feasible Project Cost = Available Margin / 10%
  const calculatedProjectCost = Math.round(margin / 0.1);

  let schemeType: SchemeType = 'MICRO_FINANCE';
  let schemeName = 'Micro Finance Scheme';
  let interestRate = 6.5; // % per annum
  let tenureYears = 3;
  let moratoriumMonths = 3;
  let maxLoanCap = 125000; // ₹1.25 Lakh ceiling

  if (calculatedProjectCost <= 140000) {
    schemeType = 'MICRO_FINANCE';
    schemeName = 'Micro Finance Scheme';
    interestRate = 6.5;
    tenureYears = 3;
    moratoriumMonths = 3;
    maxLoanCap = 125000;
  } else if (calculatedProjectCost <= 5000000) {
    schemeType = 'TERM_LOAN';
    schemeName = 'Term Loan Scheme';
    interestRate = 8.0;
    tenureYears = 7;
    moratoriumMonths = 6;
    maxLoanCap = 4500000; // ₹45.00 Lakh ceiling
  } else {
    schemeType = 'EXCEEDS_CAP';
    schemeName = 'Term Loan Scheme (Co-Financing / Cap Adjusted)';
    interestRate = 8.0;
    tenureYears = 7;
    moratoriumMonths = 6;
    maxLoanCap = 4500000;
  }

  // 90% Loan Amount, capped at scheme ceiling
  const rawLoan = calculatedProjectCost * 0.9;
  const loanEligibility = Math.min(rawLoan, maxLoanCap);
  const actualMarginAmount = calculatedProjectCost - loanEligibility;

  const totalQuarters = tenureYears * 4;
  const moratoriumQuarters = Math.ceil(moratoriumMonths / 3);
  const activeRepaymentQuarters = totalQuarters - moratoriumQuarters;

  const quarterlyPrincipal = loanEligibility / activeRepaymentQuarters;
  const quarterlyInterestRate = interestRate / 100 / 4;

  const quarterlyInstallments: QuarterlyInstallment[] = [];
  let currentBalance = loanEligibility;
  let totalInterestPayable = 0;

  for (let q = 1; q <= totalQuarters; q++) {
    const isMoratorium = q <= moratoriumQuarters;
    const openingBalance = currentBalance;
    const interestPayment = Math.round(openingBalance * quarterlyInterestRate);
    totalInterestPayable += interestPayment;

    let principalRepayment = 0;
    if (!isMoratorium) {
      principalRepayment = Math.min(Math.round(quarterlyPrincipal), currentBalance);
      // Last quarter adjust remainder
      if (q === totalQuarters) {
        principalRepayment = currentBalance;
      }
    }

    const totalInstallment = principalRepayment + interestPayment;
    const closingBalance = Math.max(0, openingBalance - principalRepayment);
    currentBalance = closingBalance;

    const startMonth = (q - 1) * 3 + 1;
    const endMonth = q * 3;
    const monthRange = `M${startMonth}–M${endMonth}${isMoratorium ? ' (Moratorium)' : ''}`;

    quarterlyInstallments.push({
      quarter: q,
      monthRange,
      isMoratorium,
      openingBalance,
      principalRepayment,
      interestPayment,
      totalInstallment,
      closingBalance,
      principalDue: principalRepayment,
      interestDue: interestPayment,
    });
  }

  const totalRepayment = loanEligibility + totalInterestPayable;
  // Average monthly equivalent for budgeting
  const monthlyEquivalentEMI = Math.round(totalRepayment / (tenureYears * 12));

  // Realistic micro-enterprise capital structuring
  const costBreakdown = {
    machineryAssets: Math.round(calculatedProjectCost * 0.60), // Plant, machinery, livestock, racks, tools
    workingCapitalRawMaterial: Math.round(calculatedProjectCost * 0.22), // Inventory, raw feed, ingredients
    infrastructureShed: Math.round(calculatedProjectCost * 0.12), // Civil shed renovation, electricals, sanitation
    licensingContingency: Math.round(calculatedProjectCost * 0.06), // FSSAI, local panchayat trade license, emergency buffer
  };

  const capitalBreakdown = {
    machineryAndEquipment: costBreakdown.machineryAssets,
    workingCapital: costBreakdown.workingCapitalRawMaterial,
    shedCivilWorks: costBreakdown.infrastructureShed,
    contingencyAndLicensing: costBreakdown.licensingContingency,
  };

  return {
    availableMargin: margin,
    promoterMargin10: margin,
    calculatedProjectCost,
    loanEligibility,
    actualMarginAmount,
    schemeType,
    schemeName,
    interestRate,
    concessionalInterestRate: interestRate,
    tenureYears,
    totalTenureYears: tenureYears,
    tenureMonths: tenureYears * 12,
    moratoriumMonths,
    maxLoanCap,
    quarterlyInstallments,
    monthlyEquivalentEMI,
    totalInterestPayable,
    totalRepayment,
    costBreakdown,
    capitalBreakdown,
  };
}

export function formatIndianCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatInLakhs(amount: number): string {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  }
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} Lakh`;
  }
  if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(1)}k`;
  }
  return `₹${amount}`;
}
