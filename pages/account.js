import { useContext } from "react";

import { User } from "./api";
import { auth } from "./api/auth";
import { DataContext, MobileContext } from "../contexts";
import { useForm } from "../hooks";
import Dashboard from "../components/Dashboard";
import Form, { Input, Submit } from "../components/Form";

const Account = ({ user }) => {
  const isMobile = useContext(MobileContext);
  return (
    <Dashboard userId={user.id} className="Account">
      <h1>my account</h1>
      <AccountDetails {...{ user, isMobile }} />
      <ChangePassword {...{ user, isMobile }} />
    </Dashboard>
  );
}

const AccountDetails = ({ user, isMobile }) => {
  const { setUser } = useContext(DataContext);
  const { formData, handleFormError, inputProps } = useForm({
    id: user.id,
    name: user.name ?? '',
    email: user.email ?? ''
  });
  const handleSubmit = () => User.edit(formData);
  const handleSuccess = ({ editUser }) => setUser(editUser);
  return (
    <Form onSubmit={handleSubmit} onSuccess={handleSuccess} handleFormError={handleFormError}
          behavior={{ checkmarkStick: false }}
          submit={<Submit value="save changes" cancel={false} className={isMobile ? 'compact mt15' : ''} />}
          title="account details">
      <Input
        type="text"
        name="name"
        label="your name:"
        defaultValue={formData.name}
        {...inputProps}
      />
      <Input
        type="text"
        name="email"
        label="your email address:"
        defaultValue={formData.email}
        {...inputProps}
      />
    </Form>
  );
}

const ChangePassword = ({ user, isMobile }) => {
  const { formData, handleFormError, inputProps, resetForm } = useForm({
    id: user.id,
    password: '',
    confirmPassword: ''
  });
  const handleSubmit = () => User.editPassword(formData);
  const handleSuccess = () => resetForm();
  const passwordIsOk = (() => {
    if (!formData.password || !formData.confirmPassword) return false;
    if (formData.password.length < 6) return false;
    return formData.password === formData.confirmPassword;
  })();
  const formSubmit = (
    <Submit
      value="save changes"
      disabled={!passwordIsOk}
      cancel={passwordIsOk ? 'cancel' : false}
      onCancel={passwordIsOk ? resetForm : false}
      className={isMobile ? 'compact mt15' : ''}
    />
  );
  return (
    <Form onSubmit={handleSubmit} onSuccess={handleSuccess} handleFormError={handleFormError}
          behavior={{ checkmarkStick: false }}
          submit={formSubmit}
          title="change password">
      <Input
        type="password"
        name="password"
        label="new password:"
        value={formData.password}
        {...inputProps}
        note="*must be at least 6 characters"
      />
      <Input
        type="password"
        name="confirmPassword"
        label="confirm new password:"
        value={formData.confirmPassword}
        {...inputProps}
      />
    </Form>
  );
}

export const getServerSideProps = auth({ shield: true, redirect: '/login' });

export default Account;