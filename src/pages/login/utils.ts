import { Tutor } from 'types/tutor.ts';
import { Student } from 'types/student.ts';
import { UserData } from '../../constants/appTypes.ts';

export const remapTutorData = (tutorData: Tutor) => {
  return {
    uuid: tutorData.tutor_uuid,
    name: tutorData.tutor_name,
    surname: tutorData.tutor_surname,
    phone_number: tutorData?.phone_number ?? null,
    email: tutorData?.email ?? null,
    photo: tutorData?.tutor_photo ?? null,
    has_access: tutorData?.has_access,
  };
};

export const remapStudentData = (studentData: Student) => {
  return {
    uuid: studentData.student_uuid,
    name: studentData.student_name,
    surname: studentData.student_surname,
    phone_number: studentData?.phone_number ?? null,
    email: studentData?.email ?? null,
    photo: studentData?.student_photo ?? null,
  };
};

export const handleDataStoring = (userData: UserData, role: string) => {
  localStorage.setItem('userData', JSON.stringify(userData));
  localStorage.setItem('appMode', role);
};
