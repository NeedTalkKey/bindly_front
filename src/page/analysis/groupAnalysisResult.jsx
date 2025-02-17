import React, { useState } from "react";
import html2canvas from "html2canvas";
import styles from "./groupAnalysisResult.module.css";
import WordCloud from "../../component/analysis/wordCloud";
import StyleChart from "../../component/analysis/styleChart";
import TopTalker from "../../component/analysis/topTalker";
import UploadComponent from "../bindly/upload";
import Button from "../../component/bindly/button";

const tempData = {
    conversationStyle: {
        empathy: 30,
        direct: 40,
        logic: 35,
        humor: 50,
    },
    keywords: [
        { text: "안녕하세요", value: 50 },
        { text: "진짜", value: 30 },
        { text: "다들", value: 40 },
        { text: "제발", value: 25 },
        { text: "ㅋㅋㅋ", value: 20 },
        { text: "여행", value: 20 },
        { text: "가족", value: 10 },
        { text: "일용일", value: 40 },
        { text: "놀자", value: 30 },
    ],
    talkers: {
        best: "박치호",
        worst: "박치호",
        tooMuch: "박치호",
        small: "박치호",
    },
};

const GroupAnalysisResult = () => {
    const [fileName, setFileName] = useState("");
    const [showInput, setShowInput] = useState(false);
    const [showUpload, setShowUpload] = useState(false);

    const handleSaveAsImage = () => {
        setShowInput(true);
    };

    const captureScreen = () => {
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
        // ✅ 기존 데이터 초기화 및 업로드 화면 표시
        setShowUpload(true);
    };

    return (
        <div className={styles.analysisContainer}>
            {showUpload ? (
                <UploadComponent />
            ) : (
                <>
                    <div id="captureArea">
                        <h2 className={styles.title}>분석결과(단체 대화)</h2>
                        <div className={styles.resultLayout}>
                            <div className={styles.wordCloudSection}>
                                <WordCloud words={tempData.keywords} />
                            </div>
                            <div className={styles.chartSection}>
                                <StyleChart data={tempData.conversationStyle} />
                            </div>
                            <div className={styles.talkerSection}>
                                <TopTalker talkers={tempData.talkers} />
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
                            <button onClick={captureScreen} className={styles.saveButton}>확인</button>
                        </div>
                    )}
                    <div className={styles.buttonContainer}>
                        <Button text="📩 분석 결과 저장하기" onClick={handleSaveAsImage} />
                        <Button text="🔍 다른 대화 분석하기" onClick={handleResetAndUpload} />
                    </div>
                </>
            )}
        </div>

    );
};

export default GroupAnalysisResult;
