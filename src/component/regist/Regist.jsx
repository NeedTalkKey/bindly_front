import React, { useState } from "react";
import axios from "axios";
import registStyles from "./Regist.module.css";
import backb from "../../asset/back-arrow.png";

const Regist = ({ isModalOpen, closeRegistModal, openLoginModal }) => {
  //(아이디, 비밀번호, 비밀번호 확인, 이메일, 닉네임)
  const [userid, setUserid] = useState(""); // 사용자 아이디
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
  
  // 아이디 유효성 검사
  const registUserid = async (e) => {
    const currentUserid = e.target.value.trim();
    setUserid(currentUserid);
  
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
  
    // 아이디 중복 체크 요청
    setIsCheckingUserid(true);
    try {
      const response = await axios.post('/api/check-id', { id: currentUserid });
      if (response.data.isDuplicate) {
        setUseridMessage("이미 사용 중인 아이디입니다.");
        setIsUserid(false);
      } else {
        setUseridMessage("사용 가능한 아이디입니다.");
        setIsUserid(true);
      }
    } catch (error) {
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
  
    const passwordRegExp = /^[a-zA-Z0-9_]{6,32}$/;
    if (!passwordRegExp.test(currentPassword)) {
      setPasswordMessage("6글자 이상 입력해 주세요.");
      setIsPassword(false);
    } else {
      setPasswordMessage("");
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
      setPasswordConfirmMessage("");
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
      setEmailMessage("");
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
      const response = await axios.post('/api/send-email-verification', { email });
      if (response.data.success) {
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
      const response = await axios.post('/api/verify-email-code', { email, emailverificationCode });
      if (response.data.verified) {
        setCodeMessage("인증번호가 확인되었습니다.");
        setIsCodeVerified(true);
      } else {
        setCodeMessage("인증번호가 일치하지 않습니다.");
        setIsCodeVerified(false);
      }
    } catch (error) {
      setCodeMessage("인증번호 확인 중 오류가 발생했습니다.");
      setIsCodeVerified(false);
    }
  };
  
  // 다음 버튼 클릭 시 이벤트 (모든 조건 및 이메일 인증 완료 후 이동)
  const goToStep2 = () => {
    if (!userid || !password || !passwordConfirm || !email) {
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
  
  // 회원가입 완료 후 입력 초기화
  // 회원가입 완료 후 API 호출 및 입력 초기화
  const handleSubmitRegistration = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/auth/register", {
        userId: userid,
        password: password,
        email: email,
        nickname: nickname,
      });
      console.log(response)
      
      if (response.data.success) {
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
    setUserid(""); 
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
      {/* 회원가입 모달 */}
      {isModalOpen && (
        <div className={registStyles.modalOverlay} onClick={closeRegist}>
          <div className={registStyles.modalContent} onClick={(e) => e.stopPropagation()}>
            {/* 닫기 버튼 */}
            <button className={registStyles.closeModalButton} onClick={closeRegist}>
            x
            </button>

            {/* 회원가입 1단계 */}
            {isStep1Open && (
              <form>
                <img src={backb} className={registStyles.backButton} onClick={() => { resetForm(); openLoginModal();}} alt="뒤로가기">
                </img>
                <h3 className={registStyles.modalSubtitle}>회원가입</h3>
                {/* 아이디 */}
                <label className={registStyles.idregistlabel}>아이디</label>
                <input type="text" placeholder="아이디" value={userid} onChange={registUserid} className={registStyles.registidinput} />
                {isCheckingUserid && <p className={registStyles.message}>아이디 중복 확인 중...</p>}
                {useridMessage && <div className={registStyles.errorMessage}>{useridMessage}</div>}
                {/* 비밀번호 */}
                <label className={registStyles.pwregistlabel}>비밀번호</label>
                <input type="password" placeholder="비밀번호" value={password} onChange={registPassword} className={registStyles.registpwinput} />
                {passwordMessage && <div className={registStyles.errorMessage}>{passwordMessage}</div>}
                {/* 비밀번호 확인 */}
                <input type="password" placeholder="비밀번호 확인" value={passwordConfirm} onChange={registPasswordConfirm} className={registStyles.registpwconfirminput} />
                {passwordConfirmMessage && (
                <div className={registStyles.errorMessage}>{passwordConfirmMessage}</div>
                )}
                {/* 이메일 */}
                <label className={registStyles.emailregistlabel}>이메일</label>
                <div className={registStyles.emailContainer}>
                {/* 이메일 입력 */}
                <input type="email" placeholder="이메일 입력" value={email} onChange={EmailEvent} className={registStyles.emailregistInput} />
                {/* 인증번호 받기 */}
                <button type="button" className={registStyles.EmailverificationButton} onClick={verificationEmailButton} disabled={!emailRegExp.test(email)}>
                인증번호 받기
                </button>
                </div>
                {emailMessage && <div className={registStyles.errorMessage}>{emailMessage}</div>}
                {showVerificationInput && (
                  <>
                    {/* 인증번호 4자리 입력 */}
                    <input type="text" placeholder="인증번호 4자리 입력" value={emailverificationCode} onChange={(e) => setEmailVerificationCode(e.target.value)} className={registStyles.EmailverificationInput} maxLength={4} />
                    {/* 인증번호 확인 */}
                    <button type="button" className={registStyles.EmailverificationconfirmButton} onClick={verifyEmailCode}>
                      인증번호 확인
                    </button>
                  </>
                )}
                {codeMessage && <div className={registStyles.infoMessage}>{codeMessage}</div>}
                {/* 다음 */}
                <button type="button" className={registStyles.nextButton} onClick={goToStep2}>
                  다음
                </button>
              </form>
            )}

            {/* 회원가입 2단계 */}
            {isStep2Open && (
            <form onSubmit={handleSubmitRegistration}>
            <button type="button" className={registStyles.backButton} onClick={goToStep1}>←</button>
            <h3 className={registStyles.modalSubtitle}>회원가입</h3>
              {/* 닉네임 */}
            <label className={registStyles.registnicknamelabel}>닉네임</label>
            <input type="text" placeholder="닉네임을 입력하세요" value={nickname} onChange={(e) => setNickname(e.target.value)} className={registStyles.registNicknameInput} />
            {/* 회원가입 완료 */}
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
