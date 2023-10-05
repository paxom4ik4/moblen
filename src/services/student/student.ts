import API from '../index.ts';

const STUDENT_URL = '/student';

const studentAPI = {
  deleteFromGroup: ({ studentId, groupId }: { studentId: string; groupId: string }) => {
    return API.delete(`${STUDENT_URL}/${studentId}/from-the-group/${groupId}/`, {
      data: { student_uuid: studentId, group_uuid: groupId },
    }).then((res) => res.data);
  },
};

export const { deleteFromGroup } = studentAPI;
