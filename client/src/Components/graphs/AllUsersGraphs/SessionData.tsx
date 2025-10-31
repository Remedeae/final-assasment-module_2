import { useEffect, useState } from "react";
import { createApiFetch } from "../../../stores/apiFetchStore";
import type { GameSchema } from "../../../types/tableTypes";
import type { UserSessionSchema } from "../../../types/graphTypes";
import type { ChartData } from "chart.js";
import ScatterGraph from "../../../Components/graphs/graphElements/ScatterGraph";

const useGetGames = createApiFetch();
const useGetSessions = createApiFetch();

function AllUserSessionData() {
  const [gameId, setGameId] = useState<number>(1);
  const [dataSet, setDataSet] = useState<ChartData<"scatter">>({
    datasets: [
      {
        label: `Avarage session length vs number of sessions played`,
        data: [
          {
            x: 0,
            y: 0,
          },
        ],
      },
    ],
  });

  const games = useGetGames((status) => status.data as GameSchema[] | null);
  const gamesError = useGetGames((status) => status.error);
  const getGames = useGetGames((status) => status.apiFetchAsync);

  const sessions = useGetSessions(
    (status) => status.data as UserSessionSchema[]
  );
  const sessionsError = useGetSessions((status) => status.error);
  const getSessions = useGetSessions((status) => status.apiFetchAsync);

  useEffect(() => {
    getGames("get", "games");
  }, [getGames]);

  useEffect(() => {
    if (games) {
      getSessions("get", `sessions/${gameId}`);
    }
  }, [getSessions, games, gameId]);
  console.log(gameId);

  useEffect(() => {
    if (sessions) {
      setDataSet({
        datasets: [
          {
            label:
              "Number of sessions played vs avarage session time for every player",
            data: sessions.map((s) => ({
              x: s.avgSession,
              y: s.numSessions,
            })),
            backgroundColor: "rgba(128, 0, 0, 1)",
          },
        ],
      });
    }
  }, [sessions]);
  console.log(dataSet);

  if (gamesError) {
    return <p>{gamesError}</p>;
  }
  if (sessionsError) {
    return <p>{sessionsError}</p>;
  }
  return (
    <div className="userStats__sessions">
      <label htmlFor="game">Choose a game:</label>
      <select
        name="game"
        id="game"
        onChange={(e) => setGameId(Number(e.target.value))}
      >
        {games?.map((game) => (
          <option key={game.id} value={game.id}>
            {game.name}
          </option>
        ))}
      </select>
      <ScatterGraph data={dataSet} />
    </div>
  );
}

export default AllUserSessionData;
