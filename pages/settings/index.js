import { auth } from "../api/auth";
import { DashboardLayout } from "../../layouts";
import MySettings from "./MySettings";

const Settings = ({ user }) => {
  return (
    <DashboardLayout userId={user.id}>
      <h1>settings</h1>
      <MySettings {...{ user }} />
    </DashboardLayout>
  );
}

export const getServerSideProps = auth({ shield: true, redirect: '/login' });

export default Settings;