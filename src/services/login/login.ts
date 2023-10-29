import API from '../index.ts';

const LOGIN_URL = '/users/login/';
const LOGOUT_URL = '/users/revoke_token/';
const REFRESH_TOKEN = '/users/refresh_token/';

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
  refreshToken: (refresh_token: string) => {
    return API.post(REFRESH_TOKEN, { refresh_token }).then((res) => res.data);
  },
};

export const { loginUser, logoutUser, refreshToken } = loginAPI;
