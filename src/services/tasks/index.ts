import API from '../index.ts';

const TASK_LIST_URL = '/tasklist';
const TASK_URL = '/task';

const tasklistAPI = {
  createTaskList: ({ list_name, topic_uuid }: { list_name: string; topic_uuid: string }) => {
    return API.post(`${TASK_LIST_URL}/by-topic/${topic_uuid}`, { list_name }).then(
      (res) => res.data,
    );
  },
  deleteTaskList: ({ list_uuid, topic_uuid }: { list_uuid: string; topic_uuid: string }) => {
    return API.delete(`${TASK_LIST_URL}/by-topic/${topic_uuid}/${list_uuid}`).then(
      (res) => res.data,
    );
  },
  getTaskList: (
    topic_uuid: string | null,
  ): Promise<
    {
      task_count: number;
      list_uuid: string;
      topic_uuid: string;
      list_name: string;
    }[]
  > | null => {
    try {
      return API.get(`${TASK_LIST_URL}/by-topic/${topic_uuid}`).then((res) => res.data);
    } catch (error) {
      console.log('Error fetching TaskList');
      return null;
    }
  },
  editTaskList: ({ listName, topicId }: { listName: string; topicId: string }) => {
    return API.patch(`${TASK_LIST_URL}/get-by-topic/${topicId}`, {
      list_name: listName,
      topic_uuid: topicId,
    }).then((res) => res.data);
  },
};

const tasksAPI = {
  getTasks: (taskListId: string) => {
    return API.get(`${TASK_URL}/by-tasklist/${taskListId}`).then((res) => res.data);
  },
  createTask: ({
    list_uuid,
    task_condition,
    criteria,
    max_ball,
    format,
  }: {
    list_uuid: string;
    task_condition: string;
    criteria: string;
    format: string;
    max_ball: number;
  }) => {
    return API.post(`${TASK_URL}/by-tasklist/${list_uuid}`, {
      task_condition,
      criteria,
      max_ball,
      format,
    }).then((res) => res.data);
  },
  deleteTask: ({ taskListId, taskId }: { taskListId: string; taskId: string }) => {
    return API.delete(`${TASK_URL}/by-tasklist/${taskListId}/${taskId}`).then((res) => res.data);
  },
};

export const { getTaskList, deleteTaskList, createTaskList, editTaskList } = tasklistAPI;
export const { getTasks, createTask, deleteTask } = tasksAPI;