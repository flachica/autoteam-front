import axios from 'axios';
import { OpenWeek } from '../models/open-week';
import { Court } from '@/models/court';

export class CourtService {
  async newCourt(
    playerId: number,
    clubId: number,
    day: string,
    hour: string,
    token: string,
  ): Promise<Object | undefined> {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/court`,
      {
        date: day,
        hour: hour,
        club: clubId,
        players: [playerId],
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  }

  async setMeOut(
    playerId: number,
    courtId: number,
    toPlayerId: number | undefined,
    token: string,
  ): Promise<Object | undefined> {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/court/${courtId}/setmeout`,
      {
        playerId: Number(playerId),
        toPlayerId: toPlayerId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  }

  async setMeIn(
    playerId: number,
    courtId: number,
    token: string,
    invitedPlayerIds: number[],
    invitedAnonPlayers: string[],
  ): Promise<Object | undefined> {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/court/${courtId}/setmein`,
      {
        playerId: Number(playerId),
        invitedPlayers: invitedPlayerIds,
        anonPlayers: invitedAnonPlayers,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  }

  async reserve(
    playerId: number,
    courtId: number,
    newName: string,
    token: string,
  ): Promise<Object | undefined> {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/reservation`,
      {
        playerId: Number(playerId),
        courtId: courtId,
        name: newName,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  }

  async unReserve(
    playerId: number,
    courtId: number,
    token: string,
  ): Promise<Object | undefined> {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/reservation/${courtId}/delete`,
      {
        playerId: Number(playerId),
        courtId: courtId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  }

  async getPendingReservations(token: string): Promise<Court[]> {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/court/pending-reservations`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  }

  async openWeek(openInfo: OpenWeek, token: string): Promise<Object> {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/court/open-week`,
      openInfo,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  }

  async deleteCourt(courtId: number, token: string): Promise<Object> {
    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/court/${courtId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  }
}
