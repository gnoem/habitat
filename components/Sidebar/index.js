import styles from "./sidebar.module.css";

export const Sidebar = ({ children }) => {
  return (
    <div className={styles.Sidebar}>
      {children}
    </div>
  );
}