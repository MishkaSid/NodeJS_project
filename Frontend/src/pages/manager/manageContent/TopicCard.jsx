import React from "react";
import styles from "../adminPages.module.css";
import Card from "../../../components/card/Card";

export default function TopicCard({ topic, onSelect, onEdit, onDelete }) {
  return (
    <div className={styles.topicCardContainer}>
      <Card
        title={topic.TopicName}
        onClick={onSelect}
        size="medium"
      />
      <div className={styles.topicActions}>
        <button className={styles.editButtonLarge} onClick={onEdit}>ערוך</button>
        <button className={styles.deleteButtonLarge} onClick={onDelete}>מחק</button>
      </div>
    </div>
  );
} 