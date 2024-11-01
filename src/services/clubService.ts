import axios from 'axios';
import { Club } from '../models/club';
import { HomeData } from '../models/homeData';

export class ClubService {
  async getData(weekDay: string, token: string): Promise<HomeData> {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/week/${weekDay}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  }

  async getClubs(token: string): Promise<Club[]> {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/club`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  }
}
