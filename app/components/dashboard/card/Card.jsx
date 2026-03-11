import React from "react";
import styles from "./card.module.css";

const Card = ({ title, number, icon }) => {
  return (
    <div className={styles.card}>
      <div className={styles.icon}>{icon}</div>

      <div className={styles.info}>
        <span className={styles.title}>{title}</span>
        <span className={styles.number}>{number}</span>
      </div>
    </div>
  );
};

export default Card;
