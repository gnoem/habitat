import { useContext } from "react";

import { auth } from "./api/auth";
import { DataContext } from "../contexts";
import { DashboardComponent } from "../components/DashboardLayout";
import { MyHabits } from "../components/MyHabits";
import { PageLoading } from "../components/Loading";

const Habits = ({ user }) => {
  return (
    <DashboardComponent userId={user.id}>
      <HabitsContent {...{ user }} />
    </DashboardComponent>
  );
}

const HabitsContent = ({ user }) => {
  const { habits } = useContext(DataContext);
  return (
    <>
      <h1>my habits</h1>
      {habits
        ? <MyHabits {...{
            user,
            habits
          }} />
        : <PageLoading className="jcfs" />
      }
    </>
  );
}

export const getServerSideProps = auth({ shield: true, redirect: '/login' });

export default Habits;