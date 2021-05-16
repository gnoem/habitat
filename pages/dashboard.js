import { useContext, useMemo, useState } from "react";

import dayjs from "dayjs";

import { auth } from "./api/auth";
import { DataContext, MobileContext } from "../contexts";
import { DashboardLayout } from "../layouts";
import { PageLoading } from "../components/Loading";
import DashPanel from "../components/DashPanel";
import MyData from "../components/MyData";

const Dashboard = ({ user }) => {
  const isMobile = useContext(MobileContext);
  const [dashPanel, setDashPanel] = useState(null);
  const [calendarPeriod, updateCalendarPeriod] = useState(dayjs().format('YYYY-MM'));
  const updateDashPanel = (view, options) => setDashPanel({ view, options });
  return (
    <DashboardLayout
      userId={user.id}
      dim={isMobile && dashPanel?.view}
      dimOnClick={() => setDashPanel(null)}
      sidebar={<DashPanel {...{ dashPanel, updateDashPanel, calendarPeriod, updateCalendarPeriod }} />}>
        <DashboardContent {...{ dashPanel, updateDashPanel, calendarPeriod, updateCalendarPeriod }} />
    </DashboardLayout>
  );
}

const DashboardContent = ({ dashPanel, updateDashPanel, calendarPeriod, updateCalendarPeriod }) => {
  const { user, habits, entries } = useContext(DataContext);
  const entriesToDisplay = useMemo(() => {
    if (!entries) return [];
    return entries.filter(entry => {
      const [currentYear, currentMonth] = calendarPeriod.split('-');
      const [entryYear, entryMonth] = entry.date.split('-');
      if ((entryYear === currentYear) && (entryMonth === currentMonth)) return entry;
    });
  }, [entries, calendarPeriod]);
  return (
    <>
      <h1>dashboard</h1>
      {(!habits || !entries) && <PageLoading className="jcfs" />}
      {(habits && entries) && (
        <MyData {...{
          user,
          habits,
          entries: entriesToDisplay,
          calendarPeriod,
          updateCalendarPeriod,
          dashPanel,
          updateDashPanel
        }} />
      )}
    </>
  );
}

export const getServerSideProps = auth({ shield: true, redirect: '/login' });

export default Dashboard;