import { FC, memo, useEffect, useState } from 'react';

import TutorIcon from 'assets/icons/tutor-icon.svg';
import { Typography } from 'common/typography/typography.tsx';
import { StudentTestCard } from 'components/student-test-card/student-test-card.tsx';

import './tests.scss';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { getStudentTaskLists } from 'services/student/student.ts';
import { batch, useDispatch, useSelector } from 'react-redux';
import { Tutor } from 'types/tutor.ts';
import { RootState } from 'store/store.ts';
import { setActiveCourse, setActiveTopic, setActiveTutor } from 'store/student/student.slice.ts';
import { TaskList } from 'types/task.ts';
import { Notification } from 'common/notification/notification.tsx';
import { CircularProgress } from '@mui/material';
import { getRelations } from 'services/relate/relate.ts';
import { useNavigate } from 'react-router-dom';
import { addNewStudent } from 'services/groups';
import { StudentRoutes } from 'constants/routes.ts';

const DEFAULT_CLASSNAME = 'tests';

interface TestsProps {
  resultsView?: boolean;
  studentId?: string;
  selectedStudent?: string;
}

const Tests: FC<TestsProps> = memo((props) => {
  const dispatch = useDispatch();
  const { activeTutor, activeTopic, activeCourse } = useSelector(
    (state: RootState) => state.student,
  );

  const queryClient = useQueryClient();

  const { resultsView = false, selectedStudent } = props;

  const {
    data: studentData,
    isLoading: isStudentDataLoading,
    isLoadingError,
  } = useQuery(['studentData'], () => getRelations());

  const {
    data: studentTaskLists,
    isLoading: isDataLoading,
    isLoadingError: isTaskListLoadingError,
  } = useQuery(
    ['taskLists', activeTutor, selectedStudent, studentData],
    () =>
      getStudentTaskLists({
        user_uuid: resultsView ? selectedStudent ?? '' : activeTutor,
      }),
    { refetchInterval: 5000 },
  );

  const [topics, setTopics] = useState<{ topic_uuid: string; topic_name: string }[]>([]);
  const [taskLists, setTaskLists] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      await queryClient.invalidateQueries('taskLists');
    })();
  }, [navigate]);

  useEffect(() => {
    if (!studentTaskLists?.length) {
      batch(() => {
        dispatch(setActiveCourse(null));
        dispatch(setActiveTopic(null));
      });
    }

    batch(() => {
      if (activeTutor && studentTaskLists?.length) {
        batch(() => {
          dispatch(
            setActiveCourse({
              id: studentTaskLists[0]?.course_uuid,
              name: studentTaskLists[0]?.course_name,
            }),
          );

          dispatch(
            setActiveTopic({
              id: studentTaskLists[0]?.topics[0]?.topic_uuid,
              name: studentTaskLists[0]?.topics[0]?.topic_name,
            }),
          );
        });
      }
    });
  }, [activeTutor, studentTaskLists]);

  useEffect(() => {
    if (studentTaskLists?.length) {
      const currentTopics = studentTaskLists?.find(
        (item: { course_uuid: string }) => item.course_uuid === activeCourse?.id,
      )?.topics;

      if (currentTopics?.length) {
        setTopics(currentTopics);

        dispatch(
          setActiveTopic({ id: currentTopics[0].topic_uuid, name: currentTopics[0].topic_name }),
        );
      }
    }
  }, [activeCourse, studentTaskLists]);

  useEffect(() => {
    if (studentTaskLists?.length) {
      const currentTopics = studentTaskLists?.find(
        (item: { course_uuid: string }) => item.course_uuid === activeCourse?.id,
      )?.topics;

      const currentTaskLists = currentTopics?.find(
        (item: { topic_uuid: string }) => item.topic_uuid === activeTopic?.id,
      )?.tasklists;

      setTaskLists(currentTaskLists ?? []);
    } else {
      setTaskLists([]);
    }
  }, [activeTopic]);

  useEffect(() => {
    if (studentData?.length && !activeTutor) {
      dispatch(setActiveTutor(studentData[0].user_uuid));
    }
  }, [studentData]);

  const joinGroupMutation = useMutation(
    (data: { studentId?: string; groupUrl: string }) => addNewStudent(data),
    {
      onSuccess: () => {
        navigate(StudentRoutes.ASSIGNMENTS);
      },
    },
  );

  useEffect(() => {
    if (location.href.includes('/joinGroup')) {
      joinGroupMutation.mutate({
        groupUrl: location.pathname,
      });
    }
  }, []);

  const [testPassed, setTestPassed] = useState(false);

  if (isStudentDataLoading || isDataLoading) {
    return <CircularProgress sx={{ color: '#c8caff' }} />;
  }

  if (isLoadingError || isTaskListLoadingError) {
    return <Typography>Произошла ошибка во время загруки... Попробуйте позже</Typography>;
  }

  if (!studentData?.length) {
    return (
      <Typography color={'purple'} size={'large'}>
        У вас нет преподавателей / групп
      </Typography>
    );
  }

  const showTasks = activeCourse && activeTopic && !!taskLists?.length;

  console.log('taskLists', taskLists);
  

  return (
    <>
      <Notification
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        autoHideDuration={3000}
        message={'Тест отправлен на проверку'}
        open={testPassed}
        onClose={() => setTestPassed(!testPassed)}
      />
      {!resultsView && (
        <div className={`${DEFAULT_CLASSNAME}_tutors`}>
          {!!studentData &&
            studentData.map((tutor: Tutor) => (
              <div
                key={tutor.user_uuid}
                onClick={() => dispatch(setActiveTutor(tutor.user_uuid))}
                className={`${DEFAULT_CLASSNAME}_tutors_item ${
                  activeTutor === tutor.user_uuid ? 'active-tutor-item' : ''
                }`}>
                <div className={`${DEFAULT_CLASSNAME}_tutors_item_image`}>
                  {tutor?.photo ? (
                    <img
                      color={`${DEFAULT_CLASSNAME}_tutors_item_image_img`}
                      alt={'tutor-profile'}
                      src={tutor.photo}
                    />
                  ) : (
                    <TutorIcon />
                  )}
                </div>
                <Typography
                  size={'small'}
                  color={'gray'}
                  className={`${DEFAULT_CLASSNAME}_tutors_item_name`}>
                  {tutor.first_name} {tutor.last_name}
                </Typography>
              </div>
            ))}
        </div>
      )}
      <div className={DEFAULT_CLASSNAME}>
        {activeTutor && studentTaskLists?.length ? (
          <>
            <div className={`${DEFAULT_CLASSNAME}_subjects`}>
              <div className={`${DEFAULT_CLASSNAME}_subjects_list`}>
                {isDataLoading && <CircularProgress sx={{ color: '#c8caff' }} />}

                {studentTaskLists?.map((course: { course_uuid: string; course_name: string }) => (
                  <div
                    key={course.course_uuid}
                    onClick={() =>
                      dispatch(
                        setActiveCourse({
                          id: course.course_uuid,
                          name: course.course_name,
                        }),
                      )
                    }
                    className={`${DEFAULT_CLASSNAME}_subjects_list-item ${
                      course.course_uuid === activeCourse?.id && 'active-subject'
                    }`}>
                    <Typography
                      className={`${
                        course.course_uuid === activeCourse?.id && 'active-subject-title'
                      }`}>
                      {course.course_name}
                    </Typography>
                  </div>
                ))}
              </div>
            </div>
            <div className={`${DEFAULT_CLASSNAME}_topics`}>
              <div className={`${DEFAULT_CLASSNAME}_topics_list`}>
                {activeCourse &&
                  topics?.length &&
                  topics.map((topic: { topic_uuid: string; topic_name: string }) => (
                    <div
                      key={topic.topic_uuid}
                      className={`${DEFAULT_CLASSNAME}_topics_list-item ${
                        topic.topic_uuid === activeTopic?.id && 'student-active-topic-item'
                      }`}
                      onClick={() =>
                        dispatch(
                          setActiveTopic({
                            id: topic.topic_uuid,
                            name: topic.topic_name,
                          }),
                        )
                      }>
                      <Typography
                        className={`${
                          topic.topic_uuid === activeTopic?.id && 'student-active-topic'
                        }`}>
                        {topic.topic_name}
                      </Typography>
                    </div>
                  ))}
              </div>
            </div>
            <div className={`${DEFAULT_CLASSNAME}_tasks`}>
              {showTasks &&
                taskLists.map((test: TaskList) => (
                  <StudentTestCard
                    selectedStudent={selectedStudent}
                    resultsView={resultsView}
                    key={test.list_uuid}
                    id={test.list_uuid}
                    name={test.list_name}
                    subject={activeCourse.name}
                    topic={activeTopic.name}
                    status={test?.status}
                    tasksAmount={test.task_count}
                    replay={test.replay}
                    deadline={test.deadline}
                    seeCriteria={test.see_criteria}
                    seeAnswers={test.see_answers}
                    sendDate={test.sent_data}
                  />
                ))}
            </div>
          </>
        ) : (
          <div className={`${DEFAULT_CLASSNAME}_empty`}>
            <Typography color={'purple'}>Нет заданий</Typography>
          </div>
        )}
      </div>
    </>
  );
});

export default Tests;
