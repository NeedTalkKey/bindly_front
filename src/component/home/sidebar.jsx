import React, { useState, useContext, useEffect } from "react";
import "./sidebar.css";
import Rab from "../../asset/rabbit.png";
import { AuthContext } from "../../AuthContext";
import { config } from "../../config.js";

const Sidebar = () => {
  const { isLoggedIn } = useContext(AuthContext);

  const [chatList, setChatList] = useState([]);

  // 비회원용 더미 리스트
  const dummyList = [
    {
      _id: 1,
      title: "더미 대화 1",
      createdAt: "2025-03-01T09:00:00Z",
    },
    {
      _id: 2,
      title: "더미 대화 2",
      createdAt: "2025-03-01T09:00:00Z",
    },
  ];

  // 선택된 채팅방 (UI 하이라이트용)
  const [selectedChat, setSelectedChat] = useState(null);

  // 로그인 시 서버로부터 채팅 리스트 불러오기
  useEffect(() => {
    if (!isLoggedIn) return;

    const token = localStorage.getItem("token");

    fetch(`${config.hosting.ip}:${config.hosting.back_port}/chat/list`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({}),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        // 응답 예시: { status: true, data: [ { chatsObjectId, title, createdAt }, ... ] }
        if (data.status) {
          setChatList(data.data);
        } else {
          console.error("서버 에러:", data.message);
        }
      })
      .catch((err) => {
        console.error("채팅 리스트 불러오기 실패:", err);
      });
  }, [isLoggedIn]);

  // selectedChat 변경 시 채팅내용 표출
  useEffect(() => {
    if (!isLoggedIn) return;
    console.log("selectedChat: ", selectedChat);

    const token = localStorage.getItem("token");

    fetch(`${config.hosting.ip}:${config.hosting.back_port}/chat/detail`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ objectId: selectedChat }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        // 응답 예시: { status: true, data: [ { chatsObjectId, title, createdAt }, ... ] }
        if (data.status) {
          console.log(data.data);
        } else {
          console.error("서버 에러:", data.message);
        }
      })
      .catch((err) => {
        console.error("채팅 불러오기 실패:", err);
      });
  }, [selectedChat]);

  // 실제로 표시할 리스트: 로그인 시 -> DB 목록, 비로그인 시 -> 더미 목록
  const conversationList = isLoggedIn ? chatList : dummyList;

  // 날짜 포맷팅 함수 (예: "2025. 02. 18(화)" 형태)
  function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    const dayOfWeekIndex = date.getDay(); // 0: 일 ~ 6: 토
    const dayOfWeekKor = ["일", "월", "화", "수", "목", "금", "토"][
      dayOfWeekIndex
    ];
    return `${year}. ${month}. ${day}(${dayOfWeekKor})`;
  }

  return (
    <div className="sidebar-wrapper">
      <div className={`sidebar-content ${!isLoggedIn ? "blurred" : ""}`}>
        {/* Brand - Bindly 로고 */}
        <div className="brand d-flex align-items-center justify-content-center p-2">
          <img alt="Logo" src={Rab} className="brand-logo" />
          <h4 className="brand-title">Bindly</h4>
        </div>

        {/* 채팅방 목록 */}
        <div className="aside-menu-wrapper flex-column-fluid">
          <div id="kt_aside_menu" className="aside-menu my-4 scroll">
            <ul className="menu-nav">
              {conversationList.length === 0 ? (
                <li style={{ padding: "10px", color: "#999" }}>
                  채팅방이 없습니다.
                </li>
              ) : (
                // (I) 날짜별 섹션 구분
                conversationList.map((chat, index) => {
                  // 현재 채팅의 날짜
                  const currentDate = formatDate(chat.createdAt);

                  // 이전 채팅과 비교해 날짜 섹션 표시 여부 결정
                  let showDateSection = false;
                  if (index === 0) {
                    showDateSection = true;
                  } else {
                    const prevDate = formatDate(
                      conversationList[index - 1].createdAt
                    );
                    if (prevDate !== currentDate) {
                      showDateSection = true;
                    }
                  }

                  return (
                    <React.Fragment key={chat.chatsObjectId || chat._id}>
                      {showDateSection && (
                        <li className="menu-section mt-3">
                          <span className="menu-date font-weight-bold text-primary">
                            {currentDate}
                          </span>
                        </li>
                      )}
                      <li className="menu-item">
                        <button
                          className={`menu-text ${
                            selectedChat === (chat.chatsObjectId || chat._id)
                              ? "active"
                              : ""
                          }`}
                          onClick={() =>
                            setSelectedChat(chat.chatsObjectId || chat._id)
                          }
                        >
                          {chat.title}
                        </button>
                      </li>
                    </React.Fragment>
                  );
                })
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
