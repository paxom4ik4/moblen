import API from '../index.ts';

const COURSES_API_URL = '/course';
const TOPICS_API_URL = '/topic';

// Courses
const coursesAPI = {
  createCourse: ({ courseName }: { courseName: string }) => {
    return API.post(`${COURSES_API_URL}`, {
      course_name: courseName,
    }).then((res) => res.data);
  },
  getTutorsCourses: (): Promise<{ course_uuid: string; course_name: string }[]> | [] => {
    return API.get(`${COURSES_API_URL}`).then((res) => res.data);
  },
  updateCourseName: ({ courseId, courseName }: { courseId: string; courseName: string }) => {
    return API.patch(`${COURSES_API_URL}?course_uuid=${courseId}`, {
      course_name: courseName,
    }).then((res) => res.data);
  },
  deleteCourse: ({ course_uuid }: { course_uuid: string }) => {
    return API.delete(`${COURSES_API_URL}?course_uuid=${course_uuid}`).then((res) => res.data);
  },
};

// Topics
const topicsAPI = {
  createTopic: ({ course_uuid, topic_name }: { course_uuid: string; topic_name: string }) => {
    return API.post(`${TOPICS_API_URL}?course_uuid=${course_uuid}`, {
      topic_name,
    }).then((res) => res.data);
  },
  getTopics: (
    courseId: string | null,
  ): Promise<{ topic_uuid: string; course_uuid: string; topic_name: string }[]> | null => {
    if (!courseId) return null;

    try {
      return API.get(`${TOPICS_API_URL}?course_uuid=${courseId}`).then((res) => res.data);
    } catch (error) {
      console.info('Error fetching Topics');
      return null;
    }
  },
  updateTopicName: ({ topicId, topicName }: { topicId: string; topicName: string }) => {
    return API.patch(`${TOPICS_API_URL}?topic_uuid=${topicId}`, {
      topic_name: topicName,
    }).then((res) => res.data);
  },
  deleteTopic: ({ topic_uuid }: { topic_uuid: string }) => {
    return API.delete(`${TOPICS_API_URL}?topic_uuid=${topic_uuid}`).then((res) => res.data);
  },
};

export const { createCourse, getTutorsCourses, updateCourseName, deleteCourse } = coursesAPI;
export const { createTopic, getTopics, updateTopicName, deleteTopic } = topicsAPI;
