import { useState } from "react";
import styles from "./form.module.css";
import Popup from "../popup/Popup";

const FIELD_CONFIG = {
  UserID: { label: "ת.ז", type: "text" },
  Name: { label: "שם", type: "text" },
  Email: { label: "אימייל", type: "email" },
  Password: { label: "סיסמה", type: "password" },
  Role: { label: "תפקיד", type: "select", options: ["Admin", "Teacher", "Examinee"] },
};

const MODE_FIELDS = {
  login: ["Email", "Password"],
  add: ["UserID", "Name", "Email", "Password", "Role"],
  edit: ["UserID", "Name", "Email", "Role"], // Password not shown in edit
};

function validate(fields, values, mode) {
  // Returns error message string or null
  if (fields.includes("UserID")) {
    if (!/^\d{9}$/.test(values.UserID || "")) {
      return "תעודת זהות חייבת להכיל בדיוק 9 ספרות.";
    }
  }
  if (fields.includes("Name")) {
    if (!/^[A-Za-z\u0590-\u05FF\s]{2,}$/.test(values.Name || "")) {
      return "השם חייב להכיל לפחות שני תווים, ורק אותיות ורווחים.";
    }
  }
  if (fields.includes("Email")) {
    if (!/^\S+@\S+\.\S+$/.test(values.Email || "")) {
      return "יש להזין כתובת אימייל תקינה.";
    }
  }
  if (fields.includes("Password") && mode !== "edit") {
    if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{3,8}$/.test(values.Password || "")) {
      return "הסיסמה חייבת להכיל לפחות אות אחת, מספר אחד, ואורכה בין 3 ל-8 תווים.";
    }
  }
  // All required fields must be filled
  for (const field of fields) {
    if (!values[field]) {
      return `יש למלא את שדה ${FIELD_CONFIG[field].label}`;
    }
  }
  return null;
}

export default function UserForm({
  mode = "login",
  initialValues = {},
  onSubmit,
  onValidationError,
  className = "",
}) {
  const [values, setValues] = useState({
    UserID: initialValues.UserID || "",
    Name: initialValues.Name || "",
    Email: initialValues.Email || "",
    Password: initialValues.Password || "",
    Role: initialValues.Role || "Examinee",
  });
  const [showPopup, setShowPopup] = useState(false);
  const [popupMsg, setPopupMsg] = useState("");

  const fields = MODE_FIELDS[mode];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const error = validate(fields, values, mode);
    if (error) {
      if (onValidationError) {
        onValidationError(error);
      } else {
        setPopupMsg(error);
        setShowPopup(true);
      }
      return;
    }
    // For login, only send Email and Password
    if (mode === "login") {
      onSubmit({ email: values.Email, password: values.Password });
    } else {
      onSubmit(values);
    }
  };

  return (
    <>
      <form className={`${styles.form} ${className}`} onSubmit={handleSubmit}>
        {fields.map((field) => {
          const config = FIELD_CONFIG[field];
          if (config.type === "select") {
            return (
              <div className={styles.inputContainer} key={field}>
                <label className={styles.label}>{config.label}</label>
                <select
                  className={styles.input}
                  name={field}
                  value={values[field]}
                  onChange={handleChange}
                >
                  {config.options.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            );
          }
          return (
            <div className={styles.inputContainer} key={field}>
              <label className={styles.label}>{config.label}</label>
              <input
                className={styles.input}
                type={config.type}
                name={field}
                value={values[field]}
                onChange={handleChange}
                autoComplete={field === "Password" ? "current-password" : undefined}
              />
            </div>
          );
        })}
        <button className={styles.submitButton} type="submit">
          {mode === "login" ? "התחבר" : mode === "add" ? "הוסף" : "שמור"}
        </button>
      </form>
      <Popup
        header="שגיאה"
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
      >
        <div style={{ color: "black" }}>{popupMsg}</div>
      </Popup>
    </>
  );
} 