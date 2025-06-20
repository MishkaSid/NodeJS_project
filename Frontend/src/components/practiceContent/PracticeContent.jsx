import React, { useState, useEffect } from "react";
import styles from "./practiceContent.module.css";
import Popup from "../popup/Popup";
import axios from "axios";

const contentTypeOptions = [
  { value: "image", label: "תמונה" },
];

function getDefaultContent() {
  return {
    contentType: "image",
    contentValue: "",
    AnswerOptions: ["", ""],
    CorrectAnswer: "A",
  };
}

export default function PracticeContent({ topic, isOpen, onClose }) {
  const [topicExercises, setTopicExercises] = useState([]);
  const [isAddContentOpen, setIsAddContentOpen] = useState(false);
  const [newContent, setNewContent] = useState(getDefaultContent());
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch exercises for selected topic
  useEffect(() => {
    if (!topic) return;
    setLoading(true);
    axios.get("/api/practiceExercises")
      .then(res => {
        setTopicExercises((res.data || []).filter(e => e.TopicID === topic.TopicID));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [topic]);

  // Add content to selected topic
  const handleAddContent = async () => {
    if (!newContent.contentValue) return;
    if (newContent.AnswerOptions.length < 2 || newContent.AnswerOptions.some(opt => !opt.trim())) return;
    if (!newContent.CorrectAnswer) return;
    const payload = {
      TopicID: topic.TopicID,
      ContentType: newContent.contentType,
      ContentValue: newContent.contentValue,
      AnswerOptions: newContent.AnswerOptions,
      CorrectAnswer: newContent.CorrectAnswer,
    };
    axios.post("/api/practiceExercise", payload)
      .then(res => {
        setTopicExercises(prev => [...prev, res.data]);
        setIsAddContentOpen(false);
        setNewContent(getDefaultContent());
        setUploadError("");
      });
  };

  // Handle file/image upload
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setUploadError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await axios.post("/api/practiceExercise/upload", formData, { headers: { "Content-Type": "multipart/form-data" } });
      setNewContent((c) => ({ ...c, contentValue: res.data.url }));
      setUploading(false);
    } catch (err) {
      setUploadError("שגיאה בהעלאת קובץ");
      setUploading(false);
    }
  };

  return (
    <Popup isOpen={isOpen} onClose={onClose} header={topic?.TopicName}>
      <table className={styles.table} style={{ marginBottom: 16 }}>
        <thead>
          <tr>
            <th>תוכן</th>
            <th>רמת קושי</th>
            <th>סוג</th>
          </tr>
        </thead>
        <tbody>
          {topicExercises.map((content) => (
            <tr key={content.ExerciseID}>
              <td>
                {content.ContentType === "text" && content.ContentValue}
                {content.ContentType === "image" && (
                  <img src={content.ContentValue} alt="img" className={styles.tableImage} />
                )}
                {content.ContentType === "file" && (
                  <a href={content.ContentValue} target="_blank" rel="noopener noreferrer">הורד קובץ</a>
                )}
              </td>
              <td>{content.level || "-"}</td>
              <td>{content.type || "-"}</td>
            </tr>
          ))}
          {topicExercises.length === 0 && (
            <tr><td colSpan="3">אין תוכן</td></tr>
          )}
        </tbody>
      </table>
      <button className={styles.addButton} onClick={() => setIsAddContentOpen(true)}>
        הוסף תוכן
      </button>
      {/* Add Content Popup (nested) */}
      <Popup isOpen={isAddContentOpen} onClose={() => setIsAddContentOpen(false)} header="הוסף תוכן">
        <form
          className={styles.form}
          onSubmit={e => {
            e.preventDefault();
            handleAddContent();
          }}
        >
          <div className={styles.inputContainer}>
            <label className={styles.label}>סוג תוכן</label>
            <select
              className={styles.input}
              value={newContent.contentType}
              disabled
            >
              <option value="image">תמונה</option>
            </select>
          </div>
          {(newContent.contentType === "image") && (
            <div className={styles.inputContainer}>
              <label className={styles.label}>בחר תמונה</label>
              <input
                className={styles.input}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
              />
              {uploading && <div className={styles.uploadingMsg}>מעלה...</div>}
              {uploadError && <div className={styles.uploadError}>{uploadError}</div>}
              {newContent.contentValue && (
                <img src={newContent.contentValue} alt="preview" className={styles.imagePreview} />
              )}
            </div>
          )}
          <div className={styles.inputContainer}>
            <label className={styles.label}>אפשרויות תשובה</label>
            {newContent.AnswerOptions.map((option, idx) => (
              <div key={idx} className={styles.answerOptionRow}>
                <input
                  className={`${styles.input} ${styles.answerOptionInput}`}
                  type="text"
                  placeholder={`תשובה ${String.fromCharCode(65 + idx)}`}
                  value={option}
                  onChange={e => {
                    const updated = [...newContent.AnswerOptions];
                    updated[idx] = e.target.value;
                    setNewContent(c => ({ ...c, AnswerOptions: updated }));
                  }}
                  required
                />
                <input
                  type="radio"
                  name="correctAnswer"
                  className={styles.answerOptionRadio}
                  checked={newContent.CorrectAnswer === String.fromCharCode(65 + idx)}
                  onChange={() => setNewContent(c => ({ ...c, CorrectAnswer: String.fromCharCode(65 + idx) }))}
                />
                <span className={styles.answerOptionLabel}>{String.fromCharCode(65 + idx)}</span>
                {newContent.AnswerOptions.length > 2 && (
                  <button
                    type="button"
                    className={styles.answerOptionRemove}
                    onClick={() => {
                      const updated = newContent.AnswerOptions.filter((_, i) => i !== idx);
                      let correct = newContent.CorrectAnswer;
                      if (correct === String.fromCharCode(65 + idx)) correct = "A";
                      setNewContent(c => ({ ...c, AnswerOptions: updated, CorrectAnswer: correct }));
                    }}
                  >✕</button>
                )}
              </div>
            ))}
            <button
              type="button"
              className={styles.addOptionButton}
              onClick={() => {
                setNewContent(c => ({ ...c, AnswerOptions: [...c.AnswerOptions, ""] }));
              }}
            >הוסף אפשרות</button>
            <div className={styles.optionHint}>בחר את התשובה הנכונה (עיגול ימני)</div>
          </div>
          <button className={styles.submitButton} type="submit" disabled={uploading}>
            הוסף
          </button>
        </form>
      </Popup>
    </Popup>
  );
} 