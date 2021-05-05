import { auth } from "./api/auth";
import { DashboardComponent } from "../components/DashboardLayout";
import SettingsForm from "../components/Settings";

const Settings = ({ user }) => {
  return (
    <DashboardComponent userId={user.id}>
      <h1>settings</h1>
      <SettingsForm {...{ user }} />
    </DashboardComponent>
  );
}

export const getServerSideProps = auth({ shield: true, redirect: '/login' });

export default Settings;