import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels"; // ✅ 추가
import styles from "./styleChart.module.css";

// Chart.js에 플러그인 등록
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

const StyleChart = ({ data }) => {
  const chartData = {
    labels: ["공감", "직설", "논리", "유머"],
    datasets: [
      {
        label: "대화 스타일",
        data: [data.empathy, data.direct, data.logic, data.humor],
        backgroundColor: ["#6A5ACD", "#DC143C", "#228B22", "#FFD700"],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        suggestedMax: 100,
        ticks: {
          stepSize: 20,
        },
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
      },
    },
    plugins: {
      datalabels: { // ✅ 플러그인 추가
        anchor: "end",
        align: "top",
        color: "#1F3A93",
        font: {
          weight: "bold",
          size: 14,
        },
        formatter: (value) => `${value}점`,
      },
    },
  };

  return (
    <div className={styles.chartContainer}>
      <h3 className={styles.title}>대화 스타일 분석</h3>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default StyleChart;