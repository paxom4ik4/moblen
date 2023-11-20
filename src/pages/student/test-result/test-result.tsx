import { ChangeEvent, FC, memo, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { CompletedTask } from 'types/task.ts';

import { Typography } from 'common/typography/typography.tsx';
import { TaskPassCard } from 'components/task-pass-card/task-pass-card.tsx';

import './test-result.scss';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store/store.ts';
import { useQuery } from 'react-query';
import { getCompletedTaskList } from 'services/student/student.ts';
import { AppModes } from '../../../constants/appTypes.ts';
import { Pagination } from '@mui/material';
import { setSelectedStudent } from '../../../store/results/results.slice.ts';

const DEFAULT_CLASSNAME = 'test-result';

interface ResultTask {
  attempt: 1;
  result: CompletedTask[];
}

const TestResult: FC = memo(() => {
  const { id } = useParams();

  const navigate = useNavigate();

  const { uuid } = useSelector((state: RootState) => state.userData.userData)!;
  const { currentTaskList, activeTopic, activeCourse } = useSelector(
    (state: RootState) => state.student,
  )!;

  const {
    name,
    id: taskListId,
    selectedStudent,
    replay,
    seeCriteria,
    seeAnswers,
  } = currentTaskList!;

  const { data: tasksHistory } = useQuery(['completedTasks', selectedStudent, uuid], () =>
    getCompletedTaskList({
      list_uuid: taskListId ?? id,
      student_uuid: selectedStudent?.length ? selectedStudent : uuid,
    }),
  );

  const [maxScore, setMaxScore] = useState(0);
  const [currentScore, setCurrentScore] = useState(0);

  const [currentAttempt, setCurrentAttempt] = useState(tasksHistory?.length - 1 ?? 0);
  const [currentTask, setCurrentTask] = useState<ResultTask | null>(() =>
    tasksHistory ? tasksHistory[currentAttempt] : null,
  );

  useEffect(() => {
    if (tasksHistory) {
      setCurrentAttempt(tasksHistory.length - 1);
    }
  }, [tasksHistory]);

  useEffect(() => {
    if (tasksHistory) {
      setCurrentTask(tasksHistory[currentAttempt]);
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

  const { appMode } = useSelector((state: RootState) => state.appMode);

  const isTutorMode = appMode === AppModes.tutor;

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

  const getScoreColor = (taskScore: number) => {
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
              isTutorMode && selectedStudent && dispatch(setSelectedStudent(selectedStudent));
              navigate(-1);
            }}>
            Закрыть
          </div>
          <div className={`${DEFAULT_CLASSNAME}_title_name`}>
            <Typography color={'purple'}>
              {activeCourse?.name} - {activeTopic?.name}
            </Typography>
            <Typography size={'large'} weight={'bold'}>
              {name}
            </Typography>
          </div>
          {tasksHistory?.length > 1 && (
            <div className={`${DEFAULT_CLASSNAME}_pagination`}>
              <Typography>Номер попытки</Typography>
              <Pagination
                size={'small'}
                count={tasksHistory?.length}
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
          {!isTutorMode && replay && (
            <button onClick={handleReplayTest} className={`${DEFAULT_CLASSNAME}_title_replay`}>
              <Typography color={'purple'}>{'Перепройти'}</Typography>
            </button>
          )}
        </div>
        <div className={`${DEFAULT_CLASSNAME}_tasks`}>
          {currentTask?.result?.map((task: CompletedTask, index: number) => (
            <div className={`${DEFAULT_CLASSNAME}_tasks_item`}>
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
                  showCriteria={seeCriteria || isTutorMode}
                  showAnswers={seeAnswers || isTutorMode}
                />
              </div>
              <div className={`${DEFAULT_CLASSNAME}_tasks_item_analytics`}>
                <Typography>Аналитика - Задание {index + 1}</Typography>
                <Typography>{task.response}</Typography>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

export default TestResult;
