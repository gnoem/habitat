import { handleFetch } from "./api";

const Users = () => {
  const getUsers = async () => {
    const { users } = await handleFetch('{ users { id name email password } }');
    console.dir(users);
  }
  return (
    <>
      <h2>users</h2>
      <button onClick={getUsers}>get all users</button>
    </>
  );
}

export default Users;