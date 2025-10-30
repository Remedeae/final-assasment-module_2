/* import { createApiFetch } from "../../../stores/apiFetchStore";
import { useEffect, useState } from "react";
import type { UserAllGamesSchema } from "../../../types/graphTypes";
import type { ChartData } from "chart.js";
import LineGraph from "../graphElements/LineGraph";

const useFetchData = createApiFetch();

function AllUsersWeekly(gameId: number) {
  const [dataSet, setDataSet] = useState<ChartData<"line"> | null>();

  const data = useFetchData(
    (state) => state.data as UserAllGamesSchema[] | null //*
  );
  const error = useFetchData((state) => state.error);
  const fetchDataSet = useFetchData((state) => state.apiFetchAsync);

  useEffect(() => {
    fetchDataSet("get", `weekly/${gameId}`);
  }, [fetchDataSet, gameId]);
  //console.log(data);

     useEffect(() => {
    if (data) {
      setDataSet({
        labels: data.map((d) => d.gameName),
        datasets: [
          {
            label: "Minutes played",
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
      <div className="userStats__allGames">{<LineGraph data={dataSet} />}</div>
    );
}
export default AllUsersWeekly;
 */
