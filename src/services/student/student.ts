import API from '../index.ts';

const STUDENT_URL = '/student';
const GROUP_URL = '/group/member';
const TASK_URL = '/tasklist';

const studentAPI = {
  getStudentInfo: (student_uuid: string) => {
    return localStorage.getItem('accessToken')
      ? API.get(`${STUDENT_URL}/${student_uuid}`).then((res) => res.data)
      : null;
  },
  deleteFromGroup: ({ studentId, groupId }: { studentId: string; groupId: string }) => {
    return API.delete(`${GROUP_URL}?group_uuid=${groupId}&student_uuid=${studentId}`).then(
      (res) => res.data,
    );
  },
  getStudentTaskLists: ({ user_uuid }: { user_uuid: string | null }) => {
    if (!user_uuid) return null;

    return API.get(`${TASK_URL}?user_uuid=${user_uuid}`).then((res) => res.data);
  },
  getCompletedTaskList: ({
    student_uuid,
    list_uuid,
    isTutor,
  }: {
    student_uuid?: string;
    list_uuid: string;
    isTutor?: boolean;
  }) => {
    return API.get(
      `${TASK_URL}/result?list_uuid=${list_uuid}&user_uuid=${isTutor ? student_uuid : ''}`,
    ).then((res) => res.data);
  },
  sendTaskListAnswers: ({
    list_uuid,
    answers,
  }: {
    list_uuid: string;
    answers: { task_uuid: string; answer: string }[];
  }) => {
    return API.post(`${TASK_URL}/result?list_uuid=${list_uuid}`, answers).then((res) => res.data);
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
