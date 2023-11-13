import { FC, memo, useState } from 'react';

import { useNavigate, useParams } from 'react-router-dom';
import { Typography } from 'common/typography/typography.tsx';
import { TaskPassCard } from 'components/task-pass-card/task-pass-card.tsx';
import { Task } from 'types/task.ts';
import CheckIcon from 'assets/icons/check-icon.svg';

import { StudentRoutes } from 'constants/routes.ts';

import './pass-test.scss';
import { useMutation, useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store/store.ts';
import { setCurrentTaskList } from 'store/student/student.slice.ts';
import { getTasks } from 'services/tasks';
import { sendTaskListAnswers } from 'services/student/student.ts';

const DEFAULT_CLASSNAME = 'pass-test';

interface Answer {
  task_uuid: string;
  answer: string;
}

export interface Answers {
  [key: string]: string;
}

const PassTest: FC = memo(() => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { id } = useParams();

  const { id: taskListId, name: taskListName } = useSelector(
    (state: RootState) => state.student.currentTaskList,
  )!;

  const { uuid } = useSelector((state: RootState) => state.userData.userData)!;

  const { activeTopic, activeCourse } = useSelector((state: RootState) => state.student);

  const { data: tasksData, isLoading: isTasksLoading } = useQuery('tasks', () =>
    getTasks(taskListId ?? id),
  );

  const maxScore = tasksData?.reduce(
    (score: number, task: Task) => score + Number(task.max_ball),
    0,
  );

  const sendTaskListAnswersMutation = useMutation(
    (data: { student_uuid: string; list_uuid: string; answers: Answer[] }) =>
      sendTaskListAnswers(data),
  );

  const submitTestHandler = () => {
    const formattedAnswers: Answer[] = Object.entries(answers).map(([task_uuid, answer]) => ({
      task_uuid,
      answer,
    }));

    sendTaskListAnswersMutation.mutate({
      student_uuid: uuid,
      list_uuid: taskListId ?? id,
      answers: formattedAnswers,
    });

    dispatch(setCurrentTaskList(null));
    navigate(StudentRoutes.ASSIGNMENTS);
  };

  const [answers, setAnswers] = useState<Answers>({});

  const handleAnswerChange = (taskId: string, answer: string) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [taskId]: answer,
    }));
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
      {!isTasksLoading && tasksData?.length && (
        <div className={`${DEFAULT_CLASSNAME}_tasks`}>
          {tasksData?.map((task: Task, index: number) => (
            <TaskPassCard
              id={task.task_uuid}
              answers={answers}
              onAnswerChange={handleAnswerChange}
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
