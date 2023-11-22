import API from '../index.ts';
import { Tutor } from 'types/tutor.ts';
import { Group } from 'types/group.ts';

const TUTOR_API_URL = '/tutor';

const tutorAPI = {
  getTutorInfo: (tutorId: string) => {
    return API.get(`${TUTOR_API_URL}/${tutorId}/`);
  },
  getTutorGroups: (tutorId: string): Promise<Group[]> => {
    return API.get(`${TUTOR_API_URL}/${tutorId}/tutor-groups/`).then((res) => res.data);
  },
  createTutorGroup: ({ tutorId, groupName }: { tutorId: string; groupName: string }) => {
    return API.post(`${TUTOR_API_URL}/${tutorId}/tutor-groups/`, { group_name: groupName }).then(
      (res) => res.data,
    );
  },
  editTutorInfo: (tutorId: string, tutorData: Partial<Tutor>) => {
    return API.patch(`${TUTOR_API_URL}/${tutorId}/`, { ...tutorData });
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

export const {
  deleteTutor,
  getTutorInfo,
  editTutorInfo,
  getTutorGroups,
  addStudentToList,
  createTutorGroup,
  editTutorPhoto,
} = tutorAPI;
