import { FC } from 'react';

import { Typography } from 'common/typography/typography.tsx';

import './student-test-card.scss';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentTaskList } from 'store/student/student.slice.ts';
import { RootState } from 'store/store.ts';
import { AppModes } from 'constants/appTypes.ts';

import DeadlineIcon from './deadline.svg';

const DEFAULT_CLASSNAME = 'student-test-card';

interface StudentTestCardProps {
  id: string;
  subject: string;
  topic: string;
  name: string;
  tasksAmount: number;
  deadline?: string;
  passTime?: Date;
  status?: [string, number?, number?];
  onClick?: () => void;
  resultsView?: boolean;
  selectedStudent?: string;
  replay?: boolean;
  seeCriteria?: boolean;
  seeAnswers?: boolean;
  sendDate?: string;
}

enum LIST_STATUS {
  completed = 'решено',
  pending = 'не решено',
  check = 'на проверке',
}

export const StudentTestCard: FC<StudentTestCardProps> = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    selectedStudent,
    id,
    subject,
    topic,
    name,
    tasksAmount,
    deadline,
    status = ['не решено'],
    resultsView = false,
    replay = false,
    sendDate,
    seeAnswers = true,
    seeCriteria = true,
  } = props;

  // console.log('deadline props', props);
  

  const [listStatus, score, maxScore] = status;

  const { appMode } = useSelector((state: RootState) => state.appMode);

  const handleTestClick = () => {
    dispatch(
      setCurrentTaskList({
        id,
        name,
        replay,
        selectedStudent: selectedStudent ?? '',
        seeAnswers,
        seeCriteria,
      }),
    );

    if (listStatus === LIST_STATUS.completed) {
      navigate(appMode === AppModes.TT ? `/groups/result/${id}` : `/assignments/result/${id}`);
    } else if (listStatus === LIST_STATUS.pending) {
      navigate(`/assignments/${id}`);
    }
  };

  const getTaskScorePercentage = (score: number = 0, maxScore?: number) => {
    if (!maxScore) return;

    return (score / maxScore) * 100;
  };

  const getCardColor = (taskScore: number) => {
    if (taskScore <= 15) return 'red';
    if (taskScore > 15 && taskScore <= 30) return 'orange';
    if (taskScore > 30 && taskScore <= 50) return 'yellow';
    if (taskScore > 50 && taskScore <= 75) return 'light-green';
    if (taskScore > 75) return 'green';
  };

  return (
    <div className={DEFAULT_CLASSNAME}>
      <div className={`${DEFAULT_CLASSNAME}_content`}>
        <div className={`${DEFAULT_CLASSNAME}_content_info`}>
          <div className={`${DEFAULT_CLASSNAME}_content_info_subject`}>
            <Typography
              color={'purple'}
              className={`${DEFAULT_CLASSNAME}_content_info_subject-container`}>
              {subject} - {topic}
            </Typography>
          </div>
          <div className={`${DEFAULT_CLASSNAME}_content_info_name`}>
            <Typography
              size={'large'}
              className={`${DEFAULT_CLASSNAME}_content_info_name-container`}>
              {name}
            </Typography>
          </div>
          <div className={`${DEFAULT_CLASSNAME}_content_info_tasks`}>
            <Typography
              color={'gray'}
              size={'small'}
              className={`${DEFAULT_CLASSNAME}_content_info_tasks-container`}>
              {'Заданий'} - {tasksAmount}
            </Typography>
          </div>
        </div>
        {listStatus === LIST_STATUS.completed && (
          <div
            className={`${DEFAULT_CLASSNAME}_color ${getCardColor(
              getTaskScorePercentage(score, maxScore)!,
            )}`}
          />
        )}
        {listStatus !== LIST_STATUS.completed && listStatus !== LIST_STATUS.check && deadline && (
          <div className={`${DEFAULT_CLASSNAME}_deadline`}>
            <DeadlineIcon />
          </div>
        )}
      </div>
      {resultsView && (
        <button
          disabled={
            (listStatus === LIST_STATUS.pending && tasksAmount === 0) ||
            (deadline && new Date(deadline) < new Date(Date.now())) ||
            listStatus !== LIST_STATUS.completed
          }
          className={`${DEFAULT_CLASSNAME}_status ${
            listStatus === LIST_STATUS.pending && !!deadline && 'red-border'
          }`}
          onClick={handleTestClick}>
          {listStatus === LIST_STATUS.check && <Typography>На проверке</Typography>}
          {listStatus === LIST_STATUS.pending && !deadline && <Typography>Не сдан</Typography>}
          {listStatus === LIST_STATUS.pending && !!deadline && (
            <Typography color={'red'}>
              Дедлайн{' '}
              {new Date(deadline).toLocaleString('da-DK', {
                hour12: false,
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Typography>
          )}
          {listStatus === LIST_STATUS.completed && sendDate && (
            <Typography className={`${DEFAULT_CLASSNAME}_status_passTime`}>
              <Typography color={'gray'}>Сдано</Typography>{' '}
              {new Date(sendDate).toLocaleString('da-DK', {
                hour12: false,
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Typography>
          )}
        </button>
      )}
      {!resultsView && (
        <button
        disabled={
          (listStatus === LIST_STATUS.pending && tasksAmount === 0) ||
          (deadline && new Date(deadline) < new Date(Date.now())) ||
          listStatus !== LIST_STATUS.completed
        }
          className={`${DEFAULT_CLASSNAME}_status ${
            listStatus === LIST_STATUS.pending && !!deadline && 'red-border'
          }`}
          onClick={handleTestClick}>
          {listStatus === LIST_STATUS.check && <Typography>На проверке</Typography>}
          {listStatus === LIST_STATUS.pending && !deadline && <Typography>Сдать тест</Typography>}
          {listStatus === LIST_STATUS.pending && !!deadline && (
            <Typography color={'red'}>
              Дедлайн{' '}
              {new Date(deadline).toLocaleString('da-DK', {
                hour12: false,
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Typography>
          )}
          {listStatus === LIST_STATUS.completed && sendDate && (
            <Typography className={`${DEFAULT_CLASSNAME}_status_passTime`}>
              <Typography color={'gray'}>Сдано</Typography>{' '}
              {new Date(sendDate).toLocaleString('da-DK', {
                hour12: false,
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Typography>
          )}
        </button>
      )}
    </div>
  );
};
