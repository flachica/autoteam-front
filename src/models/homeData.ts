import { Club } from './club';

export interface HomeData {
  clubs: Club[];
  week: string;
  currentBalance: number;
}
