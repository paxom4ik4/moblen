import API from '../index.ts';

const LOGIN_URL = '/auth/login';
const LOGOUT_URL = '/auth/logout';
const REFRESH_TOKEN = '/auth/refresh';

const loginAPI = {
  loginUser: ({
    login,
    password,
    referral,
  }: {
    login: string;
    password: string;
    referral?: string;
  }) => {
    return API.post(
      `${LOGIN_URL}?referral_link=${referral}`,
      { login, password },
      { withCredentials: false },
    ).then((res) => res.data);
  },
  logoutUser: (token: string) => {
    return API.post(LOGOUT_URL, { token }).then((res) => res.data);
  },
  refreshToken: (refresh_token: string) => {
    return API.post(REFRESH_TOKEN, { refresh_token }).then((res) => res.data);
  },
};

export const { loginUser, logoutUser, refreshToken } = loginAPI;
