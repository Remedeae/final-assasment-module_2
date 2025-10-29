import { useEffect } from "react";
import { createApiFetch } from "../../../stores/apiFetchStore";
import type { LeaderBoardSchema } from "../../../types/graphTypes";

const useFetchLeaders = createApiFetch();

function LeaderBoard() {
  const data = useFetchLeaders(
    (state) => state.data as LeaderBoardSchema[] | null
  );
  const error = useFetchLeaders((state) => state.error);
  const fetchLeaders = useFetchLeaders((state) => state.apiFetchAsync);

  useEffect(() => {
    fetchLeaders("get", "leaderBoard");
  }, [fetchLeaders]);

  if (error) {
    return <div>{error}</div>;
  }
  return (
    <div className="userStats__leaderBoard">
      <table>
        <caption>Leader Board</caption>
        <thead>
          <tr>
            <th>Game</th>
            <th>Name</th>
            <th>Time Played</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((leaderBoard) => (
            <tr key={leaderBoard.game}>
              <td>{leaderBoard.game}</td>
              <td>{leaderBoard.name}</td>
              <td>{leaderBoard.timePlayed}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default LeaderBoard;
