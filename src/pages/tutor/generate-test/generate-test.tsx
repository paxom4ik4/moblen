import { FC, useEffect, useState, memo } from 'react';

import './generate-test.scss';

import CheckIcon from 'assets/icons/check-icon.svg';
import AddIcon from 'assets/icons/add-icon.svg';
import EditButton from './drive_file_rename_outline.svg';

import { TaskCard } from 'components/task-card/task-card.tsx';
import { Typography } from 'common/typography/typography.tsx';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store/store.ts';
import { clearCreateTask } from 'store/create-task/create-task.slice.ts';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { createTask, generateTask, getAllFormats, getTasks } from 'services/tasks';
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
} from '@mui/material';

const DEFAULT_CLASSNAME = 'app-generate-test';

const GenerateTest: FC = memo(() => {
  const queryClient = useQueryClient();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { id: paramsTaskListId } = useParams();
  const isEditModeDisabled = location.href.includes('editable=false');

  const { data: taskFormats } = useQuery('formats', () => getAllFormats());

  const { taskListId, taskListName, courseName, topicName } = useSelector(
    (store: RootState) => store.generateTask,
  );

  const { data: tasksData, isLoading } = useQuery(
    'tasks',
    () => getTasks(taskListId || paramsTaskListId!),
    {
      refetchInterval: 5000,
    },
  );

  const [maxScore, setMaxScore] = useState(0);

  useEffect(() => {
    if (tasksData) {
      setMaxScore(
        tasksData?.reduce((score: number, task: Task) => score + Number(task.max_ball), 0),
      );
    }
  }, [tasksData]);

  const [isNewTask, setIsNewTask] = useState(false);

  const addNewTaskHandler = () => {
    if (isNewTask) {
      saveNewTaskHandler();
    } else {
      setIsNewTask(true);
    }
  };

  const saveTestHandler = () => {
    dispatch(clearCreateTask());
    navigate(TutorRoutes.ASSIGNMENTS);
  };

  // Creating new task

  const [newTaskText, setNewTaskText] = useState<string>('');
  const [newTaskCriteria, setNewTaskCriteria] = useState<string>('');
  const [newTaskFormat, setNewTaskFormat] = useState<string>('');
  const [newTaskMaxScore, setNewTaskMaxScore] = useState<number | null>(null);

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

  const saveNewTaskHandler = () => {
    if (newTaskText.length && newTaskCriteria.length && newTaskMaxScore && newTaskMaxScore !== 0) {
      createTaskMutation.mutate({
        list_uuid: taskListId!,
        format: newTaskFormat,
        criteria: newTaskCriteria,
        max_ball: +newTaskMaxScore,
        task_condition: newTaskText,
      });

      setNewTaskText('');
      setNewTaskCriteria('');
      setNewTaskMaxScore(null);
      setNewTaskFormat('');
    }
  };

  const handleGenerateFormatChange = (event: SelectChangeEvent) => {
    setGenerateTaskFormat(event.target.value as string);
  };

  const [generateText, setGenerateText] = useState('');
  const [generateTaskFormat, setGenerateTaskFormat] = useState('');
  const [generateBallPerTask, setGenerateBallPerTask] = useState(0);
  const [generateTaskAmount, setGenerateTaskAmount] = useState(0);

  const generateTaskMutation = useMutation(
    (data: GenerateTaskPayload) => generateTask(taskListId ?? paramsTaskListId!, data),
    {
      onSuccess: () => {
        setGenerateTaskFormat('');
        setGenerateBallPerTask(0);
        setGenerateTaskAmount(0);
      },
    },
  );

  const handleTaskGeneration = async () => {
    const format = generateTaskFormat.split(',');

    await generateTaskMutation.mutate({
      text: generateText,
      subject: format[0],
      task_format: format[1],
      max_score: generateBallPerTask,
      task_count: generateTaskAmount,
    });
  };

  return (
    <div className={DEFAULT_CLASSNAME}>
      <div className={`${DEFAULT_CLASSNAME}_text-container`}>
        <div className={`${DEFAULT_CLASSNAME}_text-container_name-text`}>
          <div className={`${DEFAULT_CLASSNAME}_text-container_name-title`}>
            <Typography color={'purple'} weight={'bold'}>
              {courseName} - {topicName}
            </Typography>
          </div>
          <div className={`${DEFAULT_CLASSNAME}_text-container_name-work`}>
            <Typography size={'large'} weight={'bold'}>
              {taskListName}
            </Typography>
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
            minRows={3}
            className={`${DEFAULT_CLASSNAME}_generate_container_text_area`}
            value={generateText}
            onChange={(e) => setGenerateText(e.currentTarget.value)}></TextareaAutosize>
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
                <Typography>Количество заданий</Typography>
                <TextField
                  placeholder={'Введите значение'}
                  value={generateTaskAmount}
                  onChange={(e) => setGenerateTaskAmount(+e.currentTarget.value)}
                />
              </div>
              <div
                className={`${DEFAULT_CLASSNAME}_tasks-container_generate-configuration_fields_item`}>
                <Typography>Балл за задание</Typography>
                <TextField
                  placeholder={'Введите значение'}
                  value={generateBallPerTask}
                  onChange={(e) => setGenerateBallPerTask(+e.currentTarget.value)}
                />
              </div>
              <div
                className={`${DEFAULT_CLASSNAME}_tasks-container_generate-configuration_fields_item`}>
                <Typography>Формат задания</Typography>
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
            <button
              onClick={handleTaskGeneration}
              className={`${DEFAULT_CLASSNAME}_tasks-container_generate-configuration_edit`}>
              <Typography color={'purple'}>Сгенерировать</Typography>
              <EditButton />
            </button>
          </div>

          {!!tasksData?.length &&
            tasksData?.map((task: Task, index: number) => (
              <TaskCard
                taskFormats={taskFormats}
                isCreateMode={false}
                key={task.task_uuid}
                taskId={task.task_uuid}
                taskListId={taskListId!}
                text={task.task_condition}
                criteria={task.criteria}
                maxScore={task.max_ball}
                format={task.format}
                index={index + 1}
                editModeDisabled={isEditModeDisabled}
              />
            ))}

          {isNewTask && (
            <TaskCard
              isCreateMode={true}
              taskFormats={taskFormats}
              taskListId={taskListId!}
              taskId={''}
              editModeDisabled={false}
              taskAssets={[]}
              newTaskMaxScore={newTaskMaxScore}
              newTaskFormat={newTaskFormat}
              newTaskCriteria={newTaskCriteria}
              newTaskText={newTaskText}
              handleFormatChange={handleFormatChange}
              setNewTaskMaxScore={setNewTaskMaxScore}
              setNewTaskText={setNewTaskText}
              setNewTaskCriteria={setNewTaskCriteria}
              saveNewTaskHandler={saveNewTaskHandler}
              setIsNewTask={setIsNewTask}
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

export default GenerateTest;
