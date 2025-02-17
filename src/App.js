import "./App.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import React from "react";
import { AuthProvider } from "./AuthContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "./page/home/Home";
import { Chat } from "./page/home/Chat";

const App = () => (
  <AuthProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<Chat />} />
        {/* <Route path="/bindly" element={<Bindly />} />
        <Route path="/analysis" element={<Analysis />} />
        <Route path="/login" element={<Login />} />
        <Route path="/regist" element={<Regist />} /> */}
      </Routes>
    </Router>
  </AuthProvider>
);

export default App;
