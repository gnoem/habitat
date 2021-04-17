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
      const recordsList = entry.records.map(record => {
        if (!record.check) return null;
        const currentHabit = getHabitObject.fromId(record.habitId);
        const label = () => {
          if (!currentHabit.complex) return currentHabit.label;
          const pre = currentHabit.label.split('{{')[0].trim();
          const post = currentHabit.label.split('}}')[1].trim();
          const unit = currentHabit.label.split('{{')[1].split('}}')[0];
          const amount = record.amount ?? 'some';
          return (
            <>{pre} {amount} {unit} {post}</>
          );
        }
        return (
          <li key={`dashboardContent-recordsListID-${record.id}`}>
            {label()}
          </li>
        )
      });
      return (
        <div key={`dashboardContent-entryID-${entry.id}`}>
          <h3>{entry.date}</h3>
          <ul>{recordsList}</ul>
        </div>
      );
    });
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