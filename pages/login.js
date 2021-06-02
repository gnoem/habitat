import { useContext } from "react";
import { useRouter } from "next/router";

import { handleRequest, User } from "./api";
import { auth } from "./api/auth";
import { ModalContext } from "../contexts";
import { useForm } from "../hooks";
import Form, { Input, Submit } from "../components/Form";

const Login = () => {
  const router = useRouter();
  const { formData, handleFormError, inputProps } = useForm({
    email: '',
    password: ''
  });
  const handleSubmit = () => User.login(formData);
  const handleSuccess = async ({ login: user }) => {
    const { id, demoTokenId } = user;
    await handleRequest('/api/auth/login', {
      user: { id, demoTokenId }
    });
    router.push('/dashboard');
  }
  return (
    <>
      <h2>login</h2>
      <Form onSubmit={handleSubmit} onSuccess={handleSuccess} handleFormError={handleFormError}
            behavior={{ showSuccess: false }}
            submit={<Submit value="continue" cancel="go back" onCancel={() => router.back()} />}>
        <Input
          type="text"
          name="email"
          label="username / email address:"
          {...inputProps}
        />
        <Input
          type="password"
          name="password"
          label="password:"
          note={<ForgotPassword />}
          {...inputProps}
        />
      </Form>
    </>
  );
}

const ForgotPassword = () => {
  const { createModal } = useContext(ModalContext);
  return (
    <button
      className="link"
      type="button"
      onClick={() => createModal('forgotPassword')}>
        forgot your password?
    </button>
  );
}

export const getServerSideProps = auth({ shield: false, redirect: '/dashboard' });

export default Login;