import "../../pages.css";
import styles from "./manager.module.css";
import Welcome from "../../../components/welcome/Welcome";

/**
 * The Manager component renders the main page for managers.
 * It contains a sidebar with links to relevant pages, and a main content area
 * with three charts: a question statistics chart, a student usage chart, and a
 * grades distribution chart.
 *
 * @returns {JSX.Element} The rendered Manager component.
 */

function Manager() {

  const userToken = localStorage.getItem("user");
  console.log(userToken);
  console.log(JSON.parse(userToken).name);
  return (
    <div className={styles.adminPage}>
      <Welcome user={{ username:JSON.parse(userToken).name}}>
        <div className={styles.background} />
        <div className={styles.managerPage}>
          <div className={styles.chartsGrid}>
            <p>
              this is manager page which will contain charts of statistics in various fields  
            </p>
          </div>
        </div>
      </Welcome>
    </div>
  );
}

export default Manager;
