import axios from 'axios';
import { GroupedHour } from '../models/grouped-hour';

export class HourService {
  async getData(token: string): Promise<GroupedHour> {
    const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/hour-group`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
    return response.data;
  }

  async getAllGroupedHours(token: string): Promise<GroupedHour[]> {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/hour-group/all`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  }

  async toggleActive(
    id: number,
    active: boolean,
    token: string,
  ): Promise<void> {
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/hour-group/${id}/activate/${!active}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  }
}
