import { FC, useEffect, useState, memo } from 'react';

import './create-test.scss';

import CheckIcon from 'assets/icons/check-icon.svg';
import AddIcon from 'assets/icons/add-icon.svg';

import { TaskCard } from 'components/task-card/task-card.tsx';
import { Typography } from 'common/typography/typography.tsx';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store/store.ts';
import { clearCreateTask } from 'store/create-task/create-task.slice.ts';
import { useQuery } from 'react-query';
import { getAllFormats, getTasks } from 'services/tasks';
import { TutorRoutes } from 'constants/routes.ts';
import { Task } from 'types/task.ts';
import { CircularProgress } from '@mui/material';

const DEFAULT_CLASSNAME = 'app-create-test';

const CreateTest: FC = memo(() => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { id: paramsTaskListId } = useParams();
  const isEditModeDisabled = location.href.includes('editable=false');

  const { data: taskFormats } = useQuery('formats', () => getAllFormats());

  const { taskListId, taskListName, courseName, topicName } = useSelector(
    (store: RootState) => store.createTask,
  );

  const { data: tasksData, isLoading } = useQuery('tasks', () =>
    getTasks(taskListId || paramsTaskListId!),
  );

  const [maxScore, setMaxScore] = useState(0);

  useEffect(() => {
    if (tasksData) {
      setMaxScore(
        tasksData?.reduce((score: number, task: Task) => score + Number(task.max_ball), 0),
      );
    }
  }, [tasksData]);

  const [isNewTask, setIsNewTask] = useState(false);
  const [newTaskText] = useState('');

  const addNewTaskHandler = () => {
    setIsNewTask(true);
  };

  const saveTestHandler = () => {
    dispatch(clearCreateTask());
    navigate(TutorRoutes.ASSIGNMENTS);
  };

  return (
    <div className={DEFAULT_CLASSNAME}>
      <div className={`${DEFAULT_CLASSNAME}_text-container`}>
        <div className={`${DEFAULT_CLASSNAME}_text-container_name-text`}>
          <div className={`${DEFAULT_CLASSNAME}_text-container_name-title`}>
            <Typography color={'purple'} weight={'bold'}>
              {courseName} - {topicName}
            </Typography>
          </div>
          <div className={`${DEFAULT_CLASSNAME}_text-container_name-work`}>
            <Typography size={'large'} weight={'bold'}>
              {taskListName}
            </Typography>
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

        {!!tasksData?.length &&
          tasksData?.map((task: Task, index: number) => (
            <TaskCard
              key={task.task_uuid}
              taskId={task.task_uuid}
              taskListId={taskListId!}
              text={task.task_condition}
              criteria={task.criteria}
              maxScore={task.max_ball}
              format={task.format}
              index={index + 1}
              editModeDisabled={isEditModeDisabled}
            />
          ))}

        {isNewTask && (
          <TaskCard
            taskFormats={taskFormats}
            taskListId={taskListId!}
            isCreateMode
            setIsCreatingMode={setIsNewTask}
            text={newTaskText ?? ''}
            criteria={''}
            maxScore={null}
            format={'standard'}
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
