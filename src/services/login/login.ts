import API from '../index.ts';

const LOGIN_URL = '/users/check-authorize/';

const loginAPI = {
  loginUser: ({ login, password }: { login: string, password: string }) => {
    return API.patch(`${LOGIN_URL}`, { login, password }).then(res => res.data);
  }
};

export const { loginUser } = loginAPI;
