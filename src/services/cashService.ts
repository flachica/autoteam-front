import axios from 'axios';
import {
  CreateMovementDto,
  Movement,
  PaginatedMovements,
} from '../models/movement';
import { Player } from '../models/player';

export class CashService {
  async getMovements(
    token: string | undefined,
    playerId: number,
    startDate: string,
    endDate: string,
    page: number,
    pageSize: number,
  ): Promise<PaginatedMovements> {
    const result = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/cash/movement`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          playerId: playerId,
          dateFrom: startDate,
          dateTo: endDate,
          page: page,
          pageSize: pageSize,
        },
      },
    );
    return result.data;
  }

  async getAllMovements(
    token: string | undefined,
    startDate: string,
    endDate: string,
    page: number,
    pageSize: number,
  ): Promise<PaginatedMovements> {
    const result = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/cash/movement/all`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          dateFrom: startDate,
          dateTo: endDate,
          page: page,
          pageSize: pageSize,
        },
      },
    );
    return result.data;
  }

  async createMovement(myPlayer: Player, playerId: number, amount: number, message?: string, validated?: boolean): Promise<Movement[]> {
    const createMovement: CreateMovementDto = {
      amount: amount,
      playerId: playerId,
      name: message,
      validated: validated,
    };
    const result = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/cash/movement`,
      createMovement,
      {
        headers: {
          Authorization: `Bearer ${myPlayer.accessToken}`,
        },
      },
    );
    return result.data;
  }

  async validateMovement(token: string, movement: Movement): Promise<void> {
    await axios.put(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/cash/movement/${movement.id}`,
      {
        validated: !movement.validated,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return;
  }

  async removeMovement(token: string, movementId: number): Promise<void> {
    await axios.delete(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/cash/movement/${movementId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return;
  }
}
