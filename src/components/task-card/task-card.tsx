import { Dispatch, FC, SetStateAction, useState } from 'react';

import './task-card.scss';

import AttachIcon from 'assets/icons/attach-icon.svg';
import TrashIcon from 'assets/icons/trash-icon.svg';
import CheckIcon from 'assets/icons/check-icon.svg';
import CloseIcon from 'assets/icons/cancel-icon.svg';

import { Typography } from 'common/typography/typography.tsx';
import { Asset, Task } from 'types/task.ts';

const DEFAULT_CLASSNAME = 'task-card';

export interface TaskCardProps {
  text: string;
  criteria: string;
  maxScore: string;
  format: string;
  taskAssets?: Asset[];
  index: number;

  isCreateMode?: boolean;
  setIsCreatingMode?: Dispatch<SetStateAction<boolean>>;
  setTasks: Dispatch<SetStateAction<Task[]>>;
  tasks: Task[];
}

export const TaskCard: FC<TaskCardProps> = (props) => {
  const {
    setIsCreatingMode,
    isCreateMode = false,
    tasks,
    setTasks,
    text,
    criteria,
    format,
    maxScore,
    index,
    taskAssets,
  } = props;

  const [taskText, setTaskText] = useState<string>(text);
  const [taskCriteria, setTaskCriteria] = useState<string>(criteria);
  const [taskMaxScore, setTaskMaxScore] = useState<string>(maxScore);

  // assets
  const [assets, setAssets] = useState<Asset[]>(taskAssets ?? []);
  const [addNewAsset, setAddNewAsset] = useState<boolean>(false);
  const [newAssetImage, setNewAssetImage] = useState(null);
  const [newAssetText, setNewAssetText] = useState('');

  const saveNewTaskHandler = () => {
    if (taskText.length && taskCriteria.length && taskMaxScore.length && taskMaxScore !== '0') {
      setTasks([
        ...tasks,
        {
          format: 'standard',
          criteria: taskCriteria,
          taskText,
          assets,
          maxScore: taskMaxScore,
        },
      ]);

      setTaskText('');
      setTaskCriteria('');
      setTaskMaxScore('');
      setAssets([]);

      setIsCreatingMode!(false);
    }
  };

  const deleteTaskHandler = () => {
    const targetTaskIndex = tasks.findIndex((task) => task.taskText === text);

    setTasks([...tasks.slice(0, targetTaskIndex), ...tasks.slice(targetTaskIndex! + 1)]);
  };

  const clearNewAsset = () => {
    setNewAssetImage(null);
    setNewAssetText('');
  };

  const addNewAssetHandler = () => setAddNewAsset(true);

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
              <input
                type={'file'}
                onChange={(e) =>
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  setNewAssetImage(e.currentTarget.files[0])
                }
              />
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
              Задание {isCreateMode ? tasks.length! + 1 : index}
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
                  value={taskMaxScore}
                  type={'text'}
                  onChange={(e) => setTaskMaxScore(e.currentTarget.value)}
                />
              )}
              {!isCreateMode && <Typography>{maxScore}</Typography>}
            </div>
            <select disabled={!isCreateMode} value={format} title={'Формат'}>
              <option>Формат задания</option>
            </select>
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
          {isCreateMode && (
            <div
              className={`${DEFAULT_CLASSNAME}_criteria-attach`}
              onClick={() => addNewAssetHandler()}>
              <AttachIcon />
            </div>
          )}
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

      {!isCreateMode && (
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
