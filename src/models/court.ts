import { CourtPlayer } from './courtPlayer';

export interface Court {
  id: number;
  name: string;
  players: CourtPlayer[];
  invitedPlayers: CourtPlayer[];
  anonPlayers: any[];
  date: string;
  day_name: string;
  day_date: string;
  hour: string;
  price: number;
  court_state: string;
}
