import {Dispatch, FC, SetStateAction, useState} from 'react';

import './groups.scss';
import { GroupCard } from "components/group-card/group-card.tsx";
import { StudentCard } from "components/student-card/student-card.tsx";
import TrashIcon from 'assets/icons/trash-icon.svg';
import AddIcon from 'assets/icons/add-icon.svg';
import {Group} from "../../types/group.ts";
import {Typography} from "../../common/typography/typography.tsx";

const DEFAULT_CLASSNAME = 'groups';

export interface GroupsProps {
  setGroups?: Dispatch<SetStateAction<Group[]>>;
  groups?: Group[];
}

export const Groups: FC<GroupsProps> = props => {
  const { groups, setGroups } = props;

  const [isNewGroupCreating, setIsNewGroupCreating] = useState(false);

  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

  const createNewGroupHandler = () => {
    setIsNewGroupCreating(true);
  }

  return (
    <div className={DEFAULT_CLASSNAME}>
      <div className={`${DEFAULT_CLASSNAME}_list`}>
        {!groups?.length && <div>Создайте новую группу</div>}

        {groups?.map(group => <GroupCard groups={groups} active={selectedGroup === group} group={group} setSelectedGroup={setSelectedGroup} editMode={false} name={group.name} amount={group.amount} iconUrl={group.iconUrl} url={group.referralLink} />)}

        {isNewGroupCreating && <GroupCard setIsNewGroupCreating={setIsNewGroupCreating} groups={groups} isNewGroupCreating={isNewGroupCreating} setGroups={setGroups} editMode={true}/>}
        <div className={`${DEFAULT_CLASSNAME}_list-add`} onClick={() => createNewGroupHandler()}><AddIcon /></div>
      </div>
      <div className={`${DEFAULT_CLASSNAME}_students`}>
        {!selectedGroup && <div className={`${DEFAULT_CLASSNAME}_students_empty`}><Typography size={'large'} color={'purple'}>Выберите группу чтобы просмотреть учеников</Typography></div>}

        {selectedGroup && selectedGroup.students?.map(student => <StudentCard groupId={selectedGroup.id} id={student.id} key={student.id} name={student.name} surname={student.surname}/>)}
        <div className={`${DEFAULT_CLASSNAME}_trash`}><TrashIcon /></div>
      </div>
    </div>
  )
}
