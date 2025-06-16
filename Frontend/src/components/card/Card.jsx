import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./card.module.css";

/**
 * A clickable card component. Can be customized with a title, description, icon, size, and layout.
 *
 * @param {Object} props Component props.
 * @prop {String} title The card title.
 * @prop {String} [description] The card description.
 * @prop {ReactNode} [icon] A React component to display as the card icon.
 * @prop {String} [to] The location to navigate to when the card is clicked.
 * @prop {String} [size=medium] The card size. Can be "small", "medium", or "large".
 * @prop {String} [layout=vertical] The card layout. Can be "vertical" or "horizontal".
 */

export default function Card({ title, description, icon, to, size = "medium", layout = "vertical" }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) {
      navigate(to);
    }
  };

  return (
    <div
      className={`${styles.card} ${styles[size]} ${layout === "horizontal" ? styles.horizontal : ""}`}
      onClick={handleClick}
    >
      {icon && <div className={styles.cardIcon}>{icon}</div>}
      <div>
        <h3 className={styles.cardTitle}>{title}</h3>
        <p className={styles.cardDescription}>{description}</p>
      </div>
    </div>
  );
}

