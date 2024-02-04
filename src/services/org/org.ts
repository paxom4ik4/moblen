import API from '../index.ts';

const ORG_URL = '/organization';
const BALANCE_URL = '/balance';

const orgAPI = {
  getOrgInfo: (org_uuid: string) => {
    return localStorage.getItem('accessToken')
      ? API.get(`${ORG_URL}/${org_uuid}`).then((res) => res.data)
      : null;
  },
  getBalance: (user_uuid?: string, from_date?: string, to_date?: string) => {
    console.log(user_uuid);
    console.log(from_date);
    console.log(to_date);

    return API.get(`${BALANCE_URL}`).then((res) => res.data);
  },
};

export const { getOrgInfo, getBalance } = orgAPI;
