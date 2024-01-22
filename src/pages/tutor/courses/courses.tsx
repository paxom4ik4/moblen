import { FC, useState, useEffect, memo } from 'react';
import { useDrop } from 'react-dnd';
import { useNavigate } from 'react-router-dom';

import AddIcon from 'assets/icons/add-icon.svg';
import CheckIcon from 'assets/icons/check-icon.svg';
import AddSubjectIcon from 'assets/icons/add-subject-icon.svg';
import CancelIcon from 'assets/icons/cancel-icon.svg';
import TrashIcon from 'assets/icons/trash-icon.svg';
import { TestCard, TestCardCreate } from 'components/test-card/test-card.tsx';
import { CoursesShare } from './courses-share/courses-share.tsx';
import { DraggableTypes } from 'types/draggable/draggable.types.ts';
import { ClickAwayListener } from '@mui/base/ClickAwayListener';

import { Typography } from 'common/typography/typography.tsx';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { batch, useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store/store.ts';
import {
  createCourse,
  createTopic,
  deleteCourse,
  deleteTopic,
  updateTopicName,
  getTopics,
  getTutorsCourses,
  updateCourseName,
} from 'services/courses';
import { deleteTaskList, getTaskList } from 'services/tasks';
import { setTaskToCreate } from 'store/create-task/create-task.slice.ts';
import { setActiveCourse, setActiveTopic } from 'store/courses/courses.slice.ts';

import './courses.scss';
import { DateCalendar } from '@mui/x-date-pickers';
import { ConfirmModal } from '../../../components/confirm-modal/confirm-modal.tsx';
import { Notification } from '../../../common/notification/notification.tsx';
import { CircularProgress, Tooltip } from '@mui/material';
import { setTaskToGenerate } from '../../../store/generate-task/generate-task.slice.ts';

const DEFAULT_CLASSNAME = 'app-courses';

const Courses: FC = memo(() => {
  const queryClient = useQueryClient();

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { userData } = useSelector((state: RootState) => state.userData);
  const { activeCourse, activeTopic } = useSelector((state: RootState) => state.courses);

  const {
    data: courses,
    isLoading,
    isLoadingError,
  } = useQuery(['courses'], () => getTutorsCourses());

  useEffect(() => {
    if (courses?.length && !activeCourse) {
      dispatch(setActiveCourse(courses[0].course_uuid));
    } else if (!courses?.length) {
      batch(() => {
        dispatch(setActiveCourse(null));
        dispatch(setActiveTopic(null));
      });
    }
  }, [courses, dispatch, userData?.user_uuid]);

  const createNewCourseMutation = useMutation(
    (data: { courseName: string }) => createCourse(data),
    {
      onSuccess: () => queryClient.invalidateQueries('courses'),
    },
  );

  const { data: topics, isLoading: isTopicsLoading } = useQuery(
    ['topics', userData?.user_uuid, activeCourse],
    () => getTopics(activeCourse ?? null),
  );

  useEffect(() => {
    if (!topics?.length) {
      dispatch(setActiveTopic(null));
    }

    if (courses?.length && !activeCourse) {
      dispatch(setActiveCourse(courses[0].course_uuid));
    }

    if (topics?.length && !activeTopic) {
      dispatch(setActiveTopic(topics[0].topic_uuid));
    }
  }, [activeTopic, dispatch, topics, userData?.user_uuid]);

  const { data: taskList, isLoading: isTaskListLoading } = useQuery(
    ['taskList', userData?.user_uuid, activeTopic],
    () => getTaskList(activeTopic ?? null),
  );

  const createNewTopicMutation = useMutation(
    (data: { course_uuid: string; topic_name: string }) => createTopic(data),
    {
      onSuccess: () => queryClient.invalidateQueries('topics'),
    },
  );

  const deleteTaskListMutation = useMutation(
    (data: { list_uuid: string }) => deleteTaskList(data),
    {
      onSuccess: () => queryClient.invalidateQueries('taskList'),
    },
  );

  const deleteCourseMutation = useMutation((data: { course_uuid: string }) => deleteCourse(data), {
    onSuccess: () => queryClient.invalidateQueries('courses'),
  });

  const deleteTopicMutation = useMutation((data: { topic_uuid: string }) => deleteTopic(data), {
    onSuccess: () => queryClient.invalidateQueries('topics'),
  });

  const [isTestDeleting, setIsTestDeleting] = useState<false | string>(false);

  const handleDeleteTest = async () => {
    if (activeTopic) {
      await deleteTaskListMutation.mutate({ list_uuid: isTestDeleting.toString() });
      setIsTestDeleting(false);
    }
  };

  const [{ isOver }, drop] = useDrop(() => ({
    accept: DraggableTypes.TEST_CARD,
    drop: (item: { id: string }) => setIsTestDeleting(item.id),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  // creating / editing subjects
  const [addNewCourse, setAddNewCourse] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState('');

  const saveNewSubjectHandler = () => {
    if (newSubjectName.length) {
      createNewCourseMutation.mutate({ courseName: newSubjectName });
    }

    setNewSubjectName('');
    setAddNewCourse(false);
  };

  const saveNewTopicHandler = () => {
    if (newTopicName.length && activeCourse) {
      createNewTopicMutation.mutate({ topic_name: newTopicName, course_uuid: activeCourse });
    }

    setNewTopicName('');
    setAddNewTopic(false);
  };

  const deleteCourseHandler = async () => {
    if (activeCourse) {
      await deleteCourseMutation.mutate({ course_uuid: activeCourse });
      setActiveCourse(null);
      setActiveTopic(null);
    }

    setIsCourseDeleting(false);
  };

  const deleteTopicHandler = async () => {
    if (activeCourse && activeTopic) {
      await deleteTopicMutation.mutate({ topic_uuid: activeTopic });

      setActiveTopic(null);
    }

    setIsTopicDeleting(false);
  };

  const [isCourseDeleting, setIsCourseDeleting] = useState(false);
  const [isTopicDeleting, setIsTopicDeleting] = useState(false);

  // creating / editing topics
  const [addNewTopic, setAddNewTopic] = useState(false);
  const [newTopicName, setNewTopicName] = useState('');

  const [courseNameEditing, setCourseNameEditing] = useState<false | string>(false);
  const [newCourseName, setNewCourseName] = useState('');

  const editCourseNameMutation = useMutation(
    (data: { courseId: string; courseName: string }) => updateCourseName(data),
    {
      onSuccess: () => queryClient.invalidateQueries('courses'),
    },
  );

  const handleCourseChangeName = () => {
    if (typeof courseNameEditing === 'string') {
      editCourseNameMutation.mutate({
        courseId: courseNameEditing,
        courseName: newCourseName,
      });
    }

    setCourseNameEditing(false);
  };

  const [topicNameEditing, setTopicNameEditing] = useState<false | string>(false);
  const [editTopicName, setEditTopicName] = useState('');

  const editTopicNameMutation = useMutation(
    (data: { topicId: string; topicName: string }) => updateTopicName(data),
    {
      onSuccess: () => queryClient.invalidateQueries('topics'),
    },
  );

  const handleTopicChangeName = () => {
    if (typeof topicNameEditing === 'string') {
      editTopicNameMutation.mutate({
        topicId: topicNameEditing,
        topicName: editTopicName,
      });
    }

    setTopicNameEditing(false);
  };

  // new test creating
  const [isCreatingNewTest, setIsCreatingNewTest] = useState<{
    list_uuid: string;
    list_name: string;
    editable: boolean;
  } | null>(null);
  const [isTaskListCreating, setIsTaskListCreating] = useState(false);

  // share
  const [testToShare, setTestToShare] = useState<{
    list_uuid: string;
    topic: string;
    course: string;
    name: string;
    task_amount: number;
  } | null>(null);

  const activeCourseName =
    (!!courses?.length &&
      activeCourse &&
      courses.find((item) => item.course_uuid === activeCourse)?.course_name) ||
    '';

  const activeTopicName =
    (!!topics?.length &&
      activeTopic &&
      topics.find((item) => item.topic_uuid === activeTopic)?.topic_name) ||
    '';

  const [calendarOpened, setCalendarOpened] = useState<boolean>(false);
  const [taskListShared, setTaskListShared] = useState(false);

  const createNewTestContent = (
    <ClickAwayListener onClickAway={() => setIsCreatingNewTest(null)}>
      <div className={`${DEFAULT_CLASSNAME}_new-test_modal`}>
        <button
          onClick={() => {
            if (isCreatingNewTest?.list_uuid && isCreatingNewTest?.list_name) {
              dispatch(
                setTaskToCreate({
                  courseName: activeCourseName,
                  topicName: activeTopicName,
                  taskListId: isCreatingNewTest.list_uuid,
                  taskListName: isCreatingNewTest!.list_name,
                }),
              );
              navigate(
                `/assignments/create-test/${isCreatingNewTest.list_uuid}?editable=${isCreatingNewTest.editable}`,
              );
              setIsCreatingNewTest(null);
            }
          }}>
          Внести готовые задания
        </button>
        <button
          onClick={() => {
            if (isCreatingNewTest?.list_uuid && isCreatingNewTest?.list_name) {
              dispatch(
                setTaskToGenerate({
                  courseName: activeCourseName,
                  topicName: activeTopicName,
                  taskListId: isCreatingNewTest.list_uuid,
                  taskListName: isCreatingNewTest!.list_name,
                }),
              );

              navigate(
                `/assignments/generate-test/${isCreatingNewTest.list_uuid}?editable=${isCreatingNewTest.editable}`,
              );
            }
          }}>
          Сгенерировать задания
        </button>
      </div>
    </ClickAwayListener>
  );

  const calendarContent = (
    <div className={`${DEFAULT_CLASSNAME}_calendar`}>
      <div className={`${DEFAULT_CLASSNAME}_calendar_title`}>
        <Typography size={'large'}>Расписание</Typography>
        <div
          className={`${DEFAULT_CLASSNAME}_calendar_close`}
          onClick={() => setCalendarOpened(false)}>
          <CancelIcon />
        </div>
      </div>
      <div className={`${DEFAULT_CLASSNAME}_calendar_content`}>
        <DateCalendar />
      </div>
    </div>
  );

  const showBackgroundShadow =
    isCreatingNewTest ||
    testToShare ||
    calendarOpened ||
    isCourseDeleting ||
    isTopicDeleting ||
    isTestDeleting;

  if (isLoading) {
    return (
      <div className={DEFAULT_CLASSNAME}>
        <CircularProgress sx={{ color: '#c8caff' }} />
      </div>
    );
  }

  if (isLoadingError) {
    return (
      <div className={DEFAULT_CLASSNAME}>
        <Typography>Произошла ошибка во время загрузки... Попробуйте позже</Typography>
      </div>
    );
  }

  return (
    <div className={DEFAULT_CLASSNAME}>
      <Notification
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        autoHideDuration={3000}
        message={'Задание отправлено по группам'}
        open={taskListShared}
        onClose={() => setTaskListShared(!taskListShared)}
      />

      {showBackgroundShadow && <div className={`backdrop-shadow`} />}

      {testToShare && (
        <CoursesShare
          setTaskListShared={setTaskListShared}
          testToShare={testToShare}
          setTestToShare={setTestToShare}
        />
      )}
      {!!isCreatingNewTest && createNewTestContent}
      {calendarOpened && calendarContent}

      {isCourseDeleting && (
        <ConfirmModal
          label={`курс ${activeCourseName}`}
          reject={() => setIsCourseDeleting(false)}
          confirm={deleteCourseHandler}
        />
      )}

      {isTopicDeleting && (
        <ConfirmModal
          label={`тему ${activeTopicName}`}
          confirm={deleteTopicHandler}
          reject={() => setIsTopicDeleting(false)}
        />
      )}

      {isTestDeleting && (
        <ConfirmModal
          label={'список заданий'}
          confirm={handleDeleteTest}
          reject={() => setIsTestDeleting(false)}
        />
      )}

      <div className={`${DEFAULT_CLASSNAME}_subjects`}>
        <div className={`${DEFAULT_CLASSNAME}_subjects_list`}>
          {!!courses?.length &&
            courses.map((course) => (
              <div
                key={course.course_uuid}
                onClick={() => {
                  dispatch(setActiveCourse(course.course_uuid));
                  dispatch(setActiveTopic(null));
                }}
                className={`${DEFAULT_CLASSNAME}_subjects_list-item ${
                  course.course_uuid === activeCourse && 'active-subject'
                }`}>
                {course.course_uuid === courseNameEditing ? (
                  <ClickAwayListener onClickAway={handleCourseChangeName}>
                    <input
                      maxLength={20}
                      autoFocus={true}
                      value={newCourseName}
                      onChange={(e) => setNewCourseName(e.currentTarget.value)}
                      type={'text'}
                    />
                  </ClickAwayListener>
                ) : (
                  <Typography
                    onClick={() => {
                      activeCourse === course.course_uuid &&
                        setCourseNameEditing(course.course_uuid);
                      setNewCourseName(course.course_name);
                    }}
                    color={course.course_uuid === activeCourse ? 'purple' : 'default'}>
                    {course.course_name}
                  </Typography>
                )}
                {course.course_uuid === activeCourse && courseNameEditing && (
                  <button
                    onClick={() => setIsCourseDeleting(true)}
                    className={`${DEFAULT_CLASSNAME}_list-item_delete`}>
                    <TrashIcon />
                  </button>
                )}
              </div>
            ))}
          {addNewCourse && (
            <ClickAwayListener onClickAway={saveNewSubjectHandler}>
              <div className={`${DEFAULT_CLASSNAME}_subjects_list-item`}>
                <input
                  maxLength={20}
                  autoFocus={true}
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
            </ClickAwayListener>
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
                  key={topic.topic_uuid}
                  className={`${DEFAULT_CLASSNAME}_topics_list-item ${
                    topic.topic_uuid === activeTopic && 'active-topic'
                  }`}
                  onClick={() => dispatch(setActiveTopic(topic.topic_uuid))}>
                  {topic.topic_uuid === topicNameEditing ? (
                    <ClickAwayListener onClickAway={handleTopicChangeName}>
                      <input
                        maxLength={16}
                        autoFocus={true}
                        value={editTopicName}
                        onChange={(e) => setEditTopicName(e.currentTarget.value)}
                        type={'text'}
                      />
                    </ClickAwayListener>
                  ) : (
                    <Typography
                      onClick={() => {
                        activeTopic === topic.topic_uuid && setTopicNameEditing(topic.topic_uuid);
                        setEditTopicName(topic.topic_name);
                      }}
                      className={`${DEFAULT_CLASSNAME}_topics_list-item_name`}
                      size={'small'}
                      color={topic.topic_uuid === activeTopic ? 'purple' : 'default'}>
                      {topic.topic_name}
                    </Typography>
                  )}

                  {topic.topic_uuid === activeTopic && topicNameEditing && (
                    <button
                      onClick={() => setIsTopicDeleting(true)}
                      className={`${DEFAULT_CLASSNAME}_list-item_delete`}>
                      <TrashIcon />
                    </button>
                  )}
                </div>
              ))}
            {addNewTopic && (
              <ClickAwayListener onClickAway={saveNewTopicHandler}>
                <div className={`${DEFAULT_CLASSNAME}_topics_list-item`}>
                  <input
                    maxLength={16}
                    autoFocus={true}
                    onChange={(e) => setNewTopicName(e.currentTarget.value)}
                    value={newTopicName}
                    placeholder={'Новая тема'}
                  />
                  <div
                    onClick={saveNewTopicHandler}
                    className={`${DEFAULT_CLASSNAME}_topics_list-item_edit`}>
                    <CheckIcon />
                  </div>
                </div>
              </ClickAwayListener>
            )}
            <div className={`${DEFAULT_CLASSNAME}_topics_add`} onClick={() => setAddNewTopic(true)}>
              {' '}
              <AddIcon />
            </div>
            {/*<button*/}
            {/*  className={`${DEFAULT_CLASSNAME}_calendar-btn`}*/}
            {/*  onClick={() => setCalendarOpened(true)}>*/}
            {/*  <CalendarIcon />*/}
            {/*</button>*/}
          </div>
        )}
      </div>
      <div className={`${DEFAULT_CLASSNAME}_tasks`}>
        {activeTopic &&
          !isTaskListLoading &&
          Array.isArray(taskList) &&
          taskList.map((test) => (
            <TestCard
              key={test.list_uuid}
              onClick={() =>
                setIsCreatingNewTest({
                  list_uuid: test.list_uuid,
                  list_name: test.list_name,
                  editable: test.editable,
                })
              }
              id={test.list_uuid}
              name={test.list_name}
              subject={activeCourseName}
              topic={activeTopicName}
              tasks={test.task_count}
              setTestToShare={setTestToShare}
            />
          ))}
        {isTaskListCreating && (
          <TestCardCreate
            setIsTaskListCreating={setIsTaskListCreating}
            activeTopic={activeTopic!}
            subject={activeCourseName}
            topic={activeTopicName}
          />
        )}
        {!!topics?.length && topics.some((item) => item.topic_uuid === activeTopic) && (
          <button
            onClick={() => setIsTaskListCreating(true)}
            className={`${DEFAULT_CLASSNAME}_tasks_add`}>
            <AddIcon />
          </button>
        )}
      </div>

      <Tooltip placement={'top'} title="Удалить">
        <div
          ref={drop}
          className={`${DEFAULT_CLASSNAME}_delete ${isOver && 'courses-delete-drop'}`}>
          <TrashIcon />
        </div>
      </Tooltip>
    </div>
  );
});

export default Courses;
