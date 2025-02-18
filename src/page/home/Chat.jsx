import React, { useState } from "react";
import "./Chat.css";
import { Common } from "../../component/home/common";
import Sidebar from "../../component/home/sidebar";
import "./ChatLayout.css";
import Rabbit from "../../asset/rabbit.png";
import { MdCancel } from "react-icons/md";
import { useContext } from "react";
import { AuthContext } from "../../AuthContext";

export const Chat = ({ onClose }) => {
  const { isLoggedIn } = useContext(AuthContext);

  // 버튼 단계 로직 (기존)
  const [step, setStep] = useState(1);
  const buttonStages = [
    [
      { text: "김남희", next: 2 },
      { text: "안승균", next: 2 }
    ],
    [
      { text: "공감", next: 3 },
      { text: "팩폭", next: 3 }
    ],
    [
      { text: "부정적인 대화", next: 4 },
      { text: "긍정적인 대화", next: 4 }
    ],
    [
      { text: "대화 더보기", next: 4 },
      { text: "마무리 하기", next: 4 }
    ]
  ];

  // 비회원용 더미 메시지
  const dummyMessages = (
    <>
      {/* Message In */}
      <div className="message other d-flex flex-row align-items-start mb-5">
        <div className="symbol symbol-40 mr-3">
          <img
            alt="Pic"
            src={Rabbit}
            style={{ width: "40px", height: "40px", borderRadius: "50%" }}
          />
        </div>
        <div className="message-content rounded p-5 text-dark-50 font-weight-bold font-size-lg text-left max-w-400px">
          하루 종일 그대가 집에 오기만 무릎 꿇고 얌전히 기다렸다가
        </div>
      </div>
      {/* Message Out */}
      <div className="message you d-flex flex-row align-items-end justify-content-end mb-5">
        <div className="message-content rounded p-5 text-dark-50 font-weight-bold font-size-lg text-right max-w-400px">
          초인종이 울리면 문 앞에 앉아 반갑다 꼬리를 흔들 거야
        </div>
      </div>
      {/* Message In */}
      <div className="message other d-flex flex-row align-items-start mb-5">
        <div className="symbol symbol-40 mr-3">
          <img
            alt="Pic"
            src={Rabbit}
            style={{ width: "40px", height: "40px", borderRadius: "50%" }}
          />
        </div>
        <div className="message-content rounded p-5 text-dark-50 font-weight-bold font-size-lg text-left max-w-400px">
          누가 봐도 못되게 굴어 왔지만 오늘부턴 착하게 지내 볼 거야
          다른 곳은 절대로 쳐다 보지마 온종일 너만 기다리니까
        </div>
      </div>
      {/* Message Out */}
      <div className="message you d-flex flex-row align-items-end justify-content-end mb-5">
        <div className="message-content rounded p-5 text-dark-50 font-weight-bold font-size-lg text-right max-w-400px">
          그대 없인 아무것도 못해내는 바보지
        </div>
      </div>
      {/* Message In */}
      <div className="message other d-flex flex-row align-items-start mb-5">
        <div className="symbol symbol-40 mr-3">
          <img
            alt="Pic"
            src={Rabbit}
            style={{ width: "40px", height: "40px", borderRadius: "50%" }}
          />
        </div>
        <div className="message-content rounded p-5 text-dark-50 font-weight-bold font-size-lg text-left max-w-400px">
          혼자 남은 30초를 못 견디고 아프지
        </div>
      </div>
      {/* Message Out */}
      <div className="message you d-flex flex-row align-items-end justify-content-end mb-5">
        <div className="message-content rounded p-5 text-dark-50 font-weight-bold font-size-lg text-right max-w-400px">
          그대 없인 삼시세끼 못 먹지 굶어 죽지 나를 혼자 남겨 두지마 나를 방치 하지마 날 묶어줘
          보채고 혼내줘 너의 강아지처럼 길들여줘
        </div>
      </div>
      {/* Message In */}
      <div className="message other d-flex flex-row align-items-start mb-5">
        <div className="symbol symbol-40 mr-3">
          <img
            alt="Pic"
            src={Rabbit}
            style={{ width: "40px", height: "40px", borderRadius: "50%" }}
          />
        </div>
        <div className="message-content rounded p-5 text-dark-50 font-weight-bold font-size-lg text-left max-w-400px">
          네 침대에 네 품에 재워줘 24시간을 구속해줘
        </div>
      </div>
      {/* Message Out */}
      <div className="message you d-flex flex-row align-items-end justify-content-end mb-5">
        <div className="message-content rounded p-5 text-dark-50 font-weight-bold font-size-lg text-right max-w-400px">
          10cm의 pet이었습니다
        </div>
      </div>
    </>
  );

  return (
    <Common>
      {/* 모달 뒷배경 (검은 오버레이) */}
      <div className="modalOverlay">
        <div
          className="modal modal-sticky show"
          id="kt_chat_modal"
          data-backdrop="false"
          style={{ display: "block" }}
          aria-modal="true"
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            {/* modal-content 전체에 custom-layout 클래스 적용 */}
            <div className="modal-content custom-layout">
              {/* 왼쪽 사이드바 영역 */}
              <div className="sidebar-wrapper">
                <Sidebar />
              </div>

              {/* 오른쪽 채팅 콘텐츠 영역 (회원/비회원에 따라 blur) */}
              <div
                className={
                  "chat-content-wrapper " + (!isLoggedIn ? "blurred" : "")
                }
              >
                {/* 닫기 아이콘 */}
                <MdCancel className="close-icon" onClick={onClose} />

                {/* 채팅 본문 */}
                <div className="card-body chat-body">
                  <div className="messages">
                    {isLoggedIn ? (
                      /* 회원일 경우: 빈 화면 (메시지 없음) */
                      <p style={{ color: "#999", textAlign: "center" }}>
                        대화 내역이 없습니다.
                      </p>
                    ) : (
                      /* 비회원일 경우: 더미 메시지 표시 */
                      dummyMessages
                    )}
                  </div>
                </div>
                {/* End Body */}

                {/* Begin Footer */}
                <div className="card-footer d-flex flex-column align-items-center justify-content-center">
                  <div className="d-flex justify-content-center">
                    {/* 회원/비회원 상관없이 버튼은 동일 로직 (예시) */}
                    {buttonStages[step - 1].map((btn, index) => (
                      <button
                        key={index}
                        type="button"
                        className="btn btn-primary btn-md text-uppercase font-weight-bold chat-send py-2 px-6 mx-2"
                        onClick={() => setStep(btn.next)}
                      >
                        {btn.text}
                      </button>
                    ))}
                  </div>
                </div>
                {/* End Footer */}
              </div>
              {/* End Chat Content Wrapper */}

              {/* 비회원 안내 오버레이 */}
              {!isLoggedIn && (
                <div className="login-overlay active">
                  <p>로그인이 필요한 서비스입니다.</p>
                </div>
              )}
            </div>
            {/* End Modal Content */}
          </div>
        </div>
      </div>
    </Common>
  );
};