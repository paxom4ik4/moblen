import { FC, memo, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import './groups.scss';
import { GroupCard } from 'components/group-card/group-card.tsx';
import { StudentCard } from 'components/student-card/student-card.tsx';
import TrashIcon from 'assets/icons/trash-icon.svg';
import AddIcon from 'assets/icons/add-icon.svg';
import { Group } from 'types/group.ts';
import { Typography } from 'common/typography/typography.tsx';
import { RootState } from 'store/store.ts';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { getTutorGroups } from 'services/tutor';
import { getGroup } from 'services/groups';
import { Student } from 'types/student.ts';
import { useDrop } from 'react-dnd';
import { DraggableTypes } from 'types/draggable/draggable.types.ts';
import { deleteFromGroup } from 'services/student/student.ts';
import { Tooltip } from '@mui/material';
import { clearSelectedStudent } from 'store/results/results.slice.ts';
import Tests from '../../student/tests/tests.tsx';

const DEFAULT_CLASSNAME = 'groups';

interface GroupsProps {
  viewMode?: boolean;
}

const Groups: FC<GroupsProps> = memo((props) => {
  const { viewMode = false } = props;

  const queryClient = useQueryClient();

  const { selectedStudent } = useSelector((state: RootState) => state.results);

  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(clearSelectedStudent());
    };
  }, [dispatch]);

  const { userData } = useSelector((state: RootState) => state.userData);
  const [isNewGroupCreating, setIsNewGroupCreating] = useState(false);

  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

  const { data: groups, isLoading } = useQuery('groups', () => getTutorGroups(userData!.uuid));

  const { data: selectedGroupData, isLoading: isGroupLoading } = useQuery(
    ['groupData', selectedGroup],
    () => getGroup(selectedGroup?.group_uuid ?? null),
  );

  const deleteStudentMutation = useMutation(
    (data: { studentId: string; groupId: string }) => deleteFromGroup(data),
    {
      onSuccess: () => queryClient.invalidateQueries(),
    },
  );

  const handleDeleteStudent = async (id: string, groupId: string) => {
    try {
      deleteStudentMutation.mutate({ studentId: id, groupId: groupId });
    } catch (error) {
      console.log('Error deleting student from group');
    }
  };

  const [{ isOver }, drop] = useDrop(() => ({
    accept: DraggableTypes.STUDENT_CARD,
    drop: (item: { id: string; groupId: string }) => handleDeleteStudent(item.id, item.groupId),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  useEffect(() => {
    if (groups?.length && !selectedGroup) {
      setSelectedGroup(groups[0]);
    }
  }, [groups]);

  const createNewGroupHandler = () => setIsNewGroupCreating(true);

  if (isLoading) {
    return (
      <div className={DEFAULT_CLASSNAME}>
        <Typography>Загрузка...</Typography>
      </div>
    );
  }

  return (
    <div className={`${DEFAULT_CLASSNAME}_wrapper ${!!selectedStudent && 'results_view'}`}>
      <div className={DEFAULT_CLASSNAME}>
        <div className={`${DEFAULT_CLASSNAME}_list`}>
          {groups?.map((group) => (
            <GroupCard
              hideControls={viewMode}
              hideIcon={viewMode && !!selectedStudent}
              key={group.group_uuid}
              onClick={() => setSelectedGroup(group)}
              id={group.group_uuid}
              active={selectedGroup === group}
              name={group.group_name}
              amount={group.students?.length}
              iconUrl={group.iconUrl}
              url={group.url}
            />
          ))}

          {isNewGroupCreating && (
            <GroupCard
              name={'Новая группа'}
              editMode={true}
              setIsNewGroupCreating={setIsNewGroupCreating}
              isNewGroupCreating={isNewGroupCreating}
            />
          )}
          {!viewMode && (
            <Tooltip title="Создать новую группу">
              <div
                className={`${DEFAULT_CLASSNAME}_list-add`}
                onClick={() => createNewGroupHandler()}>
                <AddIcon />
              </div>
            </Tooltip>
          )}
        </div>
        <div className={`${DEFAULT_CLASSNAME}_students`}>
          {selectedGroup && isGroupLoading && <Typography>Загрузка...</Typography>}

          {groups?.length == 0 ? (
            <Typography>
              <div style={{ marginTop: '50%', marginLeft: '50%', width: '250px' }}>
                У вас нет преподавателей/групп
              </div>
            </Typography>
          ) : (
            <></>
          )}

          {selectedGroup && !isGroupLoading && !selectedGroupData?.students?.length && (
            <Typography color={'purple'}>В данной группе нет студентов</Typography>
          )}

          {selectedGroup &&
            selectedGroupData &&
            selectedGroupData?.students?.map((student: Student) => (
              <StudentCard
                active={student.student_uuid === selectedStudent}
                resultsViewMode={viewMode}
                groupId={selectedGroup.group_uuid}
                id={student.student_uuid}
                key={student.student_uuid}
                name={student.student_name}
                surname={student.student_surname}
              />
            ))}
          {!viewMode && (
            <Tooltip title="Удалить">
              <div
                className={`${DEFAULT_CLASSNAME}_trash ${
                  isOver && `${DEFAULT_CLASSNAME}_trash_drop`
                }`}
                ref={drop}>
                <TrashIcon />
              </div>
            </Tooltip>
          )}
        </div>
      </div>
      {!!selectedStudent && (
        <div className={`${DEFAULT_CLASSNAME}_tests`}>
          <Tests selectedStudent={selectedStudent} studentId={selectedStudent} resultsView />
        </div>
      )}
    </div>
  );
});

export default Groups;
