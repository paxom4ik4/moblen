export enum AppModes {
  student = 'student',
  tutor = 'tutor',
}

export enum LoginModes {
  login = 'login',
  passwordReset = 'passwordReset',
}

export interface UserData {
  uuid: string;
  name: string;
  surname: string;
  phone_number: null | string;
  email: null | string;
  photo: null | string;
  has_access?: boolean;
}
