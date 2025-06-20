import React from "react";
import styles from "../adminPages.module.css";

export default function CourseSelector({
  courses,
  selectedCourse,
  onSelect,
  onAdd,
  onDelete,
  onAddTopic,
}) {
  return (
    <div className={styles.addingLine}>
      <label htmlFor="courseSelect" style={{ fontWeight: 600 }}>בחר קורס:</label>
      <select
        id="courseSelect"
        className={styles.searchInput}
        value={selectedCourse || ""}
        onChange={e => onSelect(Number(e.target.value))}
      >
        <option value="" disabled>בחר קורס</option>
        {courses.map(course => (
          <option key={course.CourseID} value={course.CourseID}>{course.CourseName}</option>
        ))}
      </select>
      {selectedCourse ? (
        <>
          <button className={styles.deleteButtonLarge} style={{marginRight: 8}} onClick={() => onDelete(selectedCourse)}>
            מחק קורס
          </button>
          <button className={styles.addButton} onClick={onAddTopic} style={{marginRight: 8}}>
            הוסף נושא
          </button>
        </>
      ) : (
        <button className={styles.addButton} onClick={onAdd}>
          הוסף קורס
        </button>
      )}
    </div>
  );
} 