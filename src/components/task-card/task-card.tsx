import { ChangeEvent, Dispatch, FC, SetStateAction, useState } from 'react';

import './task-card.scss';

import TrashIcon from 'assets/icons/trash-icon.svg';
import CheckIcon from 'assets/icons/check-icon.svg';
import CloseIcon from 'assets/icons/cancel-icon.svg';
import AttachIcon from 'assets/icons/attach-icon.svg';

import ImageIcon from '@mui/icons-material/Image';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

import { Typography } from 'common/typography/typography.tsx';
import { Asset, Task } from 'types/task.ts';
import { useMutation, useQueryClient } from 'react-query';
import { deleteTask, editTask } from 'services/tasks';
import {
  ListSubheader,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextareaAutosize,
  TextField,
  Tooltip,
} from '@mui/material';
import { ClickAwayListener } from '@mui/base/ClickAwayListener';

const DEFAULT_CLASSNAME = 'task-card';

export type TaskCardProps =
  | {
      taskId?: string;
      taskListId: string;
      taskAssets?: Asset[];
      index?: number;

      isCreateMode: true;

      newTaskText: string;
      newTaskCriteria: string;
      newTaskFormat: string;
      newTaskMaxScore: number | null;
      newTaskAssets?: FileList | null;

      setNewTaskText: Dispatch<SetStateAction<string>>;
      setNewTaskCriteria: Dispatch<SetStateAction<string>>;
      setNewTaskMaxScore: Dispatch<SetStateAction<number | null>>;
      setNewTaskAssets?: Dispatch<SetStateAction<FileList | null>>;
      handleFormatChange: (event: SelectChangeEvent) => void;

      saveNewTaskHandler: () => void;

      taskFormats?: {
        subject: string;
        formats: string[];
      }[];

      editModeDisabled?: boolean;
      setIsNewTask?: Dispatch<SetStateAction<boolean>>;

      hideAssets?: boolean;
    }
  | {
      isCreateMode: false;

      text: string;
      criteria: string;
      maxScore: number | null;
      format: string;
      editModeDisabled?: boolean;

      taskId?: string;
      taskListId: string;
      taskAssets?: Asset[];
      index?: number;

      files: { file_name: string; url: string }[];

      taskFormats?: {
        subject: string;
        formats: string[];
      }[];

      hideAssets?: boolean;
    };

