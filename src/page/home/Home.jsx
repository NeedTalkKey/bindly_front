import React, { useEffect, useState } from "react";
import { Common } from "../../component/home/common";
import FeedbackTalk from "../../component/home/feedbackTalk";
import Header from "../../../src/component/home/header";
import Upload from "../bindly/upload";
import styles from "./Home.module.css";
import logo from "../../asset/logo.png"

export const Home = () => {
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDownThreshold = window.innerHeight * 0.2; // 🔽 아래로 이동 (많이 스크롤해야)
      const scrollUpThreshold = window.innerHeight * 0.8;   // 🔼 위로 이동 (더 적은 스크롤로)

      const uploadSection = document.getElementById("uploadSection");
      const homeSection = document.getElementById("homeSection");

      if (currentScrollY > lastScrollY && currentScrollY >= scrollDownThreshold) {
        if (uploadSection) {
          uploadSection.scrollIntoView({ behavior: "smooth" });
        }
      } else if (currentScrollY < lastScrollY && currentScrollY <= scrollUpThreshold) {
        if (homeSection) {
          homeSection.scrollIntoView({ behavior: "smooth" });
        }
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <Common>
      <div className={styles.container} id="homeSection">
        <Header />
        <div className={styles.content}>
          <div className={styles.textSection}>
            <h1 className={styles.title}>Bindly</h1>
            <p className={styles.subtitle}>대화 습관, 점수로 확인해볼래?</p>
          </div>
          <div className={styles.imageSection}>
            <img src={logo} alt="Logo" className={styles.image} />
          </div>
        </div>
      </div>
      <Upload />
      <FeedbackTalk/>
    </Common>
  );
};
