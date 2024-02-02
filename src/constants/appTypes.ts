export enum AppModes {
  ST = 'ST',
  TT = 'TT',
  ORG = 'ORG'
}

export enum LoginModes {
  login = 'login',
  passwordReset = 'passwordReset',
}

export interface UserData {
  user_uuid: string;
  first_name: string;
  last_name: string;
  phone_number: null | string;
  email: null | string;
  photo: null | string;
  has_access?: boolean;
  role: string;
}
