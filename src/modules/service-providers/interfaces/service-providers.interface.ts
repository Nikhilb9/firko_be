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
  status?: AllowedUserStatuses;
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
  createdAt: Date;
  user: IServiceProvidersProfile;
}

export interface IServiceProvidersProfile {
  id: string;
  first_name: string;
  last_name: string;
  profileImage: string;
  isVerified: boolean;
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
}

export interface IServiceProductListQuery {
  latitude?: string;
  longitude?: string;
  search?: string;
  type?: ServiceProductType;
  page?: number;
  limit?: number;
}
