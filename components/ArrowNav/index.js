import { faCaretLeft, faCaretRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./arrowNav.module.css";

export const ArrowNav = ({ ariaLabel, prev, next }) => {
  return (
    <nav className={styles.ArrowNav} aria-label={ariaLabel}>
        <button type="button" onClick={prev}><FontAwesomeIcon icon={faCaretLeft} /></button>
        <button type="button" onClick={next}><FontAwesomeIcon icon={faCaretRight} /></button>
    </nav>
  );
}