import { FC } from 'react';
import { useDrag } from 'react-dnd';

import './student-card.scss';
import StudentIcon from 'assets/icons/student-icon.svg';
import { DraggableTypes } from '../../types/draggable/draggable.types.ts';
import { setSelectedStudent } from '../../store/results/results.slice.ts';
import { useDispatch } from 'react-redux';
import { Typography } from 'common/typography/typography.tsx';

const DEFAULT_CLASSNAME = 'student-cart';

export interface StudentCardProps {
  active?: boolean;
  name?: string;
  surname?: string;
  imgUrl?: string;
  id: string;
  groupId: string;
  resultsViewMode?: boolean;
}

export const StudentCard: FC<StudentCardProps> = (props) => {
  const { active = false, groupId, id, name = 'Студент', surname = 'Студентович', imgUrl } = props;

  const dispatch = useDispatch();

  const [{ isDragging }, drag] = useDrag({
    type: DraggableTypes.STUDENT_CARD,
    item: { id, groupId },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });

  const handleStudentClick = () => dispatch(setSelectedStudent(id));

  return (
    <div
      onClick={handleStudentClick}
      ref={drag}
      className={`${DEFAULT_CLASSNAME} ${isDragging && 'student-cart-dragging'} ${
        active && 'student-cart-active'
      }`}>
      <div className={`${DEFAULT_CLASSNAME}_icon`}>
        {imgUrl ? <img src={imgUrl} alt={'Image Student'} /> : <StudentIcon />}
      </div>
      <Typography
        size={'small'}
        color={active ? 'purple' : 'default'}
        className={`${DEFAULT_CLASSNAME}_name`}>
        {name}
      </Typography>
      <Typography
        size={'small'}
        color={active ? 'purple' : 'default'}
        className={`${DEFAULT_CLASSNAME}_surname`}>
        {surname}
      </Typography>
    </div>
  );
};
