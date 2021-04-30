import { useRouter } from "next/router";
import { useContext } from "react";
import { handleRequest, User } from "./api";
import { DataContext } from "../contexts";
import { useForm } from "../hooks";
import Homepage from "../components/Homepage";
import Form, { Input, Submit } from "../components/Form";
import { Footer } from "../components/Footer";

const Register = () => {
  const router = useRouter();
  const { setUser } = useContext(DataContext);
  const { formData, handleFormError, inputProps } = useForm({
    email: '',
    password: ''
  });
  const handleSubmit = () => User.create(formData);
  const handleSuccess = async ({ createUser }) => {
    const body = await handleRequest('/api/auth/login', { user: createUser });
    setUser(body.user);
    router.push('/dashboard');
  }
  return (
    <Homepage>
      <h2>register</h2>
      <p>create an account by filling out the fields below:</p>
      <Form onSubmit={handleSubmit} onSuccess={handleSuccess} handleFormError={handleFormError}
            behavior={{ checkmarkStick: false }}
            submit={<Submit value="continue" cancel="go back" onCancel={() => router.back()} />}>
        <Input type="text" name="email" label="your email address:*" {...inputProps} />
        <Input type="password" name="password" label="choose a secure password:" note="minimum 6 chars." {...inputProps} />
      </Form>
      <Footer>*i promise i will never send you marketing emails or share your data with 3rd parties. i just need your email to verify your account and so that you can reset your password if you forget what it is. thank you!</Footer>
    </Homepage>
  );
}

export default Register;