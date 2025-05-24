export interface IUserProfile {
  firstName: string;
  lastName: string;
  location: string;
  latitude: number;
  longitude: number;
  profileImage?: string;
  languages?: string[];
  phone?: string;
  email?: string;
  experience?: number;
  isPhoneVerified?: boolean;
  isEmailVerified?: boolean;
  deviceToken?: string;
}

export interface IUpdatePassword {
  oldPassword: string;
  newPassword: string;
}
