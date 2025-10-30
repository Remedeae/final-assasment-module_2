import { createApiFetch } from "../../../stores/apiFetchStore";
import DonutChart from "../../../Components/graphs/graphElements/DonutChart";
import { useEffect, useState } from "react";
import type { UserPercentTimeSchema } from "../../../types/graphTypes";
import { useParams } from "react-router-dom";
import type { ChartData } from "chart.js";

const useFetchData = createApiFetch();

function UserPercentTime() {
  const { id } = useParams();
  const [dataSet, setDataSet] = useState<ChartData<"doughnut"> | null>();

  const data = useFetchData(
    (state) => state.data as UserPercentTimeSchema[] | null
  );
  const error = useFetchData((state) => state.error);
  const fetchDataSet = useFetchData((state) => state.apiFetchAsync);

  useEffect(() => {
    fetchDataSet("get", `user/${id}/percentTime`);
  }, [fetchDataSet, id, data]);
  //console.log(data);

  useEffect(() => {
    if (data) {
      setDataSet({
        labels: data.map((d) => d.gameName),
        datasets: [
          {
            label: "Minutes played",
            data: data.map((d) => d.percentPlayed),
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(255, 205, 86, 0.2)",
              "rgba(75, 192, 192, 0.2)",
            ],
            borderColor: [
              "rgb(255, 99, 132)",
              "rgb(54, 162, 235)",
              "rgb(255, 205, 86)",
              "rgb(75, 192, 192)",
            ],
            borderWidth: 1,
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
      <div className="userStats__percentPlayed">
        {<DonutChart data={dataSet} />}
      </div>
    );
}
export default UserPercentTime;
