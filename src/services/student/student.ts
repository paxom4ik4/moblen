import API from '../index.ts';

const STUDENT_URL = '/student';

const studentAPI = {
  getStudentInfo: (student_uuid: string) => {
    return API.get(`${STUDENT_URL}/${student_uuid}`).then((res) => res.data);
  },
  deleteFromGroup: ({ studentId, groupId }: { studentId: string; groupId: string }) => {
    return API.delete(`${STUDENT_URL}/${studentId}/from-the-group/${groupId}/`, {
      data: { student_uuid: studentId, group_uuid: groupId },
    }).then((res) => res.data);
  },
};

export const { getStudentInfo, deleteFromGroup } = studentAPI;
