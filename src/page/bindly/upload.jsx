import React, { useState } from "react";
import { Common } from "../../component/home/common";
import Button from "../../component/bindly/button";
import styles from "./upload.module.css";
import { ImCancelCircle } from "react-icons/im";
import { PiSpinnerLight } from "react-icons/pi"; 
import AnalysisResult from "../analysis/analysisResult"; // ✅ 결과 분석 화면 추가
import GroupAnalysisResult from "../analysis/groupAnalysisResult";

const Upload = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [errorMessage, setErrorMessage] = useState(""); 
    const [isLoading, setIsLoading] = useState(false); 
    const [progress, setProgress] = useState(0);
    const [currentPage, setCurrentPage] = useState("upload"); // ✅ 화면 상태 관리

    // 파일 선택 핸들러
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        validateFile(file);
    };

    // 파일 드래그 앤 드롭 핸들러
    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleDrop = (event) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        validateFile(file);
    };

    // 파일 검증 함수 (확장자 & 크기 제한)
    const validateFile = (file) => {
        if (!file) {
            setErrorMessage("파일을 선택해주세요.");
            return;
        }

        if (!file.name.endsWith(".txt")) {
            setErrorMessage("❌ 지원되지 않는 파일 형식입니다. (.txt 파일만 업로드 가능)");
            setSelectedFile(null);
            return;
        }

        if (file.size > 1073741824) { // 1GB 제한
            setErrorMessage("⚠️ 파일 크기가 1GB를 초과할 수 없습니다.");
            setSelectedFile(null);
            return;
        }

        setSelectedFile(file);
        setErrorMessage(""); 
    };

    // 파일 삭제 핸들러
    const handleDeleteFile = () => {
        setSelectedFile(null);
        setErrorMessage("");
        setIsLoading(false);
        setProgress(0);
    };

    // 분석 시작 (스피너 로딩 효과 적용)
    const handleUploadClick = () => {
        if (!selectedFile) {
            setErrorMessage("파일을 업로드해주세요.");
            return;
        }

        setIsLoading(true);
        setProgress(0);
        setCurrentPage("loading"); // ✅ 로딩 화면으로 변경

        let progressValue = 0;
        const interval = setInterval(() => {
            progressValue += Math.floor(Math.random() * 10) + 5;
            if (progressValue >= 100) {
                progressValue = 100;
                clearInterval(interval);
                setTimeout(() => {
                    setIsLoading(false);
                    setCurrentPage("result"); // ✅ 결과 분석 화면으로 변경
                }, 500);
            }
            setProgress(progressValue);
        }, 500);
    };

    return (
        <Common>
            {currentPage === "upload" && ( // ✅ 업로드 화면 표시
                <div className={styles.uploadContainer} id="uploadSection">
                    <p className={styles.description}>대화내용.txt 파일을 업로드 해주세요</p>
                    <p className={styles.subDescription}>※ 업로드된 TXT 파일은 분석 시점을 기준으로 최근 1년간의 데이터만 포함됩니다.</p>
                    <div
                        className={`${styles.uploadBox} ${errorMessage ? styles.uploadError : ""}`}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                    >
                        {!selectedFile ? (
                            <>
                                <label htmlFor="fileUpload" className={styles.uploadLabel}>
                                    +
                                    <p className={styles.fileUpload}>파일 업로드</p>
                                </label>
                                {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
                            </>
                        ) : (
                            <div className={styles.uploadedFile}>
                                <p className={styles.uploadedSucces}>업로드 완료</p>
                                <div className={styles.uploadedFileRow}>
                                    <p>{selectedFile.name}</p>
                                    <button className={styles.deleteButton} onClick={handleDeleteFile}>
                                        <ImCancelCircle />
                                    </button>
                                </div>
                            </div>
                        )}
                        <input type="file" id="fileUpload" accept=".txt" onChange={handleFileChange} hidden />
                    </div>
                    {!isLoading && <Button text="분석 시작" onClick={handleUploadClick} />}
                </div>
            )}

            {currentPage === "loading" && ( // ✅ 로딩 화면 표시
                <div className={styles.uploadContainer}>
                    <div className={styles.uploadBox}>
                        <p className={styles.loadingText}>분석 중...</p>
                        <div className={styles.loadingSpinnerContainer}>
                            <PiSpinnerLight className={styles.loadingIcon}/>
                            <span className={styles.loadingPercentage}>{progress}%</span>
                        </div>
                    </div>
                </div>
            )}

            {currentPage === "result" && ( // ✅ 업로드 박스를 제거하고 분석 화면만 표시
                <AnalysisResult />
                // <GroupAnalysisResult />
            )}
        </Common>
    );
};

export default Upload;
