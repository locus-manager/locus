export interface User {
  id?: string;
  name: string;
  email: string;
  phone: string;
}

export interface Place {
  id: string;
  location: string;
  name: string;
  sector: string;
  floor: string;
}

export interface SessionData {
  name: string;
  email: string;
  phone: string;
  type: string; //'checkin' | 'checkout';
  code: string;
  checkin: string;
}

export interface Session {
  id: string;
  checkinDate: string;
  checkoutDate: string;
  place: Place;
  user: User;
}
