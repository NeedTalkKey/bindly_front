import React, { useState, useEffect } from "react";
import { Common } from "../../component/home/common";
import html2canvas from "html2canvas";
import styles from "./analysisResult.module.css";
import FriendshipMessage from "../../component/analysis/friendshipMessage";
import FriendshipScore from "../../component/analysis/friendshipScore";
import StyleChart from "../../component/analysis/styleChart";
import ReplyTime from "../../component/analysis/replyTime";
import MessageCount from "../../component/analysis/messageCount";
import WordCloud from "../../component/analysis/wordCloud";
import UploadComponent from "../bindly/upload";
import Button from "../../component/bindly/button";
import { Chat } from "../home/Chat";
import { config } from "../../config"; // config 가져오기

// [1] 가짜 데이터 (fallback)
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
  // [2] analysisData가 없으면 tempData를 쓰고, 있으면 그걸 사용
  const data = analysisData || tempData;

  const [description, setDescription] = useState("");
  const [fileName, setFileName] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  useEffect(() => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  }, []);

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

  const handleResetAndUpload = () => {
    setShowUpload(true);
  };

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

      // 링크 생성 후 복사
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

  return (
    <Common>
      <div className={styles.analysisContainer}>
        {showUpload ? (
          <UploadComponent />
        ) : (
          <>
            <div id="captureArea">
              <div className={styles.headerSection}>
                <h2 className={styles.title}>분석결과(1:1 대화)</h2>
                <p className={styles.description}>{description}</p>
              </div>
              <div className={styles.resultLayout}>
                <div className={styles.leftContainer}>
                  <div className={styles.leftSection}>
                    {/* 예: 우선 Message나 Score 컴포넌트 등에 data를 그대로 넘김 */}
                    <FriendshipMessage data={data} setDescription={setDescription} />
                  </div>
                  <div className={styles.chartSection}>
                    <FriendshipScore data={data} />
                  </div>
                </div>

                <div className={styles.analysisGrid}>
                  {/* <StyleChart data={data.conversationStyle} /> */}
                  <MessageCount data={data} />
                  {/* <WordCloud words={data.keywords} /> */}
                  {/* <ReplyTime data={data} /> */}
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
                <Button text="💬 피드백 톡" className="chat-send" onClick={toggleModal} />
                {isModalOpen && <Chat onClose={toggleModal} />}
              </div>
            </div>
          </>
        )}
      </div>
    </Common>
  );
};

export default AnalysisResult;
