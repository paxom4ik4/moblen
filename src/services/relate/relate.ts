import API from '../index.ts';

const RELATE_URL = '/relate';

const relateAPI = {
  getRelations: () => {
    return localStorage.getItem('accessToken') ? API.get(RELATE_URL).then((res) => res.data) : null;
  },
};

export const { getRelations } = relateAPI;
