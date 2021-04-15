import { Nav } from "../Nav";
import { DateMarker } from "../Date";
import styles from "./dashboard.module.css";

const Dashboard = ({ children }) => {
  return (
    <div className={styles.Dashboard}>
      <Nav />
      <DateMarker />
      <div className={styles.Main}>{children}</div>
    </div>
  );
}

export const Content = ({ children }) => {
  return (
    <div className={styles.Content}>
      {children}
    </div>
  );
}

export const Sidebar = ({ children }) => {
  return (
    <div className={styles.Sidebar}>
      {children}
    </div>
  );
}

export default Dashboard;