export type UserSchema = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  profilePic: string | null;
  createdAt: string;
  updatedAt: string;
};

export type SessionSchema = {
  id?: number;
  userId: number;
  gameId: number;
  minutes?: number;
  createdAt?: string;
};

export type GameSchema = {
  id: number;
  name: string;
};
