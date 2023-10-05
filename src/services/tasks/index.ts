import API from '../index.ts';

const TASK_LIST_URL = '/tasklist';
const TASK_URL = '/task';

const tasklistAPI = {
  createTaskList: ({ listName, topicId }: { listName: string, topicId: string }) => {
    return API.post(`${TASK_LIST_URL}/`, { list_name: listName, topic_uuid: topicId})
      .then(res => res.data);
  },
  getTaskList: (topicId: string) => {
    return API.get(`${TASK_LIST_URL}/get-by-topic/${topicId}/`).then(res => res.data);
  },
  editTaskList: ({ listName, topicId }: { listName: string, topicId: string }) => {
    return API.patch(`${TASK_LIST_URL}/get-by-topic/${topicId}`, { list_name: listName, topic_uuid: topicId})
      .then(res => res.data);
  },
};

const tasksAPI = {
  getTask: (taskListId: string) => {
    return API.get(`${TASK_URL}/get-by-tsklist/${taskListId}`).then(res => res.data);
  },
  createTask: () => {
    return API.post(`${TASK_URL}/`)
  }
};

export const { getTaskList, createTaskList, editTaskList } = tasklistAPI;
export const { getTask, createTask } = tasksAPI;
