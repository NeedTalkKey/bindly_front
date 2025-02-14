import React, { useState } from "react";
import styles from "./feedbackTalk.module.css";
import feedbackIcon from "../../asset/rabbit.png"; // PNG 아이콘 불러오기

const FeedbackTalk = () => {
    const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태 관리
    const [isTooltipVisible, setIsTooltipVisible] = useState(false); // 말풍선 상태 관리

    // 모달 열기/닫기 함수
    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    return (
        <>
            {/* 스크롤해도 고정된 아이콘 */}
            <div 
                className={styles.feedbackButton} 
                onClick={toggleModal}
                onMouseEnter={() => setIsTooltipVisible(true)} // 마우스를 올리면 말풍선 표시
                onMouseLeave={() => setIsTooltipVisible(false)} // 마우스를 떼면 숨김
            >
                <img src={feedbackIcon} alt="Feedback Icon" className={styles.icon} />
                {/* 말풍선 (마우스를 올렸을 때만 표시) */}
                {isTooltipVisible && (
                    <div className={styles.tooltip}>어떤 대화를 나눴는지 궁금하다면? <br/>피드백톡과 함께 살펴보세요!😃</div>
                )}
            </div>

            {/* 모달 (현재는 UI만 표시) */}
            {isModalOpen && (
                <div className={styles.modalOverlay} onClick={toggleModal}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <h2>Feedback Talk</h2>
                        <p>이곳에 피드백 관련 페이지가 표시될 예정입니다.</p>
                        <button className={styles.closeButton} onClick={toggleModal}>닫기</button>
                    </div>
                </div>
            )}
        </>
    );
};

export default FeedbackTalk;
