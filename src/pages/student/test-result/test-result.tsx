import { FC, memo, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { CompletedTask } from 'types/task.ts';

import { Typography } from 'common/typography/typography.tsx';
import { TaskPassCard } from 'components/task-pass-card/task-pass-card.tsx';

import './test-result.scss';
import { useSelector } from 'react-redux';
import { RootState } from 'store/store.ts';
import { useQuery } from 'react-query';
import { getCompletedTaskList } from 'services/student/student.ts';

const DEFAULT_CLASSNAME = 'test-result';

const TestResult: FC = memo(() => {
  const { id } = useParams();

  const { uuid } = useSelector((state: RootState) => state.userData.userData)!;
  const { currentTaskList, activeTopic, activeCourse } = useSelector(
    (state: RootState) => state.student,
  )!;

  const { name, id: taskListId, selectedStudent } = currentTaskList!;

  const { data: tasks } = useQuery('completedTasks', () =>
    getCompletedTaskList({ list_uuid: taskListId ?? id, student_uuid: selectedStudent ?? uuid }),
  );

  const [maxScore, setMaxScore] = useState(0);
  const [currentScore, setCurrentScore] = useState(0);

  useEffect(() => {
    setMaxScore(
      tasks?.reduce((score: number, task: CompletedTask) => score + Number(task.task.max_ball), 0),
    );

    setCurrentScore(
      tasks?.reduce((score: number, task: CompletedTask) => score + Number(task.score), 0),
    );
  }, [tasks]);

  return (
    <div className={DEFAULT_CLASSNAME}>
      <div className={DEFAULT_CLASSNAME}>
        <div className={`${DEFAULT_CLASSNAME}_title`}>
          <div className={`${DEFAULT_CLASSNAME}_title_name`}>
            <Typography color={'purple'}>
              {activeCourse?.name} - {activeTopic?.name}
            </Typography>
            <Typography size={'large'} weight={'bold'}>
              {name}
            </Typography>
          </div>
          <div className={`${DEFAULT_CLASSNAME}_title_maxScore`}>
            <Typography color={'purple'}>{'Общий балл'}</Typography>
            <Typography weight={'bold'}>
              {currentScore} / {maxScore}
            </Typography>
          </div>
        </div>
        <div className={`${DEFAULT_CLASSNAME}_tasks`}>
          {tasks?.map((task: CompletedTask, index: number) => (
            <div className={`${DEFAULT_CLASSNAME}_tasks_item`}>
              <div className={`${DEFAULT_CLASSNAME}_tasks_item_task`}>
                <TaskPassCard
                  id={task.task.task_uuid}
                  answer={task.answer}
                  mode={'view'}
                  text={task.task.task_condition}
                  criteria={task.task.criteria}
                  maxScore={task.task.max_ball}
                  currentScore={task.score}
                  format={task.task.format}
                  index={index}
                />
              </div>
              <div className={`${DEFAULT_CLASSNAME}_tasks_item_analytics`}>
                <Typography>Аналитика - Задание {index + 1}</Typography>
                <Typography>{task.response}</Typography>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

export default TestResult;
