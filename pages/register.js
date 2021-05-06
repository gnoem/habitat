import { useState } from "react";
import { useRouter } from "next/router";

import { handleRequest, User } from "./api";
import { useForm } from "../hooks";
import Homepage from "../components/Homepage";
import Footer from "../components/Footer";
import Form, { Input, Submit } from "../components/Form";
import Link from "next/link";

const Register = () => {
  const [code, setCode] = useState(null);
  return (
    <Homepage>
      <h2>register</h2>
      {code
        ? <RegisterForm code={code} />
        : <RegistrationIsClosed updateCode={setCode} />
      }
    </Homepage>
  );
}

const RegistrationIsClosed = ({ updateCode }) => {
  return (
    <>
      <p>sorry, account registration is closed for the time being!* if i've given you a registration code, you can enter it below:</p>
      <RegistrationCodeForm {...{ updateCode }} />
      <Footer>*you can still demo the app by <Link href="/login">logging in</Link> with the username <b>demo</b> and password <b>habitat</b>. if you want to join for real, <a href="mailto:contact@ngw.dev">contact me</a> and we'll talk</Footer>
    </>
  );
}

const RegistrationCodeForm = ({ updateCode }) => {
  const { formData, handleFormError, inputProps } = useForm({
    registrationCode: ''
  });
  const handleSubmit = () => Promise.resolve(formData);
  const handleSuccess = ({ code }) => updateCode(code ?? 'noice');
  return (
    <Form onSubmit={handleSubmit}
          onSuccess={handleSuccess}
          handleFormError={handleFormError}
          behavior={{ showSuccess: false }}>
      <Input type="text" name="registrationCode" label="registration code:" {...inputProps} />
    </Form>
  )
}

const RegisterForm = ({ code }) => {
  const router = useRouter();
  const { formData, handleFormError, inputProps } = useForm({
    email: '',
    password: '',
    code
  });
  const handleSubmit = () => User.create(formData);
  const handleSuccess = async ({ createUser }) => {
    await handleRequest('/api/auth/login', { user: createUser });
    router.push('/dashboard');
  }
  return (
    <>
      <p>create an account by filling out the fields below:</p>
      <Form onSubmit={handleSubmit} onSuccess={handleSuccess} handleFormError={handleFormError}
            behavior={{ showSuccess: false }}
            submit={<Submit value="continue" cancel={false} />}>
        <Input type="text" name="email" label="your email address:*" {...inputProps} />
        <Input type="password" name="password" label="choose a secure password:" note="minimum 6 chars." {...inputProps} />
      </Form>
      <Footer>*i promise i will never send you marketing emails or share your data with 3rd parties. i just need your email to verify your account and so that you can reset your password if you forget what it is. thank you!</Footer>
    </>
  );
}

export default Register;