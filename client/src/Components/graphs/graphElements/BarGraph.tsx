import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  type ChartData,
  type ChartOptions,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface BarGraphProps {
  data: ChartData<"bar">;
  options?: ChartOptions<"bar">;
}

function BarGraph({ data, options }: BarGraphProps) {
  return <Bar options={options} data={data} />;
}

export default BarGraph;
