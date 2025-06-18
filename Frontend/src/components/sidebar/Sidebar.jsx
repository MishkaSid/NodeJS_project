import { FiUsers, FiHome, FiBookOpen, FiBook, FiMenu, FiLogOut } from "react-icons/fi";
import styles from "./sidebar.module.css";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { navigate } from "../../app/navigate"; // Custom navigation function

/**
 * Sidebar component for navigation without react-router.
 *
 * Renders links based on the user's role and handles logout and route navigation.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the sidebar is expanded or collapsed.
 * @param {function} props.setIsOpen - Toggle function for sidebar expansion.
 * @param {string} [props.userType="guest"] - Determines which links to show.
 * @returns {JSX.Element}
 */

function Sidebar({ isOpen, setIsOpen, userType = "guest" }) {
  const { logout } = useAuth();
  const [expanded, setExpanded] = useState(isOpen);

  const menuItems = {
    Admin: [
      { to: "/manager", icon: <FiHome size={30} className={styles.icon} />, label: "בית" },
      { to: "/manager/permissions", icon: <FiUsers size={30} className={styles.icon} />, label: "הרשאות משתמשים" },
      { to: "/manager/manageContent", icon: <FiBookOpen size={30} className={styles.icon} />, label: "ניהול תכנים" }
    ],
    Teacher: [
      { to: "/teacher", icon: <FiHome size={30} className={styles.icon} />, label: "בית" },
      { to: "/teacher/manageContent", icon: <FiBookOpen size={30} className={styles.icon} />, label: "שיעורים" }
    ],
    Examinee: [
      { to: "/student", icon: <FiHome size={30} className={styles.icon} />, label: "בית" },
      { to: "/practice", icon: <FiBook size={30} className={styles.icon} />, label: "תרגול" }
    ],
    guest: []
  };

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <div className={`${styles.sidebar} ${expanded ? styles.expanded : styles.collapsed}`}>
      <button
        className={styles.menuToggle}
        onClick={() => {
          setIsOpen(!isOpen);
          setExpanded(!expanded);
        }}
      >
        <FiMenu size={30} />
      </button>

      <ul className={styles.navLinks}>
        {(menuItems[userType] || []).map((item, index) => (
          <li key={index}>
            <a
              href={item.to}
              onClick={(e) => {
                e.preventDefault();
                navigate(item.to);
              }}
            >
              {item.icon}
              {expanded && <span>{item.label}</span>}
            </a>
          </li>
        ))}
      </ul>

      <button className={styles.logoutButton} onClick={handleLogout}>
        <FiLogOut size={30} />
        {expanded && <span>התנתק/י</span>}
      </button>
    </div>
  );
}

export default Sidebar;
