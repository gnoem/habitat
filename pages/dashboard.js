import { auth } from "./api/auth";
import Dash, { Content } from "../components/Dashboard";
import DashPanel from "../components/DashPanel";
import { useContext, useState } from "react";
import { DataContext } from "../contexts";
import { PageLoading } from "../components/Loading";
import { Timeline } from "../components/Timeline";
import dayjs from "dayjs";

const Dashboard = ({ user }) => {
  const { habits, entries } = useContext(DataContext);
  const [calendarPeriod, setCalendarPeriod] = useState(dayjs().format('YYYY-MM'));
  const dashboardContent = () => {
    if (!habits || !entries) return <PageLoading className="jcfs" />;
    const entriesToDisplay = entries.filter(entry => {
      const [currentYear, currentMonth] = calendarPeriod.split('-');
      const [entryYear, entryMonth] = entry.date.split('-');
      if ((entryYear === currentYear) && (entryMonth === currentMonth)) return entry;
    });
    return <Timeline {...{
      habits,
      entries: entriesToDisplay,
      calendarPeriod,
      updateCalendarPeriod: setCalendarPeriod
    }} />;
  }
  return (
    <Dash userId={user.id} sidebar={<DashPanel {...{ habits }} />}>
      <h1>dashboard</h1>
      {dashboardContent()}
    </Dash>
  );
}

export const getServerSideProps = auth({ shield: true, redirect: '/login' });

export default Dashboard;