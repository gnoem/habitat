import { auth } from "./api/auth";
import { DashboardLayout } from "../layouts";
import MyAccount from "../components/MyAccount";

const Account = ({ user }) => {
  return (
    <DashboardLayout userId={user.id} className="Account">
      <h1>my account</h1>
      <MyAccount {...{ user }} />
    </DashboardLayout>
  );
}

export const getServerSideProps = auth({ shield: true, redirect: '/login' });

export default Account;