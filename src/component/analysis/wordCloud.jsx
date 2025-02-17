import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import cloud from "d3-cloud";
import styles from "./wordCloud.module.css";

const WordCloud = ({ words }) => {
  const svgRef = useRef();

  useEffect(() => {
    const maxFontSize = 30; // 전체적인 크기 축소
    const minFontSize = 10; // 최소 글자 크기 설정
    const wordCloudSize = [200, 100]; // SVG 크기 조정

    const layout = cloud()
      .size(wordCloudSize)
      .words(words.map(d => ({ text: d.text, size: Math.max(minFontSize, Math.min(maxFontSize, d.value * 0.7)) })))
      .padding(2) // 패딩 조정
      .rotate(() => 0) // 회전 제거
      .fontSize(d => d.size)
      .on("end", draw);

    layout.start();

    function draw(words) {
      const svg = d3.select(svgRef.current);
      svg.selectAll("*").remove(); // 기존 요소 제거 후 다시 그리기
      
      svg
        .attr("width", wordCloudSize[0])
        .attr("height", wordCloudSize[1])
        .append("g")
        .attr("transform", `translate(${wordCloudSize[0] / 2}, ${wordCloudSize[1] / 2})`)
        .selectAll("text")
        .data(words)
        .enter().append("text")
        .style("font-size", d => d.size + "px")
        .style("fill", "#1F3A93")
        .attr("text-anchor", "middle")
        .attr("transform", d => `translate(${d.x * 0.8}, ${d.y * 0.8})`)
        .text(d => d.text);
    }
  }, [words]);

  return (
    <div className={styles.wordCloudContainer}>
      <h3 className={styles.title}>주로 하는 얘기가 뭘까?</h3>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default WordCloud;
