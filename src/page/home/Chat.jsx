import React, { useState, useEffect, useContext } from "react";
import { Common } from "../../component/home/common";
import Sidebar from "../../component/home/sidebar";
import Rabbit from "../../asset/rabbit.png";
import { MdCancel } from "react-icons/md";
import { AuthContext } from "../../AuthContext";
import { config } from "../../config.js";
import "./Chat.css";
import "./ChatLayout.css";

export const Chat = ({
  onClose,
  conversationText: initialConversationText,
  speakerMapping, // { u1: '화자1', u2: '화자2' } 형태
}) => {
  const { isLoggedIn } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [title, setTitle] = useState("");
  const [step, setStep] = useState(1);
  const [selectedSpeaker, setSelectedSpeaker] = useState(null);
  const [conversationText] = useState(initialConversationText || "");
  const [isAnalyzing, setIsAnalyzing] = useState(false); // 분석 상태 관리

  // 화자 버튼 동적 생성
  const [speakerButtons, setSpeakerButtons] = useState([]);
  useEffect(() => {
    if (speakerMapping && Object.keys(speakerMapping).length > 0) {
      const arr = Object.entries(speakerMapping).map(([uKey, realName]) => ({
        text: realName,
        value: uKey,
        next: 2,
      }));
      setSpeakerButtons(arr);
    } else {
      setSpeakerButtons([
        { text: "u1", value: "u1", next: 2 },
        { text: "u2", value: "u2", next: 2 },
      ]);
    }
  }, [speakerMapping]);

  // 단계별 안내 멘트
  const aiQuestions = {
    1: "누구의 피드백으로 듣고 싶어?",
    2: "피드백으로 듣고 싶은 성향을 알려줄래?",
  };

  // 단계별 버튼
  const buttonStages = {
    1: speakerButtons,
    2: [
      { text: "공감", value: "공감", next: 3 },
      { text: "팩폭", value: "팩폭", next: 3 },
    ],
    3: [{ text: "대화 종료하기", value: "종료", next: 999 }],
  };

  // 대화 초기화
  useEffect(() => {
    if (!conversationText) {
      setMessages([{ role: "ai", content: "업로드된 대화 내역이 없습니다. 파일을 먼저 업로드해주세요." }]);
    } else {
      setMessages([{ role: "ai", content: aiQuestions[1] }]);
    }
  }, [conversationText]);

  const handleUserClick = (btn) => {
    if (!isLoggedIn) {
      alert("로그인이 필요한 서비스입니다.");
      return;
    }
    const userMessage = { role: "user", content: btn.text };
    setMessages((prev) => [...prev, userMessage]);

    // === Step 1: 화자 선택 ===
    if (step === 1) {
      setSelectedSpeaker(btn.value);
      setStep(btn.next);
      const nextAiQuestion = aiQuestions[btn.next];
      if (nextAiQuestion) {
        setMessages((prev) => [...prev, { role: "ai", content: nextAiQuestion }]);
      }
    }
    // === Step 2: 피드백(공감/팩폭) 요청 ===
    else if (step === 2) {
      const feedbackStyle = btn.value; // '공감' or '팩폭'
      setStep(btn.next);
      const token = localStorage.getItem("token");

      // 1) 분석 시작 상태
      setIsAnalyzing(true);

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
          if (data.feedback && Array.isArray(data.feedback)) {
            data.feedback.forEach((item) => {
              feedbackContent += `🏆[TOP ${item.rank}]<br/>`;
              feedbackContent += `✔️원문: ${item.original}<br/>`;
              feedbackContent += `✔️개선: ${item.improvedText}<br/>`;
              feedbackContent += `✔️변경: ${item.changedText}<br/><br/>`;
            });
            feedbackContent += "피드백이 완료되었습니다. 종료 버튼을 누르면 대화를 저장할 수 있어요.";
          } else if (data.message) {
            feedbackContent = data.message;
          } else {
            feedbackContent = "피드백 생성에 문제가 발생했습니다.";
          }

          // 2) 분석 결과 표시
          setMessages((prev) => [...prev, { role: "ai", content: feedbackContent }]);

          // 3) 분석 완료 상태 해제
          setIsAnalyzing(false);
        })
        .catch((err) => {
          console.error("피드백 API 에러:", err);
          setIsAnalyzing(false);
        });
    }
    // === Step 3: 종료 ===
    else if (step === 3) {
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
      if (btn.next === 999) {
        handleEndConversation();
        return;
      }
      setStep(btn.next);
      const nextAiQuestion = aiQuestions[btn.next];
      if (nextAiQuestion) {
        setMessages((prev) => [...prev, { role: "ai", content: nextAiQuestion }]);
      }
    }
  };

  const handleEndConversation = () => {
    console.log("대화 종료 및 저장:", { title, messages });
    alert("대화가 저장되었습니다. (콘솔에서 확인)");
    setMessages([{ role: "ai", content: aiQuestions[1] }]);
    setStep(1);
    setTitle("");
  };

  return (
    <Common>
      <div className="modalOverlay">
        <div className="modal modal-sticky show" style={{ display: "block" }} aria-modal="true" role="dialog">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content custom-layout">
              <div className="sidebar-wrapper">
                <Sidebar onSelectChat={setSelectedChatId} selectedChatId={selectedChatId} />
              </div>
              <MdCancel className="close-icon" onClick={onClose} />
              <div className={"chat-content-wrapper " + (!isLoggedIn ? "blurred" : "")}>
                <div className="card-body chat-body">
                  <div className="messages">
                    {isLoggedIn ? (
                      <>
                        {/* 기존 메시지 표시 */}
                        {messages.map((msg, idx) => (
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
                                <div
                                  className="message-content rounded p-5 text-dark-50 font-weight-bold font-size-lg text-left max-w-400px"
                                  dangerouslySetInnerHTML={{ __html: msg.content }}
                                />
                              </div>
                            ) : (
                              <div className="message you d-flex flex-row align-items-end justify-content-end mb-5">
                                <div
                                  className="message-content rounded p-5 text-dark-50 font-weight-bold font-size-lg text-right max-w-400px"
                                  dangerouslySetInnerHTML={{ __html: msg.content }}
                                />
                              </div>
                            )}
                          </div>
                        ))}

                        {/* 분석중일 때만 표시. 말풍선 형태가 아니라, 간단한 텍스트 형태로. */}
                        {isAnalyzing && (
                          <div className="analysis-indicator">
                            분석중...
                          </div>
                        )}
                      </>
                    ) : (
                      <p>로그인이 필요한 서비스입니다.</p>
                    )}
                  </div>
                </div>
                <div className="card-footer d-flex flex-column align-items-center justify-content-center">
                  <div className="d-flex justify-content-center">
                    {buttonStages[step]?.map((btn, index) => (
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
