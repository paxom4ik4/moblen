import API from '../index.ts';

const LOGIN_URL = '/users/login/';
const LOGOUT_URL = '/users/revoke-token/';
const CHECK_AUTHORIZE = '/users/check-authorize/';

const loginAPI = {
  loginUser: ({
    login,
    password,
    referral_link,
  }: {
    login: string;
    password: string;
    referral_link?: string;
  }) => {
    return API.post(LOGIN_URL, { login, password, referral_link }, { withCredentials: false }).then(
      (res) => res.data,
    );
  },
  logoutUser: (token: string) => {
    return API.post(LOGOUT_URL, { token }).then((res) => res.data);
  },
  checkAuthorize: () => {
    return API.get(CHECK_AUTHORIZE).then((res) => res.data);
  },
};

export const { loginUser, logoutUser, checkAuthorize } = loginAPI;
