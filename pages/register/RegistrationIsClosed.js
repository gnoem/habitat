import { useRouter } from "next/router";
import Link from "next/link";

import { useForm } from "../../hooks";
import Footer from "../../components/Footer";
import Form, { Input, Submit } from "../../components/Form";

const RegistrationIsClosed = ({ updateToken }) => {
  return (
    <>
      <p>sorry, account registration is closed for the time being!* if i've given you a registration code, you can enter it below:</p>
      <RegistrationCodeForm {...{ updateToken }} />
      <Footer>*you can still demo the app by <Link href="/login">logging in</Link> with the username <b>demo</b> and password <b>habitat</b>. if you want to join for real, <a href="mailto:contact@ngw.dev">contact me</a> and we'll talk</Footer>
    </>
  );
}

const RegistrationCodeForm = ({ updateToken }) => {
  const router = useRouter();
  const { formData, handleFormError, inputProps } = useForm({
    tokenId: ''
  });
  const handleSubmit = () => User.validateSignupToken(formData);
  const handleSuccess = ({ validateSignupToken }) => {
    updateToken(validateSignupToken.id);
  }
  return (
    <Form onSubmit={handleSubmit}
          onSuccess={handleSuccess}
          handleFormError={handleFormError}
          behavior={{ showSuccess: false }}
          submit={<Submit value="continue" cancel="go back" onCancel={() => router.back()} />}>
      <Input type="text" name="tokenId" label="registration code:" {...inputProps} />
    </Form>
  );
}

export default RegistrationIsClosed;