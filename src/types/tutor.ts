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
