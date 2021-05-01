import { useContext } from "react";

import { auth } from "./api/auth";
import { DataContext } from "../contexts";
import Dashboard from "../components/Dashboard";
import { MyHabits } from "../components/MyHabits";
import { PageLoading } from "../components/Loading";

const Habits = ({ user }) => {
  const { habits } = useContext(DataContext);
  return (
    <Dashboard userId={user.id}>
      <h1>my habits</h1>
      {habits
        ? <MyHabits {...{
            user,
            habits
          }} />
        : <PageLoading className="jcfs" />
      }
    </Dashboard>
  );
}

export const getServerSideProps = auth({ shield: true, redirect: '/login' });

export default Habits;