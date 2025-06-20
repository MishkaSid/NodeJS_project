import React, { useState, useEffect } from "react";
import styles from "../adminPages.module.css";
import Card from "../../../components/card/Card";
import Popup from "../../../components/popup/Popup";
import Form from "../../../components/form/Form";
import axios from "axios";
import PracticeContent from "../../../components/practiceContent/PracticeContent";

/**
 * The ManageContent component renders the main page for managing content.
 * It contains a search bar and a table of content items. The table is
 * filtered based on the search input. The table has four columns: topic,
 * level, type and actions. The actions column contains two buttons: edit
 * and delete. The edit button navigates to the edit page, and the delete
 * button opens a confirmation dialog.
 *
 * @returns {JSX.Element} The rendered ManageContent component.
 */

export default function ManageContent() {
  const [topics, setTopics] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [isTopicPopupOpen, setIsTopicPopupOpen] = useState(false);
  const [isAddTopicOpen, setIsAddTopicOpen] = useState(false);
  const [newTopicName, setNewTopicName] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch topics on mount
  useEffect(() => {
    setLoading(true);
    axios.get("/api/topic/getTopics")
      .then(res => {
        setTopics(res.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Add topic
  const handleAddTopic = () => {
    if (!newTopicName.trim()) return;
    axios.post("/api/topic/addTopic", { TopicName: newTopicName, CourseID: 1 }) // CourseID: 1 for demo
      .then(res => {
        setTopics(prev => [...prev, res.data]);
        setNewTopicName("");
        setIsAddTopicOpen(false);
      });
  };

  // Filter topics by search
  const filteredTopics = topics.filter((t) => (t.TopicName || "").includes(search));

  return (
    <div className={styles.adminPage}>
      <h1 className={styles.pageTitle}>ניהול תכנים</h1>
      <input
        type="text"
        className={styles.searchInput}
        placeholder="חפש נושא..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className={styles.addingLine}>
        <button className={styles.addButton} onClick={() => setIsAddTopicOpen(true)}>
          הוסף נושא
        </button>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem" }}>
        {filteredTopics.map((topic) => (
          <Card
            key={topic.TopicID}
            title={topic.TopicName}
            onClick={() => {
              setSelectedTopic(topic);
              setIsTopicPopupOpen(true);
            }}
            size="medium"
          />
        ))}
      </div>
      {/* Add Topic Popup */}
      <Popup isOpen={isAddTopicOpen} onClose={() => setIsAddTopicOpen(false)} header="הוסף נושא חדש">
        <Form
          inputs={[{
            label: "שם נושא",
            type: "text",
            name: "topic",
            value: newTopicName,
            onChange: (e) => setNewTopicName(e.target.value),
          }]}
          onSubmit={handleAddTopic}
        />
      </Popup>
      {/* Practice Content Popup */}
      <PracticeContent
        topic={selectedTopic}
        isOpen={isTopicPopupOpen}
        onClose={() => setIsTopicPopupOpen(false)}
      />
    </div>
  );
}
