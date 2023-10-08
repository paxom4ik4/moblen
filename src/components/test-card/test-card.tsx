import { Dispatch, FC, SetStateAction } from 'react';

import ShareIcon from 'assets/icons/share-icon.svg';

import './test-card.scss';
import { useDrag } from 'react-dnd';
import { DraggableTypes } from '../../types/draggable/draggable.types.ts';

export interface TestCardProps {
  id: string;
  subject: string;
  topic: string;
  name: string;
  tasks?: number;
  setTestToShare: Dispatch<
    SetStateAction<{
      list_uuid: string;
      topic: string;
      course: string;
      name: string;
    } | null>
  >;
  onClick?: () => void;
}

const DEFAULT_CLASSNAME = 'app-test-card';

export const TestCard: FC<TestCardProps> = (props) => {
  const { onClick, setTestToShare, subject, name, tasks = 0, topic, id } = props;

  const [{ isDragging }, drag] = useDrag({
    type: DraggableTypes.TEST_CARD,
    item: { id },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });

  return (
    <div
      onClick={onClick}
      className={`${DEFAULT_CLASSNAME} ${isDragging && 'app-test-card-dragging'}}`}
      ref={drag}>
      <div className={`${DEFAULT_CLASSNAME}_content`}>
        <div className={`${DEFAULT_CLASSNAME}_subject-topic`}>
          {subject} - {topic}
        </div>
        <div className={`${DEFAULT_CLASSNAME}_name`}>{name}</div>
        <div className={`${DEFAULT_CLASSNAME}_tasks`}>Заданий - {tasks}</div>
      </div>
      <div
        className={`${DEFAULT_CLASSNAME}_share`}
        onClick={(e) => {
          e.stopPropagation();
          setTestToShare({
            list_uuid: id,
            topic,
            course: subject,
            name,
          });
        }}>
        <ShareIcon />
      </div>
    </div>
  );
};
