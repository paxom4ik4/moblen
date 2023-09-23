import { FC } from 'react';
import { useDrag } from "react-dnd";

import './student-card.scss';
import StudentIcon from 'assets/icons/student-icon.svg';
import {DraggableTypes} from "../../types/draggable/draggable.types.ts";

const DEFAULT_CLASSNAME = 'student-cart'

export interface StudentCardProps {
  name?: string
  surname?: string;
  imgUrl?: string;
  id: string;
  groupId: string;
}

export const StudentCard: FC<StudentCardProps> = props => {
  const { groupId, id, name = "Студент", surname = "Студентович", imgUrl } = props;

  const [{ isDragging }, drag] = useDrag({
    type: DraggableTypes.STUDENT_CARD,
    item: { id, groupId },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });

  return (
    <div ref={drag} className={`${DEFAULT_CLASSNAME} ${isDragging && 'student-cart-dragging'}`}>
      {imgUrl ? <img src={imgUrl} alt={'Image Student'}/> : <StudentIcon />}
      <div className={`${DEFAULT_CLASSNAME}_name`}>{name}</div>
      <div className={`${DEFAULT_CLASSNAME}_surname`}>{surname}</div>
    </div>
  )
}
