import React from "react";
import styles from "../adminPages.module.css";

export default function PracticeContentTable({ contentList, onDeleteContent }) {
  return (
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
          {(contentList || []).map(content => (
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
                <button className={styles.smallButton} onClick={() => onDeleteContent(content.ExerciseID)}>מחק</button>
              </td>
            </tr>
          ))}
          {(contentList || []).length === 0 && (
            <tr><td colSpan="4">אין תוכן</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
} 