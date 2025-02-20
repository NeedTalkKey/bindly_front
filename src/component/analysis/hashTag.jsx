import React from "react";
import styles from "./hashTag.module.css";

const hashTag = ({ hashtag }) => {
  return (
    <div className={styles.hashTagCountContainer}>
      <h3 className={styles.title}>우리 대화의 해시태그는?</h3>
      <div className={styles.messageDetails}>
        <p><strong># {hashtag.humor}</strong></p>
        <p><strong># {hashtag.food}</strong></p>
        <p><strong># {hashtag.travel}</strong></p>
        <p><strong># {hashtag.chat}</strong></p>
      </div>
    </div>
  );
};

export default hashTag;
