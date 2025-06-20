import React, { useState, useEffect } from "react";
import styles from "../adminPages.module.css";
import Popup from "../../../components/popup/Popup";
import axios from "axios";
import PracticeContent from "../../../components/practiceContent/PracticeContent";
import CourseSelector from "./CourseSelector";
import TopicList from "./TopicList";
import TopicForm from "./TopicForm";
import PracticeContentTable from "./PracticeContentTable";

export default function ManageContent() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [isTopicPopupOpen, setIsTopicPopupOpen] = useState(false);
  const [isAddTopicOpen, setIsAddTopicOpen] = useState(false);
  const [isEditTopicOpen, setIsEditTopicOpen] = useState(false);
  const [editTopic, setEditTopic] = useState(null);
  const [addTopicInitial, setAddTopicInitial] = useState({ TopicID: "", TopicName: "", CourseID: "" });
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
    axios.get("/api/topics/getTopics").then(res => {
      const filtered = (res.data || []).filter(t => t.CourseID === selectedCourse);
      setTopics(filtered);
    });
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

  // Course handlers
  const handleSelectCourse = (courseId) => setSelectedCourse(courseId);
  const handleAddCourse = () => setIsAddCourseOpen(true);
  const handleDeleteCourse = (courseId) => {
    const course = courses.find(c => c.CourseID === courseId);
    setDeleteCourseConfirm({ open: true, course });
  };

  // Topic handlers
  const handleAddTopic = () => {
    setAddTopicInitial({ TopicID: "", TopicName: "", CourseID: selectedCourse });
    setIsAddTopicOpen(true);
  };
  const handleEditTopic = (topic) => {
    setEditTopic(topic);
    setIsEditTopicOpen(true);
  };
  const handleDeleteTopic = (topic) => setDeleteConfirm({ open: true, topic });
  const handleSelectTopic = (topic) => {
    setSelectedTopic(topic);
    setIsTopicPopupOpen(true);
  };

  // Add topic submit
  const handleAddTopicSubmit = (values) => {
    const payload = { TopicName: values.TopicName, CourseID: selectedCourse };
    if (values.TopicID) payload.TopicID = Number(values.TopicID);
    axios.post("/api/topics/addTopic", payload)
      .then(res => {
        setTopics(prev => [...prev, res.data]);
        setIsAddTopicOpen(false);
      });
  };
  // Edit topic submit
  const handleEditTopicSubmit = (values) => {
    axios.put(`/api/topics/updateTopic/${editTopic.TopicID}`, {
      TopicName: values.TopicName,
      CourseID: selectedCourse,
      TopicID: values.TopicID
    }).then(res => {
      setTopics(prev => prev.map(t => t.TopicID === editTopic.TopicID ? { ...t, ...values } : t));
      setIsEditTopicOpen(false);
      setEditTopic(null);
    });
  };

  // Delete topic confirm
  const handleDeleteTopicConfirm = () => {
    axios.delete(`/api/topics/deleteTopic/${deleteConfirm.topic.TopicID}`)
      .then(() => {
        setTopics(prev => prev.filter(t => t.TopicID !== deleteConfirm.topic.TopicID));
        setDeleteConfirm({ open: false, topic: null });
      });
  };

  // Delete course confirm
  const handleDeleteCourseConfirm = () => {
    axios.delete(`/api/courses/deleteCourse/${deleteCourseConfirm.course.CourseID}`)
      .then(() => {
        setCourses(prev => prev.filter(c => c.CourseID !== deleteCourseConfirm.course.CourseID));
        if (selectedCourse === deleteCourseConfirm.course.CourseID) setSelectedCourse(null);
        setDeleteCourseConfirm({ open: false, course: null });
      });
  };

  // Practice content handlers
  const handleDeleteContent = (exerciseId) => {
    axios.delete(`/api/practice/practiceExercise/${exerciseId}`)
      .then(() => {
        setPracticeContent(prev => ({
          ...prev,
          [selectedTopic.TopicID]: prev[selectedTopic.TopicID].filter(c => c.ExerciseID !== exerciseId)
        }));
      });
  };
  const handleContentAdded = (topicId, newContent) => {
    setPracticeContent(prev => ({
      ...prev,
      [topicId]: [...(prev[topicId] || []), newContent]
    }));
  };

  return (
    <div className={styles.adminPage}>
      <h1 className={styles.pageTitle}>ניהול תכנים</h1>
      {/* Course Selector */}
      <CourseSelector
        courses={courses}
        selectedCourse={selectedCourse}
        onSelect={handleSelectCourse}
        onAdd={handleAddCourse}
        onDelete={handleDeleteCourse}
        onAddTopic={handleAddTopic}
      />
      
      {/* Add Course Popup */}
      <Popup isOpen={isAddCourseOpen} onClose={() => setIsAddCourseOpen(false)} header="הוסף קורס חדש">
        <form
          className={styles.form}
          onSubmit={e => {
            e.preventDefault();
            if (!newCourseName.trim()) return;
            axios.post("/api/courses/addCourse", { CourseName: newCourseName })
              .then(res => {
                setCourses(prev => [...prev, res.data]);
                setNewCourseName("");
                setIsAddCourseOpen(false);
              });
          }}
        >
          <div className={styles.inputContainer}>
            <label className={styles.label}>שם קורס</label>
            <input
              className={styles.input}
              type="text"
              value={newCourseName}
              onChange={e => setNewCourseName(e.target.value)}
            />
          </div>
          <button className={styles.submitButton} type="submit">הוסף</button>
          <button className={styles.smallButton} type="button" onClick={() => setIsAddCourseOpen(false)} style={{marginTop: 8}}>ביטול</button>
        </form>
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
            onClick={handleDeleteCourseConfirm}
          >מחק</button>
        </div>
      </Popup>
      {/* Topic List */}
      {selectedCourse && (
        <>
          <TopicList
            topics={topics}
            onSelectTopic={handleSelectTopic}
            onEditTopic={handleEditTopic}
            onDeleteTopic={handleDeleteTopic}
          />
        </>
      )}
      {/* Add Topic Popup */}
      <Popup isOpen={isAddTopicOpen} onClose={() => setIsAddTopicOpen(false)} header="הוסף נושא חדש">
        <TopicForm
          initialValues={addTopicInitial}
          onSubmit={handleAddTopicSubmit}
          onClose={() => setIsAddTopicOpen(false)}
          mode="add"
        />
      </Popup>
      {/* Edit Topic Popup */}
      <Popup isOpen={isEditTopicOpen} onClose={() => setIsEditTopicOpen(false)} header="ערוך נושא">
        <TopicForm
          initialValues={editTopic || { TopicID: "", TopicName: "", CourseID: selectedCourse }}
          onSubmit={handleEditTopicSubmit}
          onClose={() => setIsEditTopicOpen(false)}
          mode="edit"
        />
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
            onClick={handleDeleteTopicConfirm}
          >מחק</button>
        </div>
      </Popup>
      {/* Practice Content Popup (table and add content) */}
      <Popup isOpen={isTopicPopupOpen} onClose={() => setIsTopicPopupOpen(false)} header={selectedTopic?.TopicName || "תוכן נושא"}>
        <div className={`${styles.prominentPopup} ${styles.popupLarge}`}>
          <PracticeContentTable
            contentList={practiceContent[selectedTopic?.TopicID] || []}
            onDeleteContent={handleDeleteContent}
          />
          <button className={styles.addButton} onClick={() => setIsAddContentPopupOpen(true)}>הוסף תוכן</button>
          <PracticeContent
            topic={selectedTopic}
            isOpen={isAddContentPopupOpen}
            onClose={() => setIsAddContentPopupOpen(false)}
          />
        </div>
      </Popup>
    </div>
  );
}
