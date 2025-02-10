// 공통적으로 들어가는 CSS를 적용하기 위한 컴포넌트

import React from "react";
import styles from "./common.module.css";

export const Common = ({ children }) => {
  return <div className={styles.common_container}>{children}</div>;
};
