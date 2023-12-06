import { TextareaAutosize } from '@mui/material';
import { Typography } from 'common/typography/typography.tsx';
import { Dispatch, FC, SetStateAction } from 'react';

const DEFAULT_CLASSNAME = 'task-card';

type DefaultTestProps = {
  index: number;

  isCreateMode?: boolean;
  isEditMode?: boolean;
  setIsEditMode?: Dispatch<SetStateAction<boolean>>;

  newTaskCriteria?: string;
  setNewTaskCriteria?: Dispatch<SetStateAction<string>>;

  editTaskCriteria?: string;
  setEditTaskCriteria?: Dispatch<SetStateAction<string>>;

  criteria?: string;
};

export const DefaultTask: FC<DefaultTestProps> = (props) => {
  const {
    isCreateMode = false,
    setIsEditMode,
    isEditMode = false,
    setNewTaskCriteria,
    editTaskCriteria = '',
    setEditTaskCriteria,
    newTaskCriteria = '',
    criteria = '',
  } = props;

  return (
    <div className={`${DEFAULT_CLASSNAME}_criteria`}>
      <div className={`${DEFAULT_CLASSNAME}_criteria-text`}>
        <div className={`${DEFAULT_CLASSNAME}_criteria-text_title`}>Критерии</div>
        <div className={`${DEFAULT_CLASSNAME}_task-container_content`}>
          {isCreateMode && (
            <TextareaAutosize
              placeholder={'Критерии задания'}
              value={newTaskCriteria}
              onChange={(e) => setNewTaskCriteria!(e.currentTarget.value)}
            />
          )}
          {isEditMode && (
            <TextareaAutosize
              placeholder={'Критерии задания'}
              value={editTaskCriteria}
              onChange={(e) => setEditTaskCriteria!(e.currentTarget.value)}
            />
          )}
          {!isEditMode && !isCreateMode && (
            <Typography onClick={() => setIsEditMode!(true)}>{criteria}</Typography>
          )}
        </div>
      </div>
    </div>
  );
};
