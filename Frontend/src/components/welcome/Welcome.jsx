import { ChevronDown } from "lucide-react";
import { scroller, Element } from "react-scroll";
import styles from "./welcome.module.css";


/**
 * @component Welcome
 * @description A welcome section component that displays a greeting to the user and a scroll-down indicator.
 * Clicking the indicator smoothly scrolls the page to the next section.
 * @param {object} props - The component props.
 * @param {object} [props.user={ username: "User" }] - The user object, containing the username to display.
 * @param {React.ReactNode} props.children - The content to be rendered in the section below the welcome screen.
 * @returns {JSX.Element} The rendered welcome component.
 */
function Welcome({ user = { username: "User" }, children }){

/**
 * @function scrollDown
 * @description Smoothly scrolls the page down to the 'nextSection' element using the `react-scroll` library.
 */
  const scrollDown = () => {
    scroller.scrollTo("nextSection", {
      duration: 800,
      delay: 0,
      smooth: "easeInOutQuart"
    });
  };

  return (
    <>
      <section className={styles.welcomeContainer}>
        <div className={styles.content}>
          <h1 className={styles.title}>Welcome {user.username}</h1>
          <p className={styles.subtitle}>כאן תוכל למצוא מידע על המערכת</p>

          <div className={styles.scrollIndicator} onClick={scrollDown}>
            <p>Scroll Down to Explore</p>
            <div className={styles.chevronContainer}>
              <ChevronDown className={styles.chevron} />
            </div>
          </div>
        </div>
      </section>

      <Element name="nextSection" className={styles.nextSection}>
        {children}
      </Element>
    </>
  );
};

export default Welcome;
