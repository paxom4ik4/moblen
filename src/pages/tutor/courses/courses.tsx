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
import { Typography } from "common/typography/typography.tsx";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useSelector } from "react-redux";
import { RootState } from "store/store.ts";
import { createCourse, getTutorsCourses } from "services/courses";

const DEFAULT_CLASSNAME = 'app-courses';

export const Courses: FC = () => {
  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const { userData } = useSelector((state: RootState) => state.userData);

  const { data: courses, isLoading } = useQuery('courses', () => getTutorsCourses(userData!.uuid));

  const createNewCourseMutation = useMutation((data: { tutorId: string, courseName: string }) => createCourse(data), {
    onSuccess: () => queryClient.invalidateQueries('courses'),
  });

  const handleDeleteTest = (id: string) => {
    console.log(id);
  }

  const [{ isOver }, drop] = useDrop(() => ({
    accept: DraggableTypes.TEST_CARD,
    drop: (item: { id: string }) => handleDeleteTest(item.id),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    })
  }));

  // creating / editing subjects
  const [addNewCourse, setAddNewCourse] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState("");

  const saveNewSubjectHandler = () => {
    if (newSubjectName.length) {
      createNewCourseMutation.mutate({ tutorId: userData!.uuid, courseName: newSubjectName })

      setNewSubjectName("");
      setAddNewCourse(false);
    }
  };

  // creating / editing topics
  // const [addNewTopic, setAddNewTopic] = useState(false);
  // const [newTopicName, setNewTopicName] = useState("");

  // course state
  const [activeCourse, setActiveCourse] = useState<null | string>(null);
  const [activeTopic, setActiveTopic] = useState<null | { id: string; name: string; tests: object[]}>(null);

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

  if (isLoading) {
    return <div className={DEFAULT_CLASSNAME}>
      <Typography>Загрузка...</Typography>
    </div>
  }

  return (
    <div className={DEFAULT_CLASSNAME}>
      { showBackgroundShadow && <div className={`backdrop-shadow`}/> }

      { testToShare && <CoursesShare setTestToShare={setTestToShare} /> }
      { isCreatingNewTest && createNewTestContent }

      <div className={`${DEFAULT_CLASSNAME}_subjects`}>
        <div className={`${DEFAULT_CLASSNAME}_subjects_list`}>
          {courses?.length && courses.map(course =>
            <div onClick={() => {
              setActiveCourse(course);
              setActiveTopic(null);
            }} className={`${DEFAULT_CLASSNAME}_subjects_list-item ${course === activeCourse && 'active-subject'}`}>
              <Typography color={course === activeCourse ? "purple" : "default"}>{course}</Typography>
              {course === activeCourse && <EditIcon />}
            </div>
          )}
          {addNewCourse &&
              <div className={`${DEFAULT_CLASSNAME}_subjects_list-item`}>
                  <input
                      onChange={(e) => setNewSubjectName(e.currentTarget.value)}
                      value={newSubjectName}
                      placeholder={'Новый предмет'}
                  />
                  <div className={`${DEFAULT_CLASSNAME}_topics_list-item_edit`} onClick={saveNewSubjectHandler}><CheckIcon /></div>
              </div>
          }
          <button className={`${DEFAULT_CLASSNAME}_subjects_add-new`} onClick={() => setAddNewCourse(true)}><AddSubjectIcon /></button>
        </div>
      </div>
      <div className={`${DEFAULT_CLASSNAME}_topics`}>
        {/*<div className={`${DEFAULT_CLASSNAME}_topics_list`}>*/}
        {/*  {activeCourse?.topics.map(topic =>*/}
        {/*    <div*/}
        {/*      className={`${DEFAULT_CLASSNAME}_topics_list-item ${topic === activeTopic && 'active-topic'}`}*/}
        {/*      onClick={() => setActiveTopic(topic)}*/}
        {/*    >*/}
        {/*      <Typography color={topic === activeTopic ? "purple" : "default"}>{topic.name}</Typography>*/}
        {/*      {topic === activeTopic &&*/}
        {/*          <div className={`${DEFAULT_CLASSNAME}_topics_list-item_edit`}><EditIcon /></div>*/}
        {/*      }*/}
        {/*    </div>*/}
        {/*  )}*/}
        {/*  {addNewTopic &&*/}
        {/*      <div className={`${DEFAULT_CLASSNAME}_topics_list-item`}>*/}
        {/*          <input*/}
        {/*              onChange={(e) => setNewTopicName(e.currentTarget.value)}*/}
        {/*              value={newTopicName}*/}
        {/*              placeholder={'Новая тема'}*/}
        {/*          />*/}
        {/*          <div onClick={() => {}} className={`${DEFAULT_CLASSNAME}_topics_list-item_edit`}><CheckIcon /></div>*/}
        {/*      </div>*/}
        {/*  }*/}
        {/*  <div className={`${DEFAULT_CLASSNAME}_topics_add`} onClick={() => setAddNewTopic(true)}> <AddIcon /></div>*/}
        {/*</div>*/}
      </div>
      <div className={`${DEFAULT_CLASSNAME}_tasks`}>
        {!activeTopic && <Typography color={"purple"}>Выберите или создайте тему</Typography>}

        {activeTopic && !!activeTopic?.tests?.length && activeTopic.tests.map(() => <TestCard id={'test-id'} setTestToShare={setTestToShare} />)}
        {activeTopic && <button onClick={() => handleTestCreate()} className={`${DEFAULT_CLASSNAME}_tasks_add`}> <AddIcon /> </button>}
      </div>

      <div ref={drop} className={`${DEFAULT_CLASSNAME}_delete ${isOver && 'courses-delete-drop'}`}><TrashIcon /></div>
    </div>
  )
};
