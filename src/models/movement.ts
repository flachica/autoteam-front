import { Player } from './player';

export interface Movement {
  id: number;
  type: 'in' | 'out';
  name: string;
  comment: string;
  amount: number;
  validated: boolean;
  amount_abs: number;
  date: string;
  player: Player;
}

export interface PaginatedMovements {
  items: Movement[];
  page: number;
  pageSize: number;
  totalCount: number;
  balance: number;
  futureBalance: number;
}

export interface CreateMovementDto {
  playerId: number;
  amount: number;
  name?: string;
  validated?: boolean;
}
