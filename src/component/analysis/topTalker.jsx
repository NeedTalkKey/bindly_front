import React from "react";
import styles from "./topTalker.module.css";

const TopTalker = ({ talkers }) => {
    return (
        <div className={styles.talkerSection}>
            <p><strong>Best Talker:</strong> {talkers.best}님</p>
            <p><strong>Worst Talker:</strong> {talkers.worst}님</p>
            <p><strong>Too Much Talker:</strong> {talkers.tooMuch}님</p>
            <p><strong>Small Talker:</strong> {talkers.small}님</p>
        </div>
    );
};

export default TopTalker;
