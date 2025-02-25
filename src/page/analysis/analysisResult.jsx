import React, { useState, useEffect, useContext } from "react";
import { Common } from "../../component/home/common";
import html2canvas from "html2canvas";
import styles from "./analysisResult.module.css";
import FriendshipMessage from "../../component/analysis/friendshipMessage";
import FriendshipScore from "../../component/analysis/friendshipScore";
import MessageCount from "../../component/analysis/messageCount";
import UploadComponent from "../bindly/upload";
import Button from "../../component/bindly/button";
import { Chat } from "../home/Chat";
import { config } from "../../config";
import { AuthContext } from "../../AuthContext";

// Chart.js 관련 요소 등록 (v3 이상부터는 수동 등록 필요)
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
Chart.register(ArcElement, Tooltip, Legend);

// [1] 임시 데이터 (fallback)
const tempData = {
  userName: "박치호",
  partnerName: "박건우",
  totalScore: 60,
  conversationStyle: {
    empathy: 35,
    direct: 25,
    logic: 20,
    humor: 20,
  },
  userReplyTime: 15,
  partnerReplyTime: 10,
  userMessageCount: 120,
  partnerMessageCount: 140,
  relationship: "연인",
  keywords: [
    { text: "친구", value: 60 },
    { text: "안녕하세요", value: 45 },
    // ...
  ],
};

const AnalysisResult = ({ analysisData }) => {
  const { isLoggedIn } = useContext(AuthContext);

  // 업로드 화면(true) vs 분석 결과 화면(false)를 구분하는 상태 (초기값 false: 결과 화면 표시)
  const [showUpload, setShowUpload] = useState(false);
  // 회원이었던 상태를 추적해서, 로그아웃 이벤트만 감지하기 위한 상태
  const [wasLoggedIn, setWasLoggedIn] = useState(isLoggedIn);

  // 나머지 내부 상태들
  const [description, setDescription] = useState("");
  const [fileName, setFileName] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  // analysisData가 없으면 tempData 사용
  const data = analysisData || tempData;

  useEffect(() => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  }, []);

  /**
   * 회원이 로그아웃(즉, wasLoggedIn가 true였다가 isLoggedIn이 false로 변할 때)하면
   * showUpload를 true로 전환하여 업로드 화면으로 강제 전환한다.
   */
  useEffect(() => {
    if (wasLoggedIn && !isLoggedIn) {
      setShowUpload(true);
      // 필요 시 내부 상태 초기화
      setDescription("");
      setFileName("");
      setShowInput(false);
      setIsModalOpen(false);
      setIsSharing(false);
    }
    setWasLoggedIn(isLoggedIn);
  }, [isLoggedIn, wasLoggedIn]);

  // 업로드 완료 시 호출되는 콜백 (UploadComponent에서 반드시 호출)
  const handleUploadComplete = () => {
    setShowUpload(false);
  };

  // "다른 대화 분석하기" 버튼 → 업로드 화면으로 전환
  const handleResetAndUpload = () => {
    setShowUpload(true);
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  // 파일 저장 관련 함수들
  const handleSaveAsImage = () => {
    setShowInput(true);
  };

  const captureScreenAndDownload = () => {
    if (!fileName) {
      alert("파일명을 입력해주세요.");
      return;
    }
    const content = document.getElementById("captureArea");
    html2canvas(content, { scale: 2 }).then((canvas) => {
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = `${fileName}.png`;
      link.click();
      setShowInput(false);
    });
  };

  // 공유하기 함수
  const handleShare = async () => {
    setIsSharing(true);
    try {
      const content = document.getElementById("captureArea");
      const canvas = await html2canvas(content, { scale: 2 });
      const dataUrl = canvas.toDataURL("image/png");

      // Cloudinary 업로드
      const formData = new FormData();
      formData.append("file", dataUrl);
      formData.append("upload_preset", config.cloudinary.uploadPreset);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${config.cloudinary.cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const json = await response.json();
      if (!json.secure_url) {
        throw new Error("Cloudinary 업로드 실패");
      }
      const shareLink = `${window.location.origin}/share?imgUrl=${encodeURIComponent(
        json.secure_url
      )}`;
      await navigator.clipboard.writeText(shareLink);
      alert("링크가 복사되었습니다!");
    } catch (error) {
      console.error("공유하기 실패:", error);
      alert("공유하기에 실패했습니다.");
    } finally {
      setIsSharing(false);
    }
  };

  // 업로드 화면이 보이는 경우 (회원이든 비회원이든 업로드 완료 전이거나, 회원이 로그아웃되어 강제 전환된 경우)
  if (showUpload) {
    return (
      <Common>
        <div className={styles.analysisContainer}>
          {/* UploadComponent에서 업로드 완료 시 onUploadComplete 콜백 호출 */}
          <UploadComponent onUploadComplete={handleUploadComplete} />
        </div>
      </Common>
    );
  }

  // 업로드 완료 후 분석 결과 화면 렌더링
  return (
    <Common>
      <div className={styles.analysisContainer}>
        <div id="captureArea">
          <div className={styles.headerSection}>
            <h2 className={styles.title}>분석결과(1:1 대화)</h2>
            <p className={styles.description}>{description}</p>
          </div>
          <div className={styles.resultLayout}>
            <div className={styles.leftContainer}>
              <div className={styles.leftSection}>
                <FriendshipMessage data={data} setDescription={setDescription} />
              </div>
              <div className={styles.chartSection}>
                <FriendshipScore data={data} />
              </div>
            </div>
            <div className={styles.analysisGrid}>
              <MessageCount data={data} />
            </div>
          </div>
        </div>

        {showInput && (
          <div className={styles.inputContainer}>
            <input
              type="text"
              placeholder="저장할 파일명을 입력하세요"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              className={styles.fileInput}
            />
            <button onClick={captureScreenAndDownload} className={styles.saveButton}>
              확인
            </button>
          </div>
        )}

        <div className={styles.buttonContainer}>
          <div className={styles.buttonTop}>
            <Button text="📩 분석 결과 저장하기" onClick={handleSaveAsImage} />
            <Button text={isSharing ? "공유 중..." : "🔗 공유하기"} onClick={handleShare} />
          </div>
          <div className={styles.buttonRow}>
            <Button text="🔍 다른 대화 분석하기" onClick={handleResetAndUpload} />
            <Button text="💬 피드백 톡" onClick={toggleModal} />
            {isModalOpen && <Chat onClose={toggleModal} />}
          </div>
        </div>
      </div>
    </Common>
  );
};

export default AnalysisResult;
