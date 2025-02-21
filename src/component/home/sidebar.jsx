import React, { useState, useContext, useEffect } from "react";
import "./sidebar.css";
import Rab from "../../asset/rabbit.png";
import { AuthContext } from "../../AuthContext";
import { config } from "../../config.js";

const Sidebar = ({ onSelectChat, selectedChatId }) => {
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

  // 로그인 시 서버에서 채팅 목록 불러오기
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
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (data.status) setChatList(data.data);
        else console.error("서버 에러:", data.message);
      })
      .catch((err) => console.error("채팅 리스트 불러오기 실패:", err));
  }, [isLoggedIn]);

  // 날짜 포맷 함수
  function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    const dayOfWeekKor = ["일", "월", "화", "수", "목", "금", "토"][date.getDay()];
    return `${year}. ${month}. ${day}(${dayOfWeekKor})`;
  }

  const conversationList = isLoggedIn ? chatList : dummyList;

  return (
    <div className="sidebar-wrapper">
      <div className={`sidebar-content ${!isLoggedIn ? "blurred" : ""}`}>
        <div className="brand d-flex align-items-center justify-content-center p-2">
          <img alt="Logo" src={Rab} className="brand-logo" />
          <h4 className="brand-title">Bindly</h4>
        </div>

        <div className="aside-menu-wrapper flex-column-fluid">
          <div id="kt_aside_menu" className="aside-menu my-4 scroll">
            <ul className="menu-nav">
              {conversationList.length === 0 ? (
                <li style={{ padding: "10px", color: "#999" }}>채팅방이 없습니다.</li>
              ) : (
                conversationList.map((chat, index) => {
                  const currentDate = formatDate(chat.createdAt);
                  let showDateSection = false;
                  if (index === 0) showDateSection = true;
                  else {
                    const prevDate = formatDate(conversationList[index - 1].createdAt);
                    if (prevDate !== currentDate) showDateSection = true;
                  }
                  const chatId = chat.chatsObjectId || chat._id;
                  return (
                    <React.Fragment key={chatId}>
                      {showDateSection && (
                        <li className="menu-section mt-3">
                          <span className="menu-date font-weight-bold text-primary">
                            {currentDate}
                          </span>
                        </li>
                      )}
                      <li className="menu-item">
                        <button
                          className={`menu-text ${selectedChatId === chatId ? "active" : ""}`}
                          onClick={() => onSelectChat(chatId)}
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
