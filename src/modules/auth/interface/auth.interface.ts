export interface ILogin {
  password: string;
  email?: string;
  phone?: string;
}

export interface IRegister {
  password: string;
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
}
