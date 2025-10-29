import { createApiFetch } from "../../../stores/apiFetchStore";
import BarGraph from "../graphElements/BarGraph";
import { useEffect, useState } from "react";
import type { UserAllGamesSchema } from "../../../types/graphTypes";
import type { ChartData } from "chart.js";

const useFetchData = createApiFetch();

function AllUsersAllGames() {
  const [dataSet, setDataSet] = useState<ChartData<"bar"> | null>();

  const data = useFetchData(
    (state) => state.data as UserAllGamesSchema[] | null
  );
  const error = useFetchData((state) => state.error);
  const fetchDataSet = useFetchData((state) => state.apiFetchAsync);

  useEffect(() => {
    fetchDataSet("get", `allusers/timePlayed`);
  }, [fetchDataSet, data]);
  //console.log(data);

  useEffect(() => {
    if (data) {
      setDataSet({
        labels: data.map((d) => d.gameName),
        datasets: [
          {
            label: "Total minutes played by all player",
            data: data.map((d) => d.totalTime),
          },
        ],
      });
    }
  }, [data]);

  if (error) {
    return <div>{error}</div>;
  }
  if (dataSet)
    return (
      <div className="userStats__allPlayers-timePlayed">
        {<BarGraph data={dataSet} />}
      </div>
    );
}
export default AllUsersAllGames;
