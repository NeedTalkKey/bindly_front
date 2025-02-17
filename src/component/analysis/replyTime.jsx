import React from "react";
import styles from "./replyTime.module.css";

const ReplyTime = ({ data }) => {
  return (
    <div className={styles.replyTimeContainer}>
      <h3 className={styles.title}>답장이 누가 빠를까?</h3>
      <div className={styles.replyDetails}>
        <p>박치호: 평균 {data.userReplyTime}초</p>
        <p>김남희: 평균 {data.partnerReplyTime}초</p>
      </div>
    </div>
  );
};

export default ReplyTime;
