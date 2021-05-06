import { useRouter } from "next/router";
import Link from "next/link";

import { handleRequest, User } from "./api";
import { auth } from "./api/auth";
import { useForm } from "../hooks";
import Form, { Input, Submit } from "../components/Form";
import Homepage from "../components/Homepage";

const Login = () => {
  const router = useRouter();
  const { formData, handleFormError, inputProps } = useForm({
    username: '',
    password: ''
  });
  const handleSubmit = () => User.login(formData);
  const handleSuccess = async ({ login: user }) => {
    await handleRequest('/api/auth/login', { user });
    router.push('/dashboard');
  }
  const forgotPasswordNote = <Link href="/">forgot your password?</Link>;
  return (
    <Homepage>
      <h2>login</h2>
      <p>or click <Link href="/register">here</Link> to register</p>
      <Form onSubmit={handleSubmit} onSuccess={handleSuccess} handleFormError={handleFormError}
            behavior={{ showSuccess: false }}
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