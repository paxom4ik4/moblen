import { Tutor } from './tutor.ts';

export interface Student {
  user_uuid: string;
  first_name: string;
  last_name: string;
  photo?: string;
  phone_number?: string;
  email?: string;
  tutors?: Tutor[];
}
