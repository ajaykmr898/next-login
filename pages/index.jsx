import { ticketsService, userService } from "services";
import { Doughnut, Chart, Pie } from "react-chartjs-2";
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
import { formatDate } from "../services";

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
  const [profit, setProfit] = useState({});
  const [amounts, setAmounts] = useState({});
  const [methods, setMethods] = useState({});
  const [methodsP, setMethodsP] = useState({});
  const [agents, setAgents] = useState({});
  const [agentsP, setAgentsP] = useState({});
  const [agentsA, setAgentsA] = useState({});
  const [methodsA, setMethodsA] = useState({});
  const [dates, setDates] = useState({});
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

  const pieChart4 =
    Object.keys(agentsA).length > 0 ? (
      <Pie
        data={{
          labels: Object.keys(agentsA),
          datasets: [
            {
              data: Object.values(agentsA),
              label: "Agents",
              backgroundColor: colors.slice(),
              borderColor: colors.slice(),
            },
          ],
        }}
      />
    ) : (
      <ProgressSpinner className="center" />
    );

  const pieChart5 =
    Object.keys(methodsA).length > 0 ? (
      <Pie
        data={{
          labels: Object.keys(methodsA),
          datasets: [
            {
              data: Object.values(methodsA),
              label: "Methods",
              backgroundColor: colors.slice(),
              borderColor: colors.slice(),
            },
          ],
        }}
      />
    ) : (
      <ProgressSpinner className="center" />
    );

  const pieChart =
    Object.keys(agents).length > 0 ? (
      <Pie
        data={{
          labels: Object.keys(agents),
          datasets: [
            {
              data: Object.values(agents),
              label: "Agents",
              backgroundColor: colors.slice(),
              borderColor: colors.slice(),
            },
          ],
        }}
      />
    ) : (
      <ProgressSpinner className="center" />
    );

  const pieChart1 =
    Object.keys(agentsP).length > 0 ? (
      <Doughnut
        data={{
          labels: Object.keys(agentsP),
          datasets: [
            {
              data: Object.values(agentsP),
              label: "Profit",
              backgroundColor: colors.slice(),
              borderColor: colors.slice(),
            },
          ],
        }}
      />
    ) : (
      <ProgressSpinner className="center" />
    );

  const pieChart2 =
    Object.keys(methods).length > 0 ? (
      <Pie
        data={{
          labels: Object.keys(methods),
          datasets: [
            {
              data: Object.values(methods),
              label: "Method",
              backgroundColor: colors.slice(),
              borderColor: colors.slice(),
            },
          ],
        }}
      />
    ) : (
      <ProgressSpinner className="center" />
    );

  const pieChart3 =
    Object.keys(methodsP).length > 0 ? (
      <Doughnut
        data={{
          labels: Object.keys(methodsP),
          datasets: [
            {
              data: Object.values(methodsP),
              label: "Profit",
              backgroundColor: colors.slice(),
              borderColor: colors.slice(),
            },
          ],
        }}
      />
    ) : (
      <ProgressSpinner className="center" />
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
              data: Object.values(amounts).map((a) => a.totalReceivingAmount),
              backgroundColor: colors[0],
            },
            {
              type: "bar",
              label: "Paid",
              data: Object.values(amounts).map((a) => a.paidAmount),
              backgroundColor: colors[1],
            },
          ],
        }}
      />
    ) : (
      <ProgressSpinner className="center" />
    );

  const barChart2 =
    Object.keys(amounts).length > 0 ? (
      <Chart
        type="bar"
        data={{
          labels: Object.keys(amounts),
          datasets: [
            {
              type: "line",
              data: Object.values(profit).map((a) => a.profit),
              label: "Profit",
              borderColor: "rgb(75, 192, 192)",
            },
          ],
        }}
      />
    ) : (
      <ProgressSpinner className="center" />
    );

  useEffect(() => {
    let start = new Date();
    start.setMonth(start.getMonth() - 6);
    start.setDate(1);
    start = formatDate(start);
    let end = formatDate(new Date());
    setDates({ start, end });
    ticketsService.getProfit({ start, end }).then((x) => {
      console.log(x);
      setProfit(x.ticketsP);
      setAmounts(x.ticketsP);
      setMethods(x.methods);
      setMethodsP(x.methodsP);
      setAgents(x.agents);
      setAgentsP(x.agentsP);
      setAgentsA(x.agentsA);
      setMethodsA(x.methodsA);
    });
  }, []);

  return (
    <div className="p-4">
      <div className="container">
        <div className="center center-text">
          From&nbsp;{formatDate(dates.start, "IT")}
          &nbsp;To&nbsp;{formatDate(dates.end, "IT")}
        </div>
        <br />
        <br />
        <br />
        <div className="row">
          <div className="col-md-6">
            <h4 className="drag-text">Paid vs Received Amount</h4>
            {barChart}
          </div>
          <div className="col-md-6">
            <h4 className="drag-text">Profit</h4>
            {barChart2}
          </div>
        </div>
        <div className="row">
          <div className="col-6 col-xs-12 col-xl-3">
            <br />
            <h4 className="drag-text">Agents</h4>
            {pieChart}
          </div>
          <div className="col-6 col-xs-12 col-xl-3">
            <br />
            <h4 className="drag-text">Payment Methods</h4>
            {pieChart2}
          </div>
          <div className="col-6 col-xs-12 col-xl-3">
            <br />
            <h4 className="drag-text">Profit by Agents</h4>
            {pieChart1}
          </div>
          <div className="col-6 col-xs-12 col-xl-3">
            <br />
            <h4 className="drag-text">Profit by Methods</h4>
            {pieChart3}
          </div>
          <div className="col-6 col-xs-12 col-xl-3">
            <br />
            <h4 className="drag-text">Payments by Agents</h4>
            {pieChart4}
          </div>
          <div className="col-6 col-xs-12 col-xl-3">
            <br />
            <h4 className="drag-text">Pay. by Methods</h4>
            {pieChart5}
          </div>
        </div>
      </div>
    </div>
  );
}
