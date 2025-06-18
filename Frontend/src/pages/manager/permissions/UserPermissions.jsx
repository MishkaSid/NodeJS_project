
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
          (
            (user.Name || "").toLowerCase().includes((search || "").toLowerCase()) ||
            (user.UserID?.toString() || "").includes((search || ""))
          )
      )
    : [];

  function handleDeleteUser(id) {
    axios
      .delete(`/api/userController/deleteUser/${id}`)
      .then(() => {
        setUsers((prevUsers) => prevUsers.filter((user) => user.UserID !== id));
      })
      .catch((err) => console.error("Error deleting user:", err));
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
    setFormData({ ...user });
    setIsEditMode(true);
    setIsFormOpen(true);
  }

  function handleSubmitUser() {
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
      type: "text",
      name: "Role",
      value: formData.Role,
      onChange: (e) => setFormData({ ...formData, Role: e.target.value }),
    },
  ];

  return (
    <>
      <div className={styles.adminPage}>
        <h1 className={styles.pageTitle}>ניהול הרשאות</h1>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="חפש משתמש לפי שם..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className={styles.addingLine}>
          <button className={styles.addButton} onClick={handleAddUser}>הוסף משתמש</button>
          <Upload />
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
            {filtered.map((user, index) => (
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
                    ✏️ ערוך
                  </button>
                  <button
                    className={`${styles.actionButton} ${styles.deleteButton}`}
                    onClick={() => handleDeleteUser(user.UserID)}
                  >
                    🗑️ מחק
                  </button>
                </td>
              </tr>
            ))}
            {!filtered.length && (
              <tr className="noResults">
                <td colSpan="5">לא נמצאו משתמשים</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {isFormOpen && (
        <Popup isOpen={isFormOpen} onClose={() => setIsFormOpen(false)}>
          <Form inputs={formInputs} onSubmit={handleSubmitUser} />
        </Popup>
      )}
    </>
  );
}
