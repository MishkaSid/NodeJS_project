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
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [isTopicPopupOpen, setIsTopicPopupOpen] = useState(false);
  const [isAddTopicOpen, setIsAddTopicOpen] = useState(false);
  const [isEditTopicOpen, setIsEditTopicOpen] = useState(false);
  const [editTopicName, setEditTopicName] = useState("");
  const [editTopicId, setEditTopicId] = useState(null);
  const [newTopicName, setNewTopicName] = useState("");
  const [loading, setLoading] = useState(false);
  const [practiceContent, setPracticeContent] = useState({}); // { [topicId]: [content, ...] }

  // Fetch all courses on mount
  useEffect(() => {
    axios.get("/api/courses/getCourses").then(res => {
      setCourses(res.data || []);
    });
  }, []);

  // Fetch topics for selected course
  useEffect(() => {
    if (!selectedCourse) return;
    setLoading(true);
    axios.get("/api/topics/getTopics").then(res => {
      const filtered = (res.data || []).filter(t => t.CourseID === selectedCourse);
      setTopics(filtered);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [selectedCourse]);

  // Fetch practice content for all topics in course
  useEffect(() => {
    if (!topics.length) return;
    axios.get("/api/practice/practiceExercises").then(res => {
      const allContent = res.data || [];
      const map = {};
      topics.forEach(topic => {
        map[topic.TopicID] = allContent.filter(c => c.TopicID === topic.TopicID);
      });
      setPracticeContent(map);
    });
  }, [topics]);

  // Add topic
  const handleAddTopic = () => {
    if (!newTopicName.trim() || !selectedCourse) return;
    axios.post("/api/topics/addTopic", { TopicName: newTopicName, CourseID: selectedCourse })
      .then(res => {
        setTopics(prev => [...prev, res.data]);
        setNewTopicName("");
        setIsAddTopicOpen(false);
      });
  };

  // Edit topic
  const handleEditTopic = () => {
    if (!editTopicName.trim() || !selectedCourse || !editTopicId) return;
    axios.put(`/api/topics/updateTopic/${editTopicId}`, { TopicName: editTopicName, CourseID: selectedCourse })
      .then(res => {
        setTopics(prev => prev.map(t => t.TopicID === editTopicId ? { ...t, TopicName: editTopicName } : t));
        setIsEditTopicOpen(false);
        setEditTopicName("");
        setEditTopicId(null);
      });
  };

  // Delete topic
  const handleDeleteTopic = (topicId) => {
    axios.delete(`/api/topics/deleteTopic/${topicId}`)
      .then(() => {
        setTopics(prev => prev.filter(t => t.TopicID !== topicId));
      });
  };

  // Delete practice content
  const handleDeleteContent = (exerciseId, topicId) => {
    axios.delete(`/api/practice/practiceExercise/${exerciseId}`)
      .then(() => {
        setPracticeContent(prev => ({
          ...prev,
          [topicId]: prev[topicId].filter(c => c.ExerciseID !== exerciseId)
        }));
      });
  };

  // Add practice content (handled by PracticeContent component)
  const handleContentAdded = (topicId, newContent) => {
    setPracticeContent(prev => ({
      ...prev,
      [topicId]: [...(prev[topicId] || []), newContent]
    }));
  };

  return (
    <div className={styles.adminPage}>
      <h1 className={styles.pageTitle}>ניהול תכנים</h1>
      {/* Course Dropdown */}
      <div className={styles.addingLine}>
        <label htmlFor="courseSelect" style={{ fontWeight: 600 }}>בחר קורס:</label>
        <select
          id="courseSelect"
          className={styles.searchInput}
          value={selectedCourse || ""}
          onChange={e => setSelectedCourse(Number(e.target.value))}
        >
          <option value="" disabled>בחר קורס</option>
          {courses.map(course => (
            <option key={course.CourseID} value={course.CourseID}>{course.CourseName}</option>
          ))}
        </select>
        <button className={styles.addButton} onClick={() => setIsAddTopicOpen(true)} disabled={!selectedCourse}>
          הוסף נושא
        </button>
      </div>
      {/* Topics List */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem" }}>
        {topics.map((topic) => (
          <div key={topic.TopicID} style={{ minWidth: 300, maxWidth: 350 }}>
            <Card
              title={topic.TopicName}
              onClick={() => {
                setSelectedTopic(topic);
                setIsTopicPopupOpen(true);
              }}
              size="medium"
            />
            <div style={{ marginTop: 8, marginBottom: 8 }}>
              <button className={styles.smallButton} onClick={() => { setEditTopicId(topic.TopicID); setEditTopicName(topic.TopicName); setIsEditTopicOpen(true); }}>ערוך</button>
              <button className={styles.smallButton} onClick={() => handleDeleteTopic(topic.TopicID)}>מחק</button>
            </div>
          </div>
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
      {/* Edit Topic Popup */}
      <Popup isOpen={isEditTopicOpen} onClose={() => setIsEditTopicOpen(false)} header="ערוך נושא">
        <Form
          inputs={[{
            label: "שם נושא",
            type: "text",
            name: "topic",
            value: editTopicName,
            onChange: (e) => setEditTopicName(e.target.value),
          }]}
          onSubmit={handleEditTopic}
        />
      </Popup>
      {/* Practice Content Popup (table and add content) */}
      <Popup isOpen={isTopicPopupOpen} onClose={() => setIsTopicPopupOpen(false)} header={selectedTopic?.TopicName || "תוכן נושא"}>
        <div className={styles.table} style={{ marginBottom: 8 }}>
          <table style={{ width: "100%" }}>
            <thead>
              <tr>
                <th>תמונה</th>
                <th>אפשרויות תשובה</th>
                <th>תשובה נכונה</th>
                <th>מחיקה</th>
              </tr>
            </thead>
            <tbody>
              {(practiceContent[selectedTopic?.TopicID] || []).map(content => (
                <tr key={content.ExerciseID}>
                  <td>
                    {content.ContentType === "image" && (
                      <img src={content.ContentValue} alt="img" style={{ maxWidth: 80, maxHeight: 60, borderRadius: 8 }} />
                    )}
                  </td>
                  <td>
                    {(content.AnswerOptions || []).map((opt, i) => (
                      <div key={i}>{String.fromCharCode(65 + i)}. {opt}</div>
                    ))}
                  </td>
                  <td>{content.CorrectAnswer}</td>
                  <td>
                    <button className={styles.smallButton} onClick={() => handleDeleteContent(content.ExerciseID, selectedTopic.TopicID)}>מחק</button>
                  </td>
                </tr>
              ))}
              {(practiceContent[selectedTopic?.TopicID] || []).length === 0 && (
                <tr><td colSpan="4">אין תוכן</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <button className={styles.addButton} onClick={() => {}} disabled>הוסף תוכן (דרך חלון אחר)</button>
        {/* The add content button is disabled here, as PracticeContent popup is used for adding */}
        <PracticeContent
          topic={selectedTopic}
          isOpen={isTopicPopupOpen}
          onClose={() => setIsTopicPopupOpen(false)}
        />
      </Popup>
    </div>
  );
}
