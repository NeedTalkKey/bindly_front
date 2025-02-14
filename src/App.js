import "./App.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "./page/home/Home";
import { Chat } from "./page/home/Chat";

const App = () => (
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
);

export default App;
