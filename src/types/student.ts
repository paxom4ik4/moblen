import { Tutor } from './tutor.ts';

export interface Student {
  student_uuid: string;
  student_name: string;
  student_surname: string;
  student_photo?: string;
  phone_number?: string;
  email?: string;
  tutors?: Tutor[];
}
