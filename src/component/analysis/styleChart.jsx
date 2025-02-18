import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Common } from "../home/common";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels"; // ✅ 데이터 라벨 플러그인 추가
import styles from "./styleChart.module.css";

// Chart.js에 플러그인 등록
ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const StyleChart = ({ data }) => {
  const chartData = {
    labels: ["E_F_", "I_F_", "E_T_", "I_T_"],
    datasets: [
      {
        label: "MBTI",
        data: [data.empathy, data.direct, data.logic, data.humor],
        backgroundColor: ["#32CD32", "#FF6F61", "#87CEFA", "#FFD700"],
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
      },
      datalabels: {
        color: "#1f3a93",
        font: {
          weight: "bold",
          size: 14,
        },
        formatter: (value, context) => {
          return `${context.chart.data.labels[context.dataIndex]} ${value}%`;
        },
      },
    },
  };

  // ✅ 클릭 시 새로운 창(팝업) 열기
  const handleClick = () => {
    localStorage.setItem("styleChartData", JSON.stringify(data));
    window.open("/style-chart-detail", "_blank", "width=800,height=800");
  };

  return (
    <Common>
      <div className={styles.chartContainer} onClick={handleClick}>
        <h3 className={styles.title}>MBTI</h3>
        <Doughnut data={chartData} options={options} />
      </div>
    </Common>
  );
};

export default StyleChart;