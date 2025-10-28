import { createApiFetch } from "../../../stores/apiFetchStore";
import DonutChart from "../graphElements/DonutChart";
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
