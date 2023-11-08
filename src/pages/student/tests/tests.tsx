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

  const {
    data: studentTaskLists,
    isLoading: isDataLoading,
    isLoadingError: isTaskListLoadingError,
  } = useQuery(['taskLists', activeTutor], () =>
    getStudentTaskLists({ student_uuid: userData!.uuid!, tutor_uuid: activeTutor ?? null }),
  );

  const [topics, setTopics] = useState<{ topic_uuid: string; topic_name: string }[]>([]);
  const [taskLists, setTaskLists] = useState([]);

  useEffect(() => {
    batch(() => {
      dispatch(setActiveTopic(null));
      dispatch(setActiveCourse(null));
    });
  }, [activeTutor]);

  useEffect(() => {
    const currentTopics = studentTaskLists?.find(
      (item: { course_uuid: string }) => item.course_uuid === activeCourse?.id,
    )?.topics;

    setTopics(currentTopics);
    dispatch(setActiveTopic(null));
  }, [activeCourse]);

  useEffect(() => {
    const currentTopics = studentTaskLists?.find(
      (item: { course_uuid: string }) => item.course_uuid === activeCourse?.id,
    )?.topics;

    const currentTaskLists = currentTopics?.find(
      (item: { topic_uuid: string }) => item.topic_uuid === activeTopic?.id,
    )?.tasklists;

    setTaskLists(currentTaskLists ?? []);
  }, [activeTopic]);

  if (isStudentDataLoading || isDataLoading) {
    return <Typography>Загрузка...</Typography>;
  }

  if (isLoadingError || isTaskListLoadingError) {
    return <Typography>Произошла ошибка во время загруки... Попробуйте позже</Typography>;
  }

  if (!studentData.tutors.length) {
    return (
      <Typography color={'purple'} size={'large'}>
        У вас нет преподавателей / групп
      </Typography>
    );
  }

  const showTasks = activeCourse && activeTopic && !!taskLists?.length;

  return (
    <>
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
        {activeTutor && (
          <>
            <div className={`${DEFAULT_CLASSNAME}_subjects`}>
              <div className={`${DEFAULT_CLASSNAME}_subjects_list`}>
                {isDataLoading && <Typography>Загрузка...</Typography>}

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
                    key={test.list_uuid}
                    id={test.list_uuid}
                    name={test.list_name}
                    subject={activeCourse.name}
                    topic={activeTopic.name}
                    status={'pending'}
                    tasksAmount={test.task_count}
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
