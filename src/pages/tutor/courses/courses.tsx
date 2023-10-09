import { FC, useState } from 'react';
import { useDrop } from 'react-dnd';
import { useNavigate } from 'react-router-dom';

import AddIcon from 'assets/icons/add-icon.svg';
import CheckIcon from 'assets/icons/check-icon.svg';
import AddSubjectIcon from 'assets/icons/add-subject-icon.svg';
import CancelIcon from 'assets/icons/cancel-icon.svg';
import LockIcon from 'assets/icons/lock-icon.svg';
import TrashIcon from 'assets/icons/trash-icon.svg';
import { TestCard } from 'components/test-card/test-card.tsx';
import { CoursesShare } from './courses-share/courses-share.tsx';
import { DraggableTypes } from 'types/draggable/draggable.types.ts';

import './courses.scss';
import { Typography } from 'common/typography/typography.tsx';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store/store.ts';
import { createCourse, createTopic, getTopics, getTutorsCourses } from 'services/courses';
import { createTaskList, deleteTaskList, getTaskList } from '../../../services/tasks';
import { setTaskToCreate } from 'store/create-task/create-task.slice.ts';

const DEFAULT_CLASSNAME = 'app-courses';

export const Courses: FC = () => {
  const queryClient = useQueryClient();

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { userData } = useSelector((state: RootState) => state.userData);

  const [activeCourse, setActiveCourse] = useState<null | string>(null);
  const [activeTopic, setActiveTopic] = useState<null | string>(null);

  const { data: courses, isLoading } = useQuery('courses', () => getTutorsCourses(userData!.uuid));

  const createNewCourseMutation = useMutation(
    (data: { tutorId: string; courseName: string }) => createCourse(data),
    {
      onSuccess: () => queryClient.invalidateQueries('courses'),
    },
  );

  const { data: topics, isLoading: isTopicsLoading } = useQuery(['topics', activeCourse], () =>
    getTopics(activeCourse ?? null),
  );

  const createNewTopicMutation = useMutation(
    (data: { course_uuid: string; topic_name: string }) => createTopic(data),
    {
      onSuccess: () => queryClient.invalidateQueries('topics'),
    },
  );

  const { data: taskList, isLoading: isTaskListLoading } = useQuery(['taskList', activeTopic], () =>
    getTaskList(activeTopic ?? null),
  );

  const createNewTaskListMutation = useMutation(
    (data: { list_name: string; topic_uuid: string }) => createTaskList(data),
    {
      onSuccess: () => queryClient.invalidateQueries('taskList'),
    },
  );

  const deleteTaskListMutation = useMutation(
    (data: { topic_uuid: string; list_uuid: string }) => deleteTaskList(data),
    {
      onSuccess: () => queryClient.invalidateQueries('taskList'),
    },
  );

  const handleDeleteTest = async (id: string) => {
    if (activeTopic) {
      await deleteTaskListMutation.mutate({ list_uuid: id, topic_uuid: activeTopic! });
    }
  };

  const [{ isOver }, drop] = useDrop(() => ({
    accept: DraggableTypes.TEST_CARD,
    drop: (item: { id: string }) => handleDeleteTest(item.id),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  // creating / editing subjects
  const [addNewCourse, setAddNewCourse] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState('');

  const saveNewSubjectHandler = () => {
    if (newSubjectName.length) {
      createNewCourseMutation.mutate({ tutorId: userData!.uuid, courseName: newSubjectName });

      setNewSubjectName('');
      setAddNewCourse(false);
    }
  };

  const saveNewTopicHandler = () => {
    if (newTopicName.length && activeCourse) {
      createNewTopicMutation.mutate({ topic_name: newTopicName, course_uuid: activeCourse });

      setNewTopicName('');
      setAddNewTopic(false);
    }
  };

  // creating / editing topics
  const [addNewTopic, setAddNewTopic] = useState(false);
  const [newTopicName, setNewTopicName] = useState('');

  // new test creating
  const [isCreatingNewTest, setIsCreatingNewTest] = useState<{
    list_uuid: string;
    list_name: string;
  } | null>(null);
  const [isTaskListCreating, setIsTaskListCreating] = useState(false);
  const [newTaskListName, setNewTaskListName] = useState('');

  const handleNewTaskListCreate = async () => {
    await createNewTaskListMutation.mutate({
      topic_uuid: activeTopic!,
      list_name: newTaskListName,
    });

    setIsTaskListCreating(false);
    setNewTaskListName('');
  };

  // share
  const [testToShare, setTestToShare] = useState<{
    list_uuid: string;
    topic: string;
    course: string;
    name: string;
  } | null>(null);

  const handleTaskListCreate = () => setIsTaskListCreating(true);

  const createNewTestContent = (
    <div className={`${DEFAULT_CLASSNAME}_new-test_modal`}>
      <div
        className={`${DEFAULT_CLASSNAME}_new-test_modal_cancel`}
        onClick={() => setIsCreatingNewTest(null)}>
        <CancelIcon />
      </div>

      <button
        onClick={() => {
          dispatch(
            setTaskToCreate({
              courseName: courses!.find((item) => item.course_uuid === activeCourse)!.course_name,
              topicName: topics!.find((item) => item.topic_uuid === activeTopic)!.topic_name,
              taskListId: isCreatingNewTest!.list_uuid,
              taskListName: isCreatingNewTest!.list_name,
            }),
          );
          navigate(`/assignments/create-test/${isCreatingNewTest?.list_uuid}`);
          setIsCreatingNewTest(null);
        }}>
        Внести готовые задания
      </button>
      <button disabled={true} onClick={() => navigate('/assignments/generate-test')}>
        Сгенерировать задания <LockIcon />
      </button>
    </div>
  );

  const createTaskListContent = (
    <div className={`${DEFAULT_CLASSNAME}_new-test_modal`}>
      <div
        className={`${DEFAULT_CLASSNAME}_new-test_modal_cancel`}
        onClick={() => setIsTaskListCreating(false)}>
        <CancelIcon />
      </div>

      <div className={`${DEFAULT_CLASSNAME}_new-taskList_modal_content`}>
        <input
          placeholder={'Введите название теста'}
          type={'text'}
          value={newTaskListName}
          onChange={(e) => setNewTaskListName(e.currentTarget.value)}
        />
        <button onClick={handleNewTaskListCreate}>{'Создать'}</button>
      </div>
    </div>
  );

  const showBackgroundShadow = isCreatingNewTest || testToShare;

  if (isLoading) {
    return (
      <div className={DEFAULT_CLASSNAME}>
        <Typography>Загрузка...</Typography>
      </div>
    );
  }

  return (
    <div className={DEFAULT_CLASSNAME}>
      {showBackgroundShadow && <div className={`backdrop-shadow`} />}

      {testToShare && <CoursesShare testToShare={testToShare} setTestToShare={setTestToShare} />}
      {!!isCreatingNewTest && createNewTestContent}

      {isTaskListCreating && createTaskListContent}

      <div className={`${DEFAULT_CLASSNAME}_subjects`}>
        <div className={`${DEFAULT_CLASSNAME}_subjects_list`}>
          {!!courses?.length &&
            courses.map((course) => (
              <div
                onClick={() => {
                  setActiveCourse(course.course_uuid);
                  setActiveTopic(null);
                }}
                className={`${DEFAULT_CLASSNAME}_subjects_list-item ${
                  course.course_uuid === activeCourse && 'active-subject'
                }`}>
                <Typography color={course.course_uuid === activeCourse ? 'purple' : 'default'}>
                  {course.course_name}
                </Typography>
                {/*{course.course_uuid === activeCourse && <EditIcon />}*/}
              </div>
            ))}
          {addNewCourse && (
            <div className={`${DEFAULT_CLASSNAME}_subjects_list-item`}>
              <input
                onChange={(e) => setNewSubjectName(e.currentTarget.value)}
                value={newSubjectName}
                placeholder={'Новый предмет'}
              />
              <div
                className={`${DEFAULT_CLASSNAME}_topics_list-item_edit`}
                onClick={saveNewSubjectHandler}>
                <CheckIcon />
              </div>
            </div>
          )}
          <button
            className={`${DEFAULT_CLASSNAME}_subjects_add-new`}
            onClick={() => setAddNewCourse(true)}>
            <AddSubjectIcon />
          </button>
        </div>
      </div>
      <div className={`${DEFAULT_CLASSNAME}_topics`}>
        {activeCourse && (
          <div className={`${DEFAULT_CLASSNAME}_topics_list`}>
            {!!topics?.length &&
              !isTopicsLoading &&
              topics.map((topic) => (
                <div
                  className={`${DEFAULT_CLASSNAME}_topics_list-item ${
                    topic.topic_uuid === activeTopic && 'active-topic'
                  }`}
                  onClick={() => setActiveTopic(topic.topic_uuid)}>
                  <Typography color={topic.topic_uuid === activeTopic ? 'purple' : 'default'}>
                    {topic.topic_name}
                  </Typography>
                </div>
              ))}
            {addNewTopic && (
              <div className={`${DEFAULT_CLASSNAME}_topics_list-item`}>
                <input
                  onChange={(e) => setNewTopicName(e.currentTarget.value)}
                  value={newTopicName}
                  placeholder={'Новая тема'}
                />
                <div
                  onClick={() => saveNewTopicHandler()}
                  className={`${DEFAULT_CLASSNAME}_topics_list-item_edit`}>
                  <CheckIcon />
                </div>
              </div>
            )}
            <div className={`${DEFAULT_CLASSNAME}_topics_add`} onClick={() => setAddNewTopic(true)}>
              {' '}
              <AddIcon />
            </div>
          </div>
        )}
      </div>
      <div className={`${DEFAULT_CLASSNAME}_tasks`}>
        {!activeTopic && <Typography color={'purple'}>Выберите или создайте тему</Typography>}

        {activeTopic &&
          !isTaskListLoading &&
          Array.isArray(taskList) &&
          taskList.map((test) => (
            <TestCard
              onClick={() =>
                setIsCreatingNewTest({ list_uuid: test.list_uuid, list_name: test.list_name })
              }
              id={test.list_uuid}
              name={test.list_name}
              subject={courses!.find((item) => item.course_uuid === activeCourse)!.course_name}
              topic={topics!.find((item) => item.topic_uuid === activeTopic)!.topic_name}
              setTestToShare={setTestToShare}
            />
          ))}
        {activeTopic && (
          <button onClick={handleTaskListCreate} className={`${DEFAULT_CLASSNAME}_tasks_add`}>
            <AddIcon />
          </button>
        )}
      </div>

      <div ref={drop} className={`${DEFAULT_CLASSNAME}_delete ${isOver && 'courses-delete-drop'}`}>
        <TrashIcon />
      </div>
    </div>
  );
};
