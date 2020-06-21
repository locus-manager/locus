export interface User {
  name: string;
  email: string;
  phone: string;
}

export interface Register {
  name: string;
  email: string;
  phone: string;
  type: string; //'checkin' | 'checkout';
  code: string;
  checkin: string;
}
