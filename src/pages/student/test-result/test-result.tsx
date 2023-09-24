import { useContext } from 'react';
import { useParams } from "react-router-dom";

import { TaskWithAnswer } from "types/task.ts";

import { AppContext } from "app.tsx";
import { Typography } from "common/typography/typography.tsx";
import { TaskPassCard } from "components/task-pass-card/task-pass-card.tsx";

import './test-result.scss';

const DEFAULT_CLASSNAME = 'test-result';

export const TestResult = () => {
  const { tests } = useContext(AppContext);
  const { id } = useParams();

  const testData = tests.find(test => test.id === id);

  const { name, subject, topic, tasks } = testData!;
  const maxScore = tasks.reduce((score: number, task: { maxScore: string }) => score += Number(task.maxScore), 0);

  return (
    <div className={DEFAULT_CLASSNAME}>
      <div className={DEFAULT_CLASSNAME}>
        <div className={`${DEFAULT_CLASSNAME}_title`}>
          <div className={`${DEFAULT_CLASSNAME}_title_name`}>
            <Typography color={'purple'}>{subject} - {topic}</Typography>
            <Typography size={'large'} weight={'bold'}>{name}</Typography>
          </div>
          <div className={`${DEFAULT_CLASSNAME}_title_maxScore`}>
            <Typography color={'purple'}>{"Общий балл"}</Typography>
            <Typography weight={'bold'}>24 / {maxScore}</Typography>
          </div>
        </div>
        <div className={`${DEFAULT_CLASSNAME}_tasks`}>
          {tasks?.map((task: TaskWithAnswer, index: number) =>
            <div className={`${DEFAULT_CLASSNAME}_tasks_item`}>
              <div className={`${DEFAULT_CLASSNAME}_tasks_item_task`}>
                <TaskPassCard
                  answer={task.answer}
                  mode={'view'}
                  text={task.taskText}
                  criteria={task.criteria}
                  maxScore={task.maxScore}
                  format={task.format}
                  index={index}
                />
              </div>
              <div className={`${DEFAULT_CLASSNAME}_tasks_item_analytics`}>
                {"Аналитика от GPT Аналитика от GPT Аналитика от GPT Аналитика от GPT Аналитика от GPT Аналитика от GPT Аналитика от GPT Аналитика от GPT Аналитика от GPT Аналитика от GPT Аналитика от GPT Аналитика от GPT Аналитика от GPT Аналитика от GPT Аналитика от GPT Аналитика от GPT Аналитика от GPT Аналитика от GPT Аналитика от GPT Аналитика от GPT Аналитика от GPT Аналитика от GPT Аналитика от GPT Аналитика от GPT Аналитика от GPT Аналитика от GPT Аналитика от GPT Аналитика от GPT Аналитика от GPT Аналитика от GPT Аналитика от GPT Аналитика от GPT Аналитика от GPT Аналитика от GPT Аналитика от GPT Аналитика от GPT Аналитика от GPT Аналитика от GPT Аналитика от GPT Аналитика от GPT Аналитика от GPT Аналитика от GPT Аналитика от GPT Аналитика от GPT"}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
