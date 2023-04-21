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

  useEffect(() => {
    ticketsService.getProfit().then((tickets) => {
      const res = {
        labels: Object.keys(tickets),
        datasets: [
          {
            label: "Profit",
            data: Object.values(tickets),
            borderColor: "rgb(75, 192, 192)",
            backgroundColor: "rgb(75, 192, 192)",
          },
        ],
      };
      console.log(res);
      setData(res);
    });
  }, []);

  return (
    <div className="p-4">
      <div className="container">
        <h1>Hi {userService.userValue?.firstName}!</h1>
        <p>Welcome on ticket manager</p>
        {<Line data={data} />}
      </div>
    </div>
  );
}
