import API from '../index.ts';
import { Group } from 'types/group.ts';

// SHOULD BE REFACTORED AND MOVED TO CORRESPONDING SERVICES
const TUTOR_API_URL = '/tutor';
const GROUPS_API_URL = '/group';

const tutorAPI = {
  getTutorGroups: (): Promise<Group[]> => {
    return API.get(GROUPS_API_URL).then((res) => res.data);
  },
  createTutorGroup: ({ groupName }: { groupName: string }) => {
    return API.post(`${GROUPS_API_URL}`, { group_name: groupName }).then((res) => res.data);
  },
  editTutorPhoto: (tutorId: string, formData: FormData) => {
    return API.patch(`${TUTOR_API_URL}/${tutorId}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  deleteTutor: (tutorId: string) => {
    return API.delete(`${TUTOR_API_URL}/${tutorId}/`);
  },
  addStudentToList: (tutorId: string, studentId: string) => {
    return API.post(`${TUTOR_API_URL}/${tutorId}/new-student-to-the-list/`, {
      data: { student_uuid: studentId },
    });
  },
};

export const { deleteTutor, getTutorGroups, addStudentToList, createTutorGroup, editTutorPhoto } =
  tutorAPI;
