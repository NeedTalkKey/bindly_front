// upload.jsx
import React, { useState } from "react";
import { Common } from "../../component/home/common";
import Button from "../../component/bindly/button";
import styles from "./upload.module.css";
import { config } from "../../config.js";
import { ImCancelCircle } from "react-icons/im";
import { PiSpinnerLight } from "react-icons/pi";
import AnalysisResult from "../analysis/analysisResult";
import Chat from "../home/Chat.jsx"; // Chat 컴포넌트 import (상대 경로 확인)

const Upload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentPage, setCurrentPage] = useState("upload");

  // 백엔드에서 반환된 분석 결과를 저장
  const [analysisData, setAnalysisData] = useState(null);

  // 파일 선택 핸들러
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    validateFile(file);
  };

  // 파일 드래그 앤 드롭
  const handleDragOver = (event) => event.preventDefault();
  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    validateFile(file);
  };

  // 파일 검증
  const validateFile = (file) => {
    if (!file) {
      setErrorMessage("파일을 선택해주세요.");
      return;
    }
    if (!file.name.endsWith(".txt")) {
      setErrorMessage("❌ 지원되지 않는 파일 형식입니다. (.txt 파일만)");
      setSelectedFile(null);
      return;
    }
    if (file.size > 1073741824) {
      setErrorMessage("⚠️ 파일 크기가 1GB를 초과할 수 없습니다.");
      setSelectedFile(null);
      return;
    }
    setSelectedFile(file);
    setErrorMessage("");
  };

  // 파일 삭제
  const handleDeleteFile = () => {
    setSelectedFile(null);
    setErrorMessage("");
    setIsLoading(false);
    setProgress(0);
  };

  // "분석 시작" 버튼 클릭
  const handleUploadClick = async () => {
    if (!selectedFile) {
      setErrorMessage("파일을 업로드해주세요.");
      return;
    }
    setIsLoading(true);
    setProgress(0);
    setCurrentPage("loading");

    try {
      // FormData 생성
      const formData = new FormData();
      formData.append("file", selectedFile);

      // Fetch로 업로드 및 분석 요청
      const response = await fetch(
        `${config.hosting.ip}:${config.hosting.back_port}/analysis/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`서버 에러: ${response.status} - ${errText}`);
      }

      // 결과 JSON
      const data = await response.json();
      console.log("분석 결과:", data);
      setAnalysisData(data);

      setProgress(100);

      // 로딩 0.5초 뒤 결과 화면으로
      setTimeout(() => {
        setIsLoading(false);
        setCurrentPage("result");
      }, 500);
    } catch (error) {
      console.error("파일 분석 중 오류:", error);
      setErrorMessage("파일 분석 중 오류가 발생했습니다.");
      setIsLoading(false);
      setProgress(0);
      setCurrentPage("upload");
    }
  };

  // "대화 피드백 보기" 버튼을 누르면 Chat 페이지로 이동
  const handleShowChat = () => {
    setCurrentPage("chat");
  };

  // Chat.jsx에서 닫기 버튼을 누르면 결과 페이지로 복귀
  const handleCloseChat = () => {
    setCurrentPage("result");
  };

  return (
    <Common>
      {currentPage === "upload" && (
        <div className={styles.uploadContainer} id="uploadSection">
          <p className={styles.description}>
            대화내용.txt 파일을 업로드 해주세요
          </p>
          <p className={styles.subDescription}>
            ※ 업로드된 TXT 파일은 분석 시점을 기준으로 최근 1년간의 데이터만
            포함됩니다.
          </p>
          <div
            className={`${styles.uploadBox} ${
              errorMessage ? styles.uploadError : ""
            }`}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {!selectedFile ? (
              <>
                <label htmlFor="fileUpload" className={styles.uploadLabel}>
                  +<p className={styles.fileUpload}>파일 업로드</p>
                </label>
                {errorMessage && (
                  <p className={styles.errorMessage}>{errorMessage}</p>
                )}
              </>
            ) : (
              <div className={styles.uploadedFile}>
                <p className={styles.uploadedSucces}>업로드 완료</p>
                <div className={styles.uploadedFileRow}>
                  <p>{selectedFile.name}</p>
                  <button
                    className={styles.deleteButton}
                    onClick={handleDeleteFile}
                  >
                    <ImCancelCircle />
                  </button>
                </div>
              </div>
            )}
            <input
              type="file"
              id="fileUpload"
              accept=".txt"
              onChange={handleFileChange}
              hidden
            />
          </div>
          {!isLoading && (
            <Button text="분석 시작" onClick={handleUploadClick} />
          )}
        </div>
      )}

      {currentPage === "loading" && (
        <div className={styles.uploadContainer}>
          <div className={styles.uploadBox}>
            <p className={styles.loadingText}>분석 중...</p>
            <div className={styles.loadingSpinnerContainer}>
              <PiSpinnerLight className={styles.loadingIcon} />
              <span className={styles.loadingPercentage}></span>
            </div>
          </div>
        </div>
      )}

      {currentPage === "result" && analysisData && (
        <AnalysisResult
          analysisData={analysisData}
          onShowChat={handleShowChat} // "대화 피드백 보기" 버튼에서 호출
        />
      )}

      {currentPage === "chat" && analysisData && (
        <Chat
          onClose={handleCloseChat}
          conversationText={analysisData.normalizedText} // 분석된 전체 대화 전달
        />
      )}
    </Common>
  );
};

export default Upload;
