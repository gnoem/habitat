import { useRouter } from "next/router";
import { handleFetch, handleQuery } from "./api";
import { auth } from "./api/auth";

const Dashboard = ({ user }) => {
  const router = useRouter();
  const getUsers = async () => {
    const { users } = await handleQuery('{ users { id name email } }');
    console.dir(users);
  }
  const handleLogout = async () => {
    await handleFetch('/api/auth/logout');
    router.push('/');
  }
  return (
    <>
      <h2>dashboard</h2>
      <p>you made it!!!</p>
      <p>current user: {user?.id}</p>
      <button onClick={getUsers}>get all users</button><br /><br />
      <button onClick={() => console.log(user)}>get current user</button><br /><br />
      <button className="link" onClick={handleLogout}>or click here to logout</button>
    </>
  );
}

export const getServerSideProps = auth({ shield: true, redirect: '/login' });

export default Dashboard;