import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import loginStyles from "./Login.module.css";
import logo from "../../asset/logo.png";
import kakao from "../../asset/Kakao_logo.png";

const Login = ({ isModalOpen, closeLoginModal, setIsLoggedIn, setNickname, openRegistModal }) => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(""); // 아이디
  const [password, setPassword] = useState(""); // 비밀번호 

  // 로그인 버튼
  const handleLogin = async () => {
    if (userId.trim() === "" || password.trim() === "") {
      alert("아이디와 비밀번호를 입력해주세요");
      return;
    }  
    await fetchLogin();
  };

  // 회원가입 모달 열기 (로그인 모달 닫고 회원가입 모달 열기)
  const goRegist = () => {
    closeLoginModal();
    openRegistModal();
  };
  

  // 로그인 API
  const fetchLogin = async () => {
    try {
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("로그인 성공!");
        localStorage.setItem("token", data.token); // JWT 토큰 저장
        setIsLoggedIn(true); // 로그인 상태 변경
        setNickname(data.nickname); // 닉네임 
        closeLoginModal(); // 로그인 성공 시 모달 닫기
        navigate("/"); // 로그인 후 메인 페이지로 이동
      } else {
        alert(`로그인 실패: ${data.message}`);
      }
    } catch (error) {
      console.error("로그인 요청 오류:", error);
      alert("아이디와 비밀번호를 확인해주세요.");
    }
  };

  // 카카오 로그인
  const handleKakaoLogin = () => {
    window.location.href = `https://kauth.kakao.com/oauth/authorize?client_id=YOUR_KAKAO_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI&response_type=code`;
  };

  return (
    <>
      {/* 로그인 모달 열기 */}
      {isModalOpen && (
        <div className={loginStyles.modalOverlay} onClick={closeLoginModal}>
          <div className={loginStyles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={loginStyles.loginHeader}>
              <img className={loginStyles.loginlogo} src={logo} alt="Logo" />
            </div>

            {/* 로그인 모달 닫기 */}
            <button className={loginStyles.closeModalButton} onClick={closeLoginModal}>X</button>

            {/* 아이디*/}
            <input type="text" placeholder="아이디" value={userId} onChange={(e) => setUserId(e.target.value)}className={loginStyles.loginid} />

            {/* 비밀번호 */}
            <input type="password" placeholder="비밀번호" value={password} onChange={(e) => setPassword(e.target.value)} className={loginStyles.loginpw} />

            {/* 로그인  */}
            <button className={loginStyles.LoginModalButton} onClick={handleLogin}>로그인</button>

            {/* 회원가입 */}
            <button className={loginStyles.RegistModalButton} onClick={goRegist}>회원가입</button>

            {/* 카카오 로그인 */}
            <div className={loginStyles.kakaologin}>
              <button type="button" className={loginStyles.kalogin} onClick={handleKakaoLogin}>
                <img className={loginStyles.kakao} src={kakao} alt="카카오톡 로고" />
                카카오톡으로 로그인
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
