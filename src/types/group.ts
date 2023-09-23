import {Student} from "./student.ts";

export interface Group {
  id: string;
  name: string;
  iconUrl: File;
  amount: number;
  referralLink: string;
  students?: Student[];
}
