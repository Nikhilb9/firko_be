export interface ILogin {
  password: string;
  email?: string;
  phone?: string;
}

export interface IRegister {
  phone: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface IAuthData {
  token: string;
  phone: string;
  firstName: string;
  lastName: string;
  address?: string;
}
