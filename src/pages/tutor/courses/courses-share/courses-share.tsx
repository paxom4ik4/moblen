import { Dispatch, FC, SetStateAction, useState } from 'react';

import CancelIcon from 'assets/icons/cancel-icon.svg';
import CheckIcon from 'assets/icons/check-icon.svg';
import { GroupCard } from 'components/group-card/group-card.tsx';
import { Typography } from 'common/typography/typography.tsx';
import { TitledCheckbox } from 'common/titled-checkbox/titled-checkbox.tsx';

import { DateTimePicker } from '@mui/x-date-pickers';

import './courses-share.scss';
import { useSelector } from 'react-redux';
import { RootState } from 'store/store.ts';
import { useMutation, useQuery } from 'react-query';
import { Button } from 'common/button/button.tsx';
import { getTutorGroups } from 'services/tutor';
import dayjs from 'dayjs';
import { ShareDataType } from 'types/share.data.type.ts';
import { shareTaskList } from 'services/tasks';

import GroupsIcon from 'assets/icons/groups-icon.svg';
import { useNavigate } from 'react-router-dom';
import { TutorRoutes } from '../../../../constants/routes.ts';

const DEFAULT_CLASSNAME = 'courses-share';

interface CoursesShareProps {
  setTestToShare: Dispatch<
    SetStateAction<{
      list_uuid: string;
      topic: string;
      course: string;
      name: string;
      task_amount: number;
    } | null>
  >;
  testToShare: {
    list_uuid: string;
    topic: string;
    course: string;
    name: string;
    task_amount: number;
  };
  setTaskListShared: Dispatch<SetStateAction<boolean>>;
}

