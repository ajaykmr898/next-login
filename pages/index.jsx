import { ticketsService, userService } from "services";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useEffect, useState } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default Home;

function Home() {
  const [data, setData] = useState({});

  const lineChart =
    Object.keys(data).length > 0 ? (
      <Line
        data={{
          labels: Object.keys(data),
          datasets: [
            {
              data: Object.values(data),
              label: "Profit",
              borderColor: "rgb(75, 192, 192)",
              fill: true,
            },
          ],
        }}
      />
    ) : null;

  useEffect(() => {
    const tickets = ticketsService.getProfit().then((x) => setData(x));
  }, []);

  return (
    <div className="p-4">
      <div className="container">
        <h1>Hi {userService.userValue?.firstName}!</h1>
        <p>Welcome on ticket manager</p>
        <div>{lineChart}</div>
      </div>
    </div>
  );
}
