import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { AuthProvider } from "./AuthContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "./page/home/Home";
import { Chat } from "./page/home/Chat";
import StyleChartDetail from "./component/analysis/styleChartDetail";
import WordCloudDetail from "./component/analysis/wordCloudDetail";
import KakaoToken from "./page/login/KakaoToken";

const App = () => (
  <AuthProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/style-chart-detail" element={<StyleChartDetail />} />
        <Route path="/wordCloudDetail" element={<WordCloudDetail />} />
        <Route path="/kakaoToken" element={<KakaoToken />} />
      </Routes>
    </Router>
  </AuthProvider>
);

export default App;
