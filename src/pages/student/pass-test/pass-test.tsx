import { FC, memo } from 'react';

import { useNavigate, useParams } from 'react-router-dom';
import { Typography } from 'common/typography/typography.tsx';
import { TaskPassCard } from 'components/task-pass-card/task-pass-card.tsx';
import { Task } from 'types/task.ts';
import CheckIcon from 'assets/icons/check-icon.svg';

import { StudentRoutes } from 'constants/routes.ts';

import './pass-test.scss';
import { useQuery } from 'react-query';
import { getTasks } from 'services/tasks';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store/store.ts';
import { setCurrentTaskList } from 'store/student/student.slice.ts';

const DEFAULT_CLASSNAME = 'pass-test';

const PassTest: FC = memo(() => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { id } = useParams();

  const { id: taskListId, name: taskListName } = useSelector(
    (state: RootState) => state.student.currentTaskList,
  )!;

  const { activeTopic, activeCourse } = useSelector((state: RootState) => state.student);

  const { data: tasksData, isLoading: isTasksLoading } = useQuery('tasks', () =>
    getTasks(id ?? taskListId),
  );

  const maxScore = tasksData?.tasks?.reduce(
    (score: number, task: Task) => score + Number(task.max_ball),
    0,
  );

  const submitTestHandler = () => {
    // send answers to BE and change the status of task to done
    dispatch(setCurrentTaskList(null));
    navigate(StudentRoutes.ASSIGNMENTS);
  };

  return (
    <div className={DEFAULT_CLASSNAME}>
      <div className={`${DEFAULT_CLASSNAME}_title`}>
        <div className={`${DEFAULT_CLASSNAME}_title_name`}>
          <Typography color={'purple'}>
            {activeCourse?.name} - {activeTopic?.name}
          </Typography>
          <Typography size={'large'} weight={'bold'}>
            {taskListName}
          </Typography>
        </div>
        <div className={`${DEFAULT_CLASSNAME}_title_maxScore`}>
          <Typography color={'purple'}>{'Общий макс. балл'}</Typography>
          <Typography weight={'bold'}>{maxScore}</Typography>
        </div>
      </div>
      {!isTasksLoading && tasksData?.tasks && (
        <div className={`${DEFAULT_CLASSNAME}_tasks`}>
          {tasksData?.tasks?.map((task: Task, index: number) => (
            <TaskPassCard
              key={task.task_uuid}
              text={task.task_condition}
              criteria={task.criteria}
              maxScore={task.max_ball}
              format={task.format}
              index={index}
            />
          ))}
          <button className={`${DEFAULT_CLASSNAME}_submit-test`} onClick={submitTestHandler}>
            <CheckIcon />
          </button>
        </div>
      )}
    </div>
  );
});

export default PassTest;
