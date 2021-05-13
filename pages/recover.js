import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";

import { User, Token, handleRequest } from "./api";
import { ModalContext, MobileContext } from "../contexts";
import { useForm, useWarnError } from "../hooks";
import { getQueryParams } from "../utils";
import { PageLoading } from "../components/Loading";
import Form, { Input, Submit } from "../components/Form";

const ResetPassword = ({ query }) => {
  const [userId, setUserId] = useState(null);
  const [tokenIsValid, setTokenIsValid] = useState(null);
  const warnError = useWarnError();
  useEffect(() => {
    const { token } = query;
    if (!token) return setTokenIsValid(false);
    Token.validate({ tokenId: token }).then(({ validatePasswordToken }) => {
      setUserId(validatePasswordToken.userId);
      setTokenIsValid(true);
    }).catch(err => {
      setTokenIsValid(false);
      if (err.__typename !== 'FormErrorReport') {
        warnError('somethingWentWrong', err);
      }
    });
  }, []);
  const content = () => {
    if (tokenIsValid == null) return <PageLoading className="jcfs" />;
    return tokenIsValid ? <ValidToken {...{ userId }} /> : <InvalidToken />;
  }
  return (
    <>
      <h2>reset password</h2>
      {content()}
    </>
  );
}

const InvalidToken = () => {
  const { createModal } = useContext(ModalContext);
  const handleClick = () => {
    createModal('forgotPassword');
  }
  return (
    <>
      sorry, this password reset link is invalid or expired! to request a new one, click <button className="link" type="button" onClick={handleClick}>here</button>
    </>
  );
}

const ValidToken = ({ userId }) => {
  const router = useRouter();
  const isMobile = useContext(MobileContext);
  const { formData, handleFormError, inputProps, resetForm } = useForm({
    id: userId,
    password: '',
    confirmPassword: '',
    reset: true
  });
  const handleSubmit = () => User.editPassword(formData);
  const handleSuccess = async ({ editPassword: user }) => {
    await handleRequest('/api/auth/login', { user });
    router.push('/dashboard');
  }
  const passwordIsOk = (() => {
    if (!formData.password || !formData.confirmPassword) return false;
    if (formData.password.length < 6) return false;
    return formData.password === formData.confirmPassword;
  })();
  const formSubmit = (
    <Submit
      value="save changes"
      cancel={false}
      onCancel={passwordIsOk ? resetForm : false}
      className={isMobile ? 'compact mt15' : ''}
    />
  );
  return (
    <Form onSubmit={handleSubmit}
          onSuccess={handleSuccess}
          handleFormError={handleFormError}
          submit={formSubmit}>
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

ResetPassword.getInitialProps = getQueryParams;


export default ResetPassword;