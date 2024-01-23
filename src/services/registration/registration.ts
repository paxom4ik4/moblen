import API from '../index.ts';

const REGISTRATION_URL = '/user';

const registrationAPI = {
  createNewTutor: ({
    name,
    surname,
    login,
    password,
    promo,
  }: {
    name: string;
    surname: string;
    login: string;
    password: string;
    promo: string;
  }) => {
    return API.post(`${REGISTRATION_URL}?promo_code=${promo}`, {
      first_name: name,
      last_name: surname,
      login,
      password,
      role: 'tt',
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
    return API.post(`${REGISTRATION_URL}`, {
      first_name: name,
      last_name: surname,
      login,
      password,
      role: 'st',
    }).then((res) => res.data);
  },
  createNewStudentWithRef: ({
    name,
    surname,
    login,
    password,
    referral,
  }: {
    name: string;
    surname: string;
    login: string;
    password: string;
    referral?: string;
  }) => {
    return API.post(`${REGISTRATION_URL}?referral=${referral}`, {
      first_name: name,
      last_name: surname,
      login,
      password,
      role: 'st',
    }).then((res) => res.data);
  },
};

export const { createNewTutor, createNewStudent, createNewStudentWithRef } = registrationAPI;
