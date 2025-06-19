import "../../pages.css";
import styles from "./manager.module.css";
import Welcome from "../../../components/welcome/Welcome";

/**
 * The Manager component renders the main page for managers.
 * It contains a sidebar with links to relevant pages, and a main content area
 * with charts or statistics.
 *
 * @returns {JSX.Element} The rendered Manager component.
 */
function Manager() {
  const userToken = localStorage.getItem("user");
  let userName = "מנהל"; // Default fallback

  try {
    const parsed = JSON.parse(userToken);
    if (parsed && parsed.name) {
      userName = parsed.name;
    }
  } catch (e) {
    console.warn("Invalid or missing user token.");
  }

  return (
    <div className={styles.adminPage}>
      <Welcome user={{ username: userName }}>
        <div className={styles.background} />
        <div className={styles.managerPage}>
          <div className={styles.chartsGrid}>
            <p>
              מוכנים ובגדול הוא פרויקט שיצרנו – מיכאל סידוריוק ונדב סייג – מתוך
              רצון אמיתי לעזור לתלמידים להצליח במבחני הקבלה. בנינו פלטפורמה
              ידידותית וכיפית לתרגול, שמאפשרת לכל אחד ואחת ללמוד בקצב שלהם,
              להתחזק בביטחון, ולהגיע מוכנים באמת. כי אנחנו מאמינים – כל אחד
              יכול, ובגדול. הדף הזה הוא רק חלק קטן מהפרויקט כולו. מאחוריו עומדת
              מערכת שלמה שממשיכה להתפתח – עם תרגולים מגוונים, ניתוחי ביצועים
              חכמים, וכלים שיכינו את המשתמשים לא רק למבחן, אלא גם להצלחה אמיתית
              בהמשך הדרך.
            </p>
          </div>
        </div>
      </Welcome>
    </div>
  );
}

export default Manager;
