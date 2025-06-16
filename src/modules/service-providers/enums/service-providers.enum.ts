export enum ServiceProductType {
  SERVICE = 'SERVICE',
  PRODUCT = 'PRODUCT',
}

export enum Weekday {
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
  SUNDAY = 'SUNDAY',
}

export enum ProductOrServiceStatus {
  EXPIRED = 'EXPIRED', // Product or service can expire based on business logic
  ACTIVE = 'ACTIVE', // Initial state of the product or service
  SOLD = 'SOLD', // User can mark as sold
  DEACTIVATED = 'DEACTIVATED', // User can deactivate the ad
}

export enum AllowedUserStatuses {
  DEACTIVATED = 'DEACTIVATED',
  SOLD = 'SOLD',
}
