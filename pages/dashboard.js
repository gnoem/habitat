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
    return 'going to have a pretty graph here'
  }
  return (
    <Dash userId={user.id}>
      <Content>
        <h1>dashboard</h1>
        {dashboardContent()}
      </Content>
      <DashPanel {...{ habits }} />
    </Dash>
  );
}

export const getServerSideProps = auth({ shield: true, redirect: '/login' });

export default Dashboard;