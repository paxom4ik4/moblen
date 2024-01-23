import API from '../index.ts';
import { axiosAddAuthToken } from '../tokenHelper.ts';

const USER_API_URL = '/user';
const REPORT_URL = '/report';

const userAPI = {
  sendFeedback: (message: string) => {
    return API.post(`${REPORT_URL}`, { message }).then((res) => res.data);
  },
  getUserData: () => {
    axiosAddAuthToken();

    return API.get(USER_API_URL).then((res) => res.data);
  },
  editUserPhoto: (formData: FormData) => {
    return API.patch(`${USER_API_URL}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

export const { sendFeedback, getUserData, editUserPhoto } = userAPI;
