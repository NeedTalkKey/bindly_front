import React, { useEffect } from "react";
import styles from "./friendshipMessage.module.css";

// 📌 친밀도 점수별 이미지 import
import friendship_0_20 from "../../asset/0~20.png";
import friendship_20_40 from "../../asset/20~40.png";
import friendship_40_60 from "../../asset/40~60.png";
import friendship_60_80 from "../../asset/60~80.png";
import friendship_80_100 from "../../asset/80~100.png";

// 📌 친밀도 점수에 따라 이미지 & 메시지 결정 함수
const getFriendshipDetails = (totalScore) => {
  if (totalScore <= 20) {
    return { image: friendship_0_20, message: "서로의 거리가 마음의 거리와 같다면, 아직은 조금 멀어" };
  }
  if (totalScore <= 40) {
    return { image: friendship_20_40, message: "마주치면 인사는 하지만, 깊은 이야기는 나누지 않는 사이" };
  }
  if (totalScore <= 60) {
    return { image: friendship_40_60, message: "조금씩 가까워지고 있어, 함께한 시간이 우정을 만들어가네" };
  }
  if (totalScore <= 80) {
    return { image: friendship_60_80, message: "언제든 편하게 다가올 수 있는 사이, 서로에게 힘이되는 사이" };
  }
  return { image: friendship_80_100, message: "말하지 않아도 통하는 사이, 함께라서 더 즐거운 우리의 이야기" };
};
const FriendshipMessage = ({ data, setDescription }) => {
  const { image, message } = getFriendshipDetails(data.totalScore);

  // ✅ 렌더링 후 `setDescription` 실행
  useEffect(() => {
    setDescription(message);
  }, [message, setDescription]);

  return (
    <div className={styles.friendshipMessageContainer}>
      <img src={image} alt="친밀도 이미지" className={styles.friendshipImage} />
    </div>
  );
};

export default FriendshipMessage;
