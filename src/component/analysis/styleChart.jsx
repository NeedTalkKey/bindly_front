import React from "react";
import { Bar } from "react-chartjs-2";
import { Common } from "../home/common";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import styles from "./styleChart.module.css";

// 필요한 Chart.js 요소 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  ChartDataLabels
);

const StyleChart = ({ data }) => {
  console.log("StyleChart 컴포넌트 > data : ", data);
  const chartData = {
    labels: [
      data.empathyMesurePromise[0].speaker,
      data.empathyMesurePromise[1].speaker,
    ],
    datasets: [
      {
        label: "공감 비중",
        data: [
          data.empathyMesurePromise[0].score,
          data.empathyMesurePromise[1].score,
        ],
        backgroundColor: ["#32CD32", "#FF6F61"],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
      },
      datalabels: {
        color: "#1f3a93",
        anchor: "end",
        align: "top",
        formatter: (value) => `${value}%`,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => value + "%",
        },
      },
    },
  };

  return (
    <Common>
      <div className={styles.chartContainer}>
        <h3 className={styles.title}>공감 비중</h3>
        <Bar data={chartData} options={options} />
      </div>
    </Common>
  );
};

export default StyleChart;
