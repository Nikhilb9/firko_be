import { ServiceProductType, Weekday } from '../enums/service-providers.enum';

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
}
