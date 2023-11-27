import { Dispatch, FC, SetStateAction, useState } from 'react';

import ShareIcon from 'assets/icons/share-icon.svg';
import ConfirmIcon from 'assets/icons/check-icon.svg';

import './test-card.scss';
import { useDrag } from 'react-dnd';
import { DraggableTypes } from '../../types/draggable/draggable.types.ts';
import { useMutation, useQueryClient } from 'react-query';
import { createTaskList } from '../../services/tasks';
import { TextField } from '@mui/material';
import { ClickAwayListener } from '@mui/base/ClickAwayListener';

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
      task_amount: number;
    } | null>
  >;
  onClick?: () => void;
}

export interface TestCardCreateProps {
  subject: string;
  topic: string;
  activeTopic: string;
  setIsTaskListCreating: Dispatch<SetStateAction<boolean>>;
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
      className={`${DEFAULT_CLASSNAME} ${isDragging && 'app-test-card-dragging'}`}
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
            task_amount: tasks,
          });
        }}>
        <ShareIcon />
      </div>
    </div>
  );
};

export const TestCardCreate: FC<TestCardCreateProps> = (props) => {
  const { subject, topic, activeTopic, setIsTaskListCreating } = props;

  const queryClient = useQueryClient();

  const [newTaskListName, setNewTaskListName] = useState('');

  const createNewTaskListMutation = useMutation(
    (data: { list_name: string; topic_uuid: string }) => createTaskList(data),
    {
      onSuccess: () => queryClient.invalidateQueries('taskList'),
    },
  );

  const handleNewTaskListCreate = async () => {
    await createNewTaskListMutation.mutate({
      topic_uuid: activeTopic,
      list_name: newTaskListName,
    });

    setIsTaskListCreating(false);
    setNewTaskListName('');
  };

  return (
    <ClickAwayListener onClickAway={handleNewTaskListCreate}>
      <div className={DEFAULT_CLASSNAME}>
        <div className={`${DEFAULT_CLASSNAME}_content`}>
          <div className={`${DEFAULT_CLASSNAME}_subject-topic`}>
            {subject} - {topic}
          </div>
          <TextField
            autoFocus={true}
            type={'text'}
            value={newTaskListName}
            onChange={(e) => setNewTaskListName(e.currentTarget.value)}
            placeholder={'Cписок заданий...'}
            inputProps={{ maxLength: 24 }}
          />
        </div>
        <div className={`${DEFAULT_CLASSNAME}_share`} onClick={handleNewTaskListCreate}>
          <ConfirmIcon />
        </div>
      </div>
    </ClickAwayListener>
  );
};
