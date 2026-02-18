
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface CheckInRecord {
  id: string;
  timestamp: Date;
  locationName: string;
  status: 'success' | 'failed';
  details?: string;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export enum AppScreen {
  LOGIN = 'LOGIN',
  DASHBOARD = 'DASHBOARD',
  SCANNER = 'SCANNER',
  HISTORY = 'HISTORY'
}
