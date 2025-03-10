import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [nickname, setNickname] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedNickname = localStorage.getItem("nickname");
    if (token) {
      setIsLoggedIn(true);
      if (storedNickname) {
        setNickname(storedNickname);
      }
    }
  }, []);

  // token과 nickname을 함께 인자로 받음
  const login = (token, nicknameValue, user_model) => {
    localStorage.setItem("token", token);
    localStorage.setItem("nickname", nicknameValue);
    localStorage.setItem("user_model", user_model);
    setIsLoggedIn(true);
    setNickname(nicknameValue);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("nickname");
    localStorage.removeItem("user_model");
    setIsLoggedIn(false);
    setNickname("");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, nickname, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
