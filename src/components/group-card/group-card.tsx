import { Dispatch, FC, SetStateAction, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';

import LinkIcon from 'assets/icons/link-icon.svg';
import RefreshIcon from 'assets/icons/refresh-icon.svg';
import EditIcon from 'assets/icons/edit-icon.svg';
import CheckIcon from 'assets/icons/check-icon.svg';
import TrashIcon from 'assets/icons/trash-icon.svg';
import { useDrop } from 'react-dnd';
import { DraggableTypes } from 'types/draggable/draggable.types.ts';
import { useSelector } from 'react-redux';
import { RootState } from 'store/store.ts';

import './group-card.scss';

import { createTutorGroup } from 'services/tutor';
import { addNewStudent, deleteGroup, editGroupName, refreshGroupLink } from 'services/groups';
import { deleteFromGroup } from 'services/student/student.ts';
import { Notification } from 'common/notification/notification.tsx';
import { Typography } from 'common/typography/typography.tsx';

const DEFAULT_CLASSNAME = 'group-card';

export interface GroupCardProps {
  id?: string;
  name?: string;
  amount?: number;
  url?: string;
  iconUrl?: File;

  active?: boolean;
  editMode?: boolean;

  isNewGroupCreating?: boolean;
  setIsNewGroupCreating?: Dispatch<SetStateAction<boolean>>;

  hideControls?: boolean;
  hideIcon?: boolean;

  selectedShareGroups?: string[];
  setSelectedShareGroups?: Dispatch<SetStateAction<string[]>>;

  onClick?: () => void;
}

const QUERY_KEY = 'groups';

export const GroupCard: FC<GroupCardProps> = (props) => {
  const {
    selectedShareGroups,
    setSelectedShareGroups,
    id,
    active = false,
    hideControls = false,
    hideIcon = false,
    setIsNewGroupCreating,
    editMode = false,
    name = '',
    amount = 0,
    url = '',
    iconUrl,
    isNewGroupCreating,

    onClick,
  } = props;

  const queryClient = useQueryClient();

  const { userData } = useSelector((state: RootState) => state.userData);

  const [newGroupName, setNewGroupName] = useState(name);
  const [newGroupImage, setNewGroupImage] = useState<File | null>(null);

  const [isEditMode, setIsEditMode] = useState(editMode ?? false);

  const [copiedToClipboard, setCopiedTopClipboard] = useState(false);

  const createGroupMutation = useMutation({
    mutationFn: createTutorGroup,
    onSuccess: () => queryClient.invalidateQueries(QUERY_KEY),
  });

  const deleteGroupMutation = useMutation({
    mutationFn: deleteGroup,
    onSuccess: () => queryClient.invalidateQueries(QUERY_KEY),
  });

  const editGroupNameMutation = useMutation({
    mutationFn: editGroupName,
    onSuccess: () => queryClient.invalidateQueries(QUERY_KEY),
  });

  const saveGroupHandler = () => {
    if (isNewGroupCreating && setIsNewGroupCreating) {
      setIsNewGroupCreating(false);
      setIsEditMode(false);

      createGroupMutation.mutate({ groupName: newGroupName, tutorId: userData!.uuid });
    } else {
      if (id && newGroupName.length) {
        editGroupNameMutation.mutate({ groupId: id!, groupName: newGroupName });
        setIsEditMode(false);
      }
    }
  };

  const deleteGroupHandler = () => {
    setIsEditMode(false);
    deleteGroupMutation.mutate(id!);
  };

  const deleteStudentFromGroupMutation = useMutation(
    (data: { studentId: string; groupId: string }) => deleteFromGroup(data),
    {
      onSuccess: () => queryClient.invalidateQueries('groupData'),
    },
  );
  const addToGroupMutation = useMutation(
    (data: { studentId: string; groupId: string }) => addNewStudent(data),
    {
      onSuccess: () => queryClient.invalidateQueries('groups'),
    },
  );

  const refreshGroupLinkMutation = useMutation((groupId: string) => refreshGroupLink(groupId), {
    onSuccess: () => queryClient.invalidateQueries('groups'),
  });

  const handleStudentCardDrop = async (studentId: string, groupId: string) => {
    await deleteStudentFromGroupMutation.mutate({ studentId, groupId });
    await addToGroupMutation.mutate({ groupId: id!, studentId });
  };

  const handlerRefreshRefLink = async () => await refreshGroupLinkMutation.mutate(id!);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: DraggableTypes.STUDENT_CARD,
    drop: (item: { groupId: string; id: string }) => handleStudentCardDrop(item.id, item.groupId),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  const onGroupCartClickHandler = () => {
    if (hideControls) {
      if (selectedShareGroups?.includes(id!)) {
        setSelectedShareGroups!(selectedShareGroups.filter((item) => item !== id));
      }

      if (!selectedShareGroups?.includes(id!)) {
        setSelectedShareGroups!([id!, ...selectedShareGroups!]);
      }
    }
  };

  return (
    <div
      ref={drop}
      className={`${DEFAULT_CLASSNAME} ${active && `active-${DEFAULT_CLASSNAME}`} ${
        isOver && 'group-card-drop'
      } ${isNewGroupCreating && `${DEFAULT_CLASSNAME}_creating_new`}`}
      onClick={onClick ?? onGroupCartClickHandler}>
      {!hideIcon && (
        <div className={`${DEFAULT_CLASSNAME}_icon`}>
          {isEditMode && (
            <input
              disabled={true}
              placeholder={'Название группы'}
              onChange={(e) => setNewGroupImage(e.target.files![0])}
              type={'file'}
              className={`${DEFAULT_CLASSNAME}_icon-edit`}
            />
          )}
          {isEditMode && newGroupImage && (
            <img src={URL.createObjectURL(newGroupImage)} alt={'Group Icon'} />
          )}
          {iconUrl && <img src={URL.createObjectURL(iconUrl)} alt={'Group Icon'} />}
          {!iconUrl && !newGroupImage && (newGroupName[0] ?? name[0])}
        </div>
      )}
      <div className={`${DEFAULT_CLASSNAME}_text`}>
        {isEditMode && (
          <input
            maxLength={24}
            onChange={(e) => setNewGroupName(e.currentTarget.value)}
            className={`${DEFAULT_CLASSNAME}_text-name`}
            autoFocus={true}
            value={newGroupName}
          />
        )}
        {!isEditMode && (
          <Typography className={`${DEFAULT_CLASSNAME}_text-name`} size={'default'}>
            {name}
          </Typography>
        )}
        {!isEditMode && (
          <Typography size={'small'}>
            {amount === 0 ? 'Нет участников' : `Участников: ${amount}`}
          </Typography>
        )}
        {!hideControls && (
          <div className={`${DEFAULT_CLASSNAME}_buttons`}>
            {!isEditMode && (
              <div className={`${DEFAULT_CLASSNAME}_buttons-edit`}>
                <button onClick={() => setIsEditMode(true)}>
                  <EditIcon />
                </button>
              </div>
            )}
            {!isEditMode && (
              <div
                className={`${DEFAULT_CLASSNAME}_buttons-referral`}
                onClick={() => {
                  setCopiedTopClipboard(true);
                  navigator.clipboard.writeText(url);
                }}>
                <LinkIcon />
                <Notification
                  anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                  autoHideDuration={3000}
                  message={'Реферальная ссылка скопирована'}
                  open={copiedToClipboard}
                  onClose={() => setCopiedTopClipboard(!copiedToClipboard)}
                />
                <div className={`${DEFAULT_CLASSNAME}_buttons-referral-link`}>{url}</div>
              </div>
            )}
            <div className={`${DEFAULT_CLASSNAME}_buttons-refresh`}>
              {isEditMode && (
                <button
                  onClick={() => saveGroupHandler()}
                  className={`${DEFAULT_CLASSNAME}_buttons_save-new-group`}>
                  <CheckIcon />{' '}
                </button>
              )}
              {isEditMode && !isNewGroupCreating && (
                <button
                  onClick={() => deleteGroupHandler()}
                  className={`${DEFAULT_CLASSNAME}_buttons_delete-group`}>
                  <TrashIcon />{' '}
                </button>
              )}
              {!isEditMode && (
                <button onClick={handlerRefreshRefLink}>
                  <RefreshIcon />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
