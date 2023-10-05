import { FC, useContext, useState } from 'react';

import TutorIcon from "assets/icons/tutor-icon.svg";
import { Typography } from "common/typography/typography.tsx";
import { StudentTestCard } from "components/student-test-card/student-test-card.tsx";
import { AppContext } from "app.tsx";

import './tests.scss';

const DEFAULT_CLASSNAME = 'tests';

const mockedSubjects = [
  { id: 'subject-1', name: 'История ОГЭ', topics: [{id: 'topic-1', name: 'Первая тема', tests: [] }, {id: 'topic-2', name: 'Вторая тема', tests: []}]},
  { id: 'subject-2', name: 'Обществознание ЕГЭ', topics: [{id: 'topic-1', name: 'Первая тема', tests: []}]}
];

const mockedTutors = [
  { name: 'Преподаватель 1', id: 'tutor-1' },
  { name: 'Преподаватель 2', id: 'tutor-2' },
]

export const Tests: FC = () => {
  const { tests } = useContext(AppContext);

  const [courseData] = useState(mockedSubjects);

  // tasks state
  const [activeSubject, setActiveSubject] = useState(courseData.length ? courseData[0] : null);
  const [activeTopic, setActiveTopic] = useState<null | { id: string; name: string; tests: object[]}>(null);

  const [activeTutor, setActiveTutor] = useState<null | { name: string; id: string }>(null);

  return (
    <>
      <div className={`${DEFAULT_CLASSNAME}_tutors`}>
        {mockedTutors.map(tutor => (
          <div onClick={() => setActiveTutor(tutor)} className={`${DEFAULT_CLASSNAME}_tutors_item ${activeTutor === tutor ? "active-tutor-item" : ""}`}>
            <div className={`${DEFAULT_CLASSNAME}_tutors_item_image`}>
              <TutorIcon />
            </div>
            <Typography size={"small"} color={'gray'} className={`${DEFAULT_CLASSNAME}_tutors_item_name`}>{tutor.name}</Typography>
          </div>
        ))}
      </div>
      <div className={DEFAULT_CLASSNAME}>
        <div className={`${DEFAULT_CLASSNAME}_subjects`}>
          <div className={`${DEFAULT_CLASSNAME}_subjects_list`}>
            {courseData.map(subject =>
              <div onClick={() => setActiveSubject(subject)} className={`${DEFAULT_CLASSNAME}_subjects_list-item ${subject === activeSubject && 'active-subject'}`}><Typography className={`${subject === activeSubject && 'active-subject-title'}`}>{subject.name}</Typography></div>
            )}
          </div>
        </div>
        <div className={`${DEFAULT_CLASSNAME}_topics`}>
          <div className={`${DEFAULT_CLASSNAME}_topics_list`}>
            {activeSubject?.topics?.map(topic =>
              <div
                className={`${DEFAULT_CLASSNAME}_topics_list-item ${topic === activeTopic && 'student-active-topic-item'}`}
                onClick={() => setActiveTopic(topic)}><Typography className={`${topic === activeTopic && 'student-active-topic'}`}>{topic.name}</Typography>
              </div>
            )}
          </div>
        </div>
        <div className={`${DEFAULT_CLASSNAME}_tasks`}>
          {tests.map(test => <StudentTestCard id={test.id} name={test.name} subject={test.subject} topic={test.topic} status={test.status} tasksAmount={test.tasks.length} />)}
        </div>
      </div>
    </>
  )
}
