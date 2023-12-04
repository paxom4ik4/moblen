import { Dispatch, FC, SetStateAction, useCallback, useState } from 'react';

import './task-card.scss';

import TrashIcon from 'assets/icons/trash-icon.svg';
import CheckIcon from 'assets/icons/check-icon.svg';
import CloseIcon from 'assets/icons/cancel-icon.svg';
import RemoveIcon from './close_icon.svg';

import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

import { Typography } from 'common/typography/typography.tsx';
import { Task, TestIndexOption, TestOption } from 'types/task.ts';
import { useMutation, useQueryClient } from 'react-query';
import { addFilesToTask, deleteFile, deleteTask, editTask } from 'services/tasks';
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  FormGroup,
  ListSubheader,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextareaAutosize,
  TextField,
  Tooltip,
} from '@mui/material';
import { ClickAwayListener } from '@mui/base/ClickAwayListener';
import { useDropzone } from 'react-dropzone';
import { LibraryMusic, VideoLibrary } from '@mui/icons-material';
import {
  COMPARE_TEST_FORMAT,
  TEST_FORMAT,
  TEST_FORMAT_WITH_INDEX,
} from 'constants/testTaskFormats.ts';
import {
  convertTestOptionsToCriteria,
  convertTestOptionsToOrderedCriteria,
} from '../../pages/tutor/create-test/utils.ts';

const DEFAULT_CLASSNAME = 'task-card';

const MAX_FILES = 5;
const MAX_SIZE = 30 * 1024 * 1024;

