import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";

import { User, Token, handleRequest } from "./api";
import { MobileContext, ModalContext } from "../contexts";
import { useForm, useWarnError } from "../hooks";
import Homepage from "../components/Homepage";
import { PageLoading } from "../components/Loading";
import Form, { Input, Submit } from "../components/Form";

const ResetPassword = ({ token }) => {
  const [userId, setUserId] = useState(null);
  const [tokenIsValid, setTokenIsValid] = useState(null);
  const warnError = useWarnError();
  useEffect(() => {
    Token.validate({ tokenId: token, type: 'passwordToken' }).then(({ validateToken }) => {
      setUserId(validateToken.userId);
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
    <Homepage>
      <h2>reset password</h2>
      {content()}
    </Homepage>
  );
}

const InvalidToken = () => {
  const { createModal } = useContext(ModalContext);
  const handleClick = () => {
    createModal('forgotPassword');
  }
  return (
    <>
      sorry, this password reset link is broken or expired! to request a new one, click <button className="link" type="button" onClick={handleClick}>here</button>
    </>
  )
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

ResetPassword.getInitialProps = async ({ query }) => {
  const { token } = query;
  return {
    token
  }
}

export default ResetPassword;