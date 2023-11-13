export interface ShareDataType {
  list_uuid: string;
  groups: string[];
  deadline: string | null;
  appreciable: boolean;
  time_limit: number | null;
  replay: boolean;
  see_answers: boolean;
  see_criteria: boolean;
}
