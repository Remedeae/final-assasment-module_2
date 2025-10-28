import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Tooltip,
  Legend,
  ArcElement,
  type ChartData,
  type ChartOptions,
} from "chart.js";

ChartJS.register(Tooltip, Legend, ArcElement);

interface DonutGraphProps {
  data: ChartData<"doughnut">;
  options?: ChartOptions<"doughnut">;
}

function DonutChart({ data, options }: DonutGraphProps) {
  return <Doughnut options={options} data={data} />;
}

export default DonutChart;
