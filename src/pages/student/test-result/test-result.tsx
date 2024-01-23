import { ChangeEvent, FC, memo, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { CompletedTask, ConvertedCompareOption, TestIndexOption, TestOption } from 'types/task.ts';

import { Typography } from 'common/typography/typography.tsx';
import { TaskPassCard } from 'components/task-pass-card/task-pass-card.tsx';

import './test-result.scss';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store/store.ts';
import { useQuery, useQueryClient } from 'react-query';
import { getCompletedTaskList } from 'services/student/student.ts';
import { AppModes } from 'constants/appTypes.ts';
import { Pagination } from '@mui/material';
import { setSelectedStudent } from 'store/results/results.slice.ts';
import { StudentRoutes, TutorRoutes } from 'constants/routes.ts';

const DEFAULT_CLASSNAME = 'test-result';

interface ResultTask {
  attempt: 1;
  result: CompletedTask[];
}

const TestResult: FC = memo(() => {
  const queryClient = useQueryClient();

  const { id } = useParams();

  const navigate = useNavigate();

  const { user_uuid } = useSelector((state: RootState) => state.userData.userData)!;
  const { currentTaskList } = useSelector((state: RootState) => state.student)!;

  useEffect(() => {
    if (!currentTaskList) {
      navigate(isTutorMode ? TutorRoutes.GROUPS : StudentRoutes.ASSIGNMENTS);
    }
  }, [currentTaskList]);

  const { appMode } = useSelector((state: RootState) => state.appMode);
  const isTutorMode = appMode === AppModes.TT;

  const { data: tasksHistory } = useQuery(
    ['completedTasks', currentTaskList?.selectedStudent, user_uuid],
    () =>
      getCompletedTaskList({
        list_uuid: id!,
        student_uuid: isTutorMode ? currentTaskList?.selectedStudent : '',
        isTutor: isTutorMode,
      }),
  );

  useEffect(() => {
    (async () => queryClient.invalidateQueries('completedTasks'))();
  }, [user_uuid]);

  const [maxScore, setMaxScore] = useState(0);
  const [currentScore, setCurrentScore] = useState(0);

  const [currentAttempt, setCurrentAttempt] = useState(tasksHistory?.tasks?.length - 1 ?? 0);
  const [currentTask, setCurrentTask] = useState<ResultTask | null>(() =>
    tasksHistory ? tasksHistory.tasks[currentAttempt] : null,
  );

  useEffect(() => {
    if (tasksHistory) {
      setCurrentAttempt(tasksHistory.tasks.length - 1);
    }
  }, [tasksHistory]);

  useEffect(() => {
    if (tasksHistory) {
      setCurrentTask(tasksHistory.tasks[currentAttempt]);
    }
  }, [currentAttempt]);

  useEffect(() => {
    setMaxScore(
      currentTask?.result?.reduce(
        (score: number, task: CompletedTask) => score + Number(task.task.max_ball),
        0,
      ) ?? 0,
    );

    setCurrentScore(
      currentTask?.result?.reduce(
        (score: number, task: CompletedTask) => score + Number(task.score),
        0,
      ) ?? 0,
    );
  }, [currentTask]);

  const handleReplayTest = () => {
    navigate(`/assignments/${id}`);
  };

  const handleAttemptChange = (event: ChangeEvent<unknown>, value: number) => {
    event.preventDefault();

    setCurrentAttempt(value - 1);
  };

  const getTaskScorePercentage = (score?: number, maxScore?: number) => {
    if (!score || !maxScore) return;

    return (score / maxScore) * 100;
  };

  const getScoreColor = (taskScore: number = 0) => {
    if (taskScore <= 15) return 'red';
    if (taskScore > 15 && taskScore <= 30) return 'orange';
    if (taskScore > 30 && taskScore <= 50) return 'yellow';
    if (taskScore > 50 && taskScore <= 75) return 'light-green';
    if (taskScore > 75) return 'green';
  };

  const dispatch = useDispatch();

  return (
    <div className={DEFAULT_CLASSNAME}>
      <div className={DEFAULT_CLASSNAME}>
        <div className={`${DEFAULT_CLASSNAME}_title`}>
          <div
            className={`${DEFAULT_CLASSNAME}_title_back`}
            onClick={() => {
              isTutorMode &&
                currentTaskList?.selectedStudent &&
                dispatch(setSelectedStudent(currentTaskList?.selectedStudent));
              navigate(-1);
            }}>
            Закрыть
          </div>
          <div className={`${DEFAULT_CLASSNAME}_title_name`}>
            <Typography color={'purple'}>
              {tasksHistory?.course_name} - {tasksHistory?.topic_name}
            </Typography>
            <Typography size={'large'} weight={'bold'}>
              {tasksHistory?.list_name}
            </Typography>
          </div>
          {tasksHistory?.tasks?.length > 1 && (
            <div className={`${DEFAULT_CLASSNAME}_pagination`}>
              <Typography>Номер попытки</Typography>
              <Pagination
                size={'small'}
                count={tasksHistory?.tasks?.length}
                page={currentAttempt + 1}
                onChange={handleAttemptChange}
              />
            </div>
          )}
          <div className={`${DEFAULT_CLASSNAME}_title_maxScore`}>
            <Typography color={'purple'}>{'Общий балл'}</Typography>
            <Typography
              className={`${DEFAULT_CLASSNAME}_title_maxScore_text ${getScoreColor(
                getTaskScorePercentage(currentScore, maxScore)!,
              )}`}
              weight={'bold'}>
              {currentScore} / {maxScore}
            </Typography>
          </div>
          {!isTutorMode && currentTaskList?.replay && (
            <button onClick={handleReplayTest} className={`${DEFAULT_CLASSNAME}_title_replay`}>
              <Typography color={'purple'}>{'Перепройти'}</Typography>
            </button>
          )}
        </div>
        <div className={`${DEFAULT_CLASSNAME}_tasks`}>
          {currentTask?.result?.map((task: CompletedTask, index: number) => (
            <div className={`${DEFAULT_CLASSNAME}_tasks_item`} key={task.task.task_uuid}>
              <div className={`${DEFAULT_CLASSNAME}_tasks_item_task`}>
                <TaskPassCard
                  id={task.task.task_uuid}
                  answer={task.answer}
                  mode={'view'}
                  text={task.task.task_condition}
                  criteria={task.task.criteria}
                  maxScore={task.task.max_ball}
                  currentScore={task.score}
                  format={task.task.format}
                  index={index}
                  showCriteria={currentTaskList?.seeCriteria || isTutorMode}
                  showAnswers={currentTaskList?.seeAnswers || isTutorMode}
                  files={task.task?.files ?? []}
                  compareOptions={task.task.variants as ConvertedCompareOption[]}
                  unorderedTestOptions={task.task.variants as TestOption[]}
                  orderedTestOptions={task.task.variants as TestIndexOption[]}
                />
              </div>
              {!!task.response.length && (
                <div className={`${DEFAULT_CLASSNAME}_tasks_item_analytics`}>
                  <Typography>Аналитика - Задание {index + 1}</Typography>
                  <Typography>{task.response}</Typography>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

export default TestResult;
