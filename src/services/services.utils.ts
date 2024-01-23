import { BASE_DEV_URL, BASE_DEV_URL_V2, BASE_URL } from '../constants/api.ts';

export const DEV_HOSTNAME = 'moblen.online';
const USE_API_V2 = true;

const getBaseDevUrl = (): string => {
  return USE_API_V2 ? BASE_DEV_URL_V2 : BASE_DEV_URL;
};

export const getBaseUrl = (): string => {
  return location.hostname === DEV_HOSTNAME || location.hostname === 'localhost'
    ? getBaseDevUrl()
    : BASE_URL;
};
