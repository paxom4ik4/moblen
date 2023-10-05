import { Dispatch, FC, SetStateAction } from 'react';

import ShareIcon from 'assets/icons/share-icon.svg';

import './test-card.scss';
import { useDrag } from 'react-dnd';
import { DraggableTypes } from '../../types/draggable/draggable.types.ts';

export interface TestCardProps {
  id: string;
  subject?: string;
  topic?: string;
  name?: string;
  tasks?: number;
  setTestToShare: Dispatch<SetStateAction<string | null>>;
}

const DEFAULT_CLASSNAME = 'app-test-card';

export const TestCard: FC<TestCardProps> = (props) => {
  const {
    setTestToShare,
    subject = 'Англ',
    name = 'ДЗ №12',
    tasks = 10,
    topic = 'Третья',
    id,
  } = props;

  const [{ isDragging }, drag] = useDrag({
    type: DraggableTypes.TEST_CARD,
    item: { id },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });

  return (
    <div className={`${DEFAULT_CLASSNAME} ${isDragging && 'app-test-card-dragging'}}`} ref={drag}>
      <div className={`${DEFAULT_CLASSNAME}_content`}>
        <div className={`${DEFAULT_CLASSNAME}_subject-topic`}>
          {subject} - {topic} тема
        </div>
        <div className={`${DEFAULT_CLASSNAME}_name`}>{name}</div>
        <div className={`${DEFAULT_CLASSNAME}_tasks`}>Заданий - {tasks}</div>
      </div>
      <div className={`${DEFAULT_CLASSNAME}_share`} onClick={() => setTestToShare(id)}>
        <ShareIcon />
      </div>
    </div>
  );
};
