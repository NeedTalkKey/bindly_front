import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [nickname, setNickname] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const storedNickname = localStorage.getItem("nickname");
    if (token) {
      setIsLoggedIn(true);
      if (storedNickname) {
        setNickname(storedNickname);
      }
    }
  }, []);

  // token과 nickname을 함께 인자로 받음
  const login = (token, nicknameValue) => {
    localStorage.setItem("authToken", token);
    localStorage.setItem("nickname", nicknameValue);
    setIsLoggedIn(true);
    setNickname(nicknameValue);
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("nickname");
    setIsLoggedIn(false);
    setNickname("");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, nickname, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
