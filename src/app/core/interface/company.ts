import { Address } from './address';
import { Responsible } from './responsible';

export interface Company {
    id?: number;
    email: string;
    name: string;
    website?: string;
    facebook?: string;
    linkedin?: string;
    twitter?: string;
    category: string;
    type?: any;
    cnpj: string;
    yearOfIncorporation: number;
    cnpjDescription: string;
    generalInfo: string;
    revenueModel: string;
    customersDescription: string;
    competitors: string;
    benchmarks: string;
    numberOfCustomers: number;
    payingCustomers: number;
    grossRevenue: string;
    operations: string;
    partners: string;
    totalExpenditure: any;
    investments: string;
    investmentsDeposited: string;
    incubation: string;
    debts: string;
    valuation: string;
    roundValue: string;
    providers: string;
    description?: string;
    contractModel: string;
    hasDividends: boolean;
    model: string;
    video: string;
    pitch: string;
    status?: string;
    businessName: string;
    address: Address;
    responsible: Responsible;
    upgestao: string;
    bank: string;
    payment: string;
    cmv: number;
    ltv: number;
    cac: number;
    averageTicket: number;
    activeCustomers: number;
    score: string;
    managementIndicator: number;
    technologyIndicator: number;
    strategicIndicator: number;
    intellectualIndicator: number;
    societyIndicator: number;
    peopleIndicator: number;
    processIndicator: number;
    resourceIndicator: number;
    cnae: string;
    legalType: string;
    nire: string;
    cashburnIndicator: number;
    ltvCac: number;
    sharePriceIndicator: number;
    accountAgency: string;
    accountBank: string;
    accountNumber: string;
    volutiId: string;
}
