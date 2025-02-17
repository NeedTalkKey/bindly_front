import React, { useState } from 'react';
import axios from 'axios';
import backb from '../img/back-arrow.png';
import { useNavigate } from 'react-router-dom';
import styles from './Regist.module.css';


// 회원가입 폼 백업
const Registback = () => {
    const navigate = useNavigate();

  // 상태값 설정 (아이디, 비밀번호, 비밀번호 확인, 이메일)
    const [id, setId] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [email, setEmail] = useState("");

  // 오류 메시지 상태 저장
    const [idMessage, setIdMessage] = useState("");
    const [passwordMessage, setPasswordMessage] = useState("");
    const [passwordConfirmMessage, setPasswordConfirmMessage] = useState("");
    const [emailMessage, setEmailMessage] = useState("");

  // 유효성 검사 상태
    const [isId, setIsId] = useState(false);
    const [isPassword, setIsPassword] = useState(false);
    const [isPasswordConfirm, setIsPasswordConfirm] = useState(false);
    const [isEmail, setIsEmail] = useState(false);

  // 아이디 중복 체크 상태
    const [isCheckingId, setIsCheckingId] = useState(false);

  // 이메일 인증번호 관련 상태
    const [verificationCode, setVerificationCode] = useState("");
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [codeMessage, setCodeMessage] = useState("");
    const [isCodeVerified, setIsCodeVerified] = useState(false);

  // 뒤로가기 클릭 이벤트
    const goBack = () => {
    navigate('/login');
    };

  // 아이디 유효성 검사 및 중복 체크
    const changeId = async (e) => {
    const currentId = e.target.value.trim();
    setId(currentId);

    if (!currentId) {
        setIdMessage("아이디를 입력해주세요.");
        setIsId(false);
        return;
    }

    const idRegExp = /^[a-zA-Z0-9_]{6,}$/;
    if (!idRegExp.test(currentId)) {
        setIdMessage("6글자 이상의 영문자, 숫자, 특수기호(_)만 사용 가능합니다.");
        setIsId(false);
        return;
    }

    // 아이디 중복 체크 요청
    setIsCheckingId(true);
    try {
    const response = await axios.post('/api/check-id', { id: currentId });
    if (response.data.isDuplicate) {
        setIdMessage("이미 사용 중인 아이디입니다.");
        setIsId(false);
    } else {
        setIdMessage("사용 가능한 아이디입니다.");
        setIsId(true);
    }
    } catch (error) {
    setIdMessage("아이디 중복 확인 중 오류가 발생했습니다.");
    setIsId(false);
    } finally {
    setIsCheckingId(false);
    }
};

  // 비밀번호 유효성 검사
    const changePassword = (e) => {
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
    const PasswordConfirm = (e) => {
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
    const emailRegExp =
    /^[A-Za-z0-9_]+[A-Za-z0-9]*[@]{1}[A-Za-z0-9]+[A-Za-z0-9]*[.]{1}[A-Za-z]{1,3}$/;

    if (!emailRegExp.test(currentEmail)) {
    setEmailMessage("이메일 형식이 올바르지 않습니다.");
    setIsEmail(false);
    } else {
    setEmailMessage("");
    setIsEmail(true);
    }
};

  // 이메일 인증번호 발송
  const sendVerificationCode = async () => {
    if (!isEmail) {
    alert("유효한 이메일을 입력해주세요.");
    return;
    }
    try {
    const response = await axios.post('/api/send-email-verification', { email });
    if (response.data.success) {
        setIsCodeSent(true);
        setCodeMessage("인증번호가 전송되었습니다. 이메일을 확인해주세요.");
    } else {
        setCodeMessage("인증번호 전송에 실패했습니다. 다시 시도해주세요.");
    }
    } catch (error) {
    setCodeMessage("인증번호 전송 중 오류가 발생했습니다.");
    }
};

  // 이메일 인증번호 확인
  const verifyEmailCode = async () => {
    if (!verificationCode) {
    setCodeMessage("인증번호를 입력해주세요.");
    return;
    }
    try {
    const response = await axios.post('/api/verify-email-code', { email, verificationCode });
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
    const OnSubmit = (event) => {
    event.preventDefault();

    if (!id) {
    alert("아이디를 입력해주세요.");
    return;
    }
    if (!password) {
    alert("비밀번호를 입력해주세요.");
    return;
    }
    if (!passwordConfirm) {
    alert("비밀번호 확인을 입력해주세요.");
    return;
    }
    if (!email) {
    alert("이메일을 입력해주세요.");
    return;
    }
    if (!isId || !isPassword || !isPasswordConfirm || !isEmail) {
    alert("입력한 정보가 유효하지 않습니다. 다시 확인해주세요.");
    return;
    }
    if (!isCodeVerified) {
    alert("이메일 인증을 완료해주세요.");
    return;
    }

    navigate('/regist2nd');
};

return (
    <div className={styles.regist1All}>
      {/* 회원가입 헤더 */}
    <div className={styles.regist1header}>
        <img onClick={goBack} src={backb} className={styles.backb} alt="뒤로가기 버튼" />
        <h2 className={styles.headerregist}>회원가입</h2>
    </div>
    <form onSubmit={OnSubmit}>
        {/* 아이디 */}
        <div className={styles.formelid}>
        <label className={styles.idlabel} htmlFor="id">아이디</label>
        <input
            type="text"
            id="id"
            value={id}
            onChange={changeId}
            placeholder="아이디를 입력하세요"
            className={styles.registid}
        />
        {isCheckingId && <p className="message">아이디 중복 확인 중...</p>}
        {idMessage && <p className="message">{idMessage}</p>}
        </div>
        {/* 비밀번호 */}
        <div className={styles.formelpw}>
        <label className={styles.pwlabel} htmlFor="password">비밀번호</label>
        <input
            type="password"
            id="password"
            value={password}
            onChange={changePassword}
            placeholder="비밀번호"
            className={styles.registpw}
        />
        {passwordMessage && <p className="message">{passwordMessage}</p>}
        </div>
        {/* 비밀번호 확인 */}
        <div className={styles.formelpwc}>
        <input
            type="password"
            id="passwordconfirm"
            value={passwordConfirm}
            onChange={PasswordConfirm}
            placeholder="비밀번호 확인"
            className={styles.registpwconfirm}
        />
        {passwordConfirmMessage && <p className="message">{passwordConfirmMessage}</p>}
        </div>
        {/* 이메일 및 인증번호 받기 / 확인 */}
        <div className={styles.formelemail}>
        <label className={styles.emaillabel} htmlFor="email">이메일</label>
        <input
            type="email"
            id="email"
            value={email}
            onChange={EmailEvent}
            placeholder="이메일을 입력하세요"
            className={styles.registemail}/>
        {emailMessage && <p className="message">{emailMessage}</p>}
        <button
            type="button"
            onClick={sendVerificationCode}
            className={styles.verificationEmailButton}>
            이메일 인증번호 받기
        </button>
        {isCodeSent && (
        <div className={styles.verificationEmailSection}>
        <input
            type="text"
            onClick={sendVerificationCode}
            className={styles.verificationEmailButton}>
            이메일 인증번호을 입력하세요
        </input>
            {codeMessage && <p className="message">{codeMessage}</p>}
            </div>
        )}
        </div>
        {/* 다음 버튼 */}
        <div className={styles.registbutton}>
        <button type="submit" className={styles.registitem}>
            다음
        </button>
        </div>
    </form>
    </div>
);
};

export default Registback;