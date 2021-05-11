import { useContext, useEffect } from "react";

import styles from "./dashboardLayout.module.css";
import { DataContext, DataContextProvider } from "../../contexts";
import { fancyClassName } from "../../utils";
import Nav from "../../components/Nav";
import { PageLoading } from "../../components/Loading";
import Clock from "./Clock";

export const DashboardWrapper = ({ children }) => {
  return (
    <DataContextProvider>
      {children}
    </DataContextProvider>
  );
}

const DashboardLayout = ({ children, userId, sidebar, className, dim, dimOnClick }) => {
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
  if (!user) return <PageLoading className="h80p jcc aic" />;
  return (
    <div className={styles.Dashboard}>
      <Dim {...{ dim, dimOnClick }} />
      <Nav />
      <div className={styles.Main}>
        <Clock {...{ user }} />
        <Sidebar>{sidebar}</Sidebar>
        <Content {...{ className }}>
          {children}
        </Content>
      </div>
    </div>
  );
}

export const Dim = ({ dim, dimOnClick }) => {
  return (
    <div className={`${styles.Dim} ${dim ? styles.dimmed : ''}`} onClick={dimOnClick}></div>
  );
}

export const Content = ({ children, className }) => {
  return (
    <div className={`${styles.Content} ${fancyClassName({ styles, className })}`}>
      {children}
    </div>
  );
}

export const Sidebar = ({ children }) => {
  if (!children) return null;
  return (
    <div className={styles.Sidebar}>
      {children}
    </div>
  );
}

export default DashboardLayout;