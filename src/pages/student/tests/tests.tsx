import { FC, useEffect, memo } from 'react';

import TutorIcon from 'assets/icons/tutor-icon.svg';
import { Typography } from 'common/typography/typography.tsx';
import { StudentTestCard } from 'components/student-test-card/student-test-card.tsx';

import './tests.scss';
import { useQuery } from 'react-query';
import { getStudentInfo } from 'services/student/student.ts';
import { useDispatch, useSelector } from 'react-redux';
import { Tutor } from 'types/tutor.ts';
import { getTopics, getTutorsCourses } from 'services/courses';
import { RootState } from 'store/store.ts';
import { setActiveCourse, setActiveTopic, setActiveTutor } from 'store/student/student.slice.ts';
import { mockedTests } from 'utils/app.utils.ts';

const DEFAULT_CLASSNAME = 'tests';

interface TestsProps {
  resultsView?: boolean;
}

const Tests: FC<TestsProps> = memo((props) => {
  const dispatch = useDispatch();
  const { activeTutor, activeTopic, activeCourse } = useSelector(
    (state: RootState) => state.student,
  );

  const { resultsView = false } = props;

  const { userData } = useSelector((state: RootState) => state.userData);

  const {
    data: studentData,
    isLoading: isStudentDataLoading,
    isLoadingError,
  } = useQuery('studentData', () => getStudentInfo(userData!.uuid));

  const { data: courseData, isLoading: isCourseDataLoading } = useQuery(
    ['courses', activeTutor],
    () => getTutorsCourses(activeTutor ?? ''),
  );

  useEffect(() => {
    if (courseData?.length) {
      dispatch(setActiveCourse(courseData[0].course_uuid));
    }
  }, [courseData, dispatch]);

  const { data: topics, isLoading: isTopicsLoading } = useQuery(['topics', activeCourse], () =>
    getTopics(activeCourse ?? null),
  );

  if (isStudentDataLoading) {
    return <Typography>Загрузка...</Typography>;
  }

  if (isLoadingError) {
    return <Typography>Произошла ошибка во время загруки... Попробуйте позже</Typography>;
  }

  if (!studentData.tutors.length) {
    return (
      <Typography color={'purple'} size={'large'}>
        У вас нет преподавателей / групп
      </Typography>
    );
  }

  const showTasks = activeTutor && activeCourse && activeTopic;

  return (
    <>
      {!resultsView && (
        <div className={`${DEFAULT_CLASSNAME}_tutors`}>
          {!!studentData?.tutors &&
            studentData.tutors.map((tutor: Tutor) => (
              <div
                onClick={() => dispatch(setActiveTutor(tutor.tutor_uuid))}
                className={`${DEFAULT_CLASSNAME}_tutors_item ${
                  activeTutor === tutor.tutor_uuid ? 'active-tutor-item' : ''
                }`}>
                <div className={`${DEFAULT_CLASSNAME}_tutors_item_image`}>
                  <TutorIcon />
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
        {activeTutor ? (
          <>
            <div className={`${DEFAULT_CLASSNAME}_subjects`}>
              <div className={`${DEFAULT_CLASSNAME}_subjects_list`}>
                {isCourseDataLoading && <Typography>Загрузка...</Typography>}

                {courseData?.map((course) => (
                  <div
                    onClick={() => dispatch(setActiveCourse(course.course_uuid))}
                    className={`${DEFAULT_CLASSNAME}_subjects_list-item ${
                      course.course_uuid === activeCourse && 'active-subject'
                    }`}>
                    <Typography
                      className={`${
                        course.course_uuid === activeCourse && 'active-subject-title'
                      }`}>
                      {course.course_name}
                    </Typography>
                  </div>
                ))}
              </div>
            </div>
            <div className={`${DEFAULT_CLASSNAME}_topics`}>
              <div className={`${DEFAULT_CLASSNAME}_topics_list`}>
                {isTopicsLoading && <Typography>Загрузка...</Typography>}

                {activeCourse &&
                  topics?.map((topic) => (
                    <div
                      className={`${DEFAULT_CLASSNAME}_topics_list-item ${
                        topic.topic_uuid === activeTopic && 'student-active-topic-item'
                      }`}
                      onClick={() => dispatch(setActiveTopic(topic.topic_uuid))}>
                      <Typography
                        className={`${topic.topic_uuid === activeTopic && 'student-active-topic'}`}>
                        {topic.topic_name}
                      </Typography>
                    </div>
                  ))}
              </div>
            </div>
            <div className={`${DEFAULT_CLASSNAME}_tasks`}>
              {showTasks ? (
                mockedTests.map((test) => (
                  <StudentTestCard
                    id={test.id}
                    name={test.name}
                    subject={test.subject}
                    topic={test.topic}
                    status={test.status}
                    tasksAmount={test.tasks.length}
                  />
                ))
              ) : (
                <Typography color={'purple'}>Выберите курс и тему</Typography>
              )}
            </div>
          </>
        ) : (
          <Typography className={`${DEFAULT_CLASSNAME}_select_tutor`} color={'purple'}>
            Выберите преподавателя чтобы просмотреть задания
          </Typography>
        )}
      </div>
    </>
  );
});

export default Tests;
