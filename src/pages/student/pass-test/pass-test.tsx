import { FC, useContext, useMemo, useState } from 'react';

import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from 'app.tsx';
import { Typography } from 'common/typography/typography.tsx';
import { TaskPassCard } from 'components/task-pass-card/task-pass-card.tsx';
import { Task, TaskWithAnswer } from 'types/task.ts';
import CheckIcon from 'assets/icons/check-icon.svg';

import './pass-test.scss';

const DEFAULT_CLASSNAME = 'pass-test';

export const PassTest: FC = () => {
  const navigate = useNavigate();

  const { tests } = useContext(AppContext);
  const { id } = useParams();
  const testData = tests.find((test) => test.id === id);

  const { name, subject, topic, tasks } = testData!;
  const maxScore = tasks.reduce(
    (score: number, task: { maxScore: string }) => score + Number(task.maxScore),
    0,
  );

  const initialTasks = useMemo(
    () =>
      tasks.map((task) => ({
        ...task,
        answer: '',
      })),
    [tasks],
  );

  const [tasksWithStudentAnswers, setTasksWithStudentAnswers] =
    useState<TaskWithAnswer[]>(initialTasks);

  const submitTestHandler = () => {
    // send answers to BE and change the status of task to done
    console.log(tasksWithStudentAnswers);

    navigate('/assignments');
  };

  return (
    <div className={DEFAULT_CLASSNAME}>
      <div className={`${DEFAULT_CLASSNAME}_title`}>
        <div className={`${DEFAULT_CLASSNAME}_title_name`}>
          <Typography color={'purple'}>
            {subject} - {topic}
          </Typography>
          <Typography size={'large'} weight={'bold'}>
            {name}
          </Typography>
        </div>
        <div className={`${DEFAULT_CLASSNAME}_title_maxScore`}>
          <Typography color={'purple'}>{'Общий макс. балл'}</Typography>
          <Typography weight={'bold'}>{maxScore}</Typography>
        </div>
      </div>
      <div className={`${DEFAULT_CLASSNAME}_tasks`}>
        {tasks.map((task: Task, index: number) => (
          <TaskPassCard
            tasksWithStudentAnswers={tasksWithStudentAnswers}
            setTasksWithStudentAnswers={setTasksWithStudentAnswers}
            text={task.taskText}
            criteria={task.criteria}
            maxScore={task.maxScore}
            format={task.format}
            index={index}
          />
        ))}
        <button className={`${DEFAULT_CLASSNAME}_submit-test`} onClick={submitTestHandler}>
          <CheckIcon />
        </button>
      </div>
    </div>
  );
};
