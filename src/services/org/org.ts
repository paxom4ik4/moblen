import API from '../index.ts';

const ORG_URL = '/organization';
const BALANCE_URL = '/balance';
const ORG_REF = '/orgRef'
const ORG_RELATE = '/relate'
const REGISTRATION_URL = '/user';
const MEMBER_REF = '/orgMember'

const orgAPI = {
  getOrgInfo: (org_uuid: string) => {
    return localStorage.getItem('accessToken')
      ? API.get(`${ORG_URL}/${org_uuid}`).then((res) => res.data)
      : null;
  },
  getBalance: async (user_uuid?: string, from_date?: string, to_date?: string) => {
    console.log(user_uuid);
    console.log(from_date);
    console.log(to_date);

    const res = await API.get(`${BALANCE_URL}`);
      return res.data;
  },
  getOrgLink: async () => {
    const res = await API.get(`${ORG_REF}`);
      return res.data;
  },
  refreshOrgLink: async () => {
    const res = await API.put(`${ORG_REF}`);
      return res.data;
  },
  getTutorsForOrg: async () => {
    const res = await API.get(`${ORG_RELATE}`);
    return res.data;
  },
  getInfoUser: async () => {
    const res = await API.get(`${REGISTRATION_URL}`);
    return res.data;
  },
  postOrgMember: async ({ref} : {ref: string}) => {
    const res = await API.post(`${MEMBER_REF}`, {
      referral: ref,
    });
    return res.data;
  }
};

export const { getOrgInfo, getBalance, getOrgLink, refreshOrgLink, getTutorsForOrg, getInfoUser, postOrgMember } = orgAPI;
