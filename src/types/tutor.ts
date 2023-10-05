export interface Tutor {
  tutor_uuid: string;
  tutor_name: string;
  tutor_surname: string;
  tutor_photo?: string;
  phone_number: string;
  email: string;
  has_access?: boolean;
}

export interface TutorRegister {
  tutor_name: string,
  tutor_surname: string,
  phone_number: string,
  email: string,
  has_access: boolean,
  password_hash: string,
  salt: string,
}
