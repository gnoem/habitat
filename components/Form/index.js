import React, { useContext, useEffect, useState } from "react";
import { ModalContext } from "../../contexts";
import { warnError } from "../../pages/api/handleError";
import { fancyClassName } from "../../utils";
import { Button } from "./Button";
import { Checkbox } from "./Checkbox";
import { Input } from "./Input";
import { Submit } from "./Submit";
import { Switch } from "./Switch";

const Form = ({ children, title, submit, delay, onSubmit, onSuccess, handleFormError, behavior, className }) => {
  const { createModal } = useContext(ModalContext);
  const defaultBehavior = {
    showLoading: true,
    showSuccess: true,
    checkmarkStick: true
  };
  const { showLoading, showSuccess, checkmarkStick } = Object.assign(defaultBehavior, behavior);
  const [clickedOnceAlready, setClickedOnceAlready] = useState(false);
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
        setClickedOnceAlready(false);
      }
    }, showSuccess ? 1400 : 0);
  }
  const validateResult = (result) => {
    // maybe can get rid of this
    // if !result or result field is null, then whatever fuckup caused that to happen might have been caught in catch block
    // todo take a closer look at api/handleError, do more testing and see if that's actually the case for all such fuckups
    if (!result) throw new Error('no response from server');
    if (Object.values(result)[0] == null) throw new Error('response object was null, indicates malformed query or something?')
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    if (clickedOnceAlready) return;
    setClickedOnceAlready(true);
    if (!onSubmit) return console.log('missing onSubmit handler!');
    if (showLoading) setSuccessPending(true);
    onSubmit().then(result => {
      validateResult(result);
      setTimeout(() => {
        if (showSuccess) {
          setSuccessAnimation('check');
          setSuccessPending(false);
        }
        handleSuccess(result);
      }, delay ?? 0);
    }).catch(err => {
      setSuccessPending(false);
      setClickedOnceAlready(false);
      const { __typename, errors } = err;
      if (__typename === 'FormErrorReport') {
        if (handleFormError) handleFormError(errors);
        else warnError('unhandledFormError', errors, { createModal });
        return;
      }
      warnError('somethingWentWrong', err, { createModal });
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