import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import styles from "./styleChartDetail.module.css";
import { Common } from "../home/common";

const StyleChartDetail = () => {
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        const storedData = JSON.parse(localStorage.getItem("styleChartData"));
        if (storedData) {
            setChartData({
                labels: ["E_F_", "I_F_", "E_T_", "I_T_"],
                datasets: [
                    {
                        label: "MBTI",
                        data: [storedData.empathy, storedData.direct, storedData.logic, storedData.humor],
                        backgroundColor: ["#32CD32", "#FF6F61", "#87CEFA", "#FFD700"],
                        hoverOffset: 10,
                    },
                ],
            });
        }
    }, []);

    const mbtiDescriptions = {
        "E_F_": "대화에서 감정을 적극적으로 표현하며, 분위기를 주도하는 스타일.",
        "I_F_": "조용하지만 깊은 공감을 하는 스타일. 친밀한 대화를 선호함.",
        "E_T_": "논리적으로 말하며, 설득력 있는 대화를 선호하는 스타일.",
        "I_T_": "신중하고 분석적인 스타일. 핵심적인 대화를 선호함."
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "30%",
        plugins: {
            title: {
                display: true,
                text: "MBTI 스타일 분석",
                font: {
                    size: 18,
                    weight: "bold",
                },
                padding: 20,
                color: "#1f3a93"
            },
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
                    const label = context.chart.data.labels[context.dataIndex];
                    return `${label} ${value}%`;
                },
            },
        },
    };

    return (
        <Common>
            <div className={styles.container}>
                <div className={styles.chartWrapper}>
                    {chartData && <Doughnut className={styles.doughnutChart} data={chartData} options={options} />}
                </div>
                <div className={styles.explanationContainer}>
                    {chartData?.labels.map((label, index) => (
                        <div key={index} className={styles.explanationBox}>
                            <h4 className={styles.explanationTitle}>{label}</h4>
                            <p className={styles.explanationText}>{mbtiDescriptions[label]}</p>
                        </div>
                    ))}
                </div>
            </div>
        </Common>
    );
};

export default StyleChartDetail;