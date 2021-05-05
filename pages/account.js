import { useContext } from "react";

import { User } from "./api";
import { auth } from "./api/auth";
import { DataContext, MobileContext } from "../contexts";
import { useForm } from "../hooks";
import { DashboardComponent } from "../components/DashboardLayout";
import Form, { Input, Submit } from "../components/Form";

const Account = ({ user }) => {
  const isMobile = useContext(MobileContext);
  const demo = user.email === 'demo';
  return (
    <DashboardComponent userId={user.id} className="Account">
      <h1>my account</h1>
      {demo && <p><b>note:</b> these forms have been disabled for the demo account - i'm keeping them here so you can see what's going on in this section, but nothing will happen if you try to submit them</p>}
      <AccountDetails {...{ demo, user, isMobile }} />
      <ChangePassword {...{ demo, user, isMobile }} />
    </DashboardComponent>
  );
}

const AccountDetails = ({ demo, user, isMobile }) => {
  const { setUser } = useContext(DataContext);
  const { formData, handleFormError, inputProps } = useForm({
    id: user.id,
    name: user.name ?? '',
    email: user.email ?? ''
  });
  const handleSubmit = () => {
    if (demo) {
      console.log('cute');
      return Promise.reject({ __typename: 'NiceTry' });
    }
    return User.edit(formData);
  }
  const handleSuccess = ({ editUser }) => setUser(editUser);
  return (
    <Form onSubmit={handleSubmit} onSuccess={handleSuccess} handleFormError={handleFormError}
          behavior={{ checkmarkStick: false }}
          submit={<Submit value="save changes" cancel={false} className={isMobile ? 'compact mt15' : ''} disabled={demo} />}
          title="account details">
      <Input
        type="text"
        name="name"
        label="your name:"
        defaultValue={formData.name}
        {...inputProps}
        disabled={demo}
      />
      <Input
        type="text"
        name="email"
        label="your email address:"
        defaultValue={formData.email}
        {...inputProps}
        disabled={demo}
      />
    </Form>
  );
}

const ChangePassword = ({ demo, user, isMobile }) => {
  const { formData, handleFormError, inputProps, resetForm } = useForm({
    id: user.id,
    password: '',
    confirmPassword: ''
  });
  const handleSubmit = () => {
    if (demo) {
      console.log('cute');
      return Promise.reject({ __typename: 'NiceTry' });
    }
    return User.editPassword(formData);
  }
  const handleSuccess = () => resetForm();
  const passwordIsOk = (() => {
    if (!formData.password || !formData.confirmPassword) return false;
    if (formData.password.length < 6) return false;
    return formData.password === formData.confirmPassword;
  })();
  const formSubmit = (
    <Submit
      value="save changes"
      disabled={!passwordIsOk || demo}
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
        disabled={demo}
      />
      <Input
        type="password"
        name="confirmPassword"
        label="confirm new password:"
        value={formData.confirmPassword}
        {...inputProps}
        disabled={demo}
      />
    </Form>
  );
}

export const getServerSideProps = auth({ shield: true, redirect: '/login' });

export default Account;