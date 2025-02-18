import React, { useState, useContext } from "react";
import "./sidebar.css";
import Rab from "../../asset/rabbit.png";
import { AuthContext } from "../../AuthContext"; // AuthContext를 직접 가져옵니다.

const Sidebar = () => {
  // AuthContext에서 전역 로그인 상태를 가져옵니다.
  const { isLoggedIn } = useContext(AuthContext);

  // 선택된 채팅방 (원래 로직)
  const [selectedChat, setSelectedChat] = useState(null);

  // 로그인했을 때는 실제 대화 목록, 비회원일 때는 더미 대화 목록
  const conversationList = isLoggedIn
    ? [
        { id: 1, date: "2025. 02. 12(월)", title: "업무적인 대화" },
        { id: 2, date: "2025. 02. 12(월)", title: "가족간의 대화" },
        { id: 3, date: "2025. 02. 05(월)", title: "업무적인 대화" },
        { id: 4, date: "2025. 02. 05(월)", title: "가족간의 대화" },
      ]
    : [
        { id: 1, date: "2025. 03. 01(금)", title: "더미 대화 1" },
        { id: 2, date: "2025. 03. 01(금)", title: "더미 대화 2" },
      ];

  return (
    <div className="sidebar-wrapper">
      {/* isLoggedIn이 false일 때만 blurred 클래스 적용 */}
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
                conversationList.map((chat, index) => (
                  <React.Fragment key={chat.id}>
                    {index === 0 ||
                    conversationList[index - 1].date !== chat.date ? (
                      <li className="menu-section mt-3">
                        <span className="menu-date font-weight-bold text-primary">
                          {chat.date}
                        </span>
                      </li>
                    ) : null}
                    <li className="menu-item">
                      <button
                        className={`menu-text ${selectedChat === chat.id ? "active" : ""}`}
                        onClick={() => setSelectedChat(chat.id)}
                      >
                        {chat.title}
                      </button>
                    </li>
                  </React.Fragment>
                ))
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
