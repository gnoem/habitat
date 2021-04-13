import { useRouter } from "next/router";
import Link from "next/link";
import Form, { Input, Submit } from "../components/Form";
import { useForm } from "../hooks";
import { handleFetch } from "./api";

const Login = () => {
  const router = useRouter();
  const { formData, handleFormError, inputProps } = useForm();
  const query = `
    query ($email: String, $password: String) {
      user(email: $email, password: $password) {
        ... on FormError {
          message
          location
        }
        ... on User {
          id
          password
        }
      }
    }
  `;
  const handleSubmit = async () => await handleFetch(query, formData);
  const handleSuccess = (result) => console.log(result);
  const forgotPasswordNote = <Link href="/">forgot your password?</Link>;
  return (
    <>
      <h2>login</h2>
      <p>or click <Link href="/register">here</Link> to register</p>
      <Form onSubmit={handleSubmit} onSuccess={handleSuccess} handleFormError={handleFormError}
            behavior={{ checkmarkStick: false }}
            delay={1000}
            submit={<Submit value="continue" cancel="go back" onCancel={() => router.back()} />}>
        <Input type="text" name="email" label="email address:" {...inputProps} />
        <Input type="password" name="password" label="password:" note={forgotPasswordNote} {...inputProps} />
      </Form>
    </>
  );
}

export default Login;