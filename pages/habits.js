import { useContext } from "react";

import { auth } from "./api/auth";
import { DataContext } from "../contexts";
import { DashboardLayout } from "../layouts";
import { PageLoading } from "../components/Loading";
import { MyHabits } from "../components/MyHabits";

const Habits = ({ user }) => {
  return (
    <DashboardLayout userId={user.id}>
      <HabitsContent {...{ user }} />
    </DashboardLayout>
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