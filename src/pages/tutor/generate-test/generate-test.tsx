import { FC, useEffect, useState, memo } from 'react';

import './generate-test.scss';

import CheckIcon from 'assets/icons/check-icon.svg';
import AddIcon from 'assets/icons/add-icon.svg';
import EditButton from './drive_file_rename_outline.svg';

import { TaskCard } from 'components/task-card/task-card.tsx';
import { Typography } from 'common/typography/typography.tsx';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearCreateTask } from 'store/create-task/create-task.slice.ts';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { createTask, editTaskList, generateTask, getAllFormats, getTasks } from 'services/tasks';
import { TutorRoutes } from 'constants/routes.ts';
import { GenerateTaskPayload, Task } from 'types/task.ts';
import {
  CircularProgress,
  ListSubheader,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextareaAutosize,
  TextField,
  Tooltip,
} from '@mui/material';
import { ClickAwayListener } from '@mui/base/ClickAwayListener';
import { Notification } from '../../../common/notification/notification.tsx';

const DEFAULT_CLASSNAME = 'app-generate-test';

const GenerateTest: FC = memo(() => {
  const queryClient = useQueryClient();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { id: paramsTaskListId } = useParams();
  const isEditModeDisabled = location.href.includes('editable=false');

  const { data: taskFormats } = useQuery('formats', () => getAllFormats());

  const [isGeneratingInProgress, setIsGeneratingInProgress] = useState(false);

  const { data: tasksData, isLoading } = useQuery(
    ['tasks', paramsTaskListId],
    () => getTasks(paramsTaskListId!),
    {
      refetchInterval: isGeneratingInProgress ? 3000 : false,
    },
  );

  const [maxScore, setMaxScore] = useState(0);
  const [taskCount, setTaskCount] = useState(tasksData?.tasks?.length ?? 0);

  useEffect(() => {
    if (tasksData) {
      setMaxScore(
        tasksData?.tasks?.reduce((score: number, task: Task) => score + Number(task.max_ball), 0),
      );

      setTaskCount(tasksData?.tasks?.length);
    }
  }, [tasksData]);

  const [isNewTask, setIsNewTask] = useState(false);
  const [isNewTaskSaving, setIsNewTaskSaving] = useState(false);

  const addNewTaskHandler = () => {
    if (isNewTask) {
      saveNewTaskHandler();
    } else {
      setIsNewTask(true);
    }
  };

  const saveTestHandler = async () => {
    if (isNewTask) {
      await saveNewTaskHandler();
    }

    dispatch(clearCreateTask());
    navigate(TutorRoutes.ASSIGNMENTS);
  };

  // Creating new task
  const [newTaskText, setNewTaskText] = useState<string>('');
  const [newTaskCriteria, setNewTaskCriteria] = useState<string>('');
  const [newTaskFormat, setNewTaskFormat] = useState<string>('');
  const [newTaskMaxScore, setNewTaskMaxScore] = useState<number | null>(null);
  const [newTaskAssets, setNewTaskAssets] = useState<File[]>([]);
  const [newTaskAssetsTotalSize, setNewTaskAssetsTotalSize] = useState(0);
  const [newTaskAssetsError, setNewTaskAssetsError] = useState<null | string>(null);

  const handleFormatChange = (event: SelectChangeEvent) => {
    setNewTaskFormat(event.target.value as string);
  };

  const renderFormatGroup = (group: { subject: string; formats: string[] }) => {
    const items = group.formats.map((format) => (
      <MenuItem key={format} value={`${group.subject},${format}`}>
        {format}
      </MenuItem>
    ));
    return [<ListSubheader>{group.subject}</ListSubheader>, items];
  };

  const createTaskMutation = useMutation(
    (
      data:
        | {
            payload: {
              task_condition: string;
              criteria: string;
              format: string;
              max_ball: string;
            };
            isFormData: boolean;
          }
        | { payload: FormData; isFormData: boolean },
    ) => createTask(tasksData.list_uuid!, data.payload, data.isFormData),
    {
      onSuccess: async () => {
        setNewTaskText('');
        setNewTaskCriteria('');
        setNewTaskMaxScore(null);
        setNewTaskFormat('');
        setNewTaskAssets([]);
        setIsNewTaskSaving(false);

        await queryClient.invalidateQueries('tasks');
      },
    },
  );

  const saveNewTaskHandler = async () => {
    if (newTaskAssets) {
      const data = new FormData();

      data.append(
        'format',
        newTaskFormat.length
          ? newTaskFormat
          : `${taskFormats[0].subject},${taskFormats[0].formats[0]}`,
      );
      data.append('criteria', newTaskCriteria.length ? newTaskCriteria : '-');
      data.append('max_ball', newTaskMaxScore?.toString() ?? '0');
      data.append('task_condition', newTaskText.length ? newTaskText : '-');

      Array.from(newTaskAssets).forEach((item) => {
        data.append('files', item);
      });

      await createTaskMutation.mutate({ payload: data, isFormData: true });
    } else {
      const data = {
        format: newTaskFormat.length
          ? newTaskFormat
          : `${taskFormats[0].subject},${taskFormats[0].formats[0]}`,
        criteria: newTaskCriteria.length ? newTaskCriteria : '-',
        max_ball: newTaskMaxScore?.toString() ?? '0',
        task_condition: newTaskText.length ? newTaskText : '-',
      };

      await createTaskMutation.mutate({ payload: data, isFormData: false });
    }

    setIsNewTaskSaving(true);
  };

  const handleGenerateFormatChange = (event: SelectChangeEvent) => {
    setGenerateTaskFormat(event.target.value as string);
  };

  const [generateText, setGenerateText] = useState('');
  const [generateTaskFormat, setGenerateTaskFormat] = useState('');
  const [generateBallPerTask, setGenerateBallPerTask] = useState(0);
  const [generateTaskAmount, setGenerateTaskAmount] = useState(0);

  const [generateStarted, setGenerateStarted] = useState(false);

  const generateTaskMutation = useMutation(
    (data: GenerateTaskPayload) => generateTask(tasksData.list_uuid, data),
    {
      onSuccess: () => {
        setGenerateTaskFormat('');
        setGenerateBallPerTask(0);
        setGenerateTaskAmount(0);
        setGenerateStarted(true);
      },
    },
  );

  useEffect(() => setIsGeneratingInProgress(false), [taskCount]);

  const handleTaskGeneration = async () => {
    const format = generateTaskFormat.split(',');

    setIsGeneratingInProgress(true);

    await generateTaskMutation.mutate({
      text: generateText,
      subject: format[0],
      task_format: format[1],
      max_score: generateBallPerTask,
      task_count: generateTaskAmount,
    });
  };

  const [isNameEdit, setIsNameEdit] = useState(false);
  const [editTaskListName, setEditTaskListName] = useState('');

  const editTaskListMutation = useMutation(
    (data: { id: string; name: string }) => editTaskList(data),
    {
      onSuccess: () => queryClient.invalidateQueries('tasks'),
    },
  );

  const handleSaveTaskListName = () => {
    editTaskListMutation.mutate({
      id: tasksData.list_uuid,
      name: editTaskListName!,
    });

    setIsNameEdit(false);
  };

  return (
    <div className={DEFAULT_CLASSNAME}>
      {generateStarted && (
        <Notification
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          autoHideDuration={5000}
          message={'Началась генерация заданий (может занимать до 3х минут)'}
          open={generateStarted}
          onClose={() => setGenerateStarted(false)}
        />
      )}
      <div className={`${DEFAULT_CLASSNAME}_text-container`}>
        <div className={`${DEFAULT_CLASSNAME}_text-container_name-text`}>
          <div className={`${DEFAULT_CLASSNAME}_text-container_name-title`}>
            <Typography color={'purple'} weight={'bold'}>
              {tasksData?.course_name} - {tasksData?.topic_name}
            </Typography>
          </div>
          <div className={`${DEFAULT_CLASSNAME}_text-container_name-work`}>
            {isNameEdit ? (
              <ClickAwayListener onClickAway={handleSaveTaskListName}>
                <input
                  maxLength={24}
                  value={editTaskListName}
                  onChange={(e) => setEditTaskListName(e.currentTarget.value)}
                />
              </ClickAwayListener>
            ) : (
              <Typography
                size={'large'}
                weight={'bold'}
                onClick={() => {
                  setIsNameEdit(true);
                  setEditTaskListName(tasksData?.list_name ?? '');
                }}>
                {tasksData?.list_name}
              </Typography>
            )}
          </div>
        </div>
        <div className={`${DEFAULT_CLASSNAME}_text-container_generationMargin`}>
          {maxScore !== 0 && (
            <div className={`${DEFAULT_CLASSNAME}_text-container_ball`}>
              <Typography color={'purple'}>Сумма баллов</Typography>
              <div className={`${DEFAULT_CLASSNAME}_tasks-container_title_maxScore`}>
                {maxScore}
              </div>
            </div>
          )}
          <button
            className={`${DEFAULT_CLASSNAME}_tasks-container_title_save`}
            onClick={saveTestHandler}>
            <div className={`${DEFAULT_CLASSNAME}_tasks-container_title_save_icon`}>
              <CheckIcon />
            </div>
            <Typography color={'purple'}>Завершить создание</Typography>
          </button>
        </div>
      </div>
      <div className={`${DEFAULT_CLASSNAME}_generate_container`}>
        <div className={`${DEFAULT_CLASSNAME}_generate_container_text`}>
          <Typography className={`${DEFAULT_CLASSNAME}_generate_container_text-title`}>
            Текст для генерации
          </Typography>
          <TextareaAutosize
            placeholder={'Максимальная длина текста - 5000 символов'}
            minRows={3}
            className={`${DEFAULT_CLASSNAME}_generate_container_text_area`}
            value={generateText}
            onChange={(e) => setGenerateText(e.currentTarget.value)}></TextareaAutosize>
          <Typography
            className={`${DEFAULT_CLASSNAME}_generate_container_text_info`}
            color={generateText.length > 5000 ? 'red' : 'default'}>
            {generateText.length} / 5000
          </Typography>
        </div>

        <div className={`${DEFAULT_CLASSNAME}_tasks-container`}>
          {isLoading && <CircularProgress sx={{ color: '#c8caff' }} />}

          <div
            className={`${DEFAULT_CLASSNAME}_tasks-container_generate-configuration ${
              isEditModeDisabled && 'generate-disabled'
            }`}>
            <Typography
              className={`${DEFAULT_CLASSNAME}_tasks-container_generate-configuration_title`}
              size={'large'}>
              Генерация
            </Typography>

            <div className={`${DEFAULT_CLASSNAME}_tasks-container_generate-configuration_fields`}>
              <div
                className={`${DEFAULT_CLASSNAME}_tasks-container_generate-configuration_fields_item`}>
                <Typography size={'small'}>Количество заданий</Typography>
                <TextField
                  placeholder={'Введите значение'}
                  value={generateTaskAmount}
                  onChange={(e) => setGenerateTaskAmount(+e.currentTarget.value)}
                />
              </div>
              <div
                className={`${DEFAULT_CLASSNAME}_tasks-container_generate-configuration_fields_item`}>
                <Typography size={'small'}>Балл за задание</Typography>
                <TextField
                  placeholder={'Введите значение'}
                  value={generateBallPerTask}
                  onChange={(e) => setGenerateBallPerTask(+e.currentTarget.value)}
                />
              </div>
              <div
                className={`${DEFAULT_CLASSNAME}_tasks-container_generate-configuration_fields_item min-width`}>
                <Typography size={'small'}>Формат задания</Typography>
                <Select
                  placeholder={'Формат'}
                  fullWidth
                  value={generateTaskFormat || ''}
                  onChange={handleGenerateFormatChange}
                  defaultValue=""
                  MenuProps={{ PaperProps: { sx: { maxHeight: 320 } } }}>
                  {taskFormats?.map((taskFormat: { subject: string; formats: string[] }) =>
                    renderFormatGroup(taskFormat),
                  )}
                </Select>
              </div>
            </div>
            <Tooltip title={generateText.length > 5000 && 'Текст генерации слишком большой!'}>
              <button
                disabled={
                  !generateText.length ||
                  generateText.length > 5000 ||
                  generateTaskAmount === 0 ||
                  generateBallPerTask === 0 ||
                  generateTaskFormat === ''
                }
                onClick={handleTaskGeneration}
                className={`${DEFAULT_CLASSNAME}_tasks-container_generate-configuration_edit`}>
                <Typography size={'small'} color={'purple'}>
                  Сгенерировать
                </Typography>

                <EditButton />
              </button>
            </Tooltip>
          </div>

          {isGeneratingInProgress && (
            <div className={`${DEFAULT_CLASSNAME}_in_progress`}>
              <CircularProgress size={24} sx={{ color: '#c8caff' }} />

              <Typography color={'purple'}>Генерация заданий</Typography>
            </div>
          )}

          {!!tasksData?.tasks?.length &&
            tasksData?.tasks?.map((task: Task, index: number) => (
              <TaskCard
                taskFormats={taskFormats}
                isCreateMode={false}
                key={task.task_uuid}
                taskId={task.task_uuid}
                taskListId={tasksData.list_uuid}
                text={task.task_condition}
                criteria={task.criteria}
                maxScore={task.max_ball}
                format={task.format}
                index={index + 1}
                editModeDisabled={isEditModeDisabled}
                files={task?.files ?? []}
              />
            ))}

          {isNewTask && (
            <TaskCard
              disabled={isNewTaskSaving}
              isCreateMode={true}
              taskFormats={taskFormats}
              taskListId={tasksData.list_uuid}
              taskId={''}
              editModeDisabled={false}
              newTaskMaxScore={newTaskMaxScore}
              newTaskFormat={newTaskFormat}
              newTaskCriteria={newTaskCriteria}
              newTaskText={newTaskText}
              handleFormatChange={handleFormatChange}
              setNewTaskMaxScore={setNewTaskMaxScore}
              setNewTaskText={setNewTaskText}
              setNewTaskCriteria={setNewTaskCriteria}
              saveNewTaskHandler={saveNewTaskHandler}
              newTaskAssets={newTaskAssets}
              setNewTaskAssets={setNewTaskAssets}
              newTaskAssetsTotalSize={newTaskAssetsTotalSize}
              setNewTaskAssetsTotalSize={setNewTaskAssetsTotalSize}
              newTaskAssetsError={newTaskAssetsError}
              setNewTaskAssetsError={setNewTaskAssetsError}
              isNewTaskSaving={isNewTaskSaving}
              setIsNewTask={setIsNewTask}
            />
          )}
          {!isEditModeDisabled && !isGeneratingInProgress && (
            <div
              className={`${DEFAULT_CLASSNAME}_tasks-container_addItem`}
              onClick={() => addNewTaskHandler()}>
              <AddIcon />
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

export default GenerateTest;
