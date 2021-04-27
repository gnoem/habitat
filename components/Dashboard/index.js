import { Nav } from "../Nav";
import { DateMarker } from "../Date";
import styles from "./dashboard.module.css";
import { useContext, useEffect } from "react";
import { DataContext } from "../../contexts";
import { fancyClassName } from "../../utils";

const Dashboard = ({ children, userId, sidebar, className, dim }) => {
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
      <Dim {...{ dim }} />
      <DateMarker {...{ user }} />
      <Nav />
      <div className={styles.Main}>
        {sidebar && <Sidebar {...{ user }}>{sidebar}</Sidebar>}
        <Content {...{ className }}>
          {children}
        </Content>
      </div>
    </div>
  );
}

export const Dim = ({ dim }) => {
  return (
    <div className={`${styles.Dim} ${dim ? styles.dimmed : ''}`}></div>
  );
}

export const Content = ({ children, className }) => {
  return (
    <div className={`${styles.Content} ${fancyClassName({ styles, className })}`}>
      {children}
    </div>
  );
}

export const Sidebar = ({ children, user }) => {
  return (
    <div className={styles.Sidebar}>
      {children}
    </div>
  );
}

export default Dashboard;