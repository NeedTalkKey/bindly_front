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
import styles from "./friendshipScore.module.css";

// Chart.js에 플러그인 등록
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

const FriendshipScore = ({ data }) => {
  const chartData = {
    labels: ["나", "대화 상대", "총 친밀감"],
    datasets: [
      {
        label: "친밀도 점수",
        data: [data.userScore, data.partnerScore, data.totalScore],
        backgroundColor: ["#6A7CF7", "#F76AE7", "#46F149"],
        borderRadius: 5,
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
      datalabels: { // ✅ 플러그인 추가하여 점수 표시
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
      <h3 className={styles.title}>상대방과 친밀감 점수는?</h3>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default FriendshipScore;