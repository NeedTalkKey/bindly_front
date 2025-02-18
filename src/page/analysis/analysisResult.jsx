import React, { useState } from "react";
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

const tempData = {
    userName: "박지호",
    partnerName: "김남형",
    userScore: 40,
    partnerScore: 42,
    totalScore: 82,
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
    keywords: [
        { text: "친구", value: 60 },
        { text: "안녕하세요", value: 45 },
        { text: "대화", value: 40 },
        { text: "재밌다", value: 25 },
        { text: "월요일", value: 20 },
        { text: "약속속", value: 70 },
        { text: "약약속", value: 20 },
        { text: "화요일", value: 30 },
        { text: "금요일", value: 55 },
        { text: "내일", value: 10 },
    ],
};

const AnalysisResult = () => {
    const [description, setDescription] = useState("");
    const [fileName, setFileName] = useState("");
    const [showInput, setShowInput] = useState(false);
    const [showUpload, setShowUpload] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태 관리

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

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

                            {/* 캡처할 영역 */}
                            <div className={styles.resultLayout}>
                                <div className={styles.leftContainer}>
                                    <div className={styles.leftSection}>
                                        <FriendshipMessage userScore={tempData.userScore} partnerScore={tempData.partnerScore} setDescription={setDescription} />
                                    </div>
                                    <div className={styles.chartSection}>
                                        <FriendshipScore data={tempData} />
                                    </div>
                                </div>

                                <div className={styles.analysisGrid}>
                                    <StyleChart data={tempData.conversationStyle} />
                                    <ReplyTime data={tempData} />
                                    <WordCloud words={tempData.keywords} />
                                    <MessageCount data={tempData} />
                                </div>
                            </div>
                        </div>

                        {/* 파일명 입력창 */}
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
                            <Button className={styles.buttonTop} text="📩 분석 결과 저장하기" onClick={handleSaveAsImage} />
                            <div className={styles.buttonRow}>
                                <Button text="🔍 다른 대화 분석하기" onClick={handleResetAndUpload} />
                                <Button text="💬 피드백 톡" className="chat-send" onClick={toggleModal} /> {/* 🚀 버튼 클릭 시 모달 열기 */}

                                {/* 🔥 Chat 모달을 feedbacktalk.jsx와 동일하게 렌더링 */}
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
