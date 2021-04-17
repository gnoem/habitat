import { auth } from "./api/auth";
import Dashboard, { Content } from "../components/Dashboard";
import { useContext } from "react";
import { MyHabits, HabitBox } from "../components/MyHabits";
import { PageLoading } from "../components/Loading";
import { DataContext } from "../contexts";

const Habits = ({ user }) => {
  const { habits } = useContext(DataContext);
  const content = () => {
    if (habits == null) return <PageLoading className="jcfs" />;
    if (!habits.length) return 'No habits found, add some';
    const boxes = habits.map(habit => (
      <HabitBox key={`habitBox-habitId-${habit.id}`} userId={user.id} {...habit} />
    ));
    return (
      <MyHabits userId={user.id}>
        {boxes}
      </MyHabits>
    );
  }
  return (
    <Dashboard userId={user.id}>
      <h1>my habits</h1>
      {content()}
    </Dashboard>
  );
}

export const getServerSideProps = auth({ shield: true, redirect: '/login' });

export default Habits;