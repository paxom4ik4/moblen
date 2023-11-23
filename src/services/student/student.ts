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
  getStudentTaskLists: ({
    student_uuid,
    tutor_uuid,
  }: {
    student_uuid: string;
    tutor_uuid: string | null;
  }) => {
    if (!tutor_uuid) return null;

    return API.get(`${STUDENT_URL}/${student_uuid}/get-tasklist/from/${tutor_uuid}`).then(
      (res) => res.data,
    );
  },
  getCompletedTaskList: ({
    student_uuid,
    list_uuid,
  }: {
    student_uuid: string;
    list_uuid: string;
  }) => {
    return API.get(`${STUDENT_URL}/${student_uuid}/completed-tasks/by-tasklist/${list_uuid}`).then(
      (res) => res.data,
    );
  },
  sendTaskListAnswers: ({
    student_uuid,
    list_uuid,
    answers,
  }: {
    student_uuid: string;
    list_uuid: string;
    answers: { task_uuid: string; answer: string }[];
  }) => {
    return API.post(`${STUDENT_URL}/${student_uuid}/send-tasklist/${list_uuid}/`, answers).then(
      (res) => res.data,
    );
  },
  editStudentPhoto: (studentId: string, formData: FormData) => {
    return API.patch(`${STUDENT_URL}/${studentId}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

export const {
  getStudentInfo,
  deleteFromGroup,
  getStudentTaskLists,
  getCompletedTaskList,
  sendTaskListAnswers,
  editStudentPhoto,
} = studentAPI;
