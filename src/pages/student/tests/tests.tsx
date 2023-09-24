import { FC, useContext, useState } from 'react';

import { Typography } from "common/typography/typography.tsx";
import { StudentTestCard } from "components/student-test-card/student-test-card.tsx";
import { AppContext } from "app.tsx";

import './tests.scss';

const DEFAULT_CLASSNAME = 'tests';

const mockedSubjects = [{ id: 'subject-1', name: 'История ОГЭ'}, { id: 'subject-2', name: 'Обществознание ЕГЭ'}];
const mockedTopics = [{id: 'topic-1', name: 'Первая тема'}, {id: 'topic-2', name: 'Вторая тема'}];

export const Tests: FC = () => {
  const { tests } = useContext(AppContext);

  const [courseData] = useState({
    topics: mockedTopics,
    subjects: mockedSubjects,
  });

  // tasks state
  const [activeTopic, setActiveTopic] = useState(courseData.topics.length ? mockedTopics[0].id : null);
  const [activeSubject, setActiveSubject] = useState(courseData.subjects.length ? mockedSubjects[0].id : null);

  return (
    <div className={DEFAULT_CLASSNAME}>
      <div className={`${DEFAULT_CLASSNAME}_subjects`}>
        <div className={`${DEFAULT_CLASSNAME}_subjects_list`}>
          {mockedSubjects.map(subject =>
            <div
              className={`${DEFAULT_CLASSNAME}_subjects_list-item ${subject.id === activeSubject && 'active-subject'}`}
              onClick={() => setActiveSubject(subject.id)}><Typography className={`${subject.id === activeSubject && 'active-subject-title'}`}>{subject.name}</Typography></div>
          )}
        </div>
      </div>
      <div className={`${DEFAULT_CLASSNAME}_topics`}>
        <div className={`${DEFAULT_CLASSNAME}_topics_list`}>
          {mockedTopics.map(topic =>
            <div
              className={`${DEFAULT_CLASSNAME}_topics_list-item ${topic.id === activeTopic && 'student-active-topic-item'}`}
              onClick={() => setActiveTopic(topic.id)}><Typography className={`${topic.id === activeTopic && 'student-active-topic'}`}>{topic.name}</Typography>
            </div>
          )}
        </div>
      </div>
      <div className={`${DEFAULT_CLASSNAME}_tasks`}>
        {tests.map(test => <StudentTestCard id={test.id} name={test.name} subject={test.subject} topic={test.topic} status={test.status} tasksAmount={test.tasks.length} />)}
      </div>
    </div>
  )
}
