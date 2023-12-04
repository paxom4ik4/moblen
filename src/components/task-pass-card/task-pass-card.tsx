import { ChangeEvent, Dispatch, FC, SetStateAction, useEffect, useState } from 'react';

import ArrowDown from 'assets/icons/arrow-down.svg';

import { Typography } from 'common/typography/typography.tsx';
import { TaskWithAnswer, TestIndexOption, TestOption } from 'types/task.ts';

import './task-pass-card.scss';
import { Answers } from 'pages/student/pass-test/pass-test.tsx';
import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  TextareaAutosize,
  TextField,
} from '@mui/material';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { createPortal } from 'react-dom';
import { LibraryMusic, VideoLibrary } from '@mui/icons-material';
import { TEST_FORMAT, TEST_FORMAT_WITH_INDEX } from '../../constants/testTaskFormats.ts';
import {
  convertTestOptionsToCriteria,
  convertTestOptionsToOrderedCriteria,
} from '../../pages/tutor/create-test/utils.ts';

const DEFAULT_CLASSNAME = 'task-pass-card';

export const VIEW_MODE = 'view';
export const PASS_MODE = 'pass';

interface TaskPassCardProps {
  id: string;
  answer?: string;
  mode?: typeof VIEW_MODE | typeof PASS_MODE;
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

  options?: TestOption[] | TestIndexOption[];
}

export const TaskPassCard: FC<TaskPassCardProps> = (props) => {
  const {
    answers,
    onAnswerChange,
    answer,
    id,
    mode = PASS_MODE,
    text,
    maxScore,
    index,
    criteria,
    currentScore,
    showCriteria = false,
    showAnswers = true,

    format = 'Текстовый',
    files = [],

    options = [],
  } = props;

  const isTestTask = format.includes(TEST_FORMAT) || format.includes(TEST_FORMAT_WITH_INDEX);
  const isViewMode = mode === VIEW_MODE;

  const [isCriteriaOpened, setIsCriteriaOpened] = useState(false);

  const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const newAnswer = event.target.value;

    if (onAnswerChange) {
      onAnswerChange(id, newAnswer);
    }
  };

  useEffect(() => {
    if (onAnswerChange) {
      onAnswerChange(id, '');
    }
  }, []);

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

  // UI SPLITTING

  const renderImages = () => {
    return filesImages.map((item) => {
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
    });
  };

  const renderFiles = () => {
    return restFiles.map((item) => {
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
    });
  };

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const [optionsToUse, setOptionsToUse] = useState<TestOption[]>(
    options?.map((item) => ({ ...item, isCorrect: false })) ?? [],
  );

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const [indexOptionsToUse, setIndexOptionsToUse] = useState<TestIndexOption[]>(
    options?.map((item) => ({ ...item, correctIndex: '' })) ?? [],
  );

  const handleOptionChange = (index: number, field: string, value: boolean | string) => {
    const newOptions = [...optionsToUse];

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    newOptions[index][field] = value;
    setOptionsToUse(newOptions);
  };

  const handleIndexOptionChange = (index: number, field: string, value: string) => {
    const newOptions = [...indexOptionsToUse];

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    newOptions[index][field] = value;
    setIndexOptionsToUse(newOptions);
  };

  useEffect(() => {
    if (onAnswerChange) {
      console.log(convertTestOptionsToCriteria(optionsToUse));

      onAnswerChange(id, convertTestOptionsToCriteria(optionsToUse));
    }
  }, [optionsToUse]);

  useEffect(() => {
    if (onAnswerChange) {
      onAnswerChange(id, convertTestOptionsToOrderedCriteria(indexOptionsToUse));
    }
  }, [indexOptionsToUse]);

  useEffect(() => {}, [indexOptionsToUse]);

  const getTaskContent = () => {
    if (format.includes(TEST_FORMAT)) {
      const renderOptions = isViewMode ? options : optionsToUse;

      return (
        <FormGroup className={`${DEFAULT_CLASSNAME}_test_content`}>
          <Typography className={`${DEFAULT_CLASSNAME}_test_content_task`}>{text}</Typography>

          {renderOptions?.map((option, index) => (
            <Box
              width={'100%'}
              key={index}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mt={1}>
              <FormControlLabel
                label={''}
                disabled={isViewMode}
                control={
                  <Checkbox
                    style={{ color: '#6750a4' }}
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    checked={option.isCorrect}
                    onChange={(e) => handleOptionChange(index, 'isCorrect', e.target.checked)}
                  />
                }
              />
              <TextareaAutosize
                disabled
                placeholder={'Введите вариант ответа'}
                value={option.text}
              />
            </Box>
          ))}
        </FormGroup>
      );
    }

    if (format.includes(TEST_FORMAT_WITH_INDEX)) {
      const renderOptions = isViewMode ? options : indexOptionsToUse;

      return (
        <FormGroup className={`${DEFAULT_CLASSNAME}_test_content`}>
          <Typography className={`${DEFAULT_CLASSNAME}_test_content_task`}>{text}</Typography>

          {renderOptions?.map((option, index) => (
            <Box
              width={'100%'}
              key={index}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mt={1}>
              <FormControlLabel
                label={''}
                disabled={isViewMode}
                control={
                  <TextField
                    placeholder={'Введите значение'}
                    style={{ color: '#6750a4' }}
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    value={option.correctIndex}
                    onChange={(e) => handleIndexOptionChange(index, 'correctIndex', e.target.value)}
                  />
                }
              />
              <TextareaAutosize
                disabled
                placeholder={'Введите вариант ответа'}
                value={option.text}
              />
            </Box>
          ))}
        </FormGroup>
      );
    }

    return <Typography>{text}</Typography>;
  };

  const getAnswerContent = () => {
    if (!isTestTask) {
      return (
        <TextareaAutosize
          placeholder={'Запишите ответ...'}
          value={answers![id]}
          onChange={(e) => handleInputChange(e)}
        />
      );
    }
  };

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
                {getTaskContent()}
              </div>
            </div>
          </div>
          {!(mode === 'pass' && isTestTask) && (
            <div className={`${DEFAULT_CLASSNAME}_criteria`}>
              <div className={`${DEFAULT_CLASSNAME}_criteria-text`}>
                <div className={`${DEFAULT_CLASSNAME}_criteria-text_title`}>Ответ</div>
                <div className={`${DEFAULT_CLASSNAME}_task-container_content`}>
                  {mode === 'pass' && getAnswerContent()}
                  {mode === 'view' && (
                    <Typography>
                      {showAnswers
                        ? answer?.length
                          ? answer
                          : 'Ученик не дал ответ на вопрос'
                        : 'Нельзя просмотреть ответ'}
                    </Typography>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {!!files.length && (
          <div className={`${DEFAULT_CLASSNAME}_files`}>
            <div className={`${DEFAULT_CLASSNAME}_files_images`}>{renderImages()}</div>
            <div className={`${DEFAULT_CLASSNAME}_files_assets`}>{renderFiles()}</div>
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
