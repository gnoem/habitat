import React from "react";
import { useFormSubmit } from "../../hooks";
import { fancyClassName } from "../../utils";
import { Button } from "./Button";
import { Checkbox } from "./Checkbox";
import { Input } from "./Input";
import { Submit } from "./Submit";
import { Switch } from "./Switch";

const Form = ({ children, title, submit, onSubmit, onSuccess, handleFormError, behavior, className }) => {
  const { handleSubmit, successPending, successAnimation } = useFormSubmit({ onSubmit, onSuccess, handleFormError, behavior });
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