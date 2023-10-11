import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';

import ArrowDown from 'assets/icons/arrow-down.svg';

import { Typography } from 'common/typography/typography.tsx';
import { Asset, TaskWithAnswer } from 'types/task.ts';

import './task-pass-card.scss';

const DEFAULT_CLASSNAME = 'task-pass-card';

interface TaskPassCardProps {
  answer?: string;
  mode?: 'view' | 'pass';
  text: string;
  criteria: string;
  maxScore: number;
  format?: string;
  index: number;
  taskAssets?: Asset[];
  setTasksWithStudentAnswers?: Dispatch<SetStateAction<TaskWithAnswer[]>>;
  tasksWithStudentAnswers?: TaskWithAnswer[];
}

export const TaskPassCard: FC<TaskPassCardProps> = (props) => {
  const {
    answer,
    mode = 'pass',
    text,
    maxScore,
    index,
    taskAssets,
    criteria,
    tasksWithStudentAnswers,
    setTasksWithStudentAnswers,
  } = props;

  const [studentAnswer, setStudentAnswer] = useState('');
  const [isCriteriaOpened, setIsCriteriaOpened] = useState(false);

  useEffect(() => {
    if (mode === 'pass') {
      const targetTask = tasksWithStudentAnswers![index];
      targetTask.answer = studentAnswer;

      setTasksWithStudentAnswers!([
        ...tasksWithStudentAnswers!.slice(0, index),
        targetTask,
        ...tasksWithStudentAnswers!.slice(index + 1),
      ]);
    }
  }, [studentAnswer, mode, setTasksWithStudentAnswers, tasksWithStudentAnswers, index]);

  return (
    <>
      <div className={DEFAULT_CLASSNAME}>
        <div className={`${DEFAULT_CLASSNAME}_upper`}>
          <div className={`${DEFAULT_CLASSNAME}_task`}>
            <div className={`${DEFAULT_CLASSNAME}_task-container`}>
              <div className={`${DEFAULT_CLASSNAME}_task-container_title`}>Задание {index + 1}</div>
              <div className={`${DEFAULT_CLASSNAME}_task-container_content`}>
                <Typography>{text}</Typography>
              </div>
            </div>
          </div>
          <div className={`${DEFAULT_CLASSNAME}_criteria`}>
            <div className={`${DEFAULT_CLASSNAME}_criteria-text`}>
              <div className={`${DEFAULT_CLASSNAME}_criteria-text_title`}>Ответ</div>
              <div className={`${DEFAULT_CLASSNAME}_task-container_content`}>
                {mode === 'pass' && (
                  <textarea
                    rows={5}
                    placeholder={'Запишите ответ...'}
                    value={studentAnswer}
                    onChange={(e) => setStudentAnswer(e.currentTarget.value)}
                  />
                )}
                {mode === 'view' && <Typography>{answer}</Typography>}
              </div>
            </div>
          </div>
        </div>

        <div className={`${DEFAULT_CLASSNAME}_task_score`}>
          <div className={`${DEFAULT_CLASSNAME}_task_score_maxScore`}>
            <div className={`${DEFAULT_CLASSNAME}_task_score_maxScore-title`}>
              <Typography weight={'bold'}>8 / {maxScore} баллов</Typography>
            </div>
          </div>

          <div
            className={`${DEFAULT_CLASSNAME}_task_criteria`}
            onClick={() => setIsCriteriaOpened(!isCriteriaOpened)}>
            <Typography className={`${DEFAULT_CLASSNAME}_task_criteria_open`} size={'small'}>
              Критерии{' '}
              <div
                className={`${DEFAULT_CLASSNAME}_task_criteria_open-icon ${
                  isCriteriaOpened && 'rotated'
                }`}>
                <ArrowDown />
              </div>
            </Typography>
          </div>
        </div>

        {!!taskAssets?.length && (
          <div className={`${DEFAULT_CLASSNAME}_files`}>
            {taskAssets.map((asset) => (
              <div className={`${DEFAULT_CLASSNAME}_files_item`}>
                <img src={URL.createObjectURL(asset.image)} alt={asset.text} />
                <Typography>{asset.text}</Typography>
              </div>
            ))}
          </div>
        )}
      </div>

      {isCriteriaOpened && (
        <div className={`${DEFAULT_CLASSNAME}_criteria-container`}>
          <Typography>{criteria}</Typography>
        </div>
      )}
    </>
  );
};
