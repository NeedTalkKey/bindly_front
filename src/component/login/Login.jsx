import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import loginStyles from "./Login.module.css";
import logo from "../../asset/logo.png";
import kakao from "../../asset/Kakao_logo.png";
import { config } from "../../config.js";
import { AuthContext } from "../../AuthContext.js"; // AuthContext import
import { MdCancel } from "react-icons/md";

const Login = ({ isModalOpen, closeLoginModal, openRegistModal, }) => {
  const navigate = useNavigate();

  // AuthContext에서 login 함수를 가져옴
  const { login } = useContext(AuthContext);

  const [username, setUserId] = useState("");
  const [password, setPassword] = useState("");

  // 로그아웃후 재로그인시 입력값 초기화
  useEffect(() => {
    if (!isModalOpen) {
      setUserId("");
      setPassword("");
    }
  }, [isModalOpen]);


  // 로그인 버튼 클릭 시 처리
  const handleLogin = async () => {
    if (username.trim() === "" || password.trim() === "") {
      alert("아이디와 비밀번호를 입력해주세요");
      return;
    }
    await fetchLogin();
  };

  // 로그인 API 호출
  const fetchLogin = async () => {
    try {
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.status === true) {
        alert("로그인 성공!");

        // **중요**: AuthContext의 login 함수에 (token, nickname) 모두 넘김
        login(data.token, data.nickname, data.user_model);

        // 모달 닫고 메인 페이지로 이동
        closeLoginModal();
        navigate("/");
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
    window.location.href = `https://kauth.kakao.com/oauth/authorize?client_id=${config.kakao.rest_api_key}&redirect_uri=${config.kakao.redirect_uri}&response_type=code`;
  };

  // 회원가입 모달 열기
  const goRegist = () => {
    closeLoginModal();
    openRegistModal();
  };

  // 모달이 열리지 않았으면 렌더링하지 않음
  if (!isModalOpen) return null;

  return (
    <div className={loginStyles.modalOverlay} onClick={closeLoginModal}>
      <div
        className={loginStyles.modalContent}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={loginStyles.loginHeader}>
          <img className={loginStyles.loginlogo} src={logo} alt="Logo" />
        </div>

        <MdCancel
          className={loginStyles.closeModalButton}
          onClick={closeLoginModal}
        ></MdCancel>

        <input type="text" placeholder="아이디" value={username} 
        onChange={(e) => setUserId(e.target.value)} className={loginStyles.loginid} />

        <input type="password" placeholder="비밀번호" value={password}
        onChange={(e) => setPassword(e.target.value)} className={loginStyles.loginpw} />

        <button className={loginStyles.LoginModalButton} onClick={handleLogin}>
          로그인
        </button>

        <button className={loginStyles.RegistModalButton} onClick={goRegist}>
          회원가입
        </button>

        <div className={loginStyles.kakaologin}>
          <button
            type="button"
            className={loginStyles.kalogin}
            onClick={handleKakaoLogin}
          >
            <img
              className={loginStyles.kakao}
              src={kakao}
              alt="카카오톡 로고"
            />
            카카오톡으로 로그인
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
