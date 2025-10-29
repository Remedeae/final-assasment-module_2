import { Scatter } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  type ChartData,
  type ChartOptions,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ScatterGraphProps {
  data: ChartData<"scatter">;
  options?: ChartOptions<"scatter">;
}

function ScatterGraph({ data, options }: ScatterGraphProps) {
  return <Scatter options={options} data={data} />;
}

export default ScatterGraph;
