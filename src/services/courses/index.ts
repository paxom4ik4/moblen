import API from '../index.ts';

const COURSES_API_URL = '/courses';
const TOPICS_API_URL = '/topic';

// Courses

const coursesAPI = {
  createCourse: ({ tutorId, courseName }: { tutorId: string; courseName: string }) => {
    return API.post(`${COURSES_API_URL}/by-tutor/${tutorId}/`, {
      course_name: courseName,
      owner_uuid: tutorId,
    }).then((res) => res.data);
  },
  getTutorsCourses: (tutorId: string): Promise<string[]> => {
    return API.get(`${COURSES_API_URL}/by-tutor/${tutorId}/`).then((res) => res.data);
  },
  updateCourseName: ({ tutorId, courseName }: { tutorId: string; courseName: string }) => {
    return API.patch(`${COURSES_API_URL}/by-tutor/${tutorId}/`, { course_name: courseName }).then(
      (res) => res.data,
    );
  },
};

// Topics

const topicsAPI = {
  createTopic: ({ courseId, topicName }: { courseId: string; topicName: string }) => {
    return API.post(`${TOPICS_API_URL}/`, { topic_name: topicName, course_uuid: courseId }).then(
      (res) => res.data,
    );
  },
  getTopic: (courseId: string) => {
    return API.get(`${TOPICS_API_URL}/by-tutor/${courseId}`).then((res) => res.data);
  },
  editTopicName: ({ courseId, topicName }: { courseId: string; topicName: string }) => {
    return API.patch(`${TOPICS_API_URL}/by-tutor/${courseId}`, {
      topic_name: topicName,
      course_uuid: courseId,
    }).then((res) => res.data);
  },
  deleteTopics: (courseId: string) => {
    return API.delete(`${TOPICS_API_URL}/by-tutor/${courseId}`).then((res) => res.data);
  },
};

export const { createCourse, getTutorsCourses, updateCourseName } = coursesAPI;
export const { createTopic, getTopic, editTopicName, deleteTopics } = topicsAPI;
