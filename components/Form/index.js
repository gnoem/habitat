import React, { useEffect, useState } from "react";
import { fancyClassName } from "../../utils";
import { Button } from "./Button";
import { Checkbox } from "./Checkbox";
import { Input } from "./Input";
import { Submit } from "./Submit";
import { Switch } from "./Switch";

const Form = ({ children, title, submit, delay, onSubmit, onSuccess, handleFormError, behavior, className }) => {
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
    if (Object.values(result)[0] == null) throw new Error('result is null');
    const { __typename, errors } = Object.values(result)[0];
    if (__typename === 'FormErrorReport') {
      setSuccessPending(false);
      setClicked(false);
      throw errors;
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
      if (handleFormError) return handleFormError(err);
      console.log(err);
    });
  }
  const submitProps = { successPending, successAnimation };
  const customSubmit = submit ? React.cloneElement(submit, submitProps) : null;
  return (
    <form onSubmit={handleSubmit} className={fancyClassName({ className })} autoComplete="off">
      {title && <h2>{title}</h2>}
      {children}
      {(submit === false) || (customSubmit ?? <Submit {...submitProps} cancel={false} />)}
    </form>
  );
}

export default Form;
export { Button, Checkbox, Input, Submit, Switch }