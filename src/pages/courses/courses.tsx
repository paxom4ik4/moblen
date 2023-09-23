import { FC, useState } from 'react';
import { useDrop } from "react-dnd";

import AddIcon from 'assets/icons/add-icon.svg'
import EditIcon from 'assets/icons/edit-icon.svg';
import AddSubjectIcon from 'assets/icons/add-subject-icon.svg';
import CancelIcon from 'assets/icons/cancel-icon.svg';
import LockIcon from 'assets/icons/lock-icon.svg';
import TrashIcon from 'assets/icons/trash-icon.svg'
import { useNavigate } from "react-router-dom";
import { TestCard } from "components/test-card/test-card.tsx";
import { GroupCard} from "components/group-card/group-card.tsx";
import { Typography} from "common/typography/typography.tsx";
import { TitledCheckbox} from "common/titled-checkbox/titled-checkbox.tsx";

import { DraggableTypes } from "types/draggable/draggable.types.ts";
import { mockedGroups } from "constants/mockedGroups.ts";

import './courses.scss';

const DEFAULT_CLASSNAME = 'app-courses';

const mockedSubjects = [{ id: 'subject-1', name: 'История ОГЭ'}, { id: 'subject-2', name: 'Обществознание ЕГЭ'}];
const mockedTopics = [{id: 'topic-1', name: 'Первая тема'}, {id: 'topic-2', name: 'Вторая тема'}];

export const Courses: FC = () => {
  const navigate = useNavigate();

  const [{ isOver }, drop] = useDrop(() => ({
    accept: DraggableTypes.STUDENT_CARD,
    drop: (item: { id: string }) => console.log(item),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    })
  }))

  const [activeTopic, setActiveTopic] = useState(mockedTopics[0].id);
  const [activeSubject, setActiveSubject] = useState(mockedSubjects[0].id);

  const [isCreatingNewTest, setIsCreatingNewTest] = useState(false);

  const [testToShare, setTestToShare] = useState<string | null>(null);

  const [selectedShareGroups, setSelectedShareGroups] = useState<string[]>([]);

  // share configuration
  const [deadline, setDeadline] = useState(false);
  const [timeLimit, setTimeLimit] = useState(false);
  const [mark, setMark] = useState(false);
  const [retry, setRetry] = useState(false);
  const [answers, setAnswers] = useState(false);

  // calendar
  // const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handleTestCreate = () => setIsCreatingNewTest(true);

  const createNewTestContent = (
    <div className={`${DEFAULT_CLASSNAME}_new-test_modal`}>
        <div className={`${DEFAULT_CLASSNAME}_new-test_modal_cancel`} onClick={() => setIsCreatingNewTest(false)}><CancelIcon /></div>

        <button onClick={() => navigate('/assignments/create-test')}>Внести готовые задания</button>
        <button disabled={true} onClick={() => navigate('/assignments/generate-test')}>Сгенерировать задания <LockIcon /></button>
    </div>
  )

  const shareTestContent = (
    <div className={`${DEFAULT_CLASSNAME}_share`}>
      <div className={`${DEFAULT_CLASSNAME}_share_title`}>
        <div className={`${DEFAULT_CLASSNAME}_share_title-name`}>{"Отправить задание"}</div>
        <div className={`${DEFAULT_CLASSNAME}_share_title-close`} onClick={() => setTestToShare(null)}><CancelIcon /></div>
      </div>
      <div className={`${DEFAULT_CLASSNAME}_share_content`}>
        <div className={`${DEFAULT_CLASSNAME}_share_content_groups`}>
          {mockedGroups.map(group => <GroupCard active={selectedShareGroups.includes(group.id)} selectedShareGroups={selectedShareGroups} setSelectedShareGroups={setSelectedShareGroups} key={group.id} id={group.id} name={group.name} amount={group.amount} hideControls />)}
        </div>
        <div className={`${DEFAULT_CLASSNAME}_share_content_config`}>
          <div className={`${DEFAULT_CLASSNAME}_share_content_config_task`}>
            <Typography>{'Англ - Третья тема'}</Typography>
            <Typography color={'purple'} size={'large'}>{'ДЗ №17'}</Typography>
            <Typography color={'gray'} size={'small'}>{'Заданий - 11'}</Typography>
          </div>
          <div className={`${DEFAULT_CLASSNAME}_share_content_config_dateTime`}>
            <div className={`${DEFAULT_CLASSNAME}_share_content_config_dateTime_calendar`}></div>
            <div className={`${DEFAULT_CLASSNAME}_share_content_config_dateTime_time`}>
              <TitledCheckbox name={'deadline'} checked={deadline} onChange={() => setDeadline(!deadline)}>Дедлайн</TitledCheckbox>
              <TitledCheckbox name={'mark'} checked={mark} onChange={() => setMark(!mark)}>Оценка</TitledCheckbox>
              <TitledCheckbox name={'timeLimit'} checked={timeLimit} onChange={() => setTimeLimit(!timeLimit)}>Ограничение по времени</TitledCheckbox>
              <TitledCheckbox name={'retry'} checked={retry} onChange={() => setRetry(!retry)}>Можно перепройти</TitledCheckbox>
              <TitledCheckbox name={'answers'} checked={answers} onChange={() => setAnswers(!answers)}>Смотр. ответы после сдачи</TitledCheckbox>
            </div>
          </div>
          <div className={`${DEFAULT_CLASSNAME}_share_content_config_confirm`}></div>
        </div>
      </div>
    </div>
  );

  // const calendarContent = (
  //   <div className={`${DEFAULT_CLASSNAME}_calendar`}>
  //     <div className={`${DEFAULT_CLASSNAME}_calendar_title`}>
  //       <Typography size={'large'}>Расписание</Typography>
  //       <div className={`${DEFAULT_CLASSNAME}_calendar_close`} onClick={() => setIsCalendarOpen(false)}><CancelIcon /></div>
  //     </div>
  //     <div className={`${DEFAULT_CLASSNAME}_calendar_content`}>
  //       <DateCalendar displayWeekNumber />
  //     </div>
  //   </div>
  // );

  return (
    <div className={DEFAULT_CLASSNAME}>
      {/*{ isCalendarOpen && calendarContent }*/}
      {/*{ isCalendarOpen && <div className={`backdrop-shadow`}/> }*/}

      { isCreatingNewTest && createNewTestContent }
      { isCreatingNewTest && <div className={`backdrop-shadow`}/> }

      { testToShare && shareTestContent }
      { testToShare && <div className={`backdrop-shadow`}/> }

      <div className={`${DEFAULT_CLASSNAME}_subjects`}>
        <div className={`${DEFAULT_CLASSNAME}_subjects_list`}>
          {mockedSubjects.map(subject =>
            <div
              className={`${DEFAULT_CLASSNAME}_subjects_list-item ${subject.id === activeSubject && 'active-subject'}`}
              onClick={() => setActiveSubject(subject.id)}><input disabled={true} value={subject.name} /> {subject.id === activeSubject && <EditIcon />}</div>
          )}
          <button className={`${DEFAULT_CLASSNAME}_subjects_add-new`}><AddSubjectIcon /></button>
        </div>
      </div>
      <div className={`${DEFAULT_CLASSNAME}_topics`}>
        <div className={`${DEFAULT_CLASSNAME}_topics_list`}>
          {mockedTopics.map(topic =>
            <div
              className={`${DEFAULT_CLASSNAME}_topics_list-item ${topic.id === activeTopic && 'active-topic'}`}
              onClick={() => setActiveTopic(topic.id)}><input disabled={true} value={topic.name} /> {topic.id === activeTopic && <div className={`${DEFAULT_CLASSNAME}_topics_list-item_edit`}><EditIcon /></div>}</div>
          )}
          <div className={`${DEFAULT_CLASSNAME}_topics_add`}> <AddIcon /></div>
        </div>
        {/*<div className={`${DEFAULT_CLASSNAME}_topics_edit`} onClick={() => setIsCalendarOpen(true)}><CalendarIcon /></div>*/}
      </div>
      <div className={`${DEFAULT_CLASSNAME}_tasks`}>
        <TestCard id={'test-id'} setTestToShare={setTestToShare} />
        <button onClick={() => handleTestCreate()} className={`${DEFAULT_CLASSNAME}_tasks_add`}> <AddIcon /> </button>
      </div>

      <div ref={drop} className={`${DEFAULT_CLASSNAME}_delete ${isOver && 'courses-delete-drop'}`}><TrashIcon /></div>
    </div>
  )
};
