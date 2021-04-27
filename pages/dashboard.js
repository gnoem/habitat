import { auth } from "./api/auth";
import Dash, { Content } from "../components/Dashboard";
import DashPanel from "../components/DashPanel";
import { useContext, useEffect, useMemo, useState } from "react";
import { DataContext, MobileContext } from "../contexts";
import { PageLoading } from "../components/Loading";
import { Timeline } from "../components/Timeline";
import dayjs from "dayjs";
import { useMobile } from "../hooks";

const Dashboard = ({ user }) => {
  const { habits, entries } = useContext(DataContext);
  const isMobile = useContext(MobileContext);
  const [calendarPeriod, setCalendarPeriod] = useState(dayjs().format('YYYY-MM'));
  const [dashPanel, setDashPanel] = useState(null);
  const updateDashPanel = (view, options) => setDashPanel({ view, options });
  const entriesToDisplay = useMemo(() => {
    if (!entries) return [];
    return entries.filter(entry => {
      const [currentYear, currentMonth] = calendarPeriod.split('-');
      const [entryYear, entryMonth] = entry.date.split('-');
      if ((entryYear === currentYear) && (entryMonth === currentMonth)) return entry;
    });
  }, [entries, calendarPeriod]);
  console.log(isMobile);
  console.log(dashPanel);
  return (
    <Dash userId={user.id}
          dim={isMobile && dashPanel?.view}
          sidebar={<DashPanel {...{ habits, dashPanel, updateDashPanel }} />}>
      <h1>dashboard</h1>
      {(!habits || !entries)
        ? <PageLoading className="jcfs" />
        : <Timeline {...{
          user,
          habits,
          entries: entriesToDisplay,
          calendarPeriod,
          updateCalendarPeriod: setCalendarPeriod,
          dashPanel,
          updateDashPanel
        }} />}
    </Dash>
  );
}

export const getServerSideProps = auth({ shield: true, redirect: '/login' });

export default Dashboard;