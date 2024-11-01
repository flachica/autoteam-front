import { Court } from './court';

export interface Club {
  id: number;
  name: string;
  courts: Court[];
}

export interface CheckableClub extends Club {
  checked: boolean;
}
