export interface Player {
  id: number;
  name: string;
  surname: string | undefined;
  email: string;
  phone: string;
  role: string;
  accessToken?: string;
  balance: number;
  futureBalance: number;
}

export interface UpdatePlayer {
  name: string | undefined;
  surname: string | undefined;
  email: string | undefined;
  phone: string | undefined;
  password: string | undefined;
}

export interface CreatePlayer {
  name: string;
  surname: string | undefined;
  email: string | undefined;
  phone: string | undefined;
  password: string;
}
