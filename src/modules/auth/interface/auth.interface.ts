export interface IRegister {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
}

export interface IAuthData {
  token: string;
  phone?: string;
  firstName: string;
  lastName: string;
  email?: string;
  address?: string;
  id: string;
  isNewUser?: boolean;
}
