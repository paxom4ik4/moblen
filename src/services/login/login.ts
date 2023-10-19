import API from '../index.ts';

const LOGIN_URL = '/users/login/';
const LOGOUT_URL = '/users/logout/';

const loginAPI = {
  loginUser: ({ login, password }: { login: string; password: string }) => {
    return API.post(`${LOGIN_URL}`, { login, password }).then((res) => res.data);
  },
  logoutUser: () => {
    return API.post(`${LOGOUT_URL}`).then((res) => res.data);
  },
};

export const { loginUser, logoutUser } = loginAPI;
