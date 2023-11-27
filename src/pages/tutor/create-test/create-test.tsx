import { FC, useEffect, useState, memo } from 'react';

import './create-test.scss';

import CheckIcon from 'assets/icons/check-icon.svg';
import AddIcon from 'assets/icons/add-icon.svg';

import { TaskCard } from 'components/task-card/task-card.tsx';
import { Typography } from 'common/typography/typography.tsx';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearCreateTask } from 'store/create-task/create-task.slice.ts';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { createTask, editTaskList, getAllFormats, getTasks } from 'services/tasks';
import { TutorRoutes } from 'constants/routes.ts';
import { Task } from 'types/task.ts';
import { CircularProgress, SelectChangeEvent } from '@mui/material';
import { ClickAwayListener } from '@mui/base/ClickAwayListener';

const DEFAULT_CLASSNAME = 'app-create-test';

const CreateTest: FC = memo(() => {
  const queryClient = useQueryClient();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { id: paramsTaskListId } = useParams();
  const isEditModeDisabled = location.href.includes('editable=false');

  const { data: taskFormats } = useQuery('formats', () => getAllFormats());

  const { data: tasksData, isLoading } = useQuery(['tasks', paramsTaskListId], () =>
    getTasks(paramsTaskListId!),
  );

  const [maxScore, setMaxScore] = useState(0);

  useEffect(() => {
    if (tasksData) {
      setMaxScore(
        tasksData?.tasks?.reduce((score: number, task: Task) => score + Number(task.max_ball), 0),
      );
    }
  }, [tasksData]);

  const [isNewTask, setIsNewTask] = useState(false);
  const [isNewTaskSaving, setIsNewTaskSaving] = useState(false);

  const addNewTaskHandler = () => {
    if (isNewTask) {
      saveNewTaskHandler();
    } else {
      setIsNewTask(true);
    }
  };

  const saveTestHandler = () => {
    dispatch(clearCreateTask());
    navigate(TutorRoutes.ASSIGNMENTS);
  };

  // Creating new task

  const [newTaskText, setNewTaskText] = useState<string>('');
  const [newTaskCriteria, setNewTaskCriteria] = useState<string>('');
  const [newTaskFormat, setNewTaskFormat] = useState<string>('');
  const [newTaskMaxScore, setNewTaskMaxScore] = useState<number | null>(null);
  const [newTaskAssets, setNewTaskAssets] = useState<File[]>([]);
  const [newTaskAssetsTotalSize, setNewTaskAssetsTotalSize] = useState(0);
  const [newTaskAssetsError, setNewTaskAssetsError] = useState<null | string>(null);

  const handleFormatChange = (event: SelectChangeEvent) => {
    setNewTaskFormat(event.target.value as string);
  };

  const createTaskMutation = useMutation(
    (
      data:
        | {
            payload: {
              task_condition: string;
              criteria: string;
              format: string;
              max_ball: string;
            };
            isFormData: boolean;
          }
        | { payload: FormData; isFormData: boolean },
    ) => createTask(tasksData.list_uuid!, data.payload, data.isFormData),
    {
      onSuccess: async () => {
        setNewTaskText('');
        setNewTaskCriteria('');
        setNewTaskMaxScore(null);
        setNewTaskFormat('');
        setNewTaskAssets([]);
        setIsNewTask(false);
        setIsNewTaskSaving(false);

        await queryClient.invalidateQueries('tasks');
      },
    },
  );

  const saveNewTaskHandler = () => {
    if (newTaskAssets) {
      const data = new FormData();

      data.append(
        'format',
        newTaskFormat.length
          ? newTaskFormat
          : `${taskFormats[0].subject},${taskFormats[0].formats[0]}`,
      );
      data.append('criteria', newTaskCriteria.length ? newTaskCriteria : '-');
      data.append('max_ball', newTaskMaxScore?.toString() ?? '0');
      data.append('task_condition', newTaskText.length ? newTaskText : '-');

      Array.from(newTaskAssets).forEach((item) => {
        data.append('files', item);
      });

      createTaskMutation.mutate({ payload: data, isFormData: true });
    } else {
      const data = {
        format: newTaskFormat.length
          ? newTaskFormat
          : `${taskFormats[0].subject},${taskFormats[0].formats[0]}`,
        criteria: newTaskCriteria.length ? newTaskCriteria : '-',
        max_ball: newTaskMaxScore?.toString() ?? '0',
        task_condition: newTaskText.length ? newTaskText : '-',
      };

      createTaskMutation.mutate({ payload: data, isFormData: false });
    }

    setIsNewTaskSaving(true);
  };

  const [isNameEdit, setIsNameEdit] = useState(false);
  const [editTaskListName, setEditTaskListName] = useState('');

  const editTaskListMutation = useMutation(
    (data: { id: string; name: string }) => editTaskList(data),
    {
      onSuccess: () => queryClient.invalidateQueries('tasks'),
    },
  );

  const handleSaveTaskListName = () => {
    editTaskListMutation.mutate({
      id: tasksData.list_uuid,
      name: editTaskListName!,
    });

    setIsNameEdit(false);
  };

  return (
    <div className={DEFAULT_CLASSNAME}>
      <div className={`${DEFAULT_CLASSNAME}_text-container`}>
        <div className={`${DEFAULT_CLASSNAME}_text-container_name-text`}>
          <div className={`${DEFAULT_CLASSNAME}_text-container_name-title`}>
            <Typography color={'purple'} weight={'bold'}>
              {tasksData?.course_name} - {tasksData?.topic_name}
            </Typography>
          </div>
          <div className={`${DEFAULT_CLASSNAME}_text-container_name-work`}>
            {isNameEdit ? (
              <ClickAwayListener onClickAway={handleSaveTaskListName}>
                <input
                  maxLength={24}
                  value={editTaskListName}
                  onChange={(e) => setEditTaskListName(e.currentTarget.value)}
                />
              </ClickAwayListener>
            ) : (
              <Typography
                size={'large'}
                weight={'bold'}
                onClick={() => {
                  setEditTaskListName(tasksData?.list_name ?? '');
                  setIsNameEdit(true);
                }}>
                {tasksData?.list_name}
              </Typography>
            )}
          </div>
        </div>
        <div className={`${DEFAULT_CLASSNAME}_text-container_ball`}>
          <Typography color={'purple'}>Сумма баллов</Typography>
          <div className={`${DEFAULT_CLASSNAME}_tasks-container_title_maxScore`}>{maxScore}</div>
        </div>
        <button
          className={`${DEFAULT_CLASSNAME}_tasks-container_title_save`}
          onClick={saveTestHandler}>
          <div className={`${DEFAULT_CLASSNAME}_tasks-container_title_save_icon`}>
            <CheckIcon />
          </div>
          <Typography color={'purple'}>Завершить создание</Typography>
        </button>
      </div>
      <div className={`${DEFAULT_CLASSNAME}_tasks-container`}>
        {isLoading && <CircularProgress sx={{ color: '#c8caff' }} />}

        {!!tasksData?.tasks?.length &&
          tasksData?.tasks?.map((task: Task, index: number) => (
            <TaskCard
              taskFormats={taskFormats}
              isCreateMode={false}
              key={task.task_uuid}
              taskId={task.task_uuid}
              taskListId={tasksData.list_uuid}
              text={task.task_condition}
              criteria={task.criteria}
              maxScore={task.max_ball}
              format={task.format}
              index={index + 1}
              files={task?.files ?? []}
              editModeDisabled={isEditModeDisabled}
            />
          ))}

        {isNewTask && (
          <TaskCard
            disabled={isNewTaskSaving}
            isCreateMode={true}
            taskFormats={taskFormats}
            taskListId={tasksData.list_uuid}
            taskId={''}
            editModeDisabled={false}
            taskAssets={[]}
            newTaskMaxScore={newTaskMaxScore}
            newTaskFormat={newTaskFormat}
            newTaskCriteria={newTaskCriteria}
            newTaskText={newTaskText}
            handleFormatChange={handleFormatChange}
            setNewTaskMaxScore={setNewTaskMaxScore}
            setNewTaskText={setNewTaskText}
            setNewTaskCriteria={setNewTaskCriteria}
            saveNewTaskHandler={saveNewTaskHandler}
            newTaskAssets={newTaskAssets}
            setNewTaskAssets={setNewTaskAssets}
            newTaskAssetsTotalSize={newTaskAssetsTotalSize}
            setNewTaskAssetsTotalSize={setNewTaskAssetsTotalSize}
            newTaskAssetsError={newTaskAssetsError}
            setNewTaskAssetsError={setNewTaskAssetsError}
            isNewTaskSaving={isNewTaskSaving}
          />
        )}
        {!isEditModeDisabled && (
          <div
            className={`${DEFAULT_CLASSNAME}_tasks-container_addItem`}
            onClick={() => addNewTaskHandler()}>
            <AddIcon />
          </div>
        )}
      </div>
    </div>
  );
});

export default CreateTest;
