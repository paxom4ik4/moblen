// additional helper in case of storing tokens in localStorage

import axiosApi from './index.ts';

export const ACCESS_TOKEN_NAME = 'accessToken';

export const axiosAddAuthToken = () => {
  const accessToken = localStorage.getItem(ACCESS_TOKEN_NAME);

  if (accessToken) {
    axiosApi.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  }
};
