import React from "react";
import styles from "../adminPages.module.css";
import TopicCard from "./TopicCard";

export default function TopicList({ topics, onSelectTopic, onEditTopic, onDeleteTopic }) {
  return (
    <div className={styles.topicsList}>
      {topics.map((topic) => (
        <TopicCard
          key={topic.TopicID}
          topic={topic}
          onSelect={() => onSelectTopic(topic)}
          onEdit={() => onEditTopic(topic)}
          onDelete={() => onDeleteTopic(topic)}
        />
      ))}
    </div>
  );
} 