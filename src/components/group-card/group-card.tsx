import { Dispatch, FC, SetStateAction, useState } from 'react';
import { useMutation, useQueryClient } from "react-query";

import LinkIcon from 'assets/icons/link-icon.svg';
import RefreshIcon from 'assets/icons/refresh-icon.svg';
import EditIcon from "assets/icons/edit-icon.svg";
import CheckIcon from "assets/icons/check-icon.svg";
import TrashIcon from "assets/icons/trash-icon.svg";
import { useDrop } from "react-dnd";
import { DraggableTypes } from "types/draggable/draggable.types.ts";
import { useSelector } from "react-redux";
import { RootState } from "store/store.ts";

import './group-card.scss';

import { createTutorGroup } from "services/tutor";
import { addNewStudent, deleteGroup } from "services/groups";
import { deleteFromGroup } from "../../services/student/student.ts";

const DEFAULT_CLASSNAME = 'group-card';

export interface GroupCardProps {
  id?: string;
  name?: string;
  amount?: number;
  url?: string;
  iconUrl?: File;

  active?: boolean;
  editMode?: boolean

  isNewGroupCreating?: boolean;
  setIsNewGroupCreating?: Dispatch<SetStateAction<boolean>>;

  hideControls?: boolean;

  selectedShareGroups?: string[];
  setSelectedShareGroups?: Dispatch<SetStateAction<string[]>>;

  onClick?: () => void;
}

export const GroupCard: FC<GroupCardProps> = props => {
  const {
    selectedShareGroups,
    setSelectedShareGroups,
    id,
    active = false,
    hideControls = false,
    setIsNewGroupCreating,
    editMode = false,
    name = "",
    amount = 0,
    url = "",
    iconUrl,
    isNewGroupCreating,

    onClick,
  } = props;

  const queryClient = useQueryClient()

  const { userData } = useSelector((state: RootState) => state.userData);

  const [newGroupName, setNewGroupName] = useState(name);
  const [newGroupImage, setNewGroupImage] = useState<File | null>(null);

  const [isEditMode, setIsEditMode] = useState(editMode ?? false);

  const createGroupMutation = useMutation({
    mutationFn: createTutorGroup,
    onSuccess: () => queryClient.invalidateQueries('groups'),
  });

  const deleteGroupMutation = useMutation({
    mutationFn: deleteGroup,
    onSuccess: () => queryClient.invalidateQueries('groups'),
  })

  const saveGroupHandler = () => {
    if (isNewGroupCreating && setIsNewGroupCreating) {
      setIsNewGroupCreating(false);
      setIsEditMode(false);

      createGroupMutation.mutate({ groupName: newGroupName, tutorId: userData!.uuid });
    }
  }

  const deleteGroupHandler = () => {
    setIsEditMode(false);
    deleteGroupMutation.mutate(id!);
  };

  const deleteStudentFromGroupMutation = useMutation((data: { studentId: string, groupId: string }) => deleteFromGroup(data), {
    onSuccess: () => queryClient.invalidateQueries("groupData"),
  })
  const addToGroupMutation = useMutation((data: { studentId: string, groupId: string }) => addNewStudent(data), {
    onSuccess: () => queryClient.invalidateQueries("groups"),
  })

  const handleStudentCardDrop = async (studentId: string, groupId: string) => {
    await deleteStudentFromGroupMutation.mutate({ studentId, groupId })
    await addToGroupMutation.mutate({ groupId: id!, studentId});
  };

  const [{ isOver }, drop] = useDrop(() => ({
    accept: DraggableTypes.STUDENT_CARD,
    drop: (item: { groupId: string, id: string}) => handleStudentCardDrop(item.id, item.groupId),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    })
  }))

  const onGroupCartClickHandler = () => {
    if (hideControls) {
      setSelectedShareGroups!([id!, ...selectedShareGroups!])
    }
  }

  return (
    <div ref={drop} className={`${DEFAULT_CLASSNAME} ${active && `active-${DEFAULT_CLASSNAME}`} ${isOver} && group-card-drop`} onClick={onClick ?? onGroupCartClickHandler}>
      <div className={`${DEFAULT_CLASSNAME}_icon`}>
        {isEditMode && <input placeholder={"Название группы"} onChange={(e) => setNewGroupImage(e.target.files![0])} type={"file"} className={`${DEFAULT_CLASSNAME}_icon-edit`} />}
        {isEditMode && newGroupImage && <img src={URL.createObjectURL(newGroupImage)} alt={'Group Icon'} />}
        {iconUrl && <img src={URL.createObjectURL(iconUrl)} alt={'Group Icon'} />}
        {!iconUrl && !newGroupImage && (newGroupName[0] ?? name[0])}
      </div>
      <div className={`${DEFAULT_CLASSNAME}_text`}>
        <input onChange={(e) => setNewGroupName(e.currentTarget.value)} disabled={!isEditMode} className={`${DEFAULT_CLASSNAME}_text-name`} value={isEditMode ? newGroupName : name} />
        {!isEditMode && <div className={`${DEFAULT_CLASSNAME}_text-amount`}>{amount === 0 ? "Нет участников" : `Участников: ${amount}`}</div>}
        {!hideControls && <div className={`${DEFAULT_CLASSNAME}_buttons`}>
          {!isEditMode && <div className={`${DEFAULT_CLASSNAME}_buttons-edit`}>
            <button onClick={() => setIsEditMode(true)}><EditIcon /></button>
          </div>}
          {!isEditMode && <div className={`${DEFAULT_CLASSNAME}_buttons-referral`}>
            <LinkIcon />
            <div className={`${DEFAULT_CLASSNAME}_buttons-referral-link`}>{url}</div>
          </div>}
          <div className={`${DEFAULT_CLASSNAME}_buttons-refresh`}>
            {isEditMode && <button onClick={() => saveGroupHandler()} className={`${DEFAULT_CLASSNAME}_buttons_save-new-group`}><CheckIcon /> </button>}
            {isEditMode && !isNewGroupCreating && <button onClick={() => deleteGroupHandler()} className={`${DEFAULT_CLASSNAME}_buttons_delete-group`}><TrashIcon /> </button>}
            {!isEditMode && <button><RefreshIcon /></button>}
          </div>
        </div>}
      </div>
    </div>
  )
};
