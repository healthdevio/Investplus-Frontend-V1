import { Investor } from './investor';

export interface UserInvestment {
     id: number;
     status: string;
     quotas: number;
     value: number;
     contractExternalId: String;
     publicAccess: boolean;
     date: string;
     investor: Investor;
     contractStatus: string;
}
