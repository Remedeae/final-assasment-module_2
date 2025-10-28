import { createApiFetch } from "../../../stores/apiFetchStore";
import BarGraph from "../graphElements/BarGraph";
import { useEffect, useState } from "react";
import type { UserAllGamesSchema } from "../../../types/graphTypes";
import { useParams } from "react-router-dom";
import type { ChartData } from "chart.js";

const useFetchData = createApiFetch();

function UserAllGames() {
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
      <div className="userStats__allGames">{<BarGraph data={dataSet} />}</div>
    );
}
export default UserAllGames;
