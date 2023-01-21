import {
  Investment
} from './investment';
import {
  Forum
} from './forum';

export interface Round {
  id?: number;
  duration: number;
  type?: string;
  status?: string;
  presentationOffer: string;
  presentationInvestors: string;
  valuationDoc: string;
  legalDocuments: string;
  maximumValuation: number;
  minimumValuation: number;
  offerVideo: string;
  partnerParticipation: number;
  quotas: number;
  quotaValue: number;
  riskiness: string;
  roadmap: string;
  targets: string;
  potentialMarket: string;
  achievements: string;
  business: string;
  executiveTeam: string;
  logo: string;
  banner: string;
  resume: Investment;
  posts: Forum;
  investments: Investment;
  startedAt?: string;
  percentageOfIncome: number;
  reputationalDossier: string;
  fiscalDossier: string;
  expansionPlan: string;
  cdiPercentage: number;
  cdiValue: number;
}
