import { useRouter } from "next/router";
import Link from "next/link";
import Form, { Input, Submit } from "../components/Form";
import { Footer } from "../components/Footer";
import { useForm } from "../hooks";
import { handleFetch } from "./api";

const Register = () => {
  const router = useRouter();
  const { formData, handleFormError, inputProps } = useForm();
  const handleSubmit = async () => {
    const mutation = `
      mutation ($email: String, $password: String) {
        createUser(email: $email, password: $password) {
          email
          password
        }
      }
    `;
    return await handleFetch(mutation, formData);
  }
  const handleSuccess = (result) => console.log(result);
  return (
    <>
      <h2>register</h2>
      <p>create an account by filling out the fields below:</p>
      <Form onSubmit={handleSubmit} onSuccess={handleSuccess} handleError={handleFormError}
            behavior={{ checkmarkStick: false }}
            delay={1000}
            submit={<Submit value="continue" cancel="go back" onCancel={() => router.back()} />}>
        <Input type="text" name="email" label="your email address:*" {...inputProps} />
        <Input type="password" name="password" label="choose a secure password:" note="minimum 6 chars." {...inputProps} />
      </Form>
      <Footer>*i promise i will never send you marketing emails or share your data with 3rd parties. i just need your email to verify your account and so that you can reset your password if you forget what it is. thank you!</Footer>
    </>
  );
}

export default Register;