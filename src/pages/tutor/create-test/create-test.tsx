import { FC, useEffect, useState, memo } from 'react';

import './create-test.scss';

import CheckIcon from 'assets/icons/check-icon.svg';
import AddIcon from 'assets/icons/add-icon.svg';

import { TaskCard } from 'components/task-card/task-card.tsx';
import { Typography } from 'common/typography/typography.tsx';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearCreateTask } from 'store/create-task/create-task.slice.ts';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import {
  createTask,
  editTaskList,
  generateTask,
  getAllFormats,
  getTasks,
  TaskCreatePayload,
} from 'services/tasks';
import { TutorRoutes } from 'constants/routes.ts';
import { GenerateTaskPayload, Task, TestIndexOption, TestOption } from 'types/task.ts';
import { CircularProgress, SelectChangeEvent, TextareaAutosize } from '@mui/material';
import { ClickAwayListener } from '@mui/base/ClickAwayListener';
import { TEST_FORMAT, TEST_FORMAT_WITH_INDEX } from 'constants/testTaskFormats.ts';
import { Notification } from 'common/notification/notification.tsx';
import { GenerateConfiguration } from './components/generate-configuration/generate-configuration.tsx';

const DEFAULT_CLASSNAME = 'app-create-test';

const CreateTest: FC<{ isGenerateMode?: boolean }> = memo(({ isGenerateMode = false }) => {
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
      refetchInterval: isGeneratingInProgress && 5000,
    },
  );

  const [taskCount, setTaskCount] = useState(tasksData?.tasks?.length ?? 0);
  useEffect(() => setIsGeneratingInProgress(false), [taskCount]);

  const [maxScore, setMaxScore] = useState(0);

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

  const addNewTaskHandler = async () => {
    if (isNewTask) {
      await saveNewTaskHandler();
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

  const clearNewTaskState = () => {
    setNewTaskText('');
    setNewTaskCriteria('');
    setNewTaskMaxScore(null);
    setNewTaskFormat('');
    setNewTaskAssets([]);
    setIsNewTaskSaving(false);
  };

  // Unordered test options
  const [options, setOptions] = useState<TestOption[]>([{ text: '', isCorrect: false }]);

  // Ordered test options
  const [indexOptions, setIndexOptions] = useState<TestIndexOption[]>([
    {
      text: '',
      correctIndex: '',
    },
  ]);

  const handleFormatChange = (event: SelectChangeEvent) => {
    setNewTaskFormat(event.target.value as string);
  };

  const createTaskMutation = useMutation(
    (
      data:
        | {
            payload: TaskCreatePayload;
            isFormData: boolean;
          }
        | { payload: FormData; isFormData: boolean },
    ) => createTask(tasksData.list_uuid!, data.payload, data.isFormData),
    {
      onSuccess: async () => {
        clearNewTaskState();
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

      data.append('max_ball', newTaskMaxScore?.toString() ?? '0');
      data.append('task_condition', newTaskText.length ? newTaskText : '-');

      if (!newTaskFormat.includes(TEST_FORMAT) && !newTaskFormat.includes(TEST_FORMAT_WITH_INDEX)) {
        data.append('criteria', newTaskCriteria.length ? newTaskCriteria : '-');
      }

      if (newTaskFormat.includes(TEST_FORMAT)) {
        data.append('variants', JSON.stringify(options));
      }

      if (newTaskFormat.includes(TEST_FORMAT_WITH_INDEX)) {
        data.append('variants', JSON.stringify(indexOptions));
      }

      Array.from(newTaskAssets).forEach((item) => {
        data.append('files', item);
      });

      await createTaskMutation.mutate({ payload: data, isFormData: true });
    } else {
      const data: TaskCreatePayload = {
        format: newTaskFormat.length
          ? newTaskFormat
          : `${taskFormats[0].subject},${taskFormats[0].formats[0]}`,
        max_ball: newTaskMaxScore?.toString() ?? '0',
        task_condition: newTaskText.length ? newTaskText : '-',
      };

      if (!newTaskFormat.includes(TEST_FORMAT) && !newTaskFormat.includes(TEST_FORMAT_WITH_INDEX)) {
        data['criteria'] = newTaskCriteria.length ? newTaskCriteria : '-';
      }

      if (newTaskFormat.includes(TEST_FORMAT)) {
        data['variants'] = options;
      }

      if (newTaskFormat.includes(TEST_FORMAT_WITH_INDEX)) {
        data['variants'] = options;
      }

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

  const clearGenerateTaskState = () => {
    setGenerateTaskFormat('');
    setGenerateBallPerTask(0);
    setGenerateTaskAmount(0);
    setGenerateStarted(true);
  };

  const [generateStarted, setGenerateStarted] = useState(false);

  const generateTaskMutation = useMutation(
    (data: GenerateTaskPayload) => generateTask(tasksData.list_uuid, data),
    { onSuccess: () => clearGenerateTaskState() },
  );

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

  const handleSaveTaskListName = async () => {
    await editTaskListMutation.mutate({
      id: tasksData.list_uuid,
      name: editTaskListName!,
    });

    setIsNameEdit(false);
  };

  // UI SPLIT

  const createTestHeaderTitle = (
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
              setEditTaskListName(tasksData?.list_name ?? '');
              setIsNameEdit(true);
            }}>
            {tasksData?.list_name}
          </Typography>
        )}
      </div>
    </div>
  );

  const createTestHeaderActions = (
    <div className={`${DEFAULT_CLASSNAME}_text-container ${isGenerateMode && 'generationMargin'}`}>
      {maxScore !== 0 && (
        <div className={`${DEFAULT_CLASSNAME}_text-container_ball`}>
          <Typography color={'purple'}>Сумма баллов</Typography>
          <div className={`${DEFAULT_CLASSNAME}_tasks-container_title_maxScore`}>{maxScore}</div>
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
  );

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
        {createTestHeaderTitle}
        {createTestHeaderActions}
      </div>

      <div
        className={`${DEFAULT_CLASSNAME}_tasks-container ${
          isGenerateMode && 'tasks-container-generation'
        }`}>
        {isGenerateMode && (
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
        )}

        <div className={`${DEFAULT_CLASSNAME}_tasks-container`}>
          {isLoading && <CircularProgress sx={{ color: '#c8caff' }} />}

          {isGenerateMode && (
            <GenerateConfiguration
              setGenerateTaskAmount={setGenerateTaskAmount}
              taskFormats={taskFormats}
              generateBallPerTask={generateBallPerTask}
              generateTaskAmount={generateTaskAmount}
              generateTaskFormat={generateTaskFormat}
              generateText={generateText}
              handleGenerateFormatChange={handleGenerateFormatChange}
              handleTaskGeneration={handleTaskGeneration}
              isEditModeDisabled={isEditModeDisabled}
              setGenerateBallPerTask={setGenerateBallPerTask}
            />
          )}

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
                files={task?.files ?? []}
                editModeDisabled={isEditModeDisabled}
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
              // Test options
              options={options}
              setOptions={setOptions}
              indexOptions={indexOptions}
              setIndexOptions={setIndexOptions}
            />
          )}
          {!isEditModeDisabled && (
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

export default CreateTest;
