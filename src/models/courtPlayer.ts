export interface CourtPlayer {
    id: number;
    name: string;
    surname: string | null;
    payerPlayerId: number;
    paid: boolean;
}
