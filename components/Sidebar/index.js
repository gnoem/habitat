import styles from "./sidebar.module.css";

const Sidebar = ({ children }) => {
  return (
    <div className={styles.Sidebar}>
      {children}
    </div>
  );
}

export default Sidebar;