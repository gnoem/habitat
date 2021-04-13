import styles from "./footer.module.css";

export const Footer = ({ children }) => {
  return (
    <div className={styles.Footer}>
      {children}
    </div>
  );
}