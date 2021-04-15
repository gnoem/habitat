import { useRouter } from "next/router";
import Link from "next/link";
import Form, { Input, Submit } from "../components/Form";
import { Homepage } from "../components/Homepage";
import { useForm, useUser } from "../hooks";
import { handleFetch, handleQuery } from "./api";
import { auth } from "./api/auth";

const Login = () => {
  const router = useRouter();
  const { setUser } = useUser({
    redirectTo: '/dashboard',
    redirectIfFound: true,
  });
  const { formData, handleFormError, inputProps } = useForm();
  const handleSubmit = async () => {
    const query = `
      query ($email: String, $password: String) {
        user(email: $email, password: $password) {
          ... on FormError {
            __typename
            message
            location
          }
          ... on User {
            id
            email
          }
        }
      }
    `;
    return await handleQuery(query, formData);
  }
  const handleSuccess = async ({ user }) => {
    const loggedInUser = Object.assign(user, { isLoggedIn: true });
    const body = await handleFetch('/api/auth/login', { user: loggedInUser });
    setUser(body.user);
  }
  const forgotPasswordNote = <Link href="/">forgot your password?</Link>;
  return (
    <Homepage>
      <h2>login</h2>
      <p>or click <Link href="/register">here</Link> to register</p>
      <Form onSubmit={handleSubmit} onSuccess={handleSuccess} handleFormError={handleFormError}
            behavior={{ showSuccess: false }}
            delay={1000}
            submit={<Submit value="continue" cancel="go back" onCancel={() => router.back()} />}>
        <Input type="text" name="email" label="email address:" {...inputProps} />
        <Input type="password" name="password" label="password:" note={forgotPasswordNote} {...inputProps} />
      </Form>
    </Homepage>
  );
}

export const getServerSideProps = auth({ shield: false, redirect: '/dashboard' });

export default Login;