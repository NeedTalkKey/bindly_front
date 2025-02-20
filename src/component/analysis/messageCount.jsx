import React from "react";
import styles from "./messageCount.module.css";

const MessageCount = ({ data }) => {
  return (
    <div className={styles.messageCountContainer}>
      <h3 className={styles.title}>Bindly가 예측한 두사람의 관계는?</h3>
      <div className={styles.messageDetails}>
        <p>{data.relationship}</p>
      </div>
    </div>
  );
};

export default MessageCount;
