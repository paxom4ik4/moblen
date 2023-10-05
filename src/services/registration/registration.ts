import API from '../index.ts';

const TUTOR_REGISTER = '/tutor';

const STUDENT_REGISTER = '/student';

const registrationAPI = {
  createNewTutor: ({
    name,
    surname,
    login,
    password,
  }: {
    name: string;
    surname: string;
    login: string;
    password: string;
  }) => {
    return API.post(`${TUTOR_REGISTER}/`, {
      tutor_name: name,
      tutor_surname: surname,
      login,
      password,
    }).then((res) => res.data);
  },
  createNewStudent: ({
    name,
    surname,
    login,
    password,
  }: {
    name: string;
    surname: string;
    login: string;
    password: string;
  }) => {
    return API.post(`${STUDENT_REGISTER}/`, {
      student_name: name,
      student_surname: surname,
      login,
      password,
    }).then((res) => res.data);
  },
  createNewStudentWithRef: ({
    name,
    surname,
    login,
    password,
    referralLink,
  }: {
    name: string;
    surname: string;
    login: string;
    password: string;
    referralLink?: string;
  }) => {
    return API.post(`${STUDENT_REGISTER}/with-ref-link/`, {
      student_name: name,
      student_surname: surname,
      login,
      password,
      referral_link: referralLink,
    }).then((res) => res.data);
  },
};

export const { createNewTutor, createNewStudent, createNewStudentWithRef } = registrationAPI;
