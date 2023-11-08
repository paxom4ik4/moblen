import { FC, memo } from 'react';
import { useParams } from 'react-router-dom';

import { Task } from 'types/task.ts';

import { Typography } from 'common/typography/typography.tsx';
import { TaskPassCard } from 'components/task-pass-card/task-pass-card.tsx';

import './test-result.scss';

const DEFAULT_CLASSNAME = 'test-result';

// MOCKED UNTIL BE READY WITH DONE TESTS
const TestResult: FC = memo(() => {
  const { id } = useParams();
  console.log(id);

  return (
    <div className={DEFAULT_CLASSNAME}>
      <div className={DEFAULT_CLASSNAME}>
        <div className={`${DEFAULT_CLASSNAME}_title`}>
          <div className={`${DEFAULT_CLASSNAME}_title_name`}>
            <Typography color={'purple'}>
              {'TEST SUBJECT'} - {'TEST TOPIC'}
            </Typography>
            <Typography size={'large'} weight={'bold'}>
              {'TEST NAME'}
            </Typography>
          </div>
          <div className={`${DEFAULT_CLASSNAME}_title_maxScore`}>
            <Typography color={'purple'}>{'Общий балл'}</Typography>
            <Typography weight={'bold'}>10</Typography>
          </div>
        </div>
        <div className={`${DEFAULT_CLASSNAME}_tasks`}>
          {[]?.map((task: Task, index: number) => (
            <div className={`${DEFAULT_CLASSNAME}_tasks_item`}>
              <div className={`${DEFAULT_CLASSNAME}_tasks_item_task`}>
                <TaskPassCard
                  answer={'Test Answer'}
                  mode={'view'}
                  text={task.task_condition}
                  criteria={task.criteria}
                  maxScore={task.max_ball}
                  format={task.format}
                  index={index}
                />
              </div>
              <div className={`${DEFAULT_CLASSNAME}_tasks_item_analytics`}>
                {
                  'Аналитика от GPT Аналитика от GPT Аналитика от GPT Аналитика от GPT Аналитика от GPT Аналитика от GPT Аналитика от GPT Аналитика от GPT Аналитика от GPT Аналитика от GPT Аналитика от GPT Аналитика от GPT Аналитика от GPT Аналитика от GPT Аналитика от GPT Аналитика от GPT Аналитика от GPT Аналитика от GPT Аналитика от GPT Аналитика от GPT Аналитика от GPT Аналитика от GPT Аналитика от GPT Аналитика от GPT Аналитика от GPT Аналитика от GPT Аналитика от GPT Аналитика от GPT Аналитика от GPT Аналитика от GPT Аналитика от GPT Аналитика от GPT Аналитика от GPT Аналитика от GPT Аналитика от GPT Аналитика от GPT Аналитика от GPT Аналитика от GPT Аналитика от GPT Аналитика от GPT Аналитика от GPT Аналитика от GPT Аналитика от GPT Аналитика от GPT'
                }
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

export default TestResult;
