import styles from "./homepage.module.css";

export const Homepage = ({ children, title }) => {
  return (
    <div className={styles.Homepage}>
      <div className={styles.Main}>
        <h1>{title ?? 'habitat'}</h1>
        {children}
      </div>
    </div>
  );
}