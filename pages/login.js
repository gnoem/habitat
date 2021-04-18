import { useRouter } from "next/router";
import Link from "next/link";
import Form, { Input, Submit } from "../components/Form";
import Homepage from "../components/Homepage";
import { useForm } from "../hooks";
import { handleFetch, User } from "./api";
import { auth } from "./api/auth";
import { useContext } from "react";
import { DataContext } from "../contexts";

const Login = () => {
  const router = useRouter();
  const { setUser } = useContext(DataContext);
  const { formData, handleFormError, inputProps } = useForm();
  const handleSubmit = () => User.login(formData);
  const handleSuccess = async ({ login: foundUser }) => {
    const user = Object.assign(foundUser, { isLoggedIn: true });
    const result = await handleFetch('/api/auth/login', { user });
    setUser(result.user);
    router.push('/dashboard');
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
        <Input
          type="text"
          name="email"
          label="email address:"
          {...inputProps}
        />
        <Input
          type="password"
          name="password"
          label="password:"
          note={forgotPasswordNote}
          {...inputProps}
        />
      </Form>
    </Homepage>
  );
}

export const getServerSideProps = auth({ shield: false, redirect: '/dashboard' });

export default Login;