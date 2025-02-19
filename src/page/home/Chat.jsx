import React, { useState, useEffect, useContext } from "react";
import "./Chat.css";
import { Common } from "../../component/home/common";
import Sidebar from "../../component/home/sidebar";
import "./ChatLayout.css";
import Rabbit from "../../asset/rabbit.png";
import { MdCancel } from "react-icons/md";
import { AuthContext } from "../../AuthContext";

export const Chat = ({ onClose }) => {
  const { isLoggedIn } = useContext(AuthContext);

  // ---------------------------------------
  // (A) 비회원에게 보여줄 더미 메시지
  // ---------------------------------------
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
          아무리 우겨봐도 어쩔 수 없네
          <br />
          저기 개똥 무덤이 내 집인걸
          <br />
          가슴을 내밀어도 친구가 없네
          <br />
          노래하던 새들도 멀리 날아가네
        </div>
      </div>
      {/* Message Out */}
      <div className="message you d-flex flex-row align-items-end justify-content-end mb-5">
        <div className="message-content rounded p-5 text-dark-50 font-weight-bold font-size-lg text-right max-w-400px">
          가지 마라 가지 마라 가지 말아라
          <br />
          나를 위해 한 번만 노래를 해주렴
        </div>
      </div>
    </>
  );

  // ---------------------------------------
  // (B) DB에서 가져온 대화 내용을 담을 state
  // ---------------------------------------
  const [messages, setMessages] = useState([]);

  // ---------------------------------------
  // (C) 특정 채팅(chatId)을 DB에서 불러오기 (POST)
  //     - chatId는 실제 상황에 따라 props나 URL 파라미터 등으로 전달받을 수 있음
  //     - 헤더에 token, nickname, user_model을 담아 전송
  // ---------------------------------------
  useEffect(() => {
    if (!isLoggedIn) return; // 비회원이면 DB 요청 X

    const token = localStorage.getItem("token");

    fetch(`http://localhost:8080/chat/detail`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({}) // 빈 객체 전송
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((chatData) => {
        // chatData.messages => [{ aiMessage, userMessage, timestamp }, ...]
        if (!chatData || !chatData.messages) return;

        // (D) DB의 messagePair (aiMessage, userMessage)를
        //     프론트용 배열 (role, content)로 변환
        const flattenedMessages = [];
        chatData.messages.forEach((pair) => {
          // AI 메시지
          flattenedMessages.push({
            role: "ai",
            content: pair.aiMessage,
            timestamp: pair.timestamp,
          });
          // User 메시지
          flattenedMessages.push({
            role: "user",
            content: pair.userMessage,
            timestamp: pair.timestamp,
          });
        });
        setMessages(flattenedMessages);
      })
      .catch((error) => {
        console.error("대화 불러오기 에러:", error);
      });
  }, [isLoggedIn]);

  // ---------------------------------------
  // (E) 단계별 로직 (기존 코드 그대로)
  // ---------------------------------------
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState("");

  const aiQuestions = {
    1: "누구의 피드백으로 듣고 싶어?",
    2: "피드백으로 듣고 싶은 성향을 알려줄래?",
    3: "추가로 궁금한 점이 있니?",
    4: "대화가 종료되었습니다. 종료 버튼을 누르면 대화를 저장할 수 있어요."
  };

  const buttonStages = {
    1: [
      { text: "이름1", next: 2 },
      { text: "이름2", next: 2 }
    ],
    2: [
      { text: "공감", next: 3 },
      { text: "팩폭", next: 3 }
    ],
    3: [
      { text: "긍정적인 대화", next: 4 },
      { text: "부정적인 대화", next: 4 }
    ],
    4: [
      { text: "대화 종료하기", next: 999 }
    ]
  };

  // (F) 사용자 버튼 클릭 시 메시지 추가
  const handleUserClick = (btn) => {
    if (!isLoggedIn) {
      alert("로그인이 필요한 서비스입니다.");
      return;
    }

    // 사용자 메시지 추가
    const userMessage = {
      role: "user",
      content: btn.text,
      timestamp: new Date().toLocaleString()
    };
    setMessages((prev) => [...prev, userMessage]);

    // 단계 변경
    if (btn.next === 999) {
      handleEndConversation();
      return;
    }
    setStep(btn.next);

    // 다음 AI 질문 추가
    const nextAiQuestion = aiQuestions[btn.next];
    if (nextAiQuestion) {
      const aiMessage = {
        role: "ai",
        content: nextAiQuestion,
        timestamp: new Date().toLocaleString()
      };
      setMessages((prev) => [...prev, aiMessage]);
    }
  };

  // (G) 대화 종료 시 로직
  const handleEndConversation = () => {
    console.log("대화 종료 및 저장:", { title, messages });
    alert("대화가 저장되었습니다. (콘솔 확인)");

    // 필요 시 서버에 POST 저장 로직 (예: fetch로 "/chat/create" 호출)
    // 이후 상태 초기화
    setMessages([
      {
        role: "ai",
        content: "누구의 피드백으로 듣고 싶어?",
        timestamp: new Date().toLocaleString()
      }
    ]);
    setStep(1);
    setTitle("");
  };

  return (
    <Common>
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
            <div className="modal-content custom-layout">
              <div className="sidebar-wrapper">
                <Sidebar />
              </div>

              <div className={"chat-content-wrapper " + (!isLoggedIn ? "blurred" : "")}>
                <MdCancel className="close-icon" onClick={onClose} />

                <div className="card-body chat-body">
                  <div className="messages">
                    {/* (H) 로그인 여부에 따라 다른 메시지 출력 */}
                    {isLoggedIn ? (
                      // 회원 → DB에서 불러온 실제 메시지
                      messages.map((msg, idx) => (
                        <div key={idx}>
                          {msg.role === "ai" ? (
                            <div className="message other d-flex flex-row align-items-start mb-5">
                              <div className="symbol symbol-40 mr-3">
                                <img
                                  alt="Pic"
                                  src={Rabbit}
                                  style={{
                                    width: "40px",
                                    height: "40px",
                                    borderRadius: "50%"
                                  }}
                                />
                              </div>
                              <div className="message-content rounded p-5 text-dark-50 font-weight-bold font-size-lg text-left max-w-400px">
                                {msg.content}
                                <div style={{ fontSize: "0.8rem", color: "#aaa", marginTop: "4px" }}>
                                  {msg.timestamp}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="message you d-flex flex-row align-items-end justify-content-end mb-5">
                              <div className="message-content rounded p-5 text-dark-50 font-weight-bold font-size-lg text-right max-w-400px">
                                {msg.content}
                                <div style={{ fontSize: "0.8rem", color: "#aaa", marginTop: "4px" }}>
                                  {msg.timestamp}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      // 비회원 → 더미 메시지
                      dummyMessages
                    )}
                  </div>
                </div>

                {/* 푸터 영역 */}
                <div className="card-footer d-flex flex-column align-items-center justify-content-center">
                  {step === 4 && (
                    <div style={{ width: "100%", textAlign: "center", marginBottom: "10px" }}>
                      <input
                        type="text"
                        placeholder="이번 대화의 제목을 입력하세요"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        style={{ width: "80%", padding: "6px" }}
                      />
                    </div>
                  )}

                  <div className="d-flex justify-content-center">
                    {buttonStages[step] &&
                      buttonStages[step].map((btn, index) => (
                        <button
                          key={index}
                          type="button"
                          className="btn btn-primary btn-md text-uppercase font-weight-bold chat-send py-2 px-6 mx-2"
                          onClick={() => handleUserClick(btn)}
                        >
                          {btn.text}
                        </button>
                      ))}
                  </div>
                </div>
              </div>

              {/* 비회원 안내 오버레이 (로그인 유도) */}
              {!isLoggedIn && (
                <div className="login-overlay active">
                  <p>로그인이 필요한 서비스입니다.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Common>
  );
};
