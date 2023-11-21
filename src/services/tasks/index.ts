import API from '../index.ts';
import { ShareDataType } from '../../types/share.data.type.ts';
import { GenerateTaskPayload, Task } from '../../types/task.ts';

const TASK_LIST_URL = '/tasklist';
const TASK_URL = '/task';
const GENERATE_URL = '/generate-task';

const tasklistAPI = {
  createTaskList: ({ list_name, topic_uuid }: { list_name: string; topic_uuid: string }) => {
    return API.post(`${TASK_LIST_URL}/by-topic/${topic_uuid}/`, { list_name }).then(
      (res) => res.data,
    );
  },
  deleteTaskList: ({ list_uuid }: { list_uuid: string }) => {
    return API.delete(`${TASK_LIST_URL}/${list_uuid}/`).then((res) => res.data);
  },
  editTaskList: ({ id, name }: { id: string; name: string }) => {
    return API.patch(`${TASK_LIST_URL}/${id}/`, { list_name: name });
  },
  getTaskList: (
    topic_uuid: string | null,
  ): Promise<
    {
      task_count: number;
      list_uuid: string;
      topic_uuid: string;
      list_name: string;
      editable: boolean;
    }[]
  > | null => {
    if (!topic_uuid) return null;

    try {
      return API.get(`${TASK_LIST_URL}/by-topic/${topic_uuid}/`).then((res) => res.data);
    } catch (error) {
      console.log('Error fetching TaskList');
      return null;
    }
  },
  shareTaskList: (data: ShareDataType) => {
    const { list_uuid, ...taskListData } = data;

    return API.post(`${TASK_LIST_URL}/${list_uuid}/share/`, { ...taskListData }).then(
      (res) => res.data,
    );
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
    return API.post(`${TASK_URL}/by-tasklist/${list_uuid}/`, {
      task_condition,
      criteria,
      max_ball,
      format,
    }).then((res) => res.data);
  },
  editTask: ({ taskId, data }: { taskId: string; data: Partial<Task> }) => {
    return API.patch(`${TASK_URL}/${taskId}/`, { ...data }).then((res) => res.data);
  },
  deleteTask: ({ taskId }: { taskId: string }) => {
    return API.delete(`${TASK_URL}/${taskId}/`).then((res) => res.data);
  },
  getAllFormats: () => {
    return API.get(`${TASK_URL}/get-all-formats/`).then((res) => res.data);
  },
};

const generateAPI = {
  generateTask: (taskListId: string, data: GenerateTaskPayload) => {
    return API.post(`${GENERATE_URL}/${taskListId}/`, { ...data }).then((res) => res.data);
  },
};

export const { getTaskList, deleteTaskList, createTaskList, shareTaskList, editTaskList } =
  tasklistAPI;
export const { getTasks, createTask, deleteTask, getAllFormats, editTask } = tasksAPI;
export const { generateTask } = generateAPI;
