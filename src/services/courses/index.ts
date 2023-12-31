import API from '../index.ts';

const COURSES_API_URL = '/courses';
const TOPICS_API_URL = '/topics';

// Courses

const coursesAPI = {
  createCourse: ({ tutorId, courseName }: { tutorId: string; courseName: string }) => {
    return API.post(`${COURSES_API_URL}/by-tutor/${tutorId}/`, {
      course_name: courseName,
      owner_uuid: tutorId,
    }).then((res) => res.data);
  },
  getTutorsCourses: (
    tutorId: string | undefined,
  ): Promise<{ course_uuid: string; course_name: string }[]> | [] => {
    if (!tutorId) return [];

    return API.get(`${COURSES_API_URL}/by-tutor/${tutorId}/`).then((res) => res.data);
  },
  updateCourseName: ({ courseId, courseName }: { courseId: string; courseName: string }) => {
    return API.patch(`${COURSES_API_URL}/${courseId}/`, { course_name: courseName }).then(
      (res) => res.data,
    );
  },
  deleteCourse: ({ course_uuid }: { course_uuid: string }) => {
    return API.delete(`${COURSES_API_URL}/${course_uuid}/`).then((res) => res.data);
  },
};

// Topics

const topicsAPI = {
  createTopic: ({ course_uuid, topic_name }: { course_uuid: string; topic_name: string }) => {
    return API.post(`${TOPICS_API_URL}/by-courses/${course_uuid}/`, {
      topic_name,
      course_uuid,
    }).then((res) => res.data);
  },
  getTopics: (
    courseId: string | null,
  ): Promise<{ topic_uuid: string; course_uuid: string; topic_name: string }[]> | null => {
    if (!courseId) return null;

    try {
      return API.get(`${TOPICS_API_URL}/by-courses/${courseId}`).then((res) => res.data);
    } catch (error) {
      console.info('Error fetching Topics');
      return null;
    }
  },
  updateTopicName: ({ topicId, topicName }: { topicId: string; topicName: string }) => {
    return API.patch(`${TOPICS_API_URL}/${topicId}`, {
      topic_name: topicName,
    }).then((res) => res.data);
  },
  deleteTopic: ({ topic_uuid }: { topic_uuid: string }) => {
    return API.delete(`${TOPICS_API_URL}/${topic_uuid}/`).then((res) => res.data);
  },
};

export const { createCourse, getTutorsCourses, updateCourseName, deleteCourse } = coursesAPI;
export const { createTopic, getTopics, updateTopicName, deleteTopic } = topicsAPI;
