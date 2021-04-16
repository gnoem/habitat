import { auth } from "./api/auth";
import Dash, { Content } from "../components/Dashboard";
import DashPanel from "../components/DashPanel";
import { useContext } from "react";
import { DataContext } from "../contexts";
import { PageLoading } from "../components/Loading";

const Dashboard = ({ user }) => {
  const { habits, entries } = useContext(DataContext);
  const dashboardContent = () => {
    if (!habits || !entries) return <PageLoading className="jcfs" />;
    const getHabitObject = {
      fromId: (id) => {
        const index = habits.findIndex(habit => habit.id === id);
        return (index !== -1) ? habits[index] : {}; 
      }
    }
    return entries.map(entry => {
      const recordsList = entry.records.map(record => (
        <li key={`dashboardContent-recordsListID-${record.id}`}>
          {getHabitObject.fromId(record.habitId).name}:
          {record.check ? ' ✔️' : ' ✗'}
          {(record.check && getHabitObject.fromId(record.habitId).complex) && ` (${record.amount} units)`}
        </li>
      ));
      return (
        <div key={`dashboardContent-entryID-${entry.id}`}>
          <h3>{entry.date}</h3>
          <ul>{recordsList}</ul>
        </div>
      );
    });
  }
  return (
    <Dash userId={user.id}>
      <Content>
        <h1>dashboard</h1>
        {dashboardContent()}
      </Content>
      <DashPanel {...{ habits }} />
    </Dash>
  );
}

export const getServerSideProps = auth({ shield: true, redirect: '/login' });

export default Dashboard;