import React from "react";
import { useSearchParams, Link } from "react-router-dom";

const ShareResult = () => {
  const [searchParams] = useSearchParams();
  const imgUrl = searchParams.get("imgUrl");

  if (!imgUrl) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h2>이미지 URL이 없습니다.</h2>
        <Link to="/">메인으로 돌아가기</Link>
      </div>
    );
  }

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>분석 결과</h2>
      <img
        src={imgUrl}
        alt="분석 결과"
        style={{ maxWidth: "80%", border: "1px solid #ccc" }}
      />
      <div style={{ marginTop: "20px" }}>
        <Link
          to="/"
          style={{
            display: "inline-block",
            padding: "10px 20px",
            background: "#1f3a93",
            color: "#fff",
            borderRadius: "8px",
            textDecoration: "none",
          }}
        >
          나도 분석해보기
        </Link>
      </div>
    </div>
  );
};

export default ShareResult;
