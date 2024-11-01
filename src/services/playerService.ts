import axios from 'axios';
import { CreatePlayer, Player, UpdatePlayer } from '../models/player';

export class PlayerService {
  async getData(token: string): Promise<Player[]> {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/player`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  }

  async getMyPlayerData(token: string, myPlayerId: number): Promise<Player> {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/player/${myPlayerId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  }

  async authenticate(
    email: string | undefined | null,
    phone: string | undefined,
    password: string,
  ): Promise<Player | null> {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/player/authenticate`,
      { email: email, phone, password },
    );
    return response.data;
  }

  async authenticateGoogle(token: any): Promise<Player | null> {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/player/authenticateGoogle`,
      { token: token },
    );
    return response.data;
  }

  async sendMagicLink(email: string): Promise<void> {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`,
      { destination: email },
    );
    return response.data;
  }

  async sendMagicLinkCallback(token: string): Promise<any> {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login/callback?token=${token}`,
    );
    return response.data;
  }

  async updatePlayer(
    updatePlayer: UpdatePlayer,
    token: string,
    id: number,
  ): Promise<Player | null> {
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/player/${id}`,
      updatePlayer,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  }

  async registerPlayer(
    updatePlayer: CreatePlayer,
  ): Promise<Player | null> {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/player`,
      updatePlayer,
    );
    return response.data;
  }

  async resetPassword(playerId: number, token: string): Promise<void> {
    await axios.put(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/player/${playerId}`,
      {
        password: process.env.NEXT_PUBLIC_DEFAULT_PASSWORD,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }
}
