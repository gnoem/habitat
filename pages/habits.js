import { auth } from "./api/auth";
import Dashboard from "../components/Dashboard";
import { useContext } from "react";
import { MyHabits } from "../components/MyHabits";
import { PageLoading } from "../components/Loading";
import { DataContext } from "../contexts";

const Habits = ({ user }) => {
  const { habits } = useContext(DataContext);
  return (
    <Dashboard userId={user.id}>
      <h1>my habits</h1>
      {habits
        ? <MyHabits {...{
            userId: user.id,
            habits
          }} />
        : <PageLoading className="jcfs" />
      }
    </Dashboard>
  );
}

export const getServerSideProps = auth({ shield: true, redirect: '/login' });

export default Habits;