import {FC, useEffect, useState} from 'react';

import './create-test.scss';

import CutIcon from 'assets/icons/cut-icon.svg';
import CheckIcon from 'assets/icons/check-icon.svg'
import AddIcon from 'assets/icons/add-icon.svg';

import { TaskCard } from "components/task-card/task-card.tsx";
import { Task } from "types/task.ts";
import {Typography} from "../../common/typography/typography.tsx";
import {useNavigate} from "react-router-dom";

const DEFAULT_CLASSNAME = 'app-create-test';

interface CreateTestProps {
  tasks?: Task[];
}

export const CreateTest: FC<CreateTestProps> = () => {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [maxScore, setMaxScore] = useState(0);
  const [testText, setTestText] = useState("");
  const [testTitle, setTestTitle] = useState("");

  useEffect(() => {
    setMaxScore(tasks.reduce((score, task) => score += Number(task.maxScore), 0));
  }, [tasks]);

  const [isNewTask, setIsNewTask] = useState(false);

  const addNewTaskHandler = () => setIsNewTask(true);
  const saveTestHandler = () => {
    // save logic

    navigate('/assignments');
  };

  return (
    <div className={DEFAULT_CLASSNAME}>
      <div className={`${DEFAULT_CLASSNAME}_text-container`}>
        <div className={`${DEFAULT_CLASSNAME}_text-container_name`}>
          <div className={`${DEFAULT_CLASSNAME}_text-container_name-text`}>
            <div className={`${DEFAULT_CLASSNAME}_text-container_name-title`}><Typography color={'purple'} weight={'bold'}>Англ - Третья тема</Typography></div>
            <div className={`${DEFAULT_CLASSNAME}_text-container_name-work`}>
              <input
                placeholder={"Введите имя теста"}
                type={"text"}
                value={testTitle}
                onChange={(e) => setTestTitle(e.currentTarget.value)}
              />
            </div>
          </div>
          <div className={`${DEFAULT_CLASSNAME}_text-container_name-cut`}><CutIcon /></div>
        </div>
        <Typography className={`${DEFAULT_CLASSNAME}_text-container_title`}>Текст заданий</Typography>
        <textarea className={`${DEFAULT_CLASSNAME}_text-container_main`} onSelectCapture={(e) => console.log(e)} value={testText} onChange={(e) => setTestText(e.currentTarget.value)}></textarea>
      </div>
      <div className={`${DEFAULT_CLASSNAME}_tasks-container`}>
        <div className={`${DEFAULT_CLASSNAME}_tasks-container_title`}>
          <div>
            Общий макс. балл
            <div className={`${DEFAULT_CLASSNAME}_tasks-container_title_maxScore`}>{maxScore}</div>
          </div>
          <div className={`${DEFAULT_CLASSNAME}_tasks-container_title_save`} onClick={saveTestHandler}><CheckIcon /></div>
        </div>
        {tasks?.map((task, index) => <TaskCard tasks={tasks} setTasks={setTasks} taskAssets={task.assets} text={task.taskText} criteria={task.criteria} maxScore={task.maxScore} format={task.format} index={index + 1} />)}

        {isNewTask && <TaskCard isCreateMode setIsCreatingMode={setIsNewTask} tasks={tasks} setTasks={setTasks} text={''} criteria={''} maxScore={''} format={'standard'} index={3} />}
        <div className={`${DEFAULT_CLASSNAME}_tasks-container_addItem`} onClick={() => addNewTaskHandler()}>
          <AddIcon />
        </div>
      </div>
    </div>
  )
}
