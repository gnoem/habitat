import { auth } from "./api/auth";
import Dashboard, { Content } from "../components/Dashboard";

const Settings = () => {
  return (
    <Dashboard>
      <Content>
        <h1>settings</h1>
        <h2>appearance</h2>
        <ul>
          <li>refresh background gradient periodically [y/n] - every ___ sec/min/hr</li>
          <li>clock</li>
          <ul>
            <li>hide clock [y/n]</li>
            <li>24 hr clock [y/n]</li>
            <li>show seconds [y/n]</li>
          </ul>
        </ul>
      </Content>
    </Dashboard>
  );
}

export const getServerSideProps = auth({ shield: true, redirect: '/login' });

export default Settings;