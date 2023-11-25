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
import { addFilesToTask, deleteFile, deleteTask, editTask } from 'services/tasks';
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

const MAX_FILES = 5;

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
      newTaskAssets?: File[];

      setNewTaskText: Dispatch<SetStateAction<string>>;
      setNewTaskCriteria: Dispatch<SetStateAction<string>>;
      setNewTaskMaxScore: Dispatch<SetStateAction<number | null>>;
      setNewTaskAssets?: Dispatch<SetStateAction<File[]>>;
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

  const deleteFileMutation = useMutation(
    (data: { taskId: string; fileURL: string }) => deleteFile(data.taskId, data.fileURL),
    {
      onSuccess: () => queryClient.invalidateQueries('tasks'),
    },
  );

  const addFilesToTaskMutation = useMutation(
    (data: { taskId: string; files: FormData }) => addFilesToTask(data.taskId, data.files),
    {
      onSuccess: () => queryClient.invalidateQueries('tasks'),
    },
  );

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
    const newFiles = event.target.files!;

    if (props.isCreateMode && props.newTaskAssets?.length === MAX_FILES) return;

    const maxAllowedSize = 50 * 1024 * 1024;

    if (props.isCreateMode && props.newTaskAssets) {
      for (let i = 0; i < newFiles.length; i++) {
        const isFileUnique = !props.newTaskAssets.some((file) => file.name === newFiles[i].name);

        if (isFileUnique && newFiles[i].size < maxAllowedSize) {
          props.setNewTaskAssets!((prevFiles) => [...prevFiles, newFiles[i]]);
        } else {
          console.error(`Файл с именем ${newFiles[i].name} уже загружен.`);
        }
      }
    }
  };

  const handleAddTaskAttachments = async (event: ChangeEvent<HTMLInputElement>) => {
    const newFiles = await event.target.files!;

    const files = new FormData();

    const maxAllowedSize = 50 * 1024 * 1024;

    for (let i = 0; i < newFiles.length; i++) {
      if (newFiles[i].size < maxAllowedSize) {
        files.append('files', newFiles[i]);
      }
    }

    addFilesToTaskMutation.mutate({ taskId: props.taskId!, files });
  };

  const handleAssetDelete = (name: string) => {
    props.isCreateMode &&
      props.setNewTaskAssets!((prevFiles) => prevFiles.filter((file) => file.name !== name));
  };

  const filesImages = !props.isCreateMode
    ? props.files.filter(
        (file) =>
          file.file_name.includes('.png') ||
          file.file_name.includes('.svg') ||
          file.file_name.includes('.jpg') ||
          file.file_name.includes('.jpeg'),
      )
    : [];

  const restFiles = !props.isCreateMode
    ? props.files.filter(
        (file) =>
          !(
            file.file_name.includes('.png') ||
            file.file_name.includes('.svg') ||
            file.file_name.includes('.jpg') ||
            file.file_name.includes('.jpeg')
          ),
      )
    : [];

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
            {!props.editModeDisabled &&
              props.isCreateMode &&
              props.newTaskAssets?.length !== MAX_FILES && (
                <>
                  <div className={`${DEFAULT_CLASSNAME}_attachments`}>
                    <input
                      maxLength={
                        props.newTaskAssets
                          ? MAX_FILES - Array.from(props.newTaskAssets).length
                          : MAX_FILES
                      }
                      type={'file'}
                      multiple={true}
                      onChange={handleAddAttachments}
                    />
                    <button>
                      <AttachIcon />
                    </button>
                  </div>
                  <Typography className={`${DEFAULT_CLASSNAME}_attachments_info`}>
                    Максимальный размер файла 50 мб
                  </Typography>
                </>
              )}

            {!props.editModeDisabled && !props.isCreateMode && isEditMode && (
              <>
                <div className={`${DEFAULT_CLASSNAME}_attachments`}>
                  <input
                    maxLength={MAX_FILES}
                    type={'file'}
                    multiple={true}
                    onChange={handleAddTaskAttachments}
                  />
                  <button>
                    <AttachIcon />
                  </button>
                </div>
                <Typography className={`${DEFAULT_CLASSNAME}_attachments_info`}>
                  Максимальный размер файла 50 мб
                </Typography>
              </>
            )}
          </div>
          {props.isCreateMode && !props.hideAssets && (
            <div className={`${DEFAULT_CLASSNAME}_assets`}>
              {props.isCreateMode &&
                props.newTaskAssets &&
                props.newTaskAssets.map((item) => {
                  return (
                    <div className={`${DEFAULT_CLASSNAME}_assets_item`}>
                      {item.type.includes('image') && <ImageIcon />}
                      {item.type.includes('pdf') && <TextSnippetIcon />}
                      {item.type.includes('doc') && <PictureAsPdfIcon />}
                      <Typography>{item.name}</Typography>{' '}
                      <div
                        className={`${DEFAULT_CLASSNAME}_assets_item_delete`}
                        onClick={() => handleAssetDelete(item.name)}>
                        <TrashIcon />
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
          {!props.isCreateMode && props.files && (
            <div className={`${DEFAULT_CLASSNAME}_loaded_assets`}>
              <div className={`${DEFAULT_CLASSNAME}_loaded_assets_images`}>
                {filesImages.map((item) => {
                  return (
                    <div
                      className={`${DEFAULT_CLASSNAME}_loaded_assets_images_item`}
                      onClick={() => setIsEditMode(true)}>
                      <img src={item.url} alt={item.file_name} />
                      {isEditMode && (
                        <div
                          className={`${DEFAULT_CLASSNAME}_loaded_assets_images_item_delete`}
                          onClick={(event) => {
                            event.stopPropagation();
                            deleteFileMutation.mutate({ taskId: props.taskId!, fileURL: item.url });
                          }}>
                          <TrashIcon />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className={`${DEFAULT_CLASSNAME}_loaded_assets_files`}>
                {restFiles.map((item) => {
                  return (
                    <div className={`${DEFAULT_CLASSNAME}_loaded_assets_files_item_container`}>
                      <a
                        href={item.url}
                        target={'_blank'}
                        className={`${DEFAULT_CLASSNAME}_loaded_assets_item`}>
                        {item.file_name.includes('doc') && <TextSnippetIcon />}
                        {item.file_name.includes('pdf') && <PictureAsPdfIcon />}
                        <Typography>{item.file_name}</Typography>
                      </a>
                      {isEditMode && (
                        <div
                          className={`${DEFAULT_CLASSNAME}_loaded_assets_item_delete`}
                          onClick={(event) => {
                            event.stopPropagation();
                            deleteFileMutation.mutate({ taskId: props.taskId!, fileURL: item.url });
                          }}>
                          <TrashIcon />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
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
