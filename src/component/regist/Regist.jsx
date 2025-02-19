import React, { useState } from "react";
import axios from "axios";
import registStyles from "./Regist.module.css";
import { MdCancel } from "react-icons/md";
import { FaArrowLeft } from "react-icons/fa6";
import { config } from "../../config.js"

const Regist = ({ isModalOpen, closeRegistModal, openLoginModal }) => {
  // (아이디, 비밀번호, 비밀번호 확인, 이메일, 닉네임)
  const [username, setUsername] = useState(""); // 사용자 아이디
  const [password, setPassword] = useState(""); // 비밀번호
  const [passwordConfirm, setPasswordConfirm] = useState(""); // 비밀번호 확인
  const [email, setEmail] = useState(""); // 이메일
  const [emailverificationCode, setEmailVerificationCode] = useState(""); // 이메일 인증 코드
  const [nickname, setNickname] = useState(""); // 닉네임

  // 모달 단계
  const [isStep1Open, setIsStep1Open] = useState(true);
  const [isStep2Open, setIsStep2Open] = useState(false);

  // 이메일 유효성 검사 정규식
  const emailRegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // 오류 메시지
  const [useridMessage, setUseridMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordConfirmMessage, setPasswordConfirmMessage] = useState("");
  const [emailMessage, setEmailMessage] = useState("");

  // 유효성 검사
  const [isUserid, setIsUserid] = useState(false);
  const [isPassword, setIsPassword] = useState(false);
  const [isPasswordConfirm, setIsPasswordConfirm] = useState(false);
  const [isEmail, setIsEmail] = useState(false);
  
  // 아이디 중복 체크
  const [isCheckingUserid, setIsCheckingUserid] = useState(false);

  // 이메일 인증번호
  const [codeMessage, setCodeMessage] = useState("");
  const [isCodeVerified, setIsCodeVerified] = useState(false);

  // 이메일 인증번호 입력창 보이기 여부
  const [showVerificationInput, setShowVerificationInput] = useState(false);
  
  // 아이디 유효성 검사 및 중복 체크 (수정된 부분)
  const registUserid = async (e) => {
    const currentUserid = e.target.value.trim();
    setUsername(currentUserid);
  
    if (!currentUserid) {
      setUseridMessage("아이디를 입력해주세요.");
      setIsUserid(false);
      return;
    }
    const idRegExp = /^[a-zA-Z0-9_]{6,}$/;
    if (!idRegExp.test(currentUserid)) {
      setUseridMessage("6글자 이상의 영문자, 숫자, 특수기호(_)만 사용 가능합니다.");
      setIsUserid(false);
      return;
    }
  
    // 아이디 중복 체크 요청 (서버 엔드포인트: /auth/username-dupl-chk)
    setIsCheckingUserid(true);
    try {
      const response = await axios.post(`${config.hosting.ip}:${config.hosting.back_port}/auth/username-dupl-chk`
, { username: currentUserid });
      console.log("중복체크 응답:", response.data);
      if (!response.data.status) {
        setUseridMessage("이미 사용 중인 아이디입니다.");
        setIsUserid(false);
      } else {
        setUseridMessage("사용 가능한 아이디입니다.");
        setIsUserid(true);
      }
    } catch (error) {
      console.error("중복체크 요청 에러:", error);
      setUseridMessage("아이디 중복 확인 중 오류가 발생했습니다.");
      setIsUserid(false);
    } finally {
      setIsCheckingUserid(false);
    }
  };
  
  // 비밀번호 유효성 검사
  const registPassword = (e) => {
    const currentPassword = e.target.value.trim();
    setPassword(currentPassword);
    
    const passwordRegExp = /^(?=.{6,20}$)[A-Za-z0-9!@#$%^&*]+$/;
    if (!passwordRegExp.test(currentPassword)) {
      setPasswordMessage("비밀번호는 6자 이상, 20자 이하여야 합니다.");
      setIsPassword(false);
    } else {
      setPasswordMessage("사용 가능한 비밀번호 입니다.");
      setIsPassword(true);
    }
  };
  
  // 비밀번호 확인 유효성 검사
  const registPasswordConfirm = (e) => {
    const currentConfirm = e.target.value.trim();
    setPasswordConfirm(currentConfirm);
  
    if (!currentConfirm) {
      setPasswordConfirmMessage("비밀번호를 다시 입력해주세요.");
      setIsPasswordConfirm(false);
      return;
    }
  
    if (password !== currentConfirm) {
      setPasswordConfirmMessage("동일한 비밀번호를 입력해주세요.");
      setIsPasswordConfirm(false);
    } else {
      setPasswordConfirmMessage("동일한 비밀번호입니다.");
      setIsPasswordConfirm(true);
    }
  };
  
  // 이메일 유효성 검사
  const EmailEvent = (e) => {
    const currentEmail = e.target.value;
    setEmail(currentEmail);
    const emailPattern =
      /^[A-Za-z0-9_]+[A-Za-z0-9]*[@]{1}[A-Za-z0-9]+[A-Za-z0-9]*[.]{1}[A-Za-z]{1,3}$/;
  
    if (!emailPattern.test(currentEmail)) {
      setEmailMessage("이메일 형식이 올바르지 않습니다.");
      setIsEmail(false);
    } else {
      setEmailMessage("사용 할 수있는 이메일입니다.");
      setIsEmail(true);
    }
  };
  
  // 이메일 인증번호 발송
  const verificationEmailButton = async () => {
    if (!isEmail) {
      alert("유효한 이메일을 입력해주세요.");
      return;
    }
    try {
      const response = await axios.post(`${config.hosting.ip}:${config.hosting.back_port}/auth/send-email`, { username: username, receiver: email });
      if (response.data.status) {
        setCodeMessage("인증번호가 전송되었습니다. 이메일을 확인해주세요.");
        setShowVerificationInput(true);
      } else {
        setCodeMessage("인증번호 전송에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      setCodeMessage("인증번호 전송 중 오류가 발생했습니다.");
    }
  };
  
  // 이메일 인증번호 확인
  const verifyEmailCode = async () => {
    if (!emailverificationCode) {
      setCodeMessage("인증번호를 입력해주세요.");
      return;
    }
    try {
      const response = await axios.post(`${config.hosting.ip}:${config.hosting.back_port}/auth/verify-email`, { username: username, auth_number: emailverificationCode });
      console.log("이메일 인증 응답:", response.data);
      if (response.data.status) {
        setCodeMessage("인증번호가 확인되었습니다.");
        setIsCodeVerified(true);
      } else {
        setCodeMessage(response.data.message || "인증번호가 일치하지 않습니다.");
        setIsCodeVerified(false);
      }
    } catch (error) {
      setCodeMessage("인증번호 확인 중 오류가 발생했습니다.");
      setIsCodeVerified(false);
    }
  };
  
  // 다음 버튼 클릭 시 이벤트 (모든 조건 및 이메일 인증 완료 후 이동)
  const goToStep2 = () => {
    if (!username || !password || !passwordConfirm || !email) {
      alert("모든 필드를 입력해주세요.");
      return;
    }
    if (password !== passwordConfirm) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
    if (!isUserid || !isPassword || !isPasswordConfirm || !isEmail) {
      alert("입력한 정보가 유효하지 않습니다. 다시 확인해주세요.");
      return;
    }
    if (!isCodeVerified) {
      alert("이메일 인증을 완료해주세요.");
      return;
    }
    setIsStep1Open(false);
    setIsStep2Open(true);
  };
  
  // 회원가입 2단계 -> 1단계 이동
  const goToStep1 = () => {
    resetForm();
  };
  
  // 회원가입 완료 후 입력 초기화 및 API 호출
  const handleSubmitRegistration = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${config.hosting.ip}:${config.hosting.back_port}/auth/create`, {
        username: username,
        password: password,
        email: email,
        nickname: nickname,
      });
      console.log("회원가입 응답:", response.data);
      if (response.data.status) {
        alert("회원가입이 완료되었습니다!");
        closeRegistModal(); // 회원가입 모달 닫기
        if (openLoginModal) {
          openLoginModal(); // 로그인 모달 열기
        }
        resetForm(); // 입력값 초기화
      } else {
        alert("회원가입 실패: " + response.data.message);
      }
    } catch (error) {
      console.error("회원가입 요청 오류:", error);
      alert("회원가입 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };
  
  // 회원가입 닫기 버튼 클릭 시 입력 데이터 초기화
  const closeRegist = () => {
    closeRegistModal();
    resetForm();
  };
  
  // 입력란 초기화
  const resetForm = () => {
    setUsername(""); 
    setPassword(""); 
    setPasswordConfirm(""); 
    setEmail(""); 
    setEmailVerificationCode(""); 
    setNickname(""); 
    setIsStep1Open(true); 
    setIsStep2Open(false); 
    setUseridMessage(""); 
    setPasswordMessage(""); 
    setPasswordConfirmMessage("");  
    setEmailMessage("");            
    setCodeMessage("");
    setIsUserid(false);
    setIsPassword(false);
    setIsPasswordConfirm(false);
    setIsEmail(false);
    setIsCodeVerified(false);
    setShowVerificationInput(false);
  };
  
  return (
    <>
      {isModalOpen && (
        <div className={registStyles.modalOverlay} onClick={closeRegist}>
          <div className={registStyles.modalContent} onClick={(e) => e.stopPropagation()}>
            {/* 닫기 버튼 */}
            <MdCancel className={registStyles.closeModalButton} onClick={closeRegist} />
  
            {/* 회원가입 1단계 */}
            {isStep1Open && (
              <form>
                <FaArrowLeft className={registStyles.backButton} onClick={() => { resetForm(); openLoginModal(); }} />
                <h3 className={registStyles.modalSubtitle}>회원가입</h3>
                {/* 아이디 */}
                <label className={registStyles.idregistlabel}>아이디</label>
                <input type="text" placeholder="아이디" value={username} onChange={registUserid} className={registStyles.registidinput} maxLength={20}/>
                {isCheckingUserid}
                {useridMessage && <div className={registStyles.errorMessage}>{useridMessage}</div>}
                {/* 비밀번호 */}
                <label className={registStyles.pwregistlabel}>비밀번호</label>
                <input type="password" placeholder="비밀번호" value={password} onChange={registPassword} className={registStyles.registpwinput} maxLength={20}/>
                {passwordMessage && <div className={registStyles.errorMessage}>{passwordMessage}</div>}
                {/* 비밀번호 확인 */}
                <input type="password" placeholder="비밀번호 확인" value={passwordConfirm} onChange={registPasswordConfirm} className={registStyles.registpwconfirminput} maxLength={20}/>
                {passwordConfirmMessage && (
                  <div className={registStyles.errorMessage}>{passwordConfirmMessage}</div>
                )}
                {/* 이메일 */}
                <label className={registStyles.emailregistlabel}>이메일</label>
                <div className={registStyles.emailreceiveContainer}>
                  <input type="email" placeholder="이메일 입력" value={email} onChange={EmailEvent} className={registStyles.emailregistInput} />
                  <button type="button" className={registStyles.EmailverificationButton} onClick={verificationEmailButton} disabled={!emailRegExp.test(email)}>
                    인증번호 받기
                  </button>
                </div>
                {emailMessage && <div className={registStyles.errorMessage}>{emailMessage}</div>}
                {showVerificationInput && (
                  <div className={registStyles.emailverifyContainer}>
                    <input type="text" placeholder="이메일 인증번호 입력" value={emailverificationCode} onChange={(e) => setEmailVerificationCode(e.target.value)} className={registStyles.EmailverificationInput} maxLength={6} />
                    <button type="button" className={registStyles.EmailverificationconfirmButton} onClick={verifyEmailCode}>
                      인증번호 확인
                    </button>
                  </div>
                )}
                {codeMessage && <div className={registStyles.infoMessage}>{codeMessage}</div>}
                <button type="button" className={registStyles.nextButton} onClick={goToStep2}>
                  다음
                </button>
              </form>
            )}
  
            {/* 회원가입 2단계 */}
            {isStep2Open && (
              <form onSubmit={handleSubmitRegistration} className={registStyles.modalStep2}>
                <div className={registStyles.topBar}>
                <FaArrowLeft type="button" className={registStyles.backButton} onClick={goToStep1} />
                <h3 className={registStyles.modalSubtitle}>회원가입</h3>
                <MdCancel className={registStyles.closeModalButton} onClick={closeRegist} />
                </div>
                {/* 닉네임 */}
                <div className={registStyles.nickContainer}>
                <label className={registStyles.registnicknamelabel}>닉네임</label>
                <input type="text" placeholder="닉네임을 입력하세요" value={nickname} onChange={(e) => setNickname(e.target.value)} className={registStyles.registNicknameInput} 
                maxLength={20}/>
                </div>
                <button type="submit" className={registStyles.completeButton}>
                  시작하기
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Regist;