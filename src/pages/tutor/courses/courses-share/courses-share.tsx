import { Dispatch, FC, SetStateAction, useState } from 'react';

import CancelIcon from 'assets/icons/cancel-icon.svg';
import CheckIcon from 'assets/icons/check-icon.svg';
import { mockedGroups } from 'constants/mockedGroups.ts';
import { GroupCard } from 'components/group-card/group-card.tsx';
import { Typography } from 'common/typography/typography.tsx';
import { TitledCheckbox } from 'common/titled-checkbox/titled-checkbox.tsx';

import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { MenuItem, Select, SelectChangeEvent } from '@mui/material';

import './courses-share.scss';

const DEFAULT_CLASSNAME = 'courses-share';

interface CoursesShareProps {
  setTestToShare: Dispatch<SetStateAction<string | null>>;
}

export const CoursesShare: FC<CoursesShareProps> = (props) => {
  const { setTestToShare } = props;

  const [deadline, setDeadline] = useState(false);
  const [timeLimit, setTimeLimit] = useState(false);
  const [mark, setMark] = useState(false);
  const [retry, setRetry] = useState(false);
  const [answers, setAnswers] = useState(false);

  const [timeLimitValue, setTimeLimitValue] = useState('0');
  const [assessmentMethod, setAssessmentMethod] = useState('Оценивание по ФГОС');
  const [criteriaView, setCriteriaView] = useState('Просмотр учеником');

  const [selectedShareGroups, setSelectedShareGroups] = useState<string[]>([]);

  const handleAssessmentMethod = (event: SelectChangeEvent) => {
    setAssessmentMethod(event.target.value as string);
  };

  const handleCriteriaView = (event: SelectChangeEvent) => {
    setCriteriaView(event.target.value as string);
  };

  return (
    <div className={`${DEFAULT_CLASSNAME}_share`}>
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
          {mockedGroups.map((group) => (
            <GroupCard
              active={selectedShareGroups.includes(group.id)}
              selectedShareGroups={selectedShareGroups}
              setSelectedShareGroups={setSelectedShareGroups}
              key={group.id}
              id={group.id}
              name={group.name}
              amount={group.amount}
              hideControls
            />
          ))}
        </div>
        <div className={`${DEFAULT_CLASSNAME}_share_content_config`}>
          <div className={`${DEFAULT_CLASSNAME}_share_content_config_task`}>
            <Typography>{'Англ - Третья тема'}</Typography>
            <Typography color={'purple'} size={'large'}>
              {'ДЗ №17'}
            </Typography>
            <Typography color={'gray'} size={'small'}>
              {'Заданий - 11'}
            </Typography>
          </div>
          <div className={`${DEFAULT_CLASSNAME}_share_content_config_dateTime`}>
            <div className={`${DEFAULT_CLASSNAME}_share_content_config_dateTime_time`}>
              <TitledCheckbox
                name={'deadline'}
                checked={deadline}
                onChange={() => setDeadline(!deadline)}>
                Дедлайн
              </TitledCheckbox>
              {deadline && (
                <div className={`${DEFAULT_CLASSNAME}_share_content_config_deadline`}>
                  <DatePicker />
                  <TimePicker />
                </div>
              )}
              <TitledCheckbox name={'mark'} checked={mark} onChange={() => setMark(!mark)}>
                Оценка
              </TitledCheckbox>
              <TitledCheckbox
                name={'timeLimit'}
                checked={timeLimit}
                onChange={() => setTimeLimit(!timeLimit)}>
                Ограничение по времени
              </TitledCheckbox>
              {timeLimit && (
                <div className={`${DEFAULT_CLASSNAME}_share_content_config_timeDeadline`}>
                  <Typography>Ограничение по времени (мин.)</Typography>
                  <input
                    type={'text'}
                    value={timeLimitValue}
                    onChange={(e) => setTimeLimitValue(e.currentTarget.value)}
                  />
                </div>
              )}
              <TitledCheckbox name={'retry'} checked={retry} onChange={() => setRetry(!retry)}>
                Можно перепройти
              </TitledCheckbox>
              <TitledCheckbox
                name={'answers'}
                checked={answers}
                onChange={() => setAnswers(!answers)}>
                Смотр. ответы после сдачи
              </TitledCheckbox>

              <div className={`${DEFAULT_CLASSNAME}_share_select_container`}>
                <Select
                  labelId="assessmentMethod"
                  id="assessmentMethod"
                  value={assessmentMethod}
                  onChange={handleAssessmentMethod}>
                  <MenuItem value={'Оценивание по ФГОС'}>Оценивание по ФГОС</MenuItem>
                </Select>

                <Select
                  labelId="criteriaView"
                  id="criteriaView"
                  value={criteriaView}
                  onChange={handleCriteriaView}>
                  <MenuItem value={'Просмотр учеником'}>Просмотр учеником</MenuItem>
                </Select>
              </div>
            </div>
          </div>
          <div className={`${DEFAULT_CLASSNAME}_share_content_config_confirm`}>
            <Typography>Отправить задание</Typography> <CheckIcon />
          </div>
        </div>
      </div>
    </div>
  );
};
