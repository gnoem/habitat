import { useRouter } from "next/router";

import { handleRequest, User } from "../api";
import { useForm } from "../../hooks";
import Footer from "../../components/Footer";
import Form, { Input, Submit } from "../../components/Form";

const RegistrationIsOpen = ({ token }) => {
  const router = useRouter();
  const { formData, handleFormError, inputProps } = useForm({
    email: '',
    password: '',
    token
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

export default RegistrationIsOpen;