import {  handleQuery } from "./api";
import { auth } from "./api/auth";
import { Dash } from "../components/Dash";

const Dashboard = ({ user }) => {
  const getUsers = async () => {
    const { users } = await handleQuery('{ users { id name email } }');
    console.dir(users);
  }
  return (
    <Dash>
      <h1>dashboard</h1>
    </Dash>
  );
}

export const getServerSideProps = auth({ shield: true, redirect: '/login' });

export default Dashboard;