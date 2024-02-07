import { FC, memo, useEffect, useMemo, useState } from 'react';

import { useNavigate, useParams } from 'react-router-dom';
import { Typography } from 'common/typography/typography.tsx';
import { TaskPassCard } from 'components/task-pass-card/task-pass-card.tsx';
import { ConvertedCompareOption, Task, TestIndexOption, TestOption } from 'types/task.ts';
import CheckIcon from 'assets/icons/check-icon.svg';

import { StudentRoutes } from 'constants/routes.ts';

import './pass-test.scss';
import { useMutation, useQuery } from 'react-query';
import { useDispatch } from 'react-redux';
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

const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;

const Timer = (props : { deadline: string } ) => {

  const {
    deadline
  } = props;

  const parsedDeadline = useMemo(() => Date.parse(deadline), [deadline]);
  const [time, setTime] = useState(parsedDeadline - Date.now());

  useEffect(() => {
      const interval = setInterval(
          () => setTime(parsedDeadline - Date.now()),
          1000,
      );

      return () => clearInterval(interval);
  }, [parsedDeadline]);

  return (
      <div style={{display: 'flex', gap: 10, justifyContent: 'flex-end'}}>
          {Object.entries({
              Дней: time / DAY,
              Часов: (time / HOUR) % 24,
              Минут: (time / MINUTE) % 60,
              Секунд: (time / SECOND) % 60,
          }).map(([label, value]) => (
              <div key={label}>
                  <div style={{display: 'flex', gap: 5}}>
                      <p style={{color: 'red'}}>{`${Math.floor(value)}`.padStart(2, "0")}</p>
                      <span style={{color: 'red'}}>{label}</span>
                  </div>
              </div>
          ))}
      </div>
  );
};

const PassTest: FC = memo(() => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { id } = useParams();

  const { data: tasksData, isLoading: isTasksLoading } = useQuery('tasks', () => getTasks(id!));

  const timer = tasksData ? new Date(tasksData?.deadline).getTime() - new Date(Date.now()).getTime() : -1;
  
  const [isNotLate, setIsNotLate] = useState<boolean>(true);
  
  useEffect(() => {
    if (tasksData) {
      tasksData.deadline !== null ? setIsNotLate(tasksData && tasksData.deadline !== null && (new Date(tasksData.deadline) > new Date(Date.now()))) : setIsNotLate(true)
    }
  }, [tasksData])
  

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [sendTimer, _] = useState(new Date(tasksData?.deadline).getTime() - new Date(Date.now()).getTime());

  if (isNotLate && tasksData && tasksData.deadline !== null && timer !== -1 && timer > 0) {
    setTimeout(() => {
      setIsNotLate(false);
    }, timer);
  }

  useEffect(() => {
    if (!isNotLate && sendTimer > 0) {
      submitTestHandler();
    }
  }, [isNotLate])
  

  const maxScore = tasksData?.tasks?.reduce(
    (score: number, task: Task) => score + Number(task.max_ball),
    0,
  );

  const sendTaskListAnswersMutation = useMutation(
    (data: { list_uuid: string; answers: Answer[] }) => sendTaskListAnswers(data),
  );

  const submitTestHandler = () => {
    const formattedAnswers: Answer[] = Object.entries(answers).map(([task_uuid, answer]) => ({
      task_uuid,
      answer,
    }));

    sendTaskListAnswersMutation.mutate({
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
              compareOptions={task.variants as ConvertedCompareOption[]}
              unorderedTestOptions={task.variants as TestOption[]}
              orderedTestOptions={task.variants as TestIndexOption[]}
            />
          ))}
          {isNotLate && (
            <>
              <button className={`${DEFAULT_CLASSNAME}_submit-test`} onClick={submitTestHandler}>
                <CheckIcon />
              </button>
              {tasksData.deadline !== null && (
                <>
                  <p style={{textAlign: 'right', color: 'red'}}>
                    До дедлайна
                  </p>
                  <Timer deadline={tasksData.deadline}/>
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
});

export default PassTest;
