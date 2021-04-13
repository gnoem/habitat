import { useRouter } from "next/router";
import Link from "next/link";
import Form, { Input, Submit } from "../components/Form";
import { Footer } from "../components/Footer";

const Register = () => {
  const router = useRouter();
  const handleSubmit = () => Promise.resolve('yayyy');
  const handleSuccess = (result) => console.log(result);
  return (
    <>
      <h2>register</h2>
      <p>create an account by filling out the fields below:</p>
      <Form onSubmit={handleSubmit} onSuccess={handleSuccess}
            behavior={{ checkmarkStick: false }}
            delay={1000}
            submit={<Submit value="continue" cancel="go back" onCancel={() => router.back()} />}>
        <Input type="text" name="email" label="your email address:*" />
        <Input type="password" name="password" label="choose a secure password:" note="minimum 6 chars." />
      </Form>
      <Footer>*i promise i will never send you marketing emails or share your data with 3rd parties. i just need your email to verify your account and so that you can reset your password if you forget what it is. thank you!</Footer>
    </>
  );
}

export default Register;