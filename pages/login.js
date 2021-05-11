import { useContext } from "react";
import { useRouter } from "next/router";

import { handleRequest, User } from "./api";
import { auth } from "./api/auth";
import { ModalContext } from "../contexts";
import { useForm } from "../hooks";
import Form, { Input, Submit } from "../components/Form";
import Homepage from "../components/Homepage";

const Login = () => {
  const router = useRouter();
  const { createModal } = useContext(ModalContext);
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
  const createPasswordToken = () => {
    createModal('forgotPassword');
  }
  const forgotPasswordNote = <button className="link" type="button" onClick={createPasswordToken}>forgot your password?</button>;
  return (
    <Homepage>
      <h2>login</h2>
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