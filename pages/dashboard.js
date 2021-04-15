import {  handleQuery } from "./api";
import { auth } from "./api/auth";
import Dash, { Content, Sidebar } from "../components/Dashboard";
import { Button } from "../components/Form";
import DashPanel from "../components/DashPanel";

const Dashboard = ({ user }) => {
  const getUsers = async () => {
    const { users } = await handleQuery('{ users { id name email } }');
    console.dir(users);
  }
  return (
    <Dash>
      <Content><h1>dashboard</h1></Content>
      <DashPanel />
    </Dash>
  );
}

export const getServerSideProps = auth({ shield: true, redirect: '/login' });

export default Dashboard;