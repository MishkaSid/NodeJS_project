import styles from "./unauthorize.module.css";

/**
 * @component Unauthorize
 * @description A page displayed to users who try to access a route they are not authorized to view.
 * It shows a message indicating lack of permission and provides a contact email for assistance.
 * @returns {JSX.Element} The rendered unauthorized access page.
 */
const Unauthorize = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>אין לך הרשאה לגישה לדף זה</h1>
      <p className={styles.subtitle}>
        אם אתה מנהל או מורה, אנא פנה למנהל המערכת
      </p>
      <a className={styles.email} href="mailto:harshama@pet.ac.il">harshama@pet.ac.il</a>
    </div>
  );
};

export default Unauthorize;
