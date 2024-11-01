import { CourtPlayer } from './courtPlayer';

export interface Reservation {
  id: number;
  name: string;
  players: CourtPlayer[];
  invitedPlayers: CourtPlayer[];
  anonPlayers: any[];
  day_name: string;
  day_date: string;
  hour: string;
  price: number;
  court_state: string;
}
