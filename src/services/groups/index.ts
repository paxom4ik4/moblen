import API from '../index.ts';

const GROUPS_API_URL = '/group';

const groupsAPI = {
  deleteGroup: (groupId: string) => {
    return API.delete(`${GROUPS_API_URL}/${groupId}/`).then((res) => res.data);
  },
  getGroup: (groupId: string | null) => {
    return groupId && API.get(`${GROUPS_API_URL}/${groupId}/`).then((res) => res.data);
  },
  editGroupName: ({ groupId, groupName }: { groupId: string; groupName: string }) => {
    return API.patch(`${GROUPS_API_URL}/${groupId}/`, { group_name: groupName }).then(
      (res) => res.data,
    );
  },
  getGroupLink: (groupId: string) => {
    return API.get(`${GROUPS_API_URL}/${groupId}/reflink/`).then((res) => res.data);
  },
  addNewStudent: ({ groupId, studentId }: { groupId: string; studentId: string }) => {
    return API.post(`${GROUPS_API_URL}/${groupId}/new-student/`, { student_uuid: studentId }).then(
      (res) => res.data,
    );
  },
};

export const { getGroup, editGroupName, deleteGroup, getGroupLink, addNewStudent } = groupsAPI;
