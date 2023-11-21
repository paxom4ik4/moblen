import API from '../index.ts';
import { Tutor } from 'types/tutor.ts';
import { Group } from 'types/group.ts';

const TUTOR_API_URL = '/tutor';

const tutorAPI = {
  getTutorInfo: async (tutorId: string) => {
    return await API.get(`${TUTOR_API_URL}/${tutorId}/`);
  },
  getTutorGroups: (tutorId: string): Promise<Group[]> => {
    return API.get(`${TUTOR_API_URL}/${tutorId}/tutor-groups/`).then((res) => res.data);
  },
  createTutorGroup: ({ tutorId, groupName }: { tutorId: string; groupName: string }) => {
    return API.post(`${TUTOR_API_URL}/${tutorId}/tutor-groups/`, { group_name: groupName }).then(
      (res) => res.data,
    );
  },
  editTutorInfo: async (tutorId: string, tutorData: FormData | File | Partial<Tutor>) => {
    return await API.patch(`${TUTOR_API_URL}/${tutorId}/`, { ...tutorData });
  },
  deleteTutor: async (tutorId: string) => {
    return await API.delete(`${TUTOR_API_URL}/${tutorId}/`);
  },
  addStudentToList: async (tutorId: string, studentId: string) => {
    return await API.post(`${TUTOR_API_URL}/${tutorId}/new-student-to-the-list/`, {
      data: { student_uuid: studentId },
    });
  },
};

export const {
  deleteTutor,
  getTutorInfo,
  editTutorInfo,
  getTutorGroups,
  addStudentToList,
  createTutorGroup,
} = tutorAPI;
