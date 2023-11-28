import API from '../index.ts';

const USER_API_URL = '/users';

const userAPI = {
  sendFeedback: (user_uuid: string, message: string) => {
    return API.post(`${USER_API_URL}/${user_uuid}/report/`, { message }).then((res) => res.data);
  },
};

export const { sendFeedback } = userAPI;
