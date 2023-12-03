import { Dispatch, FC, SetStateAction } from 'react';
import { Typography } from 'common/typography/typography.tsx';
import {
  ListSubheader,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Tooltip,
} from '@mui/material';
import EditButton from './drive_file_rename_outline.svg';

const DEFAULT_CLASSNAME = 'generate-config';

import './generate-configuration.scss';

type GenerateConfigurationProps = {
  isEditModeDisabled: boolean;
  generateTaskAmount: number;
  setGenerateTaskAmount: Dispatch<SetStateAction<number>>;
  generateBallPerTask: number;
  setGenerateBallPerTask: Dispatch<SetStateAction<number>>;
  generateTaskFormat: string;
  handleGenerateFormatChange: (event: SelectChangeEvent) => void;
  taskFormats: { subject: string; formats: string[] }[];
  generateText: string;
  handleTaskGeneration: () => void;
};

export const GenerateConfiguration: FC<GenerateConfigurationProps> = ({
  isEditModeDisabled,
  generateTaskAmount,
  setGenerateTaskAmount,
  generateBallPerTask,
  setGenerateBallPerTask,
  generateTaskFormat,
  handleGenerateFormatChange,
  taskFormats,
  generateText,
  handleTaskGeneration,
}) => {
  const renderFormatGroup = (group: { subject: string; formats: string[] }) => {
    const items = group.formats.map((format) => (
      <MenuItem key={format} value={`${group.subject},${format}`}>
        {format}
      </MenuItem>
    ));
    return [<ListSubheader>{group.subject}</ListSubheader>, items];
  };

  return (
    <div
      className={`${DEFAULT_CLASSNAME}_tasks-container_generate-configuration ${
        isEditModeDisabled && 'generate-disabled'
      }`}>
      <Typography
        className={`${DEFAULT_CLASSNAME}_tasks-container_generate-configuration_title`}
        size={'large'}>
        Генерация
      </Typography>

      <div className={`${DEFAULT_CLASSNAME}_tasks-container_generate-configuration_fields`}>
        <div className={`${DEFAULT_CLASSNAME}_tasks-container_generate-configuration_fields_item`}>
          <Typography size={'small'}>Количество заданий</Typography>
          <TextField
            placeholder={'Введите значение'}
            value={generateTaskAmount}
            onChange={(e) => setGenerateTaskAmount(+e.currentTarget.value)}
          />
        </div>
        <div className={`${DEFAULT_CLASSNAME}_tasks-container_generate-configuration_fields_item`}>
          <Typography size={'small'}>Балл за задание</Typography>
          <TextField
            placeholder={'Введите значение'}
            value={generateBallPerTask}
            onChange={(e) => setGenerateBallPerTask(+e.currentTarget.value)}
          />
        </div>
        <div
          className={`${DEFAULT_CLASSNAME}_tasks-container_generate-configuration_fields_item min-width`}>
          <Typography size={'small'}>Формат задания</Typography>
          <Select
            placeholder={'Формат'}
            fullWidth
            value={generateTaskFormat || ''}
            onChange={handleGenerateFormatChange}
            defaultValue=""
            MenuProps={{ PaperProps: { sx: { maxHeight: 320 } } }}>
            {taskFormats?.map((taskFormat: { subject: string; formats: string[] }) =>
              renderFormatGroup(taskFormat),
            )}
          </Select>
        </div>
      </div>
      <Tooltip title={generateText.length > 5000 && 'Текст генерации слишком большой!'}>
        <button
          disabled={
            !generateText.length ||
            generateText.length > 5000 ||
            generateTaskAmount === 0 ||
            generateBallPerTask === 0 ||
            generateTaskFormat === ''
          }
          onClick={handleTaskGeneration}
          className={`${DEFAULT_CLASSNAME}_tasks-container_generate-configuration_edit`}>
          <Typography size={'small'} color={'purple'}>
            Сгенерировать
          </Typography>

          <EditButton />
        </button>
      </Tooltip>
    </div>
  );
};
