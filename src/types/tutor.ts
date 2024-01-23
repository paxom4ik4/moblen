export interface Tutor {
  user_uuid: string;
  first_name: string;
  last_name: string;
  photo?: string;
  phone_number: string;
  email: string;
  has_access?: boolean;
  files?: File[];
  file?: File;
}

export interface TutorRegister {
  tutor_name: string;
  tutor_surname: string;
  phone_number: string;
  email: string;
  has_access: boolean;
  password_hash: string;
  salt: string;
}
