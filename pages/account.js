import { auth } from "./api/auth";
import { Dash } from "../components/Dash";
import Form, { Input, Submit } from "../components/Form";
import { useForm } from "../hooks";

const Account = ({ user }) => {
  return (
    <Dash>
      <h1>my account</h1>
      <AccountDetails {...{ user }} />
    </Dash>
  );
}

const AccountDetails = ({ user }) => {
  const { formData, warnFormError, inputProps } = useForm({
    name: user.name,
    email: user.email
  });
  const handleSubmit = () => Promise.resolve('heyyyy');
  const handleSuccess = (result) => console.log(result);
  return (
    <Form onSubmit={handleSubmit} onSuccess={handleSuccess}
          submit={<Submit value="save changes" cancel={false} />}
          title="account details">
      <Input type="text" name="name" label="your name:" defaultValue={formData.name} {...inputProps} />
      <Input type="text" name="email" label="your email address:" defaultValue={formData.email} {...inputProps} />
    </Form>
  );
}

export const getServerSideProps = auth({ shield: true, redirect: '/login' });

export default Account;