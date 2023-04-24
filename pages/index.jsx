import { ticketsService, userService } from "services";
import { Doughnut, Chart } from "react-chartjs-2";
import { useEffect, useState } from "react";
import { ProgressSpinner } from "primereact/progressspinner";
import React from "react";
import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  LineController,
  BarController,
  ArcElement,
} from "chart.js";

ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  LineController,
  BarController,
  ArcElement
);

export default Home;

function Home() {
  const [profit, setData] = useState({});
  const [amounts, setAmounts] = useState({});
  const colors = [
    "rgba(255, 99, 132, 0.5)",
    "rgba(54, 162, 235, 0.5)",
    "rgba(255, 206, 86, 0.5)",
    "rgba(75, 192, 192, 0.5)",
    "rgba(153, 102, 255, 0.5)",
    "rgba(255, 159, 64, 0.5)",
    "rgba(255, 99, 132, 0.5)",
    "rgba(54, 162, 235, 0.5)",
    "rgba(255, 206, 86, 0.5)",
    "rgba(75, 192, 192, 0.5)",
    "rgba(153, 102, 255, 0.5)",
    "rgba(255, 159, 64, 0.5)",
  ];

  const pieChart =
    Object.keys(profit).length > 0 ? (
      <Doughnut
        data={{
          labels: Object.keys(profit),
          datasets: [
            {
              data: Object.values(profit),
              label: "Profit (Last 12 months)",
              backgroundColor: colors.slice(),
              borderColor: colors.slice(),
            },
          ],
        }}
      />
    ) : (
      <ProgressSpinner />
    );

  const barChart =
    Object.keys(amounts).length > 0 ? (
      <Chart
        type="bar"
        data={{
          labels: Object.keys(amounts),
          datasets: [
            {
              type: "bar",
              label: "Received",
              data: Object.values(amounts).map((a) => {
                console.log(a);
                return a.receiving;
              }),
              backgroundColor: "rgba(255, 99, 132, 0.5)",
            },
            {
              type: "bar",
              label: "Paid",
              data: Object.values(amounts).map((a) => a.paid),
              backgroundColor: "rgba(53, 162, 235, 0.5)",
            },
            {
              type: "line",
              data: Object.values(profit),
              label: "Profit (Last 12 months)",
              borderColor: "rgb(75, 192, 192)",
            },
          ],
        }}
      />
    ) : (
      <ProgressSpinner />
    );

  useEffect(() => {
    ticketsService.getProfit().then((x) => {
      //console.log(x);
      setData(x[0]);
      setAmounts(x[1]);
    });
  }, []);

  return (
    <div className="p-4">
      <div className="container">
        <h1>Hi {userService.userValue?.firstName}!</h1>
        <p>Welcome on ticket manager</p>
        <br />
        <h3 className="drag-text">Paid vs Received Amount</h3>
        <div>{barChart}</div>
        <br />
        <h3 className="drag-text">Profit</h3>
        <div>{pieChart}</div>
      </div>
    </div>
  );
}
