import { BASE_DEV_URL, BASE_URL } from '../constants/api.ts';

const DEV_HOSTNAME = 'moblen.online';

export const getBaseUrl = (): string => {
  return location.hostname === DEV_HOSTNAME ? BASE_DEV_URL : BASE_URL;
};
