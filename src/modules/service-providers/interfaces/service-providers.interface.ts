import {
  AllowedUserStatuses,
  ProductOrServiceStatus,
  ServiceProductType,
  Weekday,
} from '../enums/service-providers.enum';

export interface ICreateServiceProduct {
  location: string;
  longitude: number;
  latitude: number;
  price: number;
  title: string;
  description: string;
  images: string[];
  category: string;
  type: ServiceProductType;
  skills?: string[];
  availableDays?: Weekday[];
  workingHours?: string;
  serviceAreaKM?: number;
  status?: AllowedUserStatuses | ProductOrServiceStatus.ACTIVE;
}

export interface IServiceProductResponse {
  id: string;
  location: string;
  longitude: number;
  latitude: number;
  price: number;
  title: string;
  description: string;
  images: string[];
  category: string;
  type: ServiceProductType;
  skills?: string[];
  availableDays?: Weekday[];
  workingHours?: string;
  serviceAreaKM?: number;
  isVerified: boolean;
  status: ProductOrServiceStatus;
  createdAt: Date;
  user: IServiceProvidersProfile;
}

export interface IServiceProvidersProfile {
  id: string;
  firstName: string;
  lastName: string;
  profileImage: string;
  languages?: string[];
  email?: string;
  phone: string;
  gender?: string;
  age?: number;
}

export interface IServiceProductListResponse {
  id: string;
  location: string;
  price: number;
  title: string;
  images: string[];
  isVerified: boolean;
  type: ServiceProductType;
  status: ProductOrServiceStatus;
  createdAt: Date;
}

export interface IServiceProductListQuery {
  latitude?: string;
  longitude?: string;
  search?: string;
  type?: ServiceProductType;
  page?: number;
  limit?: number;
  category?: string;
}

export interface IServiceProductCategory {
  name: string;
  type: string;
  icon: string;
}
