import { FC, useEffect, useRef, useState } from 'react';

import './create-test.scss';

import CutIcon from 'assets/icons/cut-icon.svg';
import CheckIcon from 'assets/icons/check-icon.svg';
import AddIcon from 'assets/icons/add-icon.svg';

import { TaskCard } from 'components/task-card/task-card.tsx';
import { Typography } from 'common/typography/typography.tsx';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store/store.ts';
import { clearCreateTask } from 'store/create-task/create-task.slice.ts';
import { useQuery } from 'react-query';
import { getTasks } from 'services/tasks';
import { Task } from 'types/task.ts';

const DEFAULT_CLASSNAME = 'app-create-test';

export const CreateTest: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { id: paramsTaskListId } = useParams();

  const { taskListId, taskListName, courseName, topicName } = useSelector(
    (store: RootState) => store.createTask,
  );

  const { data: tasksData, isLoading } = useQuery('tasks', () =>
    getTasks(taskListId || paramsTaskListId!),
  );

  const textContainerRef = useRef<HTMLTextAreaElement>(null);

  const [maxScore, setMaxScore] = useState(0);
  const [testText, setTestText] = useState('');

  useEffect(() => {
    if (tasksData) {
      setMaxScore(
        tasksData.tasks.reduce((score: number, task: Task) => score + Number(task.max_ball), 0),
      );
    }
  }, [tasksData]);

  const [isNewTask, setIsNewTask] = useState(false);
  const [newTaskText, setNewTaskText] = useState('');

  const addNewTaskHandler = () => setIsNewTask(true);

  const saveTestHandler = () => {
    dispatch(clearCreateTask());
    navigate('/assignments');
  };

  const handleCreateTaskFromText = () => {
    const cursorStart = textContainerRef.current!.selectionStart;
    const cursorEnd = textContainerRef.current!.selectionEnd;

    setIsNewTask(true);

    setNewTaskText(testText.substring(cursorStart, cursorEnd));
  };

  return (
    <div className={DEFAULT_CLASSNAME}>
      <div className={`${DEFAULT_CLASSNAME}_text-container`}>
        <div className={`${DEFAULT_CLASSNAME}_text-container_name`}>
          <div className={`${DEFAULT_CLASSNAME}_text-container_name-text`}>
            <div className={`${DEFAULT_CLASSNAME}_text-container_name-title`}>
              <Typography color={'purple'} weight={'bold'}>
                {courseName} - {topicName}
              </Typography>
            </div>
            <div className={`${DEFAULT_CLASSNAME}_text-container_name-work`}>
              <Typography size={'large'}>{taskListName}</Typography>
            </div>
          </div>
          <div
            className={`${DEFAULT_CLASSNAME}_text-container_name-cut`}
            onClick={handleCreateTaskFromText}>
            <CutIcon />
          </div>
        </div>
        <Typography className={`${DEFAULT_CLASSNAME}_text-container_title`}>
          Текст заданий
        </Typography>
        <textarea
          ref={textContainerRef}
          className={`${DEFAULT_CLASSNAME}_text-container_main`}
          value={testText}
          onChange={(e) => setTestText(e.currentTarget.value)}></textarea>
      </div>
      <div className={`${DEFAULT_CLASSNAME}_tasks-container`}>
        <div className={`${DEFAULT_CLASSNAME}_tasks-container_title`}>
          <div>
            Общий макс. балл
            <div className={`${DEFAULT_CLASSNAME}_tasks-container_title_maxScore`}>{maxScore}</div>
          </div>
          <div
            className={`${DEFAULT_CLASSNAME}_tasks-container_title_save`}
            onClick={saveTestHandler}>
            <CheckIcon />
          </div>
        </div>
        {isLoading && <Typography>Загрузка заданий...</Typography>}

        {!!tasksData?.tasks?.length &&
          tasksData.tasks?.map((task: Task, index: number) => (
            <TaskCard
              taskId={task.task_uuid}
              taskListId={taskListId!}
              taskAssets={task.task_image}
              text={task.task_condition}
              criteria={task.criteria}
              maxScore={task.max_ball}
              format={task.format}
              index={index + 1}
            />
          ))}

        {isNewTask && (
          <TaskCard
            taskListId={taskListId!}
            isCreateMode
            setIsCreatingMode={setIsNewTask}
            text={newTaskText ?? ''}
            criteria={''}
            maxScore={null}
            format={'standard'}
          />
        )}
        <div
          className={`${DEFAULT_CLASSNAME}_tasks-container_addItem`}
          onClick={() => addNewTaskHandler()}>
          <AddIcon />
        </div>
      </div>
    </div>
  );
};