export type TaskCardProps =
  | {
      disabled?: boolean;

      taskId?: string;
      taskListId: string;
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

      newTaskAssetsTotalSize: number;
      setNewTaskAssetsTotalSize: Dispatch<SetStateAction<number>>;
      newTaskAssetsError: null | string;
      setNewTaskAssetsError: Dispatch<SetStateAction<null | string>>;

      saveNewTaskHandler: () => void;

      taskFormats?: {
        subject: string;
        formats: string[];
      }[];

      editModeDisabled?: boolean;

      hideAssets?: boolean;

      isNewTaskSaving?: boolean;

      setIsNewTask: Dispatch<SetStateAction<boolean>>;

      options: TestOption[];
      indexOptions: TestIndexOption[];

      setOptions: Dispatch<SetStateAction<TestOption[]>>;
      setIndexOptions: Dispatch<SetStateAction<TestIndexOption[]>>;
    }
  | {
      disabled?: boolean;

      isCreateMode: false;

      text: string;
      criteria: string;
      maxScore: number | null;
      format: string;
      editModeDisabled?: boolean;

      taskId?: string;
      taskListId: string;
      index?: number;

      files: { file_name: string; url: string }[];

      taskFormats?: {
        subject: string;
        formats: string[];
      }[];

      hideAssets?: boolean;

      options?: TestOption[];
      indexOptions?: TestIndexOption[];

      setOptions: Dispatch<SetStateAction<TestOption[]>>;
      setIndexOptions: Dispatch<SetStateAction<TestIndexOption[]>>;
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

  const handleSaveEdits = async (isEditMode: boolean) => {
    if (isEditMode && !props.isCreateMode) {
      let criteria = '';

      if (!props.format.includes(TEST_FORMAT) && !props.format.includes(TEST_FORMAT_WITH_INDEX)) {
        criteria = editTaskCriteria.length ? editTaskCriteria : '-';
      }

      if (props.format.includes(TEST_FORMAT)) {
        criteria = convertTestOptionsToCriteria(currentOptions);
      }

      if (props.format.includes(TEST_FORMAT_WITH_INDEX)) {
        criteria = convertTestOptionsToOrderedCriteria(currentIndexOptions);
      }

      await editTaskMutation.mutate({
        format: editTaskFormat,
        task_condition: editTaskText,
        max_ball: editTaskMaxBall,
        criteria,
        variants: currentOptions,
      });
    }
  };

  const handleFormatChange = (event: SelectChangeEvent) => {
    setEditTaskFormat(event.target.value as string);
  };

  const handleAssetDelete = (index: number) => {
    if (props.isCreateMode && props.newTaskAssets && props.setNewTaskAssets) {
      const removedFile = props.newTaskAssets[index];

      props.setNewTaskAssets((prevFiles) => prevFiles.filter((_, idx) => idx !== index));
      props.setNewTaskAssetsTotalSize((prevSize) => prevSize - removedFile.size);
    }
  };

  const [editAssetsError, setEditAssetsError] = useState<null | string>(null);

  const onDropEdit = useCallback(
    (acceptedFiles: File[]) => {
      setEditAssetsError(null);

      const filesToServer = new FormData();

      if (!props.isCreateMode) {
        const newFiles = acceptedFiles.slice(0, MAX_FILES - props.files.length).filter((file) => {
          if (file.size < MAX_SIZE) {
            return true;
          } else {
            setEditAssetsError(`Файл "${file.name}" превышает максимально допустимый размер.`);
          }
        });

        for (let i = 0; i < newFiles.length; i++) {
          filesToServer.append('files', newFiles[i]);
        }

        addFilesToTaskMutation.mutate({ taskId: props.taskId!, files: filesToServer });
      }
    },
    [!props.isCreateMode && props.files],
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      props.isCreateMode && props.setNewTaskAssetsError(null);

      const maxFiles = 5;

      let addedSize = props.isCreateMode ? props.newTaskAssetsTotalSize : 0;
      const newFiles = acceptedFiles.slice(0, maxFiles).filter((file: File) => {
        if (addedSize + file.size <= MAX_SIZE) {
          addedSize += file.size;
          return true;
        } else {
          props.isCreateMode &&
            props.setNewTaskAssetsError(
              `Файл "${file.name}" превышает максимально допустимый размер.`,
            );
          return false;
        }
      });

      props.isCreateMode && props.setNewTaskAssets!((prevFiles) => [...prevFiles, ...newFiles]);
      props.isCreateMode && props.setNewTaskAssetsTotalSize(addedSize);
    },
    [props.isCreateMode && props.newTaskAssetsTotalSize],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    disabled: props.isCreateMode && props.newTaskAssets?.length === MAX_FILES,
    accept: {
      'image/png': ['.png'],
      'image/jpg': ['.jpeg', '.jpg'],
      'text/text': ['.txt', '.docx', '.doc', '.xlsx', '.pdf'],
      'text/pdf': ['.pdf'],
      'audio/audio': ['.mp3'],
      'video/video': ['.mp4'],
      'text/file': ['.pptx', '.zip', '.csv', '.svg'],
    },
  });

  const {
    getRootProps: getRootPropsEdit,
    getInputProps: getInputPropsEdit,
    isDragActive: isDragActiveEdit,
  } = useDropzone({
    onDrop: onDropEdit,
    disabled: !props.isCreateMode && props.files?.length === MAX_FILES,
    accept: {
      'image/png': ['.png'],
      'image/jpg': ['.jpeg', '.jpg'],
      'text/text': ['.txt', '.docx', '.doc', '.xlsx', '.pdf'],
      'text/pdf': ['.pdf'],
      'audio/audio': ['.mp3'],
      'video/video': ['.mp4'],
      'text/file': ['.pptx', '.zip', '.csv', '.svg'],
    },
  });

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

  const defaultTask = (
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
  );

  // Test card
  const handleOptionChange = (index: number, field: string, value: boolean | string) => {
    const newOptions: TestOption[] = props.isCreateMode ? [...props.options] : [...currentOptions];

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    newOptions[index][field] = value;
    props.isCreateMode ? props.setOptions(newOptions) : setCurrentOptions(newOptions);
  };

  const handleAddOption = () => {
    props.isCreateMode && props.setOptions([...props.options, { text: '', isCorrect: false }]);

    !props.isCreateMode && setCurrentOptions([...currentOptions, { text: '', isCorrect: false }]);
  };

  const handleRemoveOption = (index: number) => {
    const newOptions = props.isCreateMode ? [...props.options] : [...currentOptions];
    newOptions.splice(index, 1);
    props.isCreateMode ? props.setOptions(newOptions) : setCurrentOptions(newOptions);
  };

  // Test card EDIT MODE

  const [currentOptions, setCurrentOptions] = useState(props?.options ?? []);

  // Test index card
  const handleIndexOptionChange = (index: number, field: string, value: string) => {
    const newOptions: TestIndexOption[] = props.isCreateMode
      ? [...props.indexOptions]
      : [...currentIndexOptions];

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    newOptions[index][field] = value;
    props.isCreateMode ? props.setIndexOptions(newOptions) : setCurrentIndexOptions(newOptions);
  };

  const handleIndexAddOption = () => {
    props.isCreateMode &&
      props.setIndexOptions([...props.indexOptions, { text: '', correctIndex: '' }]);

    !props.isCreateMode &&
      setCurrentIndexOptions([...currentIndexOptions, { text: '', correctIndex: '' }]);
  };

  const handleIndexRemoveOption = (index: number) => {
    const newOptions = props.isCreateMode ? [...props.indexOptions] : [...currentIndexOptions];
    newOptions.splice(index, 1);
    props.isCreateMode ? props.setIndexOptions(newOptions) : setCurrentIndexOptions(newOptions);
  };

  // Test Index card EDIT MODE

  const [currentIndexOptions, setCurrentIndexOptions] = useState(props?.indexOptions ?? []);

  const formItemDisabled = !isEditMode && !props.isCreateMode;

  const optionsToUse = props.isCreateMode ? props.options : currentOptions;
  const indexOptionsToUse = props.isCreateMode ? props.indexOptions : currentIndexOptions;

  const testTask = (
    <div className={`${DEFAULT_CLASSNAME}_test`}>
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

          <div className={`${DEFAULT_CLASSNAME}_test_content`}>
            <FormGroup onClick={() => !props.isCreateMode && setIsEditMode(true)}>
              {optionsToUse?.map((option, index) => (
                <Box
                  width={'100%'}
                  key={index}
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mt={1}>
                  <FormControlLabel
                    disabled={formItemDisabled}
                    label={''}
                    control={
                      <Checkbox
                        disabled={formItemDisabled}
                        style={{ color: '#6750a4' }}
                        checked={option.isCorrect}
                        onChange={(e) => handleOptionChange(index, 'isCorrect', e.target.checked)}
                      />
                    }
                  />
                  <TextareaAutosize
                    disabled={formItemDisabled}
                    placeholder={'Введите вариант ответа'}
                    value={option.text}
                    onChange={(e) => handleOptionChange(index, 'text', e.target.value)}
                  />

                  <Button disabled={formItemDisabled} onClick={() => handleRemoveOption(index)}>
                    <RemoveIcon />
                  </Button>
                </Box>
              ))}
            </FormGroup>
            {(props.isCreateMode || isEditMode) && (
              <Button className={`${DEFAULT_CLASSNAME}_test_content_add`} onClick={handleAddOption}>
                + Добавить вариант
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const testTaskIndex = (
    <div className={`${DEFAULT_CLASSNAME}_test`}>
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

          <div className={`${DEFAULT_CLASSNAME}_test_content`} onClick={() => setIsEditMode(true)}>
            <FormGroup>
              {indexOptionsToUse.map((option, index) => (
                <Box
                  width={'100%'}
                  key={index}
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mt={1}>
                  <FormControlLabel
                    disabled={formItemDisabled}
                    label={''}
                    control={
                      <TextField
                        disabled={formItemDisabled}
                        placeholder={'Введите значение'}
                        style={{ color: '#6750a4' }}
                        value={option.correctIndex}
                        onChange={(e) =>
                          handleIndexOptionChange(index, 'correctIndex', e.target.value)
                        }
                      />
                    }
                  />
                  <TextareaAutosize
                    disabled={formItemDisabled}
                    placeholder={'Введите вариант ответа'}
                    value={option.text}
                    onChange={(e) => handleIndexOptionChange(index, 'text', e.target.value)}
                  />

                  <Button
                    disabled={formItemDisabled}
                    onClick={() => handleIndexRemoveOption(index)}>
                    <RemoveIcon />
                  </Button>
                </Box>
              ))}
            </FormGroup>
            {!formItemDisabled && (
              <Button
                className={`${DEFAULT_CLASSNAME}_test_content_add`}
                onClick={handleIndexAddOption}>
                + Добавить вариант
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const getTaskFormat = () => {
    if (props.isCreateMode && props.newTaskFormat) {
      const format = props.newTaskFormat;

      if (format.includes(TEST_FORMAT)) return testTask;

      if (format.includes(TEST_FORMAT_WITH_INDEX)) return testTaskIndex;

      if (format.includes(COMPARE_TEST_FORMAT)) return testTask;

      return defaultTask;
    }

    if (!props.isCreateMode && props.format) {
      if (props.format.includes(TEST_FORMAT)) return testTask;

      if (props.format.includes(TEST_FORMAT_WITH_INDEX)) return testTaskIndex;

      if (props.format.includes(COMPARE_TEST_FORMAT)) return testTask;

      return defaultTask;
    }
  };

  return (
    <ClickAwayListener onClickAway={() => handleSaveEdits(isEditMode)}>
      <div
        className={`${DEFAULT_CLASSNAME} ${
          (props.editModeDisabled || props.disabled) && 'card-disabled'
        }`}>
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
          {getTaskFormat()}
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
                <div className={`${DEFAULT_CLASSNAME}_attachments`}>
                  <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
                    <input {...getInputProps()} />
                    <Typography size={'small'} className={`${DEFAULT_CLASSNAME}_attachments_text`}>
                      <TextSnippetIcon /> Перетащите файлы сюда или кликните, чтобы выбрать файлы
                    </Typography>
                  </div>
                </div>
              )}

            {!props.editModeDisabled &&
              !props.isCreateMode &&
              isEditMode &&
              props.files.length !== MAX_FILES && (
                <>
                  <div className={`${DEFAULT_CLASSNAME}_attachments`}>
                    <div
                      {...getRootPropsEdit()}
                      className={`dropzone ${isDragActiveEdit ? 'active' : ''}`}>
                      <input {...getInputPropsEdit()} />
                      <Typography
                        size={'small'}
                        className={`${DEFAULT_CLASSNAME}_attachments_text`}>
                        <TextSnippetIcon /> Перетащите файлы сюда или кликните, чтобы выбрать файлы
                      </Typography>
                    </div>
                  </div>
                </>
              )}
          </div>
          {props.isCreateMode && !props.hideAssets && !!props.newTaskAssets?.length ? (
            <div className={`${DEFAULT_CLASSNAME}_assets`}>
              {props.isCreateMode &&
                props.newTaskAssets &&
                props.newTaskAssets.map((item, index) => {
                  return (
                    <div className={`${DEFAULT_CLASSNAME}_assets_item`}>
                      {item.type.includes('image') && (
                        <img alt={`${index}_asset`} src={URL.createObjectURL(item)} />
                      )}
                      {item.type.includes('doc') && (
                        <div className={`${DEFAULT_CLASSNAME}_assets_item_icon`}>
                          <TextSnippetIcon />
                        </div>
                      )}
                      {item.type.includes('pdf') && (
                        <div className={`${DEFAULT_CLASSNAME}_assets_item_icon`}>
                          <PictureAsPdfIcon />
                        </div>
                      )}
                      {item.type.includes('mp4') && (
                        <div className={`${DEFAULT_CLASSNAME}_assets_item_icon`}>
                          <VideoLibrary />
                        </div>
                      )}
                      {item.type.includes('mp3') && (
                        <div className={`${DEFAULT_CLASSNAME}_assets_item_icon`}>
                          <LibraryMusic />
                        </div>
                      )}
                      <div className={`${DEFAULT_CLASSNAME}_assets_item_footer`}>
                        <Typography size={'small'}>
                          {item.name.length > 18
                            ? `${item.name.slice(0, 12)}...${item.name.slice(-4)}`
                            : item.name}
                        </Typography>{' '}
                        <div
                          className={`${DEFAULT_CLASSNAME}_assets_item_delete`}
                          onClick={() => handleAssetDelete(index)}>
                          <TrashIcon />
                        </div>
                      </div>
                    </div>
                  );
                })}
              {props.newTaskAssetsError && (
                <Typography color={'red'} size={'small'}>
                  {props.newTaskAssetsError}
                </Typography>
              )}
            </div>
          ) : (
            <div />
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
                {editAssetsError && (
                  <Typography color={'red'} size={'small'}>
                    {editAssetsError}
                  </Typography>
                )}
                {restFiles.map((item) => {
                  return (
                    <div
                      className={`${DEFAULT_CLASSNAME}_assets_item`}
                      onClick={() => setIsEditMode(true)}>
                      {item.file_name.includes('doc') && (
                        <div className={`${DEFAULT_CLASSNAME}_assets_item_icon`}>
                          <TextSnippetIcon />
                        </div>
                      )}
                      {item.file_name.includes('pdf') && (
                        <div className={`${DEFAULT_CLASSNAME}_assets_item_icon`}>
                          <PictureAsPdfIcon />
                        </div>
                      )}
                      {item.file_name.includes('mp4') && (
                        <div className={`${DEFAULT_CLASSNAME}_assets_item_icon`}>
                          <VideoLibrary />
                        </div>
                      )}
                      {item.file_name.includes('mp3') && (
                        <div className={`${DEFAULT_CLASSNAME}_assets_item_icon`}>
                          <LibraryMusic />
                        </div>
                      )}
                      <div className={`${DEFAULT_CLASSNAME}_assets_item_footer`}>
                        <Typography size={'small'}>
                          {item.file_name.length > 18
                            ? `${item.file_name.slice(0, 12)}...${item.file_name.slice(-4)}`
                            : item.file_name}
                        </Typography>
                        {isEditMode && (
                          <div
                            className={`${DEFAULT_CLASSNAME}_loaded_assets_item_delete`}
                            onClick={(event) => {
                              event.stopPropagation();
                              deleteFileMutation.mutate({
                                taskId: props.taskId!,
                                fileURL: item.url,
                              });
                            }}>
                            <TrashIcon />
                          </div>
                        )}
                      </div>
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
                props.setIsNewTask(false);
              }}>
              {props.isNewTaskSaving ? (
                <CircularProgress sx={{ color: '#c8caff' }} />
              ) : (
                <CheckIcon />
              )}
            </div>
          </Tooltip>
        )}
      </div>
    </ClickAwayListener>
  );
};
