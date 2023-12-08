import { ChangeEvent, Dispatch, FC, SetStateAction, useEffect, useState } from 'react';

import ArrowDown from 'assets/icons/arrow-down.svg';

import { Typography } from 'common/typography/typography.tsx';
import { ConvertedCompareOption, TaskWithAnswer, TestIndexOption, TestOption } from 'types/task.ts';

import './task-pass-card.scss';
import { Answers } from 'pages/student/pass-test/pass-test.tsx';
import { TextareaAutosize } from '@mui/material';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { createPortal } from 'react-dom';
import { LibraryMusic, VideoLibrary } from '@mui/icons-material';
import {
  COMPARE_TEST_FORMAT,
  TEST_FORMAT,
  TEST_FORMAT_WITH_INDEX,
} from '../../constants/testTaskFormats.ts';
import {
  convertTestOptionsToCompareCriteria,
  convertTestOptionsToCriteria,
  convertTestOptionsToOrderedCriteria,
} from 'pages/tutor/create-test/utils.ts';
import { OrderedTest } from '../../pages/student/pass-test/tests/ordered-test/ordered-test.tsx';
import { UnorderedTest } from '../../pages/student/pass-test/tests/unordered-test/unordered-test.tsx';
import { CompareState } from '../../types/test.ts';
import { CompareTest } from '../../pages/student/pass-test/tests/compare-test/compare-test.tsx';

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

  compareOptions?: ConvertedCompareOption[];
  unorderedTestOptions?: TestOption[];
  orderedTestOptions?: TestIndexOption[];
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

    unorderedTestOptions = [],
    orderedTestOptions = [],
    compareOptions = [],
  } = props;

  const isTestTask =
    format.includes(TEST_FORMAT) ||
    format.includes(TEST_FORMAT_WITH_INDEX) ||
    format.includes(COMPARE_TEST_FORMAT);
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

  const [optionsToUse, setOptionsToUse] = useState<TestOption[]>(
    unorderedTestOptions?.map((item) => ({ ...item, isCorrect: false })) ?? [],
  );

  const [indexOptionsToUse, setIndexOptionsToUse] = useState<TestIndexOption[]>(
    orderedTestOptions?.map((item) => ({ ...item, correctIndex: '' })) ?? [],
  );

  const [compareOptionsToUse, setCompareOptionsToUse] = useState<CompareState>({
    leftOptions: compareOptions?.filter((option) => !option.connected) ?? [],

    rightOptions: compareOptions
      ?.filter((option) => option.connected)
      .map((item) => ({ ...item, connected: [] })),
  });

  const handleLinkChange = (index: number, linkedTo: number[], side: 'left' | 'right') => {
    const optionsKey = side === 'left' ? 'leftOptions' : 'rightOptions';

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const currentOptions = compareOptionsToUse[optionsKey];
    const newOptions = [...currentOptions];

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    newOptions[index].connected = linkedTo;

    const updatedState = {
      ...compareOptionsToUse,
      [optionsKey]: newOptions,
    };

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    setCompareOptionsToUse(updatedState);
  };

  const handleOptionChange = (index: number, field: string, value: boolean | string) => {
    const newOptions = [...optionsToUse];

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
      onAnswerChange(id, convertTestOptionsToCriteria(optionsToUse));
    }
  }, [optionsToUse]);

  useEffect(() => {
    if (onAnswerChange) {
      onAnswerChange(id, convertTestOptionsToOrderedCriteria(indexOptionsToUse));
    }
  }, [indexOptionsToUse]);

  useEffect(() => {
    if (onAnswerChange && compareOptionsToUse?.rightOptions?.length) {
      onAnswerChange(id, convertTestOptionsToCompareCriteria(compareOptionsToUse?.rightOptions));
    }
  }, [compareOptionsToUse]);

  useEffect(() => {}, [indexOptionsToUse]);

  const getTaskContent = () => {
    if (format.includes(TEST_FORMAT)) {
      const renderOptions = isViewMode ? unorderedTestOptions : optionsToUse;

      return (
        <UnorderedTest
          options={renderOptions}
          text={text}
          isViewMode={isViewMode}
          handleOptionChange={handleOptionChange}
        />
      );
    }

    if (format.includes(TEST_FORMAT_WITH_INDEX)) {
      const renderOptions = isViewMode ? orderedTestOptions : indexOptionsToUse;

      return (
        <OrderedTest
          handleIndexOptionChange={handleIndexOptionChange}
          options={renderOptions}
          text={text}
          isViewMode={isViewMode}
        />
      );
    }

    if (format.includes(COMPARE_TEST_FORMAT)) {
      const viewCompareOptions = {
        leftOptions: compareOptions?.filter((option) => !option.connected) ?? [],
        rightOptions:
          compareOptions
            ?.filter((option) => option.connected)
            .map((item) => ({ ...item, connected: item.connected!.split(' ') })) ?? [],
      };

      const renderOptions = isViewMode ? viewCompareOptions : compareOptionsToUse;

      return (
        <CompareTest
          handleLinkChange={handleLinkChange}
          options={renderOptions as CompareState}
          text={text}
          isViewMode={isViewMode}
        />
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