export const TaskCard: FC<TaskCardProps> = (props) => {
  const queryClient = useQueryClient();

  // assets

  const [addNewAsset, setAddNewAsset] = useState<boolean>(false);
  const [newAssetImage, setNewAssetImage] = useState<File | null>(null);
  const [newAssetText, setNewAssetText] = useState('');

  const deleteTaskMutation = useMutation((data: { taskId: string }) => deleteTask(data), {
    onSuccess: () => queryClient.invalidateQueries('tasks'),
  });

  const deleteTaskHandler = () => {
    if (props.taskId && props.taskListId) {
      deleteTaskMutation.mutate({
        taskId: props.taskId,
      });
    }
  };

  const clearNewAsset = () => {
    setNewAssetImage(null);
    setNewAssetText('');
  };

  const closeNewAssetHandler = () => {
    setAddNewAsset(false);
    clearNewAsset();
  };

  // const saveNewAssetHandler = () => {
  //   if (newAssetText.length && newAssetImage) {
  //     setAssets([
  //       ...assets,
  //       {
  //         text: newAssetText,
  //         image: newAssetImage!,
  //       },
  //     ]);
  //
  //     closeNewAssetHandler();
  //   }
  // };

  const renderFormatGroup = (group: { subject: string; formats: string[] }) => {
    const items = group.formats.map((format) => (
      <MenuItem key={format} value={`${group.subject},${format}`}>
        {format}
      </MenuItem>
    ));
    return [<ListSubheader>{group.subject}</ListSubheader>, items];
  };

  const [editTaskText, setEditTaskText] = useState(
    !props.isCreateMode && props.text ? props.text : '',
  );
  const [editTaskCriteria, setEditTaskCriteria] = useState(
    !props.isCreateMode && props.criteria ? props.criteria : '',
  );
  const [editTaskMaxBall, setEditTaskMaxBall] = useState(
    !props.isCreateMode && props.maxScore ? props.maxScore : 0,
  );
  const [editTaskFormat, setEditTaskFormat] = useState(
    !props.isCreateMode && props.format ? props.format : '',
  );

  const [isEditMode, setIsEditMode] = useState(false);

  const editTaskMutation = useMutation(
    (data: Partial<Task>) => editTask({ taskId: props.taskId!, data }),
    {
      onSuccess: () => {
        setIsEditMode(false);
        queryClient.invalidateQueries('tasks');
      },
    },
  );

  const handleSaveEdits = (isEditMode: boolean) => {
    if (isEditMode) {
      editTaskMutation.mutate({
        format: editTaskFormat,
        task_condition: editTaskText,
        max_ball: editTaskMaxBall,
        criteria: editTaskCriteria,
      });
    }
  };

  const handleFormatChange = (event: SelectChangeEvent) => {
    setEditTaskFormat(event.target.value as string);
  };

  const handleAddAttachments = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files!;

    props.isCreateMode && props.setNewTaskAssets!(files);
  };

  return (
    <ClickAwayListener onClickAway={() => handleSaveEdits(isEditMode)}>
      <div className={`${DEFAULT_CLASSNAME} ${props.editModeDisabled && 'card-disabled'}`}>
        {addNewAsset && (
          <div className={`${DEFAULT_CLASSNAME}_new-asset`}>
            <div className={`${DEFAULT_CLASSNAME}_new-asset_content`}>
              <div className={`${DEFAULT_CLASSNAME}_new-asset_content_image`}>
                <input
                  type={'file'}
                  onChange={(e) => setNewAssetImage(e.currentTarget.files![0])}
                />
                {!newAssetImage && (
                  <Typography className={`${DEFAULT_CLASSNAME}_new-asset_content_image-title`}>
                    Загрузить картинку
                  </Typography>
                )}
                {newAssetImage && (
                  <img src={URL.createObjectURL(newAssetImage)} alt={'New Asset'} />
                )}
              </div>
              <TextareaAutosize
                value={newAssetText}
                onChange={(e) => setNewAssetText(e.target.value)}
                placeholder={'Описание картинки'}
                className={`${DEFAULT_CLASSNAME}_new-assets_content_text`}
              />
              <div className={`${DEFAULT_CLASSNAME}_new-asset_buttons`}>
                <button onClick={closeNewAssetHandler}>
                  <CloseIcon />
                </button>
                {/*<button onClick={saveNewAssetHandler}>*/}
                {/*  <CheckIcon />*/}
                {/*</button>*/}
              </div>
            </div>
          </div>
        )}

        <div className={`${DEFAULT_CLASSNAME}_upper`}>
          <div className={`${DEFAULT_CLASSNAME}_task`}>
            <div className={`${DEFAULT_CLASSNAME}_criteria`}>
              <div className={`${DEFAULT_CLASSNAME}_task-container`}>
                <div className={`${DEFAULT_CLASSNAME}_task-container_title`}>
                  Задание {props.isCreateMode ? '' : props.index}
                </div>
                <div className={`${DEFAULT_CLASSNAME}_task-container_content`}>
                  {props.isCreateMode && (
                    <TextareaAutosize
                      placeholder={'Текст задания'}
                      value={props.newTaskText}
                      onChange={(e) => props.setNewTaskText(e.currentTarget.value)}
                    />
                  )}
                  {!props.isCreateMode && isEditMode && (
                    <TextareaAutosize
                      placeholder={'Текст задания'}
                      value={editTaskText}
                      onChange={(e) => setEditTaskText(e.currentTarget.value)}
                    />
                  )}
                  {!isEditMode && !props.isCreateMode && (
                    <Typography onClick={() => setIsEditMode(true)}>{props.text}</Typography>
                  )}
                </div>
              </div>
            </div>
            <div className={`${DEFAULT_CLASSNAME}_criteria`}>
              <div className={`${DEFAULT_CLASSNAME}_criteria-text`}>
                <div className={`${DEFAULT_CLASSNAME}_criteria-text_title`}>Критерии</div>
                <div className={`${DEFAULT_CLASSNAME}_task-container_content`}>
                  {props.isCreateMode && (
                    <TextareaAutosize
                      placeholder={'Критерии задания'}
                      value={props.newTaskCriteria}
                      onChange={(e) => props.setNewTaskCriteria(e.currentTarget.value)}
                    />
                  )}
                  {!props.isCreateMode && isEditMode && (
                    <TextareaAutosize
                      placeholder={'Критерии задания'}
                      value={editTaskCriteria}
                      onChange={(e) => setEditTaskCriteria(e.currentTarget.value)}
                    />
                  )}
                  {!isEditMode && !props.isCreateMode && (
                    <Typography onClick={() => setIsEditMode(true)}>{props.criteria}</Typography>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className={`${DEFAULT_CLASSNAME}_task_score_container`}>
            <div className={`${DEFAULT_CLASSNAME}_task_score`}>
              <div className={`${DEFAULT_CLASSNAME}_task_score_maxScore`}>
                <div className={`${DEFAULT_CLASSNAME}_task_score_maxScore-title`}>
                  Максимальный балл за задание
                </div>
                {props.isCreateMode && (
                  <TextField
                    placeholder={'Балл за задание'}
                    value={props.newTaskMaxScore ?? 0}
                    type={'text'}
                    onChange={(e) => props.setNewTaskMaxScore(Number(e.currentTarget.value))}
                  />
                )}
                {!props.isCreateMode && isEditMode && (
                  <TextField
                    placeholder={'Балл за задание'}
                    value={editTaskMaxBall}
                    type={'text'}
                    onChange={(e) => setEditTaskMaxBall(Number(e.currentTarget.value))}
                  />
                )}
                {!isEditMode && !props.isCreateMode && (
                  <Typography onClick={() => setIsEditMode(true)}>{props.maxScore}</Typography>
                )}
              </div>

              <div className={`${DEFAULT_CLASSNAME}_task_score_maxScore`}>
                <div className={`${DEFAULT_CLASSNAME}_task_score_maxScore-title`}>
                  Формат задания
                </div>
                {props.isCreateMode && (
                  <Select
                    fullWidth
                    value={props.newTaskFormat || ''}
                    onChange={props.handleFormatChange}
                    defaultValue=""
                    MenuProps={{ PaperProps: { sx: { maxHeight: 320 } } }}>
                    {props.taskFormats?.map((taskFormat) => renderFormatGroup(taskFormat))}
                  </Select>
                )}
                {!props.isCreateMode && isEditMode && (
                  <Select
                    fullWidth
                    value={editTaskFormat || ''}
                    onChange={handleFormatChange}
                    defaultValue=""
                    MenuProps={{ PaperProps: { sx: { maxHeight: 320 } }, disablePortal: true }}>
                    {props.taskFormats?.map((taskFormat) => renderFormatGroup(taskFormat))}
                  </Select>
                )}
                {!isEditMode && !props.isCreateMode && (
                  <Typography onClick={() => setIsEditMode(true)}>
                    {props.format.replace(',', ': ')}
                  </Typography>
                )}
              </div>
            </div>
            {!props.editModeDisabled && props.isCreateMode && (
              <div className={`${DEFAULT_CLASSNAME}_attachments`}>
                <input type={'file'} multiple={true} onChange={handleAddAttachments} />
                <button>
                  <AttachIcon />
                </button>
              </div>
            )}
          </div>
          {props.isCreateMode && !props.hideAssets && (
            <div className={`${DEFAULT_CLASSNAME}_assets`}>
              {props.isCreateMode &&
                props.newTaskAssets &&
                Array.from(props.newTaskAssets).map((item) => {
                  if (item.type.includes('image')) {
                    return (
                      <div className={`${DEFAULT_CLASSNAME}_assets_item`}>
                        <ImageIcon /> <Typography>{item.name}</Typography>
                      </div>
                    );
                  }
                  if (item.type.includes('pdf')) {
                    return (
                      <div className={`${DEFAULT_CLASSNAME}_assets_item`}>
                        <TextSnippetIcon /> <Typography>{item.name}</Typography>
                      </div>
                    );
                  }
                  if (item.type.includes('doc')) {
                    return (
                      <div className={`${DEFAULT_CLASSNAME}_assets_item`}>
                        <PictureAsPdfIcon /> <Typography>{item.name}</Typography>
                      </div>
                    );
                  }
                })}
            </div>
          )}
          {!props.isCreateMode && props.files && (
            <div className={`${DEFAULT_CLASSNAME}_loaded_assets`}>
              {props.files.map((item) => (
                <img src={item.url} alt={item.file_name} />
              ))}
            </div>
          )}
        </div>

        {/*{props.isCreateMode && !!assets.length && (*/}
        {/*  <div className={`${DEFAULT_CLASSNAME}_files`}>*/}
        {/*    {assets.map((asset) => (*/}
        {/*      <div key={asset.text} className={`${DEFAULT_CLASSNAME}_files_item`}>*/}
        {/*        <img src={URL.createObjectURL(asset.image)} alt={asset.text} />*/}
        {/*        <Typography className={`${DEFAULT_CLASSNAME}_files_item_text`}>*/}
        {/*          {asset.text}*/}
        {/*        </Typography>*/}
        {/*      </div>*/}
        {/*    ))}*/}
        {/*  </div>*/}
        {/*)}*/}

        {/*{!!props.taskAssets?.length && (*/}
        {/*  <div className={`${DEFAULT_CLASSNAME}_files`}>*/}
        {/*    {assets.map((asset) => (*/}
        {/*      <div key={asset.text} className={`${DEFAULT_CLASSNAME}_files_item`}>*/}
        {/*        <img src={URL.createObjectURL(asset.image)} alt={asset.text} />*/}
        {/*        <Typography className={`${DEFAULT_CLASSNAME}_files_item_text`}>*/}
        {/*          {asset.text}*/}
        {/*        </Typography>*/}
        {/*      </div>*/}
        {/*    ))}*/}
        {/*  </div>*/}
        {/*)}*/}

        {!props.editModeDisabled && !props.isCreateMode && (
          <Tooltip placement={'top'} title={'Удалить'}>
            <div className={`${DEFAULT_CLASSNAME}_trash`} onClick={deleteTaskHandler}>
              <TrashIcon />
            </div>
          </Tooltip>
        )}
        {props.isCreateMode && (
          <Tooltip placement={'top'} title={'Сохранить'}>
            <div
              className={`${DEFAULT_CLASSNAME}_save`}
              onClick={() => {
                props.saveNewTaskHandler();
                props.setIsNewTask!(false);
              }}>
              <CheckIcon />
            </div>
          </Tooltip>
        )}
      </div>
    </ClickAwayListener>
  );
};
