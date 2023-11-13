import { Dispatch, FC, SetStateAction, useState } from 'react';

import './task-card.scss';

// import AttachIcon from 'assets/icons/attach-icon.svg';
import TrashIcon from 'assets/icons/trash-icon.svg';
import CheckIcon from 'assets/icons/check-icon.svg';
import CloseIcon from 'assets/icons/cancel-icon.svg';

import { Typography } from 'common/typography/typography.tsx';
import { Asset } from 'types/task.ts';
import { useMutation, useQueryClient } from 'react-query';
import { createTask, deleteTask } from 'services/tasks';

const DEFAULT_CLASSNAME = 'task-card';

export interface TaskCardProps {
  taskId?: string;
  taskListId: string;
  text: string;
  criteria: string;
  maxScore: number | null;
  format: string;
  taskAssets?: Asset[];
  index?: number;

  isCreateMode?: boolean;
  editModeDisabled?: boolean;
  setIsCreatingMode?: Dispatch<SetStateAction<boolean>>;
}

export const TaskCard: FC<TaskCardProps> = (props) => {
  const {
    taskId,
    taskListId,
    setIsCreatingMode,
    isCreateMode = false,
    text,
    criteria,
    format,
    maxScore,
    index,
    taskAssets,
    editModeDisabled = false,
  } = props;

  const queryClient = useQueryClient();

  const [taskText, setTaskText] = useState<string>(text);
  const [taskCriteria, setTaskCriteria] = useState<string>(criteria);
  const [taskFormat, setTaskFormat] = useState<string>(criteria);
  const [taskMaxScore, setTaskMaxScore] = useState<number | null>(maxScore);

  // assets
  const [assets, setAssets] = useState<Asset[]>(taskAssets ?? []);
  const [addNewAsset, setAddNewAsset] = useState<boolean>(false);
  const [newAssetImage, setNewAssetImage] = useState<File | null>(null);
  const [newAssetText, setNewAssetText] = useState('');

  const createTaskMutation = useMutation(
    (data: {
      list_uuid: string;
      task_condition: string;
      criteria: string;
      format: string;
      max_ball: number;
    }) => createTask(data),
    {
      onSuccess: () => queryClient.invalidateQueries('tasks'),
    },
  );

  const deleteTaskMutation = useMutation((data: { taskId: string }) => deleteTask(data), {
    onSuccess: () => queryClient.invalidateQueries('tasks'),
  });

  const saveNewTaskHandler = () => {
    if (taskText.length && taskCriteria.length && taskMaxScore && taskMaxScore !== 0) {
      createTaskMutation.mutate({
        list_uuid: taskListId,
        format: taskFormat,
        criteria: taskCriteria,
        max_ball: Number(taskMaxScore),
        task_condition: taskText,
      });

      setTaskText('');
      setTaskCriteria('');
      setTaskMaxScore(null);
      setAssets([]);

      setIsCreatingMode!(false);
    }
  };

  const deleteTaskHandler = () => {
    if (taskId && taskListId) {
      deleteTaskMutation.mutate({
        taskId,
      });
    }
  };

  const clearNewAsset = () => {
    setNewAssetImage(null);
    setNewAssetText('');
  };

  // const addNewAssetHandler = () => setAddNewAsset(true);

  const closeNewAssetHandler = () => {
    setAddNewAsset(false);
    clearNewAsset();
  };

  const saveNewAssetHandler = () => {
    if (newAssetText.length && newAssetImage) {
      setAssets([
        ...assets,
        {
          text: newAssetText,
          image: newAssetImage!,
        },
      ]);

      closeNewAssetHandler();
    }
  };

  return (
    <div className={DEFAULT_CLASSNAME}>
      {addNewAsset && (
        <div className={`${DEFAULT_CLASSNAME}_new-asset`}>
          <div className={`${DEFAULT_CLASSNAME}_new-asset_content`}>
            <div className={`${DEFAULT_CLASSNAME}_new-asset_content_image`}>
              <input type={'file'} onChange={(e) => setNewAssetImage(e.currentTarget.files![0])} />
              {!newAssetImage && (
                <Typography className={`${DEFAULT_CLASSNAME}_new-asset_content_image-title`}>
                  Загрузить картинку
                </Typography>
              )}
              {newAssetImage && <img src={URL.createObjectURL(newAssetImage)} alt={'New Asset'} />}
            </div>
            <textarea
              value={newAssetText}
              onChange={(e) => setNewAssetText(e.target.value)}
              placeholder={'Описание картинки'}
              className={`${DEFAULT_CLASSNAME}_new-assets_content_text`}
            />
            <div className={`${DEFAULT_CLASSNAME}_new-asset_buttons`}>
              <button onClick={closeNewAssetHandler}>
                <CloseIcon />
              </button>
              <button onClick={saveNewAssetHandler}>
                <CheckIcon />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={`${DEFAULT_CLASSNAME}_upper`}>
        <div className={`${DEFAULT_CLASSNAME}_task`}>
          <div className={`${DEFAULT_CLASSNAME}_task-container`}>
            <div className={`${DEFAULT_CLASSNAME}_task-container_title`}>
              Задание {isCreateMode ? '' : index}
            </div>
            <div className={`${DEFAULT_CLASSNAME}_task-container_content`}>
              {isCreateMode && (
                <textarea
                  placeholder={'Текст задания'}
                  value={taskText}
                  onChange={(e) => setTaskText(e.currentTarget.value)}
                />
              )}
              {!isCreateMode && <Typography>{text}</Typography>}
            </div>
          </div>
          <div className={`${DEFAULT_CLASSNAME}_task_score`}>
            <div className={`${DEFAULT_CLASSNAME}_task_score_maxScore`}>
              <div className={`${DEFAULT_CLASSNAME}_task_score_maxScore-title`}>
                Максимальный балл за задание
              </div>
              {isCreateMode && (
                <input
                  placeholder={'10'}
                  value={taskMaxScore ?? 0}
                  type={'text'}
                  onChange={(e) => setTaskMaxScore(Number(e.currentTarget.value))}
                />
              )}
              {!isCreateMode && <Typography>{maxScore}</Typography>}
            </div>
            <div className={`${DEFAULT_CLASSNAME}_task_score_maxScore`}>
              <div className={`${DEFAULT_CLASSNAME}_task_score_maxScore-title`}>Формат задания</div>
              {isCreateMode && (
                <input
                  placeholder={'Формат задания'}
                  value={taskFormat}
                  type={'text'}
                  onChange={(e) => setTaskFormat(e.currentTarget.value)}
                />
              )}
              {!isCreateMode && <Typography>{format}</Typography>}
            </div>
          </div>
        </div>
        <div className={`${DEFAULT_CLASSNAME}_criteria`}>
          <div className={`${DEFAULT_CLASSNAME}_criteria-text`}>
            <div className={`${DEFAULT_CLASSNAME}_criteria-text_title`}>Критерии</div>
            <div className={`${DEFAULT_CLASSNAME}_task-container_content`}>
              {isCreateMode && (
                <textarea
                  placeholder={'Критерии задания'}
                  value={taskCriteria}
                  onChange={(e) => setTaskCriteria(e.currentTarget.value)}
                />
              )}
              {!isCreateMode && <Typography>{criteria}</Typography>}
            </div>
          </div>
          {/*{isCreateMode && (*/}
          {/*  <div*/}
          {/*    className={`${DEFAULT_CLASSNAME}_criteria-attach`}*/}
          {/*    onClick={() => addNewAssetHandler()}>*/}
          {/*    <AttachIcon />*/}
          {/*  </div>*/}
          {/*)}*/}
        </div>
      </div>

      {isCreateMode && !!assets.length && (
        <div className={`${DEFAULT_CLASSNAME}_files`}>
          {assets.map((asset) => (
            <div className={`${DEFAULT_CLASSNAME}_files_item`}>
              <img src={URL.createObjectURL(asset.image)} alt={asset.text} />
              <Typography className={`${DEFAULT_CLASSNAME}_files_item_text`}>
                {asset.text}
              </Typography>
            </div>
          ))}
        </div>
      )}

      {!!taskAssets?.length && (
        <div className={`${DEFAULT_CLASSNAME}_files`}>
          {assets.map((asset) => (
            <div className={`${DEFAULT_CLASSNAME}_files_item`}>
              <img src={URL.createObjectURL(asset.image)} alt={asset.text} />
              <Typography className={`${DEFAULT_CLASSNAME}_files_item_text`}>
                {asset.text}
              </Typography>
            </div>
          ))}
        </div>
      )}

      {!editModeDisabled && !isCreateMode && (
        <div className={`${DEFAULT_CLASSNAME}_trash`} onClick={deleteTaskHandler}>
          <TrashIcon />
        </div>
      )}
      {isCreateMode && (
        <div className={`${DEFAULT_CLASSNAME}_save`} onClick={saveNewTaskHandler}>
          <CheckIcon />
        </div>
      )}
    </div>
  );
};
