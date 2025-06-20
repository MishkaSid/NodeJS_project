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
  const [newTopicId, setNewTopicId] = useState("");
  const [loading, setLoading] = useState(false);
  const [practiceContent, setPracticeContent] = useState({}); // { [topicId]: [content, ...] }
  const [isAddContentPopupOpen, setIsAddContentPopupOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, topic: null });
  const [isAddCourseOpen, setIsAddCourseOpen] = useState(false);
  const [newCourseName, setNewCourseName] = useState("");
  const [deleteCourseConfirm, setDeleteCourseConfirm] = useState({ open: false, course: null });

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
        {selectedCourse ? (
          <button className={styles.deleteButtonLarge} style={{marginRight: 8}} onClick={() => {
            const course = courses.find(c => c.CourseID === selectedCourse);
            setDeleteCourseConfirm({ open: true, course });
          }}>
            מחק קורס
          </button>
        ) : (
          <button className={styles.addButton} onClick={() => setIsAddCourseOpen(true)}>
            הוסף קורס
          </button>
        )}
        <button className={styles.addButton} onClick={() => setIsAddTopicOpen(true)} disabled={!selectedCourse}>
          הוסף נושא
        </button>
      </div>
      {/* Topics List */}
      <div className={styles.topicsList}>
        {topics.map((topic) => (
          <div key={topic.TopicID} className={styles.topicCardContainer}>
            <Card
              title={topic.TopicName}
              onClick={() => {
                setSelectedTopic(topic);
                setIsTopicPopupOpen(true);
              }}
              size="medium"
            />
            <div className={styles.topicActions}>
              <button className={styles.editButtonLarge} onClick={() => { setEditTopicId(topic.TopicID); setEditTopicName(topic.TopicName); setIsEditTopicOpen(true); }}>ערוך</button>
              <button className={styles.deleteButtonLarge} onClick={() => setDeleteConfirm({ open: true, topic })}>מחק</button>
            </div>
          </div>
        ))}
      </div>
      {/* Add Topic Popup */}
      <Popup isOpen={isAddTopicOpen} onClose={() => setIsAddTopicOpen(false)} header="הוסף נושא חדש">
        <Form
          inputs={[{
            label: "מזהה נושא (TopicID)",
            type: "number",
            name: "topicId",
            value: newTopicId,
            onChange: (e) => setNewTopicId(e.target.value),
            placeholder: "אוטומטי אלא אם שונה"
          }, {
            label: "שם נושא",
            type: "text",
            name: "topic",
            value: newTopicName,
            onChange: (e) => setNewTopicName(e.target.value),
          }, {
            label: "מזהה קורס (CourseID)",
            type: "number",
            name: "courseId",
            value: selectedCourse || "",
            disabled: true
          }]}
          onSubmit={() => {
            if (!newTopicName.trim() || !selectedCourse) return;
            const payload = { TopicName: newTopicName, CourseID: selectedCourse };
            if (newTopicId) payload.TopicID = Number(newTopicId);
            axios.post("/api/topics/addTopic", payload)
              .then(res => {
                setTopics(prev => [...prev, res.data]);
                setNewTopicName("");
                setNewTopicId("");
                setIsAddTopicOpen(false);
              });
          }}
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
        <div className={`${styles.prominentPopup} ${styles.popupLarge}`}>
          <div className={styles.tableWrapper}>
            <table className={styles.tableFullWidth}>
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
          <button className={styles.addButton} onClick={() => setIsAddContentPopupOpen(true)}>הוסף תוכן</button>
          {/* Add Practice Content Popup (nested) */}
          <PracticeContent
            topic={selectedTopic}
            isOpen={isAddContentPopupOpen}
            onClose={() => setIsAddContentPopupOpen(false)}
          />
        </div>
      </Popup>
      {/* Delete Topic Confirmation Popup */}
      <Popup isOpen={deleteConfirm.open} onClose={() => setDeleteConfirm({ open: false, topic: null })} header="אישור מחיקה">
        <div style={{ padding: '1.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: 18, marginBottom: 18 }}>
            האם אתה בטוח שברצונך למחוק את הנושא "{deleteConfirm.topic?.TopicName}"?
          </div>
          <button
            className={styles.deleteButtonLarge}
            style={{ marginLeft: 8 }}
            onClick={() => {
              handleDeleteTopic(deleteConfirm.topic.TopicID);
              setDeleteConfirm({ open: false, topic: null });
            }}
          >מחק</button>
        </div>
      </Popup>
      {/* Add Course Popup */}
      <Popup isOpen={isAddCourseOpen} onClose={() => setIsAddCourseOpen(false)} header="הוסף קורס חדש">
        <Form
          inputs={[{
            label: "שם קורס",
            type: "text",
            name: "course",
            value: newCourseName,
            onChange: (e) => setNewCourseName(e.target.value),
          }]}
          onSubmit={() => {
            if (!newCourseName.trim()) return;
            axios.post("/api/courses/addCourse", { CourseName: newCourseName })
              .then(res => {
                setCourses(prev => [...prev, res.data]);
                setNewCourseName("");
                setIsAddCourseOpen(false);
              });
          }}
        />
      </Popup>
      {/* Delete Course Confirmation Popup */}
      <Popup isOpen={deleteCourseConfirm.open} onClose={() => setDeleteCourseConfirm({ open: false, course: null })} header="אישור מחיקת קורס">
        <div style={{ padding: '1.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: 18, marginBottom: 18 }}>
            האם אתה בטוח שברצונך למחוק את הקורס "{deleteCourseConfirm.course?.CourseName}"?
          </div>
          <button
            className={styles.deleteButtonLarge}
            style={{ marginLeft: 8 }}
            onClick={() => {
              axios.delete(`/api/courses/deleteCourse/${deleteCourseConfirm.course.CourseID}`)
                .then(() => {
                  setCourses(prev => prev.filter(c => c.CourseID !== deleteCourseConfirm.course.CourseID));
                  if (selectedCourse === deleteCourseConfirm.course.CourseID) setSelectedCourse(null);
                  setDeleteCourseConfirm({ open: false, course: null });
                });
            }}
          >מחק</button>
        </div>
      </Popup>
    </div>
  );
}
