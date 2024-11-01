export interface Hour {
  id: number;
  name: string;
  price: number;
  index: number;
}

export interface Day {
  day_name: string;
  hours: Hour[];
}

export interface GroupedHour {
  id: number;
  group_name: string;
  days: Day[];
  active: boolean;
}
