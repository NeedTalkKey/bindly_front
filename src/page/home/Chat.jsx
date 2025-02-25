// Chat.jsx
import React, { useState, useEffect, useContext } from "react";
import "./Chat.css";
import { Common } from "../../component/home/common";
import Sidebar from "../../component/home/sidebar";
import "./ChatLayout.css";
import Rabbit from "../../asset/rabbit.png";
import { MdCancel } from "react-icons/md";
import { AuthContext } from "../../AuthContext";
import { config } from "../../config.js";

export const Chat = ({ onClose }) => {
  const { isLoggedIn } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [title, setTitle] = useState("");
  const [step, setStep] = useState(1);
  const [selectedSpeaker, setSelectedSpeaker] = useState(null);
  // 분석된 대화 텍스트 – 실제로는 파일 업로드 후 서버에서 받아온 결과를 사용합니다.
  const [conversationText, setConversationText] = useState("");

  // 단계별 질문 및 버튼 옵션 정의
  const aiQuestions = {
    1: "누구의 피드백으로 듣고 싶어?",
    2: "피드백으로 듣고 싶은 성향을 알려줄래?",
    3: "피드백이 완료되었습니다. 추가로 궁금한 점이 있니?",
    4: "대화가 종료되었습니다. 종료 버튼을 누르면 대화를 저장할 수 있어요.",
  };
  const buttonStages = {
    // 단계 1: 화자 선택 (u1, u2; 실제로 파일 업로드 시 화자명이 u1, u2로 매핑됨)
    1: [
      { text: "u1", next: 2 },
      { text: "u2", next: 2 },
    ],
    // 단계 2: 피드백 성향 선택 (공감/팩폭)
    2: [
      { text: "공감", next: 3 },
      { text: "팩폭", next: 3 },
    ],
    // 단계 3: 추가 질문 단계 (추가 대화 진행 가능; 여기서는 단순 안내)
    3: [
      { text: "긍정적인 대화", next: 4 },
      { text: "부정적인 대화", next: 4 },
    ],
    // 단계 4: 대화 종료 단계
    4: [{ text: "대화 종료하기", next: 999 }],
  };

  // 데모용 더미 대화 텍스트 (실제 구현에서는 파일 업로드 후 분석 결과를 사용)
  useEffect(() => {
    const dummyConversation = `u1 : 안녕, 오늘 회의 정말 힘들었어.
u2 : 그렇구나, 무슨 일이 있었어?
u1 : 상사가 계속 짜증나게 굴어서 빡쳤어.
u2 : 그런 상황이면 정말 힘들었겠다.
u1 : 회의 도중에 모두가 불편해 보였어.`;
    setConversationText(dummyConversation);
  }, []);

  // 사용자의 버튼 클릭 처리: 각 단계별로 다르게 처리합니다.
  const handleUserClick = (btn) => {
    if (!isLoggedIn) {
      alert("로그인이 필요한 서비스입니다.");
      return;
    }
    // 사용자가 누른 버튼은 사용자 메시지로 추가
    const userMessage = { role: "user", content: btn.text };
    setMessages((prev) => [...prev, userMessage]);

    // 단계별 처리
    if (step === 1) {
      // ① 화자 선택 단계
      setSelectedSpeaker(btn.text);
      setStep(btn.next);
      const nextAiQuestion = aiQuestions[btn.next];
      if (nextAiQuestion) {
        setMessages((prev) => [...prev, { role: "ai", content: nextAiQuestion }]);
      }
    } else if (step === 2) {
      // ② 피드백 성향 선택 단계 → 선택 정보를 feedback API에 전달
      const feedbackStyle = btn.text;
      setStep(btn.next);
      const token = localStorage.getItem("token"); // 인증 토큰이 필요한 경우 사용
      fetch(`${config.hosting.ip}:${config.hosting.back_port}/feedback/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          conversationText,
          speaker: selectedSpeaker,
          feedbackStyle,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          let feedbackContent = "";
          if (data.feedback) {
            data.feedback.forEach((item, index) => {
              feedbackContent += `🏆 TOP ${index + 1}\n`;
              feedbackContent += `🔴 원문: ${item.original}\n`;
              feedbackContent += `🔸 개선: ${item.improved}\n\n`;
            });
          } else if (data.message) {
            feedbackContent = data.message;
          } else {
            feedbackContent = "피드백 생성에 문제가 발생했습니다.";
          }
          // 피드백 결과를 AI 메시지로 추가
          setMessages((prev) => [...prev, { role: "ai", content: feedbackContent }]);
          // 추가 질문 단계로 진행
          const nextAiQuestion = aiQuestions[3];
          if (nextAiQuestion) {
            setMessages((prev) => [...prev, { role: "ai", content: nextAiQuestion }]);
          }
        })
        .catch((err) => {
          console.error("피드백 API 에러:", err);
        });
    } else if (step === 4) {
      if (btn.next === 999) {
        handleEndConversation();
        return;
      }
      setStep(btn.next);
      const nextAiQuestion = aiQuestions[btn.next];
      if (nextAiQuestion) {
        setMessages((prev) => [...prev, { role: "ai", content: nextAiQuestion }]);
      }
    } else {
      setStep(btn.next);
      const nextAiQuestion = aiQuestions[btn.next];
      if (nextAiQuestion) {
        setMessages((prev) => [...prev, { role: "ai", content: nextAiQuestion }]);
      }
    }
  };

  // 대화 종료 및 저장 처리
  const handleEndConversation = () => {
    console.log("대화 종료 및 저장:", { title, messages });
    alert("대화가 저장되었습니다. (콘솔 확인)");
    // 종료 후 초기화
    setMessages([{ role: "ai", content: "누구의 피드백으로 듣고 싶어?" }]);
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
                <Sidebar onSelectChat={setSelectedChatId} selectedChatId={selectedChatId} />
              </div>
              {/* 닫기 버튼 */}
              <MdCancel className="close-icon" onClick={onClose} />
              <div className={"chat-content-wrapper " + (!isLoggedIn ? "blurred" : "")}>
                <div className="card-body chat-body">
                  <div className="messages">
                    {isLoggedIn ? (
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
                                    borderRadius: "50%",
                                  }}
                                />
                              </div>
                              <div className="message-content rounded p-5 text-dark-50 font-weight-bold font-size-lg text-left max-w-400px">
                                {msg.content}
                              </div>
                            </div>
                          ) : (
                            <div className="message you d-flex flex-row align-items-end justify-content-end mb-5">
                              <div className="message-content rounded p-5 text-dark-50 font-weight-bold font-size-lg text-right max-w-400px">
                                {msg.content}
                              </div>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <p>로그인이 필요한 서비스입니다.</p>
                    )}
                  </div>
                </div>
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

export default Chat;
