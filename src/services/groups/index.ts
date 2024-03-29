import API from '../index.ts';

const GROUPS_API_URL = '/group';

const groupsAPI = {
  deleteGroup: (groupId: string) => {
    return API.delete(`${GROUPS_API_URL}?group_uuid=${groupId}`).then((res) => res.data);
  },
  getGroup: (groupId: string | null) => {
    return groupId && API.get(`${GROUPS_API_URL}?group_uuid=${groupId}`).then((res) => res.data);
  },
  editGroupName: ({ groupId, groupName }: { groupId: string; groupName: string }) => {
    return API.patch(`${GROUPS_API_URL}?group_uuid=${groupId}`, { group_name: groupName }).then(
      (res) => res.data,
    );
  },
  getGroupLink: (groupId: string) => {
    return API.get(`${GROUPS_API_URL}/${groupId}/reflink`).then((res) => res.data);
  },
  refreshGroupLink: (groupId: string) => {
    return API.put(`${GROUPS_API_URL}/ref?group_uuid=${groupId}`, { group_uuid: groupId }).then(
      (res) => res.data,
    );
  },
  addNewStudent: ({ groupUrl, studentId }: { groupUrl: string; studentId?: string }) => {
    const referralIndex = groupUrl.lastIndexOf('/');
    const referral = groupUrl.slice(referralIndex + 1);

    return API.post(
      studentId ? GROUPS_API_URL + `/member?student_uuid=${studentId}` : `${GROUPS_API_URL}/member`,
      { referral },
    ).then((res) => res.data);
  },
};

export const {
  getGroup,
  editGroupName,
  deleteGroup,
  getGroupLink,
  addNewStudent,
  refreshGroupLink,
} = groupsAPI;
