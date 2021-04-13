import { useRouter } from "next/router";
import Link from "next/link";
import Form, { Input, Submit } from "../components/Form";

const Login = () => {
  const router = useRouter();
  const handleSubmit = () => Promise.resolve('yayyy');
  const handleSuccess = (result) => console.log(result);
  const forgotPasswordNote = (
    <Link href="/">forgot your password?</Link>
  );
  return (
    <>
      <h2>login</h2>
      <p>or click <Link href="/register">here</Link> to register</p>
      <Form onSubmit={handleSubmit} onSuccess={handleSuccess}
            behavior={{ checkmarkStick: false }}
            delay={1000}
            submit={<Submit value="continue" cancel="go back" onCancel={() => router.back()} />}>
        <Input type="text" name="email" label="email address:" />
        <Input type="password" name="password" label="password:" note={forgotPasswordNote} />
      </Form>
    </>
  );
}

export default Login;