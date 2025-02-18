import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import cloud from "d3-cloud";
import styles from "./wordCloudDetail.module.css";

const WordCloudDetail = () => {
    const svgRef = useRef();
    const [wordData, setWordData] = useState([]);

    useEffect(() => {
        const storedData = JSON.parse(localStorage.getItem("wordCloudData"));
        if (storedData) {
            setWordData(storedData);
        }
    }, []);

    useEffect(() => {
        if (wordData.length === 0) return;

        const maxFontSize = 50; // ✅ 글자 크기 증가
        const minFontSize = 18;
        const wordCloudSize = [600, 400]; // ✅ 더 넓은 크기 적용

        const layout = cloud()
            .size(wordCloudSize)
            .words(wordData.map(d => ({
                text: d.text,
                size: Math.max(minFontSize, Math.min(maxFontSize, d.value * 0.7))
            })))
            .padding(6) // ✅ 단어 간 간격 조정
            .spiral("rectangular") // ✅ 더 자연스러운 배치 유지
            .rotate(() => 0)
            .fontSize(d => d.size)
            .on("end", draw);

        layout.start();

        function draw(words) {
            const svg = d3.select(svgRef.current);
            svg.selectAll("*").remove();

            svg
                .attr("width", wordCloudSize[0])
                .attr("height", wordCloudSize[1])
                .append("g")
                .attr("transform", `translate(${wordCloudSize[0] / 2}, ${wordCloudSize[1] / 2})`)
                .selectAll("text")
                .data(words)
                .enter().append("text")
                .style("font-size", d => d.size + "px")
                .style("fill", d => d3.interpolateBlues(d.size / maxFontSize))
                .attr("text-anchor", "middle")
                .attr("transform", d => `translate(${d.x}, ${d.y}) rotate(${d.rotate})`)
                .text(d => d.text);
        }
    }, [wordData]);

    return (
        <div className={styles.wordCloudDetailContainer}>
            <h2 className={styles.title}>주로 하는 얘기가 뭘까?</h2>
            <svg ref={svgRef}></svg>
            <p className={styles.description}>
                크기가 클수록 우리가 자주 말한 단어입니다! <br/>대화의 흐름을 한눈에 확인해보세요.
            </p>
        </div>
    );
};

export default WordCloudDetail;