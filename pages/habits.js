import { handleQuery } from "./api";
import { auth } from "./api/auth";
import { Dash } from "../components/Dash";
import { useEffect, useState } from "react";
import { MyHabits, HabitBox } from "../components/MyHabits";
import { PageLoading } from "../components/Loading";

const Habits = ({ user }) => {
  const [habits, setHabits] = useState(null);
  useEffect(() => {
    (async () => {
      const query = `
        query ($userId: Int) {
          habits(userId: $userId) {
            id
            name
            icon
            color
            label
          }
        }
      `;
      const { habits } = await handleQuery(query, { userId: user.id });
      setHabits(habits);
    })();
  }, []);
  const content = () => {
    if (habits == null) return <PageLoading />;
    if (!habits.length) return 'No habits found, add some';
    const boxes = habits.map(habit => (
      <HabitBox {...habit} />
    ));
    return (
      <MyHabits>
        {boxes}
      </MyHabits>
    );
  }
  return (
    <Dash>
      <h1>my habits</h1>
      {content()}
    </Dash>
  );
}

export const getServerSideProps = auth({ shield: true, redirect: '/login' });

export default Habits;