import { createApiFetch } from "../../../stores/apiFetchStore";
import BarGraph from "../../../Components/graphs/graphElements/BarGraph"
import { useEffect, useState } from "react";
import type { UserAllGamesSchema } from "../../../types/graphTypes";
import { useParams } from "react-router-dom";
import type { ChartData } from "chart.js";

const useFetchData = createApiFetch();
interface Props {
  playerName: string;
}

function UserAllGames({ playerName }: Props) {
  const { id } = useParams();
  const [dataSet, setDataSet] = useState<ChartData<"bar"> | null>();

  const data = useFetchData(
    (state) => state.data as UserAllGamesSchema[] | null
  );
  const error = useFetchData((state) => state.error);
  const fetchDataSet = useFetchData((state) => state.apiFetchAsync);

  useEffect(() => {
    fetchDataSet("get", `user/${id}/allGames`);
  }, [fetchDataSet, id, data]);
  //console.log(data);

  useEffect(() => {
    if (data) {
      setDataSet({
        labels: data.map((d) => d.gameName),
        datasets: [
          {
            label: `Minutes played by ${playerName}`,
            data: data.map((d) => d.totalTime),
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(255, 159, 64, 0.2)",
              "rgba(255, 205, 86, 0.2)",
              "rgba(75, 192, 192, 0.2)",
            ],
            borderColor: [
              "rgb(255, 99, 132)",
              "rgb(255, 159, 64)",
              "rgb(255, 205, 86)",
              "rgb(75, 192, 192)",
            ],
            borderWidth: 1,
          },
        ],
      });
    }
  }, [data, playerName]);

  if (error) {
    return <div>{error}</div>;
  }
  if (dataSet)
    return (
      <div className="userStats__allGames">{<BarGraph data={dataSet} />}</div>
    );
}
export default UserAllGames;