export const CoursesShare: FC<CoursesShareProps> = (props) => {
  const { userData } = useSelector((state: RootState) => state.userData);

  const { data: groups } = useQuery('groups', () => getTutorGroups(userData!.uuid));

  const { setTestToShare, testToShare, setTaskListShared } = props;

  const [withDeadline, setWithDeadline] = useState(false);
  const [withTimeLimit, setWithTimeLimit] = useState(false);

  const [timeLimit, setTimeLimit] = useState(0);
  const [deadline, setDeadline] = useState(() => dayjs(Date.now()));
  const [appreciable, setAppreciable] = useState(false);
  const [replay, setReplay] = useState(false);
  const [seeAnswers, setSeeAnswers] = useState(false);
  const [seeCriteria, setSeeCriteria] = useState(false);

  const [selectedShareGroups, setSelectedShareGroups] = useState<string[]>([]);

  const shareTaskListMutation = useMutation((data: ShareDataType) => shareTaskList(data), {
    onSuccess: () => setTestToShare(null),
  });

  const handleTaskListShare = async () => {
    await shareTaskListMutation.mutate({
      list_uuid: testToShare.list_uuid,
      groups: selectedShareGroups,
      see_answers: seeAnswers,
      see_criteria: seeCriteria,
      replay,
      appreciable,
      deadline: withDeadline ? dayjs(deadline).format('YYYY-MM-DDThh:mm:ss.SSSZ') : null,
      time_limit: withTimeLimit ? Number(timeLimit) : null,
    });

    setTaskListShared(true);
  };

  const navigate = useNavigate();

  const emptyGroups = (
    <div className={`${DEFAULT_CLASSNAME}_share_content_empty`}>
      <GroupsIcon />
      <div className={`${DEFAULT_CLASSNAME}_share_content_empty-text`}>
        У вас еще нет ни одной группы. Cоздайте их{' '}
        <span
          className={`${DEFAULT_CLASSNAME}_share_content_empty-text_link`}
          onClick={() => navigate(TutorRoutes.GROUPS)}>
          тут
        </span>{' '}
        чтобы поделиться заданиями с учениками
      </div>
    </div>
  );

  return (
    <div className={`${DEFAULT_CLASSNAME}_share ${!groups?.length && 'empty-share'}`}>
      <div className={`${DEFAULT_CLASSNAME}_share_title`}>
        <div className={`${DEFAULT_CLASSNAME}_share_title-name`}>{'Отправить задание'}</div>
        <div
          className={`${DEFAULT_CLASSNAME}_share_title-close`}
          onClick={() => setTestToShare(null)}>
          <CancelIcon />
        </div>
      </div>
      <div className={`${DEFAULT_CLASSNAME}_share_content`}>
        <div className={`${DEFAULT_CLASSNAME}_share_content_groups`}>
          {groups?.length
            ? groups!.map((group) => (
                <GroupCard
                  active={selectedShareGroups.includes(group.group_uuid)}
                  selectedShareGroups={selectedShareGroups}
                  setSelectedShareGroups={setSelectedShareGroups}
                  key={group.group_uuid}
                  id={group.group_uuid}
                  name={group.group_name}
                  amount={group.students?.length}
                  hideControls
                />
              ))
            : emptyGroups}
        </div>
        {!!groups?.length && (
          <div className={`${DEFAULT_CLASSNAME}_share_content_config`}>
            <div className={`${DEFAULT_CLASSNAME}_share_content_config_task`}>
              <Typography>{testToShare.course + ' - ' + testToShare.topic}</Typography>
              <Typography color={'purple'} size={'large'}>
                {testToShare.name}
              </Typography>
              <Typography color={'gray'} size={'small'}>
                {'Заданий - '} {testToShare.task_amount}
              </Typography>
            </div>
            <div className={`${DEFAULT_CLASSNAME}_share_content_config_dateTime`}>
              <div className={`${DEFAULT_CLASSNAME}_share_content_config_dateTime_time`}>
                <TitledCheckbox
                  name={'deadline'}
                  checked={withDeadline}
                  onChange={() => setWithDeadline(!withDeadline)}>
                  Дедлайн
                </TitledCheckbox>
                {withDeadline && (
                  <div className={`${DEFAULT_CLASSNAME}_share_content_config_deadline`}>
                    <DateTimePicker
                      label="Выберите дедлайн"
                      value={deadline}
                      onChange={(newValue) => setDeadline(newValue!)}
                    />
                  </div>
                )}
                <TitledCheckbox
                  name={'mark'}
                  checked={appreciable}
                  onChange={() => setAppreciable(!appreciable)}>
                  Оценка
                </TitledCheckbox>
                <TitledCheckbox
                  name={'timeLimit'}
                  checked={withTimeLimit}
                  onChange={() => setWithTimeLimit(!withTimeLimit)}>
                  Ограничение по времени
                </TitledCheckbox>
                {withTimeLimit && (
                  <div className={`${DEFAULT_CLASSNAME}_share_content_config_timeDeadline`}>
                    <Typography>Ограничение по времени (мин.)</Typography>
                    <input
                      type={'text'}
                      value={timeLimit}
                      onChange={(e) => setTimeLimit(+e.currentTarget.value)}
                    />
                  </div>
                )}
                <TitledCheckbox name={'retry'} checked={replay} onChange={() => setReplay(!replay)}>
                  Можно перепройти
                </TitledCheckbox>
                <TitledCheckbox
                  name={'answers'}
                  checked={seeAnswers}
                  onChange={() => setSeeAnswers(!seeAnswers)}>
                  Смотр. ответы после сдачи
                </TitledCheckbox>
                <TitledCheckbox
                  name={'criteria'}
                  checked={seeCriteria}
                  onChange={() => setSeeCriteria(!seeCriteria)}>
                  Просмотр критериев
                </TitledCheckbox>
              </div>
            </div>
            <Button
              className={'share-btn'}
              title={'Отправить задание'}
              icon={<CheckIcon />}
              disabled={!selectedShareGroups.length}
              onClick={handleTaskListShare}
            />
            <Typography
              size={'small'}
              color={'red'}
              className={`${DEFAULT_CLASSNAME}_share_infoText`}>
              После отправки редактирование теста станет невозможным!
            </Typography>
          </div>
        )}
      </div>
    </div>
  );
};
