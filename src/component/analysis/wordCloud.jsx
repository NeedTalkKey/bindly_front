// wordCloud.jsx
import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import cloud from "d3-cloud";
import styles from "./wordCloud.module.css";

const WordCloud = ({ words = [] }) => { // 기본값을 빈 배열로 지정
  const svgRef = useRef();

  useEffect(() => {
    if (!words || words.length === 0) return; // words가 없으면 실행하지 않음

    const maxFontSize = 20;
    const minFontSize = 12;
    const wordCloudSize = [200, 150];

    const layout = cloud()
      .size(wordCloudSize)
      .words(
        words.map((d) => ({
          text: d.text,
          size: Math.max(minFontSize, Math.min(maxFontSize, d.value * 0.7)),
        }))
      )
      .padding(6)
      .spiral("rectangular")
      .rotate(() => 0)
      .fontSize((d) => d.size)
      .on("end", draw);

    layout.start();

    function draw(words) {
      const svg = d3.select(svgRef.current);
      svg.selectAll("*").remove();

      svg
        .attr("width", wordCloudSize[0])
        .attr("height", wordCloudSize[1])
        .append("g")
        .attr(
          "transform",
          `translate(${wordCloudSize[0] / 2}, ${wordCloudSize[1] / 2})`
        )
        .selectAll("text")
        .data(words)
        .enter()
        .append("text")
        .style("font-size", (d) => d.size + "px")
        .style("fill", (d) => d3.interpolateBlues(d.size / maxFontSize))
        .attr("text-anchor", "middle")
        .attr("transform", (d) => `translate(${d.x}, ${d.y})`)
        .text((d) => d.text);
    }
  }, [words]);

  // 팝업으로 워드클라우드 크게 보기
  const openPopup = () => {
    localStorage.setItem("wordCloudData", JSON.stringify(words));
    window.open(
      "/wordCloudDetail",
      "_blank",
      "width=800,height=600,top=100,left=100,resizable=no,scrollbars=no"
    );
  };

  return (
    <div
      className={styles.wordCloudContainer}
      onClick={openPopup}
      style={{ cursor: "pointer" }}
    >
      <h3 className={styles.title}>주로 하는 얘기가 뭘까?</h3>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default WordCloud;
