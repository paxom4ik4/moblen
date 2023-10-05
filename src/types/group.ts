import { Student } from './student.ts';

export interface Group {
  group_uuid: string;
  group_name: string;
  iconUrl: File;
  amount: number;
  url: string;
  owner_uuid: string;
  students?: Student[];
}
