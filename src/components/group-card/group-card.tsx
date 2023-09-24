import {Dispatch, FC, SetStateAction, useState} from 'react';

import './group-card.scss';

import LinkIcon from 'assets/icons/link-icon.svg';
import RefreshIcon from 'assets/icons/refresh-icon.svg';
import EditIcon from "assets/icons/edit-icon.svg";
import CheckIcon from "assets/icons/check-icon.svg";
import TrashIcon from "assets/icons/trash-icon.svg";
import { Group } from "types/group.ts";
import { useDrop } from "react-dnd";
import {DraggableTypes} from "../../types/draggable/draggable.types.ts";
import {Student} from "../../types/student.ts";

const DEFAULT_CLASSNAME = 'group-card';

export interface GroupCardProps {
  id?: string;
  active?: boolean;
  editMode?: boolean
  name?: string;
  amount?: number;
  url?: string;
  iconUrl?: File;
  setGroups?: Dispatch<SetStateAction<Group[]>>;
  groups?: Group[];
  isNewGroupCreating?: boolean;
  setIsNewGroupCreating?: Dispatch<SetStateAction<boolean>>;
  hideControls?: boolean;
  setSelectedGroup?: Dispatch<SetStateAction<Group | null>>;
  group?: Group;

  selectedShareGroups?: string[];
  setSelectedShareGroups?: Dispatch<SetStateAction<string[]>>;
}

export const GroupCard: FC<GroupCardProps> = props => {
  const { selectedShareGroups, setSelectedShareGroups, id, active = false, group, setSelectedGroup, hideControls, setIsNewGroupCreating, groups, setGroups, editMode = false, name = "Альфа Группа", amount = 32, url = "https/реф.ссылка.ru", iconUrl } = props;

  const [newGroupName, setNewGroupName] = useState(name ?? "");
  const [newGroupImage, setNewGroupImage] = useState<File | null>(null);

  const [isEditMode, setIsEditMode] = useState(editMode ?? false);

  const saveNewGroupHandler = () => {
    setIsEditMode(false);

    setGroups!([{
      id: Date.now().toString(),
      name: newGroupName,
      amount: 0,
      referralLink: 'https/реф.ссылка.ru',
      iconUrl: newGroupImage!,
    }, ...groups!]);

    setIsNewGroupCreating!(false);
  }

  const deleteGroupHandler = () => {
    //
  }

  const handleStudentCardDrop = (id: string, groupId: string) => {
    if (groups) {
      const targetStudent = groups.find(item => item.id === groupId)?.students?.find(student => student.id === id);
      const groupsWithNewStudent = groups.find(item => item.id === group!.id)?.students?.push(targetStudent!);

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      setGroups!(groupsWithNewStudent);
    }
  }

  const [{ isOver }, drop] = useDrop(() => ({
    accept: DraggableTypes.STUDENT_CARD,
    drop: (item: Student) => handleStudentCardDrop(item.id, item.groupId),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    })
  }))

  const onGroupCartClickHandler = () => {
    if (hideControls) {
      setSelectedShareGroups!([id!, ...selectedShareGroups!])
    } else {
      group && setSelectedGroup!(group)
    }
  }

  return (
    <div ref={drop} className={`${DEFAULT_CLASSNAME} ${active && `active-${DEFAULT_CLASSNAME}`} ${isOver} && group-card-drop`} onClick={onGroupCartClickHandler}>
      <div className={`${DEFAULT_CLASSNAME}_icon`}>
        {isEditMode && <input onChange={(e) => setNewGroupImage(e.target.files![0])} type={"file"} className={`${DEFAULT_CLASSNAME}_icon-edit`} />}
        {isEditMode && newGroupImage && <img src={URL.createObjectURL(newGroupImage)} alt={'Group Icon'} />}
        {iconUrl && <img src={URL.createObjectURL(iconUrl)} alt={'Group Icon'} />}
        {!iconUrl && !newGroupImage && (newGroupName[0] ?? name[0])}
      </div>
      <div className={`${DEFAULT_CLASSNAME}_text`}>
        <input onChange={(e) => setNewGroupName(e.currentTarget.value)} disabled={!isEditMode} className={`${DEFAULT_CLASSNAME}_text-name`} value={isEditMode ? newGroupName : name} />
        {!isEditMode && <div className={`${DEFAULT_CLASSNAME}_text-amount`}>{amount} участника</div>}
        {!hideControls && <div className={`${DEFAULT_CLASSNAME}_buttons`}>
          {!isEditMode && <div className={`${DEFAULT_CLASSNAME}_buttons-edit`}>
            <button onClick={() => setIsEditMode(true)}><EditIcon /></button>
          </div>}
          {!isEditMode && <div className={`${DEFAULT_CLASSNAME}_buttons-referral`}>
            <LinkIcon />
            <div className={`${DEFAULT_CLASSNAME}_buttons-referral-link`}>{url}</div>
          </div>}
          <div className={`${DEFAULT_CLASSNAME}_buttons-refresh`}>
            {isEditMode && <button onClick={() => saveNewGroupHandler()} className={`${DEFAULT_CLASSNAME}_buttons_save-new-group`}><CheckIcon /> </button>}
            {isEditMode && <button onClick={() => deleteGroupHandler()} className={`${DEFAULT_CLASSNAME}_buttons_delete-group`}><TrashIcon /> </button>}
            {!isEditMode && <button><RefreshIcon /></button>}
          </div>
        </div>}
      </div>
    </div>
  )
};
