import React from "react";
import styles from "./replyTime.module.css";

const ReplyTime = ({ data }) => {
  return (
    <div className={styles.replyTimeContainer}>
      <h3 className={styles.title}>답장이 누가 빠를까?</h3>
      <div className={styles.replyDetails}>
        <p>{data.userName}: 평균 {data.userReplyTime}초</p>
        <p>{data.partnerName}: 평균 {data.partnerReplyTime}초</p>
      </div>
      <h3 className={styles.title}>누가 더 많이 말할까?</h3>
      <div className={styles.replyDetails}>
        <p>{data.userName}: {data.userMessageCount}번</p>
        <p>{data.partnerName}: {data.partnerMessageCount}번</p>
      </div>
    </div>
  );
};

export default ReplyTime;
