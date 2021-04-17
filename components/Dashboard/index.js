import { Nav } from "../Nav";
import { DateMarker } from "../Date";
import styles from "./dashboard.module.css";
import { useContext, useEffect } from "react";
import { DataContext } from "../../contexts";

const Dashboard = ({ children, userId, sidebar }) => {
  const { user, getUser, habits, getHabits, entries, getEntries } = useContext(DataContext);
  useEffect(() => {
    if (user == null) return getUser(userId);
  }, [user]);
  useEffect(() => {
    if (user && !habits) return getHabits();
  }, [user, habits]);
  useEffect(() => {
    if (user && !entries) return getEntries();
  }, [user, entries]);
  return (
    <div className={styles.Dashboard}>
      <Nav />
      <div className={styles.Main}>
        {sidebar && <Sidebar>{sidebar}</Sidebar>}
        <Content>
          {children}
        </Content>
      </div>
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
      <DateMarker />
      {children}
    </div>
  );
}

export default Dashboard;