import React from "react";
import styles from "./messageCount.module.css";

const MessageCount = ({ data }) => {
  return (
    <div className={styles.messageCountContainer}>
      <h3 className={styles.title}>누가 더 많이 말할까?</h3>
      <div className={styles.messageDetails}>
        <p>박치호: {data.userMessageCount}번</p>
        <p>김남희: {data.partnerMessageCount}번</p>
      </div>
    </div>
  );
};

export default MessageCount;
