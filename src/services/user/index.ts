import API from '../index.ts';

const USER_API_URL = '/user';

const userAPI = {
  sendFeedback: (user_uuid: string, message: string) => {
    return API.post(`${USER_API_URL}/${user_uuid}/report/`, { message }).then((res) => res.data);
  },
  getUserData: () => {
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
