export interface IIncorporator {
    id: number;
    name: string;
    achievements: string,
    annualMaxProfitability: number,
    annualMinProfitability: number,
    availableApartments: number,
    banner: string,
    builder: string,
    builderDoc: string,
    business: string,
    description: string,
    duration: number,
    investments: investments[],
    location: string,
    locationLink: string,
    logo: string,
    minimalProfitability: number,
    offerVideo: string,
    photos: [],
    projectedMaxProfitability: number,
    projectedMinProfitability: number,
    property: string,
    propertyDoc: string,
    quotaValue: number,
    quotas: number,
    resume: {
        quotasSold: number,
        total: number
    },
    returnTimeInMonths: number,
    riskiness: string,
    roundDoc: string,
    startedAt: string,
    status: string,
    totalApartments: number,
    logoDocUrl: string,
    round: {
        id: 1,
        status: string,
        type: string,
        logo: string,
        banner: string,
        quotas: number,
        quotaValue: number,
        resume: { quotasSold: number, total: number },
        maximumValuation: number,
        percentageOfIncome: number,
        cdiPercentage: number,
        cdiValue: number,
        partnerParticipation: number,
        deadline: number,
        upangelCost: number,
        modality: String,
        guarantee: String,
        valuation: number,
    }
}

interface investments {
    avatar: string | null,
    facebook: string | null,
    fullName: string | null,
    investorId: string | null,
    linkedin: string | null,
    nickname: string | null,
    personalWebsite: string | null,
    publicAccess: boolean,
    twitter: string | null
}
