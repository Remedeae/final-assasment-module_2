// client/src/api.ts
export type User = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  profilePic?: string | null;
};

export type Game = {
  id: number;
  name: string;
};

// generic helper
export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    headers: { Accept: "application/json", ...(init?.headers || {}) },
    ...init,
  });
  if (!res.ok) {
    const msg = await res.text().catch(() => "");
    throw new Error(msg || `HTTP ${res.status} for ${path}`);
  }
  return res.json() as Promise<T>;
}

// (optional) stats helper used by StatsPage
export const weeklyStats = () =>
  api<{
    perDayUser: Record<string, Record<number, number>>;
    perGameUser: Record<string, Record<number, number>>;
    leaderboard: Record<number, number>;
    users?: Record<number, { id: number; firstName: string; lastName: string }>;
  }>("/api/stats/weekly");
