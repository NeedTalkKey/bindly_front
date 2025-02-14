import React, { useState } from "react";
import "./sidebar.css";
import Rab from "../../asset/rabbit.png";

const Sidebar = () => {
  const [selectedChat, setSelectedChat] = useState(null);

  // 채팅방 목록
  const chatRooms = [
    { id: 1, date: "2025. 02. 12(월)", title: "업무적인 대화" },
    { id: 2, date: "2025. 02. 12(월)", title: "가족간의 대화" },
    { id: 3, date: "2025. 02. 05(월)", title: "업무적인 대화" },
    { id: 4, date: "2025. 02. 05(월)", title: "가족간의 대화" },
  ];

  return (
    <div className="sidebar-wrapper">
      {/* Brand - Bindly 로고 */}
      <div className="brand d-flex align-items-center justify-content-center p-2">
        <img alt="Logo" src={Rab} className="brand-logo" />
        <h4 className="brand-title">Bindly</h4>
      </div>

      {/* 채팅방 목록 */}
      <div className="aside-menu-wrapper flex-column-fluid">
        <div id="kt_aside_menu" className="aside-menu my-4 scroll">
          <ul className="menu-nav">
            {chatRooms.map((chat, index) => (
              <React.Fragment key={chat.id}>
                {/* 날짜 구분 표시 */}
                {index === 0 || chatRooms[index - 1].date !== chat.date ? (
                  <li className="menu-section mt-3">
                    <span className="menu-date font-weight-bold text-primary">{chat.date}</span>
                  </li>
                ) : null}
                {/* 채팅방 버튼 */}
                <li className="menu-item">
                  <button
                    className={`menu-text ${selectedChat === chat.id ? "active" : ""}`}
                    onClick={() => setSelectedChat(chat.id)}
                  >
                    {chat.title}
                  </button>
                </li>
              </React.Fragment>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
