import { useEffect, useState } from "react";
import { createApiFetch } from "../../../stores/apiFetchStore";
import type { GameSchema } from "../../../types/tableTypes";

const useGetGames = createApiFetch();
const useGetSessions = createApiFetch();

function UserSessionData() {
  const [gameId, setGameId] = useState<number>(1);

  const games = useGetGames((status) => status.data as GameSchema[] | null);
  const gamesError = useGetGames((status) => status.error);
  const getGames = useGetGames((status) => status.apiFetchAsync);

  const sessions = useGetSessions(
    (status) => status.data as GameSchema[] | null
  );
  const sessionsError = useGetSessions((status) => status.error);
  const getSessions = useGetSessions((status) => status.apiFetchAsync);

  useEffect(() => {
    getGames("get", "games");
  }, [getGames]);

  if (games) {
    getSessions("get", "");
  }

  if (gamesError) {
    return <p>{gamesError}</p>;
  }
  if (sessionsError) {
    return <p>{sessionsError}</p>;
  }
  return (
    <div className="userStats__sessions">
      <label htmlFor="game">Choose a game:</label>
      {games?.map((game) => (
        <select name="game" id="game" key={game.id}>
          <option value={game.id} onClick={() => setGameId(game.id)}>
            {game.name}
          </option>
        </select>
      ))}
    </div>
  );
}

export default UserSessionData;
