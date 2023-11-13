import { FC } from 'react';

import { Typography } from 'common/typography/typography.tsx';

import './student-test-card.scss';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentTaskList } from 'store/student/student.slice.ts';
import { RootState } from 'store/store.ts';
import { AppModes } from 'constants/appTypes.ts';

const DEFAULT_CLASSNAME = 'student-test-card';

interface StudentTestCardProps {
  id: string;
  subject: string;
  topic: string;
  name: string;
  tasksAmount: number;
  deadline?: Date;
  passTime?: Date;
  status: [string, number?, number?];
  onClick?: () => void;
  resultsView?: boolean;
  selectedStudent?: string;
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
    passTime = new Date(),
    status,
  } = props;

  const [listStatus, score, maxScore] = status;

  const { appMode } = useSelector((state: RootState) => state.appMode);

  const handleTestClick = () => {
    dispatch(setCurrentTaskList({ id, name, selectedStudent: selectedStudent ?? '' }));

    if (listStatus === LIST_STATUS.completed) {
      navigate(appMode === AppModes.tutor ? `/groups/result/${id}` : `/assignments/result/${id}`);
    } else if (listStatus === LIST_STATUS.pending) {
      navigate(`/assignments/${id}`);
    }
  };

  const getTaskScorePercentage = (score?: number, maxScore?: number) => {
    if (!score || !maxScore) return;

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
            <Typography color={'purple'}>
              {subject} - {topic}
            </Typography>
          </div>
          <div className={`${DEFAULT_CLASSNAME}_content_info_name`}>
            <Typography size={'large'}>{name}</Typography>
          </div>
          <div className={`${DEFAULT_CLASSNAME}_content_info_tasks`}>
            <Typography color={'gray'} size={'small'}>
              {'Заданий'} - {tasksAmount}
            </Typography>
          </div>
        </div>
        {listStatus === LIST_STATUS.completed && score && maxScore && (
          <div
            className={`${DEFAULT_CLASSNAME}_color ${getCardColor(
              getTaskScorePercentage(score, maxScore)!,
            )}`}></div>
        )}
      </div>
      <button
        disabled={listStatus === LIST_STATUS.pending && tasksAmount === 0}
        className={`${DEFAULT_CLASSNAME}_status`}
        onClick={handleTestClick}>
        {listStatus === LIST_STATUS.check && <Typography>На проверке</Typography>}
        {listStatus === LIST_STATUS.pending && <Typography>Сдать тест</Typography>}
        {listStatus === LIST_STATUS.pending && !!deadline && (
          <Typography>Дедлайн {deadline.toString()}</Typography>
        )}
        {listStatus === LIST_STATUS.completed && passTime && (
          <Typography>Сдано {passTime.toLocaleDateString()}</Typography>
        )}
      </button>
    </div>
  );
};
