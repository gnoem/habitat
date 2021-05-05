import { useContext, useMemo, useState } from "react";

import dayjs from "dayjs";

import { auth } from "./api/auth";
import { DataContext, MobileContext } from "../contexts";
import { DashboardComponent } from "../components/DashboardLayout";
import DashPanel from "../components/DashPanel";
import { PageLoading } from "../components/Loading";
import Timeline from "../components/Timeline";

const Dashboard = ({ user }) => {
  const isMobile = useContext(MobileContext);
  const [dashPanel, setDashPanel] = useState(null);
  const updateDashPanel = (view, options) => setDashPanel({ view, options });
  return (
    <DashboardComponent userId={user.id}
          dim={isMobile && dashPanel?.view}
          dimOnClick={() => setDashPanel(null)}
          sidebar={<DashPanel {...{ dashPanel, updateDashPanel }} />}>
      <DashboardContent {...{ user, dashPanel, updateDashPanel }} />
    </DashboardComponent>
  );
}

const DashboardContent = ({ user, dashPanel, updateDashPanel }) => {
  const { habits, entries } = useContext(DataContext);
  const [calendarPeriod, setCalendarPeriod] = useState(dayjs().format('YYYY-MM'));
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
        <Timeline {...{
          user,
          habits,
          entries: entriesToDisplay,
          calendarPeriod,
          updateCalendarPeriod: setCalendarPeriod,
          dashPanel,
          updateDashPanel
        }} />
      )}
    </>
  );
}

export const getServerSideProps = auth({ shield: true, redirect: '/login' });

export default Dashboard;