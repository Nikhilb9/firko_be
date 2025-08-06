import {
  AllowedUserStatuses,
  ServiceStatus,
  Weekday,
} from '../enums/service-providers.enum';

export interface ICreateService {
  location: string;
  longitude: number;
  latitude: number;
  price: number;
  title: string;
  description: string;
  images: string[];
  category: string;
  skills?: string[];
  availableDays?: Weekday[];
  workingHours?: string;
  serviceAreaKM?: number;
  status?: AllowedUserStatuses | ServiceStatus.ACTIVE;
}

export interface IServiceResponse {
  id: string;
  location: string;
  longitude: number;
  latitude: number;
  price: number;
  title: string;
  description: string;
  images: string[];
  category: string;
  skills?: string[];
  availableDays?: Weekday[];
  workingHours?: string;
  serviceAreaKM?: number;
  isVerified: boolean;
  status: ServiceStatus;
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

export interface IServiceListResponse {
  id: string;
  location: string;
  price: number;
  title: string;
  images: string[];
  isVerified: boolean;
  status: ServiceStatus;
  createdAt: Date;
}

export interface IServiceListQuery {
  latitude?: string;
  longitude?: string;
  search?: string;
  page?: number;
  limit?: number;
  category?: string;
}

export interface IServiceCategory {
  name: string;
  icon: string;
}
