export interface User {
  name: string;
  email: string;
  phone: string;
}

export interface Place {
  id: string;
  name: string;
  floor: string;
}

export interface Session {
  name: string;
  email: string;
  phone: string;
  type: string; //'checkin' | 'checkout';
  code: string;
  checkin: string;
}
