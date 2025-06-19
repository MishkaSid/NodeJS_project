import { useState, useEffect } from "react";
import styles from "../adminPages.module.css";
import Upload from "../../../components/upload/UploadStudentTable";
import axios from "axios";
import Form from "../../../components/form/Form";
import Popup from "../../../components/popup/Popup";

export default function UserPermissions() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    UserID: "",
    Name: "",
    Email: "",
    Password: "",
    Role: "Examinee",
    CourseID: null,
  });
  const [popupConfig, setPopupConfig] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");

  useEffect(() => {
    axios
      .get("/api/generalData/users")
      .then((res) => {
        const fetchedUsers = res.data[0] || [];
        setUsers(fetchedUsers);
      })
      .catch((err) => console.error("Error fetching users:", err));
  }, []);

  const filtered = Array.isArray(users)
    ? users.filter(
        (user) =>
          user &&
          ((user.Name || "")
            .toLowerCase()
            .includes((search || "").toLowerCase()) ||
            (user.UserID?.toString() || "").includes(search || ""))
      )
    : [];

  const filteredByRole = filtered.filter((user) => {
    if (selectedRole === "") return true;
    if (selectedRole === "All") return true;
    return user.Role === selectedRole;
  });

  const roles = ["All", "Admin", "Teacher", "Examinee"];
  const roleOptions = roles.map((role) => (
    <option key={role} value={role}>
      {role}
    </option>
  ));

  function handleDeleteUser(id) {
    setPopupConfig({
      title: "האם אתה בטוח?",
      message: "מחיקת משתמש תמחק את כל הנתונים שלו",
      confirmLabel: "כן, מחק",
      cancelLabel: "ביטול",
      onConfirm: () => {
        axios
          .delete(`/api/user/deleteUser/${id}`)
          .then(() => {
            setUsers((prevUsers) =>
              prevUsers.filter((user) => user.UserID !== id)
            );
            setPopupConfig(null);
          })
          .catch((err) => {
            console.error("Error deleting user:", err);
            setPopupConfig(null);
          });
      },
    });
  }

  function handleAddUser() {
    setFormData({
      UserID: "",
      Name: "",
      Email: "",
      Password: "",
      Role: "Examinee",
      CourseID: null,
    });
    setIsEditMode(false);
    setIsFormOpen(true);
  }

  function handleEditUser(user) {
    const { Password, ...rest } = user;
    setFormData({ ...rest });
    setIsEditMode(true);
    setIsFormOpen(true);
  }

  function handleSubmitUser() {
    const { UserID, Name, Password } = formData;

    const idIsValid = /^\d{9}$/.test(UserID);
    const nameIsValid = /^[A-Za-z\u0590-\u05FF\s]{2,}$/.test(Name);
    const passwordIsValid = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{3,8}$/.test(
      Password
    );

    if (!idIsValid) {
      setPopupConfig({
        title: "שגיאה",
        message: "תעודת זהות חייבת להכיל בדיוק 9 ספרות.",
        confirmLabel: "סגור",
        onConfirm: () => setPopupConfig(null),
      });
      return;
    }

    if (!nameIsValid) {
      setPopupConfig({
        title: "שגיאה",
        message: "השם חייב להכיל לפחות שני תווים, ורק אותיות ורווחים.",
        confirmLabel: "סגור",
        onConfirm: () => setPopupConfig(null),
      });
      return;
    }

    if (!isEditMode && !passwordIsValid) {
      setPopupConfig({
        title: "שגיאה",
        message:
          "הסיסמה חייבת להכיל לפחות אות אחת, מספר אחד, ואורכה בין 3 ל-8 תווים.",
        confirmLabel: "סגור",
        onConfirm: () => setPopupConfig(null),
      });
      return;
    }

    const endpoint = isEditMode
      ? `/api/user/updateUser/${formData.UserID}`
      : "/api/user/addUser";

    const axiosMethod = isEditMode ? axios.put : axios.post;

    axiosMethod(endpoint, formData)
      .then((res) => {
        if (isEditMode) {
          setUsers((prev) =>
            prev.map((u) => (u.UserID === formData.UserID ? formData : u))
          );
        } else {
          setUsers((prev) => [...prev, formData]);
        }
        setIsFormOpen(false);
      })
      .catch((err) => {
        console.error("Error saving user:", err);
        setIsFormOpen(false);
      });
  }

  const formInputs = [
    {
      label: "ת.ז",
      type: "text",
      name: "UserID",
      value: formData.UserID,
      onChange: (e) => setFormData({ ...formData, UserID: e.target.value }),
    },
    {
      label: "שם",
      type: "text",
      name: "Name",
      value: formData.Name,
      onChange: (e) => setFormData({ ...formData, Name: e.target.value }),
    },
    {
      label: "אימייל",
      type: "email",
      name: "Email",
      value: formData.Email,
      onChange: (e) => setFormData({ ...formData, Email: e.target.value }),
    },
    {
      label: "סיסמה",
      type: "text",
      name: "Password",
      value: formData.Password,
      onChange: (e) => setFormData({ ...formData, Password: e.target.value }),
    },
    {
      label: "תפקיד",
      type: "select",
      name: "Role",
      value: formData.Role,
      onChange: (e) => setFormData({ ...formData, Role: e.target.value }),
      options: ["Admin", "Teacher", "Examinee"],
    },
  ];

  return (
    <>
      <div className={styles.adminPage}>
        <h1 className={styles.pageTitle}>ניהול הרשאות</h1>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="חפש משתמש לפי שם או ת.ז..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className={styles.addingLine}>
          <button className={styles.addButton} onClick={handleAddUser}>
            הוסף משתמש
          </button>
          <Upload />
          <div className={styles.sort}>
            <select
              id="role-select"
              className={styles.input}
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <option value="" disabled hidden>
                בחר תפקיד
              </option>
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role === "All" ? "הצג הכל" : role}
                </option>
              ))}
            </select>
          </div>
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ת.ז</th>
              <th>שם משתמש</th>
              <th>תפקיד</th>
              <th>אימייל</th>
              <th>פעולות</th>
            </tr>
          </thead>
          <tbody>
            {filteredByRole.map((user, index) => (
              <tr key={index}>
                <td>{user.UserID}</td>
                <td>{user.Name}</td>
                <td>{user.Role || "---"}</td>
                <td>{user.Email}</td>
                <td>
                  <button
                    className={`${styles.actionButton} ${styles.editButton}`}
                    onClick={() => handleEditUser(user)}
                  >
                    ערוך ✏️
                  </button>
                  <button
                    className={`${styles.actionButton} ${styles.deleteButton}`}
                    onClick={() => handleDeleteUser(user.UserID)}
                  >
                    מחק 🗑️
                  </button>
                </td>
              </tr>
            ))}
            {!filteredByRole.length && (
              <tr className="noResults">
                <td colSpan="5">לא נמצאו משתמשים</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {isFormOpen && (
        <Popup isOpen={isFormOpen} onClose={() => setIsFormOpen(false)}>
          <Form
            inputs={
              isEditMode
                ? formInputs.filter((input) => input.name !== "Password")
                : formInputs
            }
            onSubmit={handleSubmitUser}
          />
          {isEditMode && (
            <div className={styles.note}>
              <p>שינוי סיסמה יתבצע ממסך נפרד או בהרשמה מחדש בלבד.</p>
            </div>
          )}
        </Popup>
      )}
      {popupConfig && (
        <Popup
          header={popupConfig.title}
          text={popupConfig.message}
          isOpen={true}
          onClose={() => setPopupConfig(null)}
        >
          <button onClick={popupConfig.onConfirm}>
            {popupConfig.confirmLabel}
          </button>
        </Popup>
      )}
    </>
  );
}
