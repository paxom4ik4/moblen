import { ChangeEvent, Dispatch, FC, SetStateAction, useState } from 'react';

import ArrowDown from 'assets/icons/arrow-down.svg';

import { Typography } from 'common/typography/typography.tsx';
import { Asset, TaskWithAnswer } from 'types/task.ts';

import './task-pass-card.scss';
import { Answers } from 'pages/student/pass-test/pass-test.tsx';
import { TextareaAutosize } from '@mui/material';

const DEFAULT_CLASSNAME = 'task-pass-card';

interface TaskPassCardProps {
  id: string;
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

  currentScore?: string;

  answers?: Answers;
  onAnswerChange?: (id: string, answer: string) => void;

  showCriteria?: boolean;
  showAnswers?: boolean;
}

export const TaskPassCard: FC<TaskPassCardProps> = (props) => {
  const {
    answers,
    onAnswerChange,
    answer,
    id,
    mode = 'pass',
    text,
    maxScore,
    index,
    taskAssets,
    criteria,
    currentScore,
    showCriteria = true,
    showAnswers = true,

    format = 'Текстовый',
  } = props;

  const [isCriteriaOpened, setIsCriteriaOpened] = useState(false);

  const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const newAnswer = event.target.value;
    onAnswerChange!(id, newAnswer);
  };

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
                  <TextareaAutosize
                    placeholder={'Запишите ответ...'}
                    value={answers![id]}
                    onChange={(e) => handleInputChange(e)}
                  />
                )}
                {mode === 'view' && (
                  <Typography>{showAnswers ? answer : 'Нельзя просмотреть ответ'}</Typography>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className={`${DEFAULT_CLASSNAME}_task_score`}>
          <div className={`${DEFAULT_CLASSNAME}_task_score_description`}>
            <div className={`${DEFAULT_CLASSNAME}_task_score_maxScore`}>
              <div className={`${DEFAULT_CLASSNAME}_task_score_maxScore-title`}>
                <Typography weight={'bold'}>
                  {`Баллов: ${currentScore ? `${currentScore} / ${maxScore}` : maxScore}`}
                </Typography>
              </div>
            </div>
            <div className={`${DEFAULT_CLASSNAME}_task_score_maxScore primary-color`}>
              <div className={`${DEFAULT_CLASSNAME}_task_score_maxScore-title`}>
                <Typography color={'purple'}>{format}</Typography>
              </div>
            </div>
          </div>

          {showCriteria && (
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
          )}
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
          <Typography size={'small'} className={`${DEFAULT_CLASSNAME}_criteria-container_title`}>
            Критерии
          </Typography>
          <Typography>{criteria}</Typography>
        </div>
      )}
    </>
  );
};
