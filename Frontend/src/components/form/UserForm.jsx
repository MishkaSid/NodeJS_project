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

/**
 * @function validate
 * @description Validates the form values based on the fields required for the current mode.
 * It checks for specific formats (UserID, Name, Email, Password) and ensures that all required fields are filled.
 * @param {Array<string>} fields - An array of field names to validate.
 * @param {object} values - An object containing the current form values.
 * @param {string} mode - The current form mode ('login', 'add', or 'edit').
 * @returns {string|null} An error message string if validation fails, or null if it succeeds.
 */
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

/**
 * @component UserForm
 * @description A reusable form for user-related actions like login, adding a new user, or editing an existing one.
 * The form's fields, validation logic, and submit button text change based on the 'mode' prop.
 * It uses a shared `FIELD_CONFIG` for field properties and `MODE_FIELDS` to determine which fields are visible.
 * It has its own validation and can display error messages in a popup.
 * @param {object} props - The component props.
 * @param {string} [props.mode='login'] - The mode of the form, can be 'login', 'add', or 'edit'.
 * @param {object} [props.initialValues={}] - The initial values for the form fields.
 * @param {Function} props.onSubmit - The function to call when the form is submitted successfully.
 * @param {Function} [props.onValidationError] - An optional callback to handle validation errors. If not provided, a default popup is used.
 * @param {string} [props.className=''] - Additional CSS classes to apply to the form element.
 * @returns {JSX.Element} The rendered user form component.
 */
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

  /**
   * @function handleChange
   * @description A generic change handler for all form inputs. It updates the component's 'values' state
   * with the new value of the input that triggered the event.
   * @param {React.ChangeEvent<HTMLInputElement|HTMLSelectElement>} e - The change event.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * @function handleSubmit
   * @description Handles the form submission. It first validates the form values based on the current mode.
   * If validation fails, it either calls the `onValidationError` prop or shows a popup with the error.
   * If validation succeeds, it calls the `onSubmit` prop with the form values.
   * @param {React.FormEvent<HTMLFormElement>} e - The form submission event.
   */
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