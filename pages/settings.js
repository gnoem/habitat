import { auth } from "./api/auth";
import Dashboard from "../components/Dashboard";
import { AppearanceSettings, DashboardSettings, SettingsForm } from "../components/Settings";

const Settings = ({ user }) => {
  return (
    <Dashboard userId={user.id}>
      <h1>settings</h1>
      <SettingsForm {...{ user }} />
    </Dashboard>
  );
}

export const getServerSideProps = auth({ shield: true, redirect: '/login' });

export default Settings;