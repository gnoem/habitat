import React, { useEffect, useState } from "react";
import { Button } from "./Button";
import { Input } from "./Input";
import { Submit } from "./Submit";

const Form = ({ children, title, submit, delay, onSubmit, onSuccess, behavior }) => {
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
  const handleSubmit = (e) => {
    e.preventDefault();
    if (clicked) return; // prevent multiple form submission
    setClicked(true);
    if (!onSubmit) return console.log('missing onSubmit handler!');
    if (showLoading) setSuccessPending(true);
    onSubmit().then(result => {
      setTimeout(() => {
        if (showSuccess) {
          setSuccessAnimation('check');
          setSuccessPending(false);
        }
        setTimeout(() => {
          onSuccess?.(result);
          if (!checkmarkStick) {
            setSuccessAnimation('fade');
            setClicked(false);
          }
        }, showSuccess ? 1400 : 0);
      }, delay ?? 0);
    }).catch(err => {
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
  )
}

export default Form;
export { Button, Input, Submit }