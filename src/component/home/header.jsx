import React, { useState, useContext } from "react";
import { Common } from "./common";
import headerStyles from "./header.module.css";
import Login from "../login/Login";
import Regist from "../regist/Regist";
import sad from "../../asset/sad.png"
import { AuthContext } from "../../AuthContext";

const Header = () => {
  const { isLoggedIn, nickname, logout } = useContext(AuthContext);

  // 로그인/회원가입 모달
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegistModalOpen, setIsRegistModalOpen] = useState(false);

  // 로그아웃 모달
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // 로그인 모달 열기
  const openLoginModal = () => {
    setIsLoginModalOpen(true);
    setIsRegistModalOpen(false);
  };
  // 로그인 모달 닫기
  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };
  // 회원가입 모달 열기
  const openRegistModal = () => {
    setIsRegistModalOpen(true);
    setIsLoginModalOpen(false);
  };
  // 회원가입 모달 닫기
  const closeRegistModal = () => {
    setIsRegistModalOpen(false);
  };

  // 로그아웃 버튼 클릭 시
  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };
  // 로그아웃 확인
  const confirmLogout = () => {
    logout();
    setIsLogoutModalOpen(false);
  };
  // 로그아웃 취소
  const cancelLogout = () => {
    setIsLogoutModalOpen(false);
  };

  return (
    <Common>
      <header className={headerStyles.header}>
        {isLoggedIn ? (
          <div className={headerStyles.authContainer}>
            <button className={headerStyles.nicknameBtn}>
              {nickname}님
            </button>
            <button
              className={headerStyles.logout}
              onClick={handleLogoutClick}
            >
              로그아웃
            </button>
          </div>
        ) : (
          <button className={headerStyles.login} onClick={openLoginModal}>
            로그인
          </button>
        )}
      </header>

      {/* 로그인 모달 */}
      <Login
        isModalOpen={isLoginModalOpen}
        closeLoginModal={closeLoginModal}
        openRegistModal={openRegistModal}
      />

      {/* 회원가입 모달 */}
      <Regist
        isModalOpen={isRegistModalOpen}
        closeRegistModal={closeRegistModal}
        openLoginModal={openLoginModal}
      />

      {/* 로그아웃 모달 */}
      {isLogoutModalOpen && (
        <div
          className={headerStyles.logoutModalOverlay}
          onClick={cancelLogout}
        >
          <div
            className={headerStyles.logoutModalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className={headerStyles.logoutTitle}>
              정말 로그아웃하시겠습니까?
            </h2>

            <img
              className={headerStyles.sad}
              src={sad}
              alt="카카오톡 로고"
            />

            <div className={headerStyles.logoutButtonGroup}>
              <button
                className={headerStyles.logoutBlackButton}
                onClick={confirmLogout}
              >
                로그아웃
              </button>
              <button
                className={headerStyles.logoutWhiteButton}
                onClick={cancelLogout}
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </Common>
  );
};

export default Header;
