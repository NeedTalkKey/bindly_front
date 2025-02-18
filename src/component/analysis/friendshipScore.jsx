import React from "react";
// import { Bar } from "react-chartjs-2";
import { Doughnut } from "react-chartjs-2";
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

// 주석부분은 나, 상대, 총친밀감을 막대그래프로 보여주는 코드임 
// const FriendshipScore = ({ data }) => {
//   const chartData = {
//     labels: ["나", "대화 상대", "총 친밀감"],
//     datasets: [
//       {
//         label: "친밀도 점수",
//         data: [data.userScore, data.partnerScore, data.totalScore],
//         backgroundColor: ["#6A7CF7", "#F76AE7", "#46F149"],
//         borderRadius: 5,
//       },
//     ],
//   };

//   const options = {
//     responsive: true,
//     maintainAspectRatio: false,
//     scales: {
//       y: {
//         beginAtZero: true,
//         suggestedMax: 100,
//         ticks: {
//           stepSize: 20,
//         },
//         grid: {
//           color: "rgba(0, 0, 0, 0.1)",
//         },
//       },
//     },
//     plugins: {
//       datalabels: { // ✅ 플러그인 추가하여 점수 표시
//         anchor: "end",
//         align: "top",
//         color: "#1F3A93",
//         font: {
//           weight: "bold",
//           size: 14,
//         },
//         formatter: (value) => `${value}점`,
//       },
//     },
//   };

const FriendshipScore = ({ data }) => {
  const totalPossibleScore = 100;
  const remainingScore = totalPossibleScore - data.totalScore;

  const chartData = {
    labels: ["총 친밀감", ""],
    datasets: [
      {
        label: "친밀도 점수",
        data: [data.totalScore, remainingScore],
        backgroundColor: ["#1f3a93", "#D3D3D3"],
        hoverOffset: 10,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "30%", // ✅ 도넛 내부 구멍 크기 조정
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          filter: (legendItem, chartData) => {
            // ✅ 범례에서 빈 라벨("")을 가진 데이터는 숨김
            return chartData.labels[legendItem.index] !== "";
          },
        },
      },
      datalabels: {
        color: "white",
        font: {
          weight: "bold",
          size: 16,
        },
        formatter: (value, context) => {
          // ✅ '총 친밀감' 점수만 표시하고, 빈 문자열 데이터는 무시
          return context.dataIndex === 0 ? `${context.chart.data.labels[context.dataIndex]} ${value}점` : "";
        },
      },
    },
  };


  return (
    <div className={styles.chartContainer}>
      {/* <h3 className={styles.title}>상대방과 친밀감 점수는?</h3> */}
      <h3 className={styles.title}>우리의 친밀감 점수는?</h3>
      {/* <Bar data={chartData} options={options} /> */}
      <Doughnut data={chartData} options={options} />
    </div>
  );
};

export default FriendshipScore;