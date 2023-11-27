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
import { CircularProgress } from '@mui/material';

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

  const { uuid } = useSelector((state: RootState) => state.userData.userData)!;

  const { data: tasksData, isLoading: isTasksLoading } = useQuery('tasks', () => getTasks(id!));

  const maxScore = tasksData?.tasks?.reduce(
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
      list_uuid: tasksData?.list_uuid ?? id,
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
            {tasksData?.course_name} - {tasksData?.topic_name}
          </Typography>
          <Typography size={'large'} weight={'bold'}>
            {tasksData?.list_name}
          </Typography>
        </div>
        <div className={`${DEFAULT_CLASSNAME}_title_maxScore`}>
          <Typography color={'purple'}>{'Общий макс. балл'}</Typography>
          <Typography weight={'bold'}>{maxScore}</Typography>
        </div>
      </div>
      {isTasksLoading && <CircularProgress sx={{ color: '#c8caff' }} />}
      {!isTasksLoading && tasksData?.tasks?.length && (
        <div className={`${DEFAULT_CLASSNAME}_tasks`}>
          {tasksData?.tasks?.map((task: Task, index: number) => (
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
              showCriteria={false}
              files={task?.files ?? []}
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
