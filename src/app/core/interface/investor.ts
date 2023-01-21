import { Address } from './address';

export interface Investor {
    profession: string;
    nationality: string;
    gender: string;
    maritalStatus: string;
    rgEmitter: string;
    rg: string;
    phone: number;
    dateOfBirth: string;
    address?: Address;
    investorProfileStatement: string;
    totalInvestedOthers: number;
    investedUpangel: number;
    publicFigure: boolean;
    personalWebsite?: string;
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    aboutUpangel: string;
    publicProfile: boolean;
    cpf?: string;
    cnpj?: string;
    email?: string;
    fullName?: string;
    id?: number;
    nickname?: string;
}
