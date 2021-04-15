import { handleQuery } from "./api";
import { auth } from "./api/auth";
import Dash, { Content, Sidebar } from "../components/Dashboard";
import { Button } from "../components/Form";
import DashPanel from "../components/DashPanel";
import { useEffect, useState } from "react";
import { PageLoading } from "../components/Loading";

const Dashboard = ({ user }) => {
  const [habits, setHabits] = useState(null);
  const getUsers = async () => {
    const { users } = await handleQuery('{ users { id name email } }');
    console.dir(users);
  }
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
            complex
          }
        }
      `;
      const { habits } = await handleQuery(query, { userId: user.id });
      setHabits(habits);
    })();
  }, []);
  return (
    <Dash>
      <Content><h1>dashboard</h1></Content>
      <DashPanel {...{ habits }} />
    </Dash>
  );
}

export const getServerSideProps = auth({ shield: true, redirect: '/login' });

export default Dashboard;