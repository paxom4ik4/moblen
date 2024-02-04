import API from '../index.ts';

// SHOULD BE REFACTORED AND MOVED TO CORRESPONDING SERVICES
const REGISTRATION_URL = '/user';

const registrationAPI = {
  createNewTutor: async ({
    name,
    surname,
    login,
    password,
    reflink,
  }: {
    name: string;
    surname: string;
    login: string;
    password: string;
    reflink?: string;
  }) => {
    const res = await API.post(
      reflink ? `${REGISTRATION_URL}?referral=${reflink}` : `${REGISTRATION_URL}`,
      {
        first_name: name,
        last_name: surname,
        login,
        password,
        role: 'tt',
      },
    );
    return res.data;
  },
  createNewStudent: async ({
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
    const res = await API.post(`${REGISTRATION_URL}`, {
      first_name: name,
      last_name: surname,
      login,
      password,
      role: 'st',
    });
    return res.data;
  },
  createNewStudentWithRef: async ({
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
    const res = await API.post(`${REGISTRATION_URL}?referral=${referral}`, {
      first_name: name,
      last_name: surname,
      login,
      password,
      role: 'st',
    });
    return res.data;
  },
  createNewOrg: async ({
    title,
    name,
    surname,
    login,
    password,
    promo,
  }: {
    title?: string;
    name: string;
    surname: string;
    login: string;
    password: string;
    promo?: string;
  }) => {
    const res = await API.post(`${REGISTRATION_URL}?promo_code=${promo}`, {
      org_name: title,
      first_name: name,
      last_name: surname,
      login,
      password,
      role: 'org',
    });
    return res.data;
  },
};

export const { createNewTutor, createNewStudent, createNewStudentWithRef, createNewOrg } =
  registrationAPI;
