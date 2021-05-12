import { User } from "../../pages/api";
import { useForm } from "../../hooks";
import Form, { Input, Submit } from "../Form";

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

export default ChangePassword;