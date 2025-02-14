import React, { useState } from "react";
import { Common } from "./common"; // Common 적용
import styles from "./header.module.css";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태 관리
  const [nickname, setNickname] = useState(""); // 닉네임 상태 관리
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false); // 로그인 모달 상태 관리

  // 로그인 버튼 클릭 시 모달 열기
  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  // 로그아웃 버튼 클릭 시
  const handleLogout = () => {
    setIsLoggedIn(false);
    setNickname("");
  };

  return (
    <Common>
      <header className={styles.header}>
        {isLoggedIn ? (
          <div className={styles.authContainer}>
            <button className={styles.nicknameBtn}>{nickname} 님</button>
            <button className={styles.logout} onClick={handleLogout}>
              로그아웃
            </button>
          </div>
        ) : (
          <button className={styles.login} onClick={openLoginModal}>
            로그인
          </button>
        )}
      </header>

      {/* 로그인 모달 (UI만 준비) */}
      {isLoginModalOpen && (
        <div className={styles.modalOverlay} onClick={closeLoginModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2>로그인</h2>
            <p>이곳에 로그인 폼이 추가될 예정입니다.</p>
            <button className={styles.closeButton} onClick={closeLoginModal}>닫기</button>
          </div>
        </div>
      )}
    </Common>
  );
};

export default Header;
