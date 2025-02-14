export interface Team {
    showDetails: boolean;
    id(id: any): unknown;
    fullName: string;
    email: string;
    department: string;
    role: string;
    activities: string;
    linkedin: string;
}
