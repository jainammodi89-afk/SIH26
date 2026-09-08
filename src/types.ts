export type SupportedLanguage = 'en' | 'hi' | 'mr' | 'ta' | 'te' | 'bn' | 'gu' | 'kn';

export type AppTab = 'setup' | 'calculator' | 'feasibility' | 'dpr' | 'advisor';

export interface UserInputs {
  village: string;
  block: string;
  district: string;
  state: string;
  availableMargin: number;
  businessCategory: string;
  businessSubtype?: string;
  language: SupportedLanguage;
  experienceYears?: number;
  promoterCategory?: 'OBC' | 'SC' | 'ST' | 'Safai Karamchari' | 'Minority' | 'General';
}

export type SchemeType = 'MICRO_FINANCE' | 'TERM_LOAN' | 'EXCEEDS_CAP';

export interface QuarterlyInstallment {
  quarter: number;
  monthRange: string;
  isMoratorium: boolean;
  openingBalance: number;
  principalRepayment: number;
  interestPayment: number;
  totalInstallment: number;
  closingBalance: number;
  // Aliases for resilience across components
  principalDue?: number;
  interestDue?: number;
}

export interface SchemeCalculation {
  availableMargin: number;
  promoterMargin10?: number;
  calculatedProjectCost: number;
  loanEligibility: number;
  actualMarginAmount: number;
  schemeType: SchemeType;
  schemeName: string;
  interestRate: number; // e.g. 6.5 or 8.0
  concessionalInterestRate?: number;
  tenureYears: number; // 3 or 7
  totalTenureYears?: number;
  tenureMonths: number; // 36 or 84
  moratoriumMonths: number; // 3 or 6
  maxLoanCap: number; // 125000 or 4500000
  quarterlyInstallments: QuarterlyInstallment[];
  monthlyEquivalentEMI: number;
  totalInterestPayable: number;
  totalRepayment: number;
  costBreakdown: {
    machineryAssets: number;
    workingCapitalRawMaterial: number;
    infrastructureShed: number;
    licensingContingency: number;
  };
  capitalBreakdown?: {
    machineryAndEquipment: number;
    workingCapital: number;
    shedCivilWorks: number;
    contingencyAndLicensing: number;
  };
}

export interface DistributionChannel {
  channel: string;
  reachShare: string;
  description: string;
  frequency: string;
}

export interface ThreatItem {
  threat: string;
  category: 'Supply Chain' | 'Seasonal Demand' | 'Buyer Dependency' | 'Infrastructure & Power' | 'Working Capital';
  riskLevel: 'Low' | 'Moderate' | 'High';
  impactDescription: string;
  practicalMitigation: string;
}

export interface HyperLocalFeasibilityReport {
  executiveSummary: string;
  marketReach: {
    population5to10km: number;
    estimatedTargetHouseholds: number;
    dailyWeeklyDemandUnits: string;
    primaryDistributionChannels: DistributionChannel[];
    logisticsFeasibility: string;
  };
  opportunityAnalysis: {
    underservedNiches: string[];
    valueAdditionPotential: string;
    localDemandDrivers: string[];
    recommendedInitialScale: string;
  };
  swotAnalysis: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  threatsIdentification: ThreatItem[];
  competitorMapping: {
    blockDensityCount: number;
    saturationIndex: 'Under-saturated' | 'Balanced Growth Potential' | 'High Competition';
    saturationScore: number;
    keyCompetitorTypes: string[];
    competitiveAdvantageAngle: string;
  };
  productMarketValue: {
    recommendedSellingPrice: string;
    regionalBenchmarkRange: string;
    estimatedGrossMarginPercent: number;
    breakEvenTimeMonths: number;
    unitCostBreakdown: {
      costOfGoods: string;
      directLabor: string;
      overheadTransport: string;
      netMargin: string;
    };
    regionalPurchasingPowerVerdict: string;
  };
  scaOfficerChecklist: string[];
}

export interface PresetProfile {
  name: string;
  entrepreneur: string;
  village: string;
  block: string;
  district: string;
  state: string;
  margin: number;
  category: string;
  subtype: string;
  tag: string;
  description: string;
  names?: Partial<Record<SupportedLanguage, string>>;
  tags?: Partial<Record<SupportedLanguage, string>>;
  descriptions?: Partial<Record<SupportedLanguage, string>>;
}
