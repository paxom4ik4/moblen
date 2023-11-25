import { FC, memo, useEffect, useState } from 'react';

import TutorIcon from 'assets/icons/tutor-icon.svg';
import { Typography } from 'common/typography/typography.tsx';
import { StudentTestCard } from 'components/student-test-card/student-test-card.tsx';

import './tests.scss';
import { useQuery } from 'react-query';
import { getStudentInfo, getStudentTaskLists } from 'services/student/student.ts';
import { batch, useDispatch, useSelector } from 'react-redux';
import { Tutor } from 'types/tutor.ts';
import { RootState } from 'store/store.ts';
import { setActiveCourse, setActiveTopic, setActiveTutor } from 'store/student/student.slice.ts';
import { TaskList } from 'types/task.ts';
import { Notification } from 'common/notification/notification.tsx';
import { CircularProgress } from '@mui/material';

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

  const { resultsView = false, selectedStudent } = props;

  const { userData } = useSelector((state: RootState) => state.userData);

  const {
    data: studentData,
    isLoading: isStudentDataLoading,
    isLoadingError,
  } = useQuery(['studentData'], () =>
    getStudentInfo(resultsView ? selectedStudent! : userData?.uuid ?? ''),
  );

  const {
    data: studentTaskLists,
    isLoading: isDataLoading,
    isLoadingError: isTaskListLoadingError,
  } = useQuery(
    ['taskLists', activeTutor, selectedStudent],
    () =>
      getStudentTaskLists({
        student_uuid: resultsView ? selectedStudent! : userData?.uuid ?? '',
        tutor_uuid: resultsView ? userData?.uuid ?? '' : activeTutor,
      }),
    { refetchInterval: 5000 },
  );

  const [topics, setTopics] = useState<{ topic_uuid: string; topic_name: string }[]>([]);
  const [taskLists, setTaskLists] = useState([]);

  useEffect(() => {
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
    }
  }, [activeTopic]);

  useEffect(() => {
    if (studentData?.tutors?.length && !activeTutor) {
      dispatch(setActiveTutor(studentData.tutors[0].tutor_uuid));
    }
  }, [studentData]);

  const [testPassed, setTestPassed] = useState(false);

  if (isStudentDataLoading || isDataLoading) {
    return <CircularProgress sx={{ color: '#c8caff' }} />;
  }

  if (isLoadingError || isTaskListLoadingError) {
    return <Typography>Произошла ошибка во время загруки... Попробуйте позже</Typography>;
  }

  if (!studentData?.tutors?.length) {
    return (
      <Typography color={'purple'} size={'large'}>
        У вас нет преподавателей / групп
      </Typography>
    );
  }

  const showTasks = activeCourse && activeTopic && !!taskLists?.length;

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
          {!!studentData?.tutors &&
            studentData.tutors.map((tutor: Tutor) => (
              <div
                key={tutor.tutor_uuid}
                onClick={() => dispatch(setActiveTutor(tutor.tutor_uuid))}
                className={`${DEFAULT_CLASSNAME}_tutors_item ${
                  activeTutor === tutor.tutor_uuid ? 'active-tutor-item' : ''
                }`}>
                <div className={`${DEFAULT_CLASSNAME}_tutors_item_image`}>
                  {tutor?.tutor_photo ? (
                    <img
                      color={`${DEFAULT_CLASSNAME}_tutors_item_image_img`}
                      alt={'tutor-profile'}
                      src={tutor.tutor_photo}
                    />
                  ) : (
                    <TutorIcon />
                  )}
                </div>
                <Typography
                  size={'small'}
                  color={'gray'}
                  className={`${DEFAULT_CLASSNAME}_tutors_item_name`}>
                  {tutor.tutor_name}
                </Typography>
              </div>
            ))}
        </div>
      )}
      <div className={DEFAULT_CLASSNAME}>
        {activeTutor && (
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
        )}
      </div>
    </>
  );
});

export default Tests;
