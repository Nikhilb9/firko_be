export enum Weekday {
  MONDAY = 'MON',
  TUESDAY = 'TUES',
  WEDNESDAY = 'WED',
  THURSDAY = 'THU',
  FRIDAY = 'FRI',
  SATURDAY = 'SAT',
  SUNDAY = 'SUN',
}

export enum ServiceStatus {
  EXPIRED = 'EXPIRED', //  service can expire based on business logic
  ACTIVE = 'ACTIVE', // Initial state of the service
  SOLD = 'SOLD', // User can mark as sold
  DEACTIVATED = 'DEACTIVATED', // User can deactivate the ad
}

export enum AllowedUserStatuses {
  DEACTIVATED = 'DEACTIVATED',
  SOLD = 'SOLD',
  ACTIVE = 'ACTIVE', // Initial state of the service
}
