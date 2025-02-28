export interface AddressDTO {
  id?: number;
  street: string;
  number: number;
  neighborhood: string;
  city: string;
  uf: string;
  zipCode: string;
  complement?: string;
}

export interface CompanyPartner {
  rgDate: string;
  id?: number;
  fullName: string;
  email: string;
  cpf: string;
  rg: string;
  phone: string;
  dateOfBirth: Date;
  profession: string;
  maritalStatus: string;
  address: AddressDTO;
}
