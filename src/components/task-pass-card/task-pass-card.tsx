import { ChangeEvent, Dispatch, FC, SetStateAction, useState } from 'react';

import ArrowDown from 'assets/icons/arrow-down.svg';

import { Typography } from 'common/typography/typography.tsx';
import { TaskWithAnswer } from 'types/task.ts';

import './task-pass-card.scss';
import { Answers } from 'pages/student/pass-test/pass-test.tsx';
import { TextareaAutosize } from '@mui/material';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { createPortal } from 'react-dom';
import { LibraryMusic, VideoLibrary } from '@mui/icons-material';

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
  setTasksWithStudentAnswers?: Dispatch<SetStateAction<TaskWithAnswer[]>>;
  tasksWithStudentAnswers?: TaskWithAnswer[];

  currentScore?: string;

  answers?: Answers;
  onAnswerChange?: (id: string, answer: string) => void;

  showCriteria?: boolean;
  showAnswers?: boolean;

  files: { file_name: string; url: string }[];
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
    criteria,
    currentScore,
    showCriteria = true,
    showAnswers = true,

    format = 'Текстовый',
    files = [],
  } = props;

  const [isCriteriaOpened, setIsCriteriaOpened] = useState(false);

  const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const newAnswer = event.target.value;
    onAnswerChange!(id, newAnswer);
  };

  const filesImages =
    files.filter(
      (file) =>
        file.file_name.includes('.png') ||
        file.file_name.includes('.svg') ||
        file.file_name.includes('.jpg') ||
        file.file_name.includes('.jpeg'),
    ) ?? [];

  const restFiles =
    files.filter(
      (file) =>
        !(
          file.file_name.includes('.png') ||
          file.file_name.includes('.svg') ||
          file.file_name.includes('.jpg') ||
          file.file_name.includes('.jpeg')
        ),
    ) ?? [];

  const [openedImage, setOpenedImage] = useState<null | string>(null);

  return (
    <>
      {!!openedImage &&
        createPortal(
          <div
            onClick={() => setOpenedImage(null)}
            className={`${DEFAULT_CLASSNAME}_opened_image_container`}>
            <img
              className={`${DEFAULT_CLASSNAME}_opened_image`}
              alt={openedImage}
              src={openedImage}
            />
          </div>,
          document.body,
        )}

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
        {!!files.length && (
          <div className={`${DEFAULT_CLASSNAME}_files`}>
            <div className={`${DEFAULT_CLASSNAME}_files_images`}>
              {filesImages.map((item) => {
                return (
                  <div
                    key={item.file_name}
                    className={`${DEFAULT_CLASSNAME}_files_images_item`}
                    onClick={() => {
                      setOpenedImage(item.url);
                    }}>
                    <img src={item.url} alt={item.file_name} />
                  </div>
                );
              })}
            </div>
            <div className={`${DEFAULT_CLASSNAME}_files_assets`}>
              {restFiles.map((item) => {
                return (
                  <a
                    key={item.file_name}
                    href={item.url}
                    target={'_blank'}
                    className={`${DEFAULT_CLASSNAME}_files_assets_item_container`}>
                    {item.file_name.includes('doc') && (
                      <div className={`${DEFAULT_CLASSNAME}_files_assets_item_container_icon`}>
                        <TextSnippetIcon />
                      </div>
                    )}
                    {item.file_name.includes('pdf') && (
                      <div className={`${DEFAULT_CLASSNAME}_files_assets_item_container_icon`}>
                        <PictureAsPdfIcon />
                      </div>
                    )}
                    {item.file_name.includes('mp4') && (
                      <div className={`${DEFAULT_CLASSNAME}_files_assets_item_container_icon`}>
                        <VideoLibrary />
                      </div>
                    )}
                    {item.file_name.includes('mp3') && (
                      <div className={`${DEFAULT_CLASSNAME}_files_assets_item_container_icon`}>
                        <LibraryMusic />
                      </div>
                    )}
                    <div className={`${DEFAULT_CLASSNAME}_files_assets_item_container_footer`}>
                      <Typography size={'small'}>
                        {item.file_name.length > 18
                          ? `${item.file_name.slice(0, 12)}...${item.file_name.slice(-4)}`
                          : item.file_name}
                      </Typography>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        )}

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
                <Typography color={'purple'}>{format.replace(',', ': ')}</Typography>
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
