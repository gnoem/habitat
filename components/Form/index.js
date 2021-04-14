import React, { useEffect, useState } from "react";
import { Button } from "./Button";
import { Input } from "./Input";
import { Submit } from "./Submit";

const Form = ({ children, title, submit, delay, onSubmit, onSuccess, warnError, behavior }) => {
  const defaultBehavior = {
    showLoading: true,
    showSuccess: true,
    checkmarkStick: true
  };
  const { showLoading, showSuccess, checkmarkStick } = Object.assign(defaultBehavior, behavior);
  const [clicked, setClicked] = useState(false);
  const [successPending, setSuccessPending] = useState(false);
  const [successAnimation, setSuccessAnimation] = useState(null);
  useEffect(() => {
    if (successAnimation === 'fade') setTimeout(() => {
      setSuccessAnimation(false);
    }, 500); /* length of checkmark-shrink duration */
  }, [successAnimation]);
  const handleSuccess = (result) => {
    setTimeout(() => {
      onSuccess(result);
      if (showSuccess && !checkmarkStick) {
        setSuccessAnimation('fade');
        setClicked(false);
      }
    }, showSuccess ? 1400 : 0);
  }
  const handleError = (result) => {
    const { __typename, message, location } = Object.values(result)[0];
    if (__typename === 'FormError') {
      setSuccessPending(false);
      setClicked(false);
      throw { message, location }
    }
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    if (clicked) return; // prevent multiple form submission
    setClicked(true);
    if (!onSubmit) return console.log('missing onSubmit handler!');
    if (showLoading) setSuccessPending(true);
    onSubmit().then(result => {
      handleError(result);
      setTimeout(() => {
        if (showSuccess) {
          setSuccessAnimation('check');
          setSuccessPending(false);
        }
        handleSuccess(result);
      }, delay ?? 0);
    }).catch(err => {
      if (warnError) return warnError(err);
      console.error(err);
    });
  }
  const submitProps = { successPending, successAnimation };
  const customSubmit = submit ? React.cloneElement(submit, submitProps) : null;
  return (
    <form onSubmit={handleSubmit} autoComplete="off">
      {title && <h2>{title}</h2>}
      {children}
      {(submit === false) || (customSubmit ?? <Submit {...submitProps} cancel={false} />)}
    </form>
  );
}

export default Form;
export { Button, Input, Submit }