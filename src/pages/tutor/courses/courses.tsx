import { FC, useState } from 'react';
import { useDrop } from "react-dnd";
import { useNavigate } from "react-router-dom";

import AddIcon from 'assets/icons/add-icon.svg'
import CheckIcon from 'assets/icons/check-icon.svg';
import EditIcon from 'assets/icons/edit-icon.svg';
import AddSubjectIcon from 'assets/icons/add-subject-icon.svg';
import CancelIcon from 'assets/icons/cancel-icon.svg';
import LockIcon from 'assets/icons/lock-icon.svg';
import TrashIcon from 'assets/icons/trash-icon.svg'
import { TestCard } from "components/test-card/test-card.tsx";
import { CoursesShare } from "./courses-share/courses-share.tsx";
import { DraggableTypes } from "types/draggable/draggable.types.ts";

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
  }));

  const [courseData, setCourseData] = useState({
    topics: mockedTopics,
    subjects: mockedSubjects,
  });

  // creating / editing subjects
  const [addNewSubject, setAddNewSubject] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState("");

  const saveNewSubjectHandler = () => {
    if (newSubjectName.length) {
      setCourseData({
        ...courseData,
        subjects: [...courseData.subjects, { id: Date.now().toString(), name: newTopicName }],
      });

      setNewSubjectName("");
      setAddNewSubject(false);
    }
  };

  // creating / editing topics
  const [addNewTopic, setAddNewTopic] = useState(false);
  const [newTopicName, setNewTopicName] = useState("");

  const saveNewTopicHandler = () => {
    if (newTopicName.length) {
      setCourseData({
        ...courseData,
        topics: [...courseData.topics, { id: Date.now().toString(), name: newTopicName }],
      });

      setNewTopicName("");
      setAddNewTopic(false);
    }
  };

  // course state
  const [activeTopic, setActiveTopic] = useState(courseData.topics.length ? mockedTopics[0].id : null);
  const [activeSubject, setActiveSubject] = useState(courseData.subjects.length ? mockedSubjects[0].id : null);

  // new test creating
  const [isCreatingNewTest, setIsCreatingNewTest] = useState(false);

  // share
  const [testToShare, setTestToShare] = useState<string | null>(null);

  const handleTestCreate = () => setIsCreatingNewTest(true);

  const createNewTestContent = (
    <div className={`${DEFAULT_CLASSNAME}_new-test_modal`}>
        <div className={`${DEFAULT_CLASSNAME}_new-test_modal_cancel`} onClick={() => setIsCreatingNewTest(false)}><CancelIcon /></div>

        <button onClick={() => navigate('/assignments/create-test')}>Внести готовые задания</button>
        <button disabled={true} onClick={() => navigate('/assignments/generate-test')}>Сгенерировать задания <LockIcon /></button>
    </div>
  )

  const showBackgroundShadow = isCreatingNewTest || testToShare

  return (
    <div className={DEFAULT_CLASSNAME}>
      { showBackgroundShadow && <div className={`backdrop-shadow`}/> }

      { testToShare && <CoursesShare setTestToShare={setTestToShare} /> }
      { isCreatingNewTest && createNewTestContent }

      <div className={`${DEFAULT_CLASSNAME}_subjects`}>
        <div className={`${DEFAULT_CLASSNAME}_subjects_list`}>
          {mockedSubjects.map(subject =>
            <div
              className={`${DEFAULT_CLASSNAME}_subjects_list-item ${subject.id === activeSubject && 'active-subject'}`}
              onClick={() => setActiveSubject(subject.id)}><input disabled={true} value={subject.name} /> {subject.id === activeSubject && <EditIcon />}</div>
          )}
          {addNewSubject &&
              <div className={`${DEFAULT_CLASSNAME}_subjects_list-item`}>
                  <input
                      onChange={(e) => setNewSubjectName(e.currentTarget.value)}
                      value={newSubjectName}
                      placeholder={'Новый предмет'}
                  />
                  <div className={`${DEFAULT_CLASSNAME}_topics_list-item_edit`} onClick={saveNewSubjectHandler}><CheckIcon /></div>
              </div>
          }
          <button className={`${DEFAULT_CLASSNAME}_subjects_add-new`} onClick={() => setAddNewSubject(true)}><AddSubjectIcon /></button>
        </div>
      </div>
      <div className={`${DEFAULT_CLASSNAME}_topics`}>
        <div className={`${DEFAULT_CLASSNAME}_topics_list`}>
          {mockedTopics.map(topic =>
            <div
              className={`${DEFAULT_CLASSNAME}_topics_list-item ${topic.id === activeTopic && 'active-topic'}`}
              onClick={() => setActiveTopic(topic.id)}><input disabled={true} value={topic.name} /> {topic.id === activeTopic && <div className={`${DEFAULT_CLASSNAME}_topics_list-item_edit`}><EditIcon /></div>}
            </div>
          )}
          {addNewTopic &&
              <div className={`${DEFAULT_CLASSNAME}_topics_list-item`}>
                  <input
                      onChange={(e) => setNewTopicName(e.currentTarget.value)}
                      value={newTopicName}
                      placeholder={'Новая тема'}
                  />
                  <div onClick={saveNewTopicHandler} className={`${DEFAULT_CLASSNAME}_topics_list-item_edit`}><CheckIcon /></div>
              </div>
          }
          <div className={`${DEFAULT_CLASSNAME}_topics_add`} onClick={() => setAddNewTopic(true)}> <AddIcon /></div>
        </div>
      </div>
      <div className={`${DEFAULT_CLASSNAME}_tasks`}>
        <TestCard id={'test-id'} setTestToShare={setTestToShare} />
        <button onClick={() => handleTestCreate()} className={`${DEFAULT_CLASSNAME}_tasks_add`}> <AddIcon /> </button>
      </div>

      <div ref={drop} className={`${DEFAULT_CLASSNAME}_delete ${isOver && 'courses-delete-drop'}`}><TrashIcon /></div>
    </div>
  )
};
