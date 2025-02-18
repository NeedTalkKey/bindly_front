import React, { useState, useContext } from "react";
import { Common } from "./common";
import headerStyles from "./header.module.css";
import Login from "../login/Login";
import Regist from "../regist/Regist";
import { AuthContext } from "../../AuthContext"; // AuthContext import

const Header = () => {
  // AuthContext에서 전역 로그인 상태와 닉네임, 로그아웃 함수를 가져옴
  const { isLoggedIn, nickname, logout } = useContext(AuthContext);

  // 로그인/회원가입 모달 상태는 로컬로 관리
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegistModalOpen, setIsRegistModalOpen] = useState(false);

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

  // 로그아웃 시 AuthContext의 logout() 호출
  const handleLogout = () => {
    logout();
  };

  return (
    <Common>
      <header className={headerStyles.header}>
        {isLoggedIn ? (
          <div className={headerStyles.authContainer}>
            <button className={headerStyles.nicknameBtn}>{nickname} 님</button>
            <button className={headerStyles.logout} onClick={handleLogout}>
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
        openRegistModal={openRegistModal} // 회원가입 모달 열기
      />

      {/* 회원가입 모달 */}
      <Regist 
        isModalOpen={isRegistModalOpen}   
        closeRegistModal={closeRegistModal} // 회원가입 모달 닫기
        openLoginModal={openLoginModal} // 로그인 모달 열기
      />
    </Common>
  );
};

export default Header;
