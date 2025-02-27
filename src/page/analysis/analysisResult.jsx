// analysisResult.jsx
import React, { useState, useEffect, useContext } from "react";
import { Common } from "../../component/home/common";
import html2canvas from "html2canvas";
import styles from "./analysisResult.module.css";
import FriendshipMessage from "../../component/analysis/friendshipMessage";
import FriendshipScore from "../../component/analysis/friendshipScore";
import MessageCount from "../../component/analysis/messageCount";
import StyleChart from "../../component/analysis/styleChart";
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
  // 분석 단계에서 반환된 전체 대화 텍스트 예시 (문자열로 처리)
  normalizedText: `[u1] ㅋㅋㅋㅋㅋㅋㅋ 설마;; 10달라
[u2] 아놀래라
10만원 넣었으면 난 전부 gpt로 돌리지
그건그치
하 햇빛 쬐서 그런가 몸에 기운이 없냐 근데 진짜 빛 쬐면 몸에 힘이 빠진다니까?
뭔
이게 물리적으로 진짜 빠짐
흡혈귀여\\
농담같지 진짜야 진짜 그냥 축 쳐짐 그리고 갑자기 밝아지면 기침나오고 그럼`,
};

const AnalysisResult = ({ analysisData }) => {
  const { isLoggedIn } = useContext(AuthContext);

  // 업로드 화면(true) vs 분석 결과 화면(false)를 구분하는 상태
  const [showUpload, setShowUpload] = useState(false);
  // 회원 상태 추적
  const [wasLoggedIn, setWasLoggedIn] = useState(isLoggedIn);

  // 내부 상태
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

  // 로그아웃 감지 (필요한 경우)
  useEffect(() => {
    if (wasLoggedIn && !isLoggedIn) {
      setShowUpload(true);
      setDescription("");
      setFileName("");
      setShowInput(false);
      setIsModalOpen(false);
      setIsSharing(false);
    }
    setWasLoggedIn(isLoggedIn);
  }, [isLoggedIn, wasLoggedIn]);

  // 업로드 완료 시 콜백
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
      const shareLink = `${
        window.location.origin
      }/share?imgUrl=${encodeURIComponent(json.secure_url)}`;
      await navigator.clipboard.writeText(shareLink);
      alert("링크가 복사되었습니다!");
    } catch (error) {
      console.error("공유하기 실패:", error);
      alert("공유하기에 실패했습니다.");
    } finally {
      setIsSharing(false);
    }
  };

  // 업로드 화면이 보이는 경우
  if (showUpload) {
    return (
      <Common>
        <div className={styles.analysisContainer}>
          <UploadComponent onUploadComplete={handleUploadComplete} />
        </div>
      </Common>
    );
  }

  // 분석 결과 화면 렌더링
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
                <FriendshipMessage
                  data={data}
                  setDescription={setDescription}
                />
              </div>
              <div className={styles.chartSection}>
                <FriendshipScore data={data} />
              </div>
            </div>
            <div>
              <div className={styles.analysisGrid}>
                <MessageCount data={data} />
              </div>
              <div className={styles.analysisGrid}>
                <StyleChart data={data} />
              </div>
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
            <button
              onClick={captureScreenAndDownload}
              className={styles.saveButton}
            >
              확인
            </button>
          </div>
        )}

        <div className={styles.buttonContainer}>
          <div className={styles.buttonTop}>
            <Button text="📩 분석 결과 저장하기" onClick={handleSaveAsImage} />
            <Button
              text={isSharing ? "공유 중..." : "🔗 공유하기"}
              onClick={handleShare}
            />
          </div>
          <div className={styles.buttonRow}>
            <Button
              text="🔍 다른 대화 분석하기"
              onClick={handleResetAndUpload}
            />
            {/* "💬 피드백 톡" 버튼 클릭 시 모달로 Chat 컴포넌트를 띄움 */}
            <Button text="💬 피드백 톡" onClick={toggleModal} />
          </div>
        </div>

        {isModalOpen && (
          // Chat 컴포넌트에 분석된 전체 대화(normalizedText)를 conversationText로 전달
          <Chat
            onClose={toggleModal}
            conversationText={data.normalizedText}
            speakerMapping={data.speakerMapping}
          />
        )}
      </div>
    </Common>
  );
};

export default AnalysisResult;
