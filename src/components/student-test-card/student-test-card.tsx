import { FC } from 'react';

import { Typography } from 'common/typography/typography.tsx';

import './student-test-card.scss';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCurrentTaskList } from 'store/student/student.slice.ts';

const DEFAULT_CLASSNAME = 'student-test-card';

interface StudentTestCardProps {
  id: string;
  subject: string;
  topic: string;
  name: string;
  tasksAmount: number;
  deadline?: Date;
  passTime?: Date;
  status: 'pending' | 'done';
  onClick?: () => void;
}

export const StudentTestCard: FC<StudentTestCardProps> = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { id, subject, topic, name, tasksAmount, deadline, passTime = new Date(), status } = props;

  const handleTestClick = () => {
    dispatch(setCurrentTaskList({ id, name }));

    if (status === 'done') {
      navigate(`/assignments/result/${id}`);
    } else {
      navigate(`/assignments/${id}`);
    }
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
        <div className={`${DEFAULT_CLASSNAME}_color`}></div>
      </div>
      <button
        disabled={status === 'pending' && tasksAmount === 0}
        className={`${DEFAULT_CLASSNAME}_status`}
        onClick={handleTestClick}>
        {status === 'pending' && <Typography>Сдать тест</Typography>}
        {status === 'pending' && !!deadline && (
          <Typography>Дедлайн {deadline.toString()}</Typography>
        )}
        {status === 'done' && passTime && (
          <Typography>Сдано {passTime.toLocaleDateString()}</Typography>
        )}
      </button>
    </div>
  );
};
