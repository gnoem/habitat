import React, { useContext } from "react";
import { ModalContext } from "../../contexts";
import Form, { Submit } from "../Form";

export const ModalForm = (props) => {
  const { children, onSuccess, submit } = props;
  const { closeModal } = useContext(ModalContext);
  const handleSuccess = () => {
    onSuccess();
    closeModal();
  }
  const submitProps = {
    onCancel: closeModal
  }
  const modalSubmit = submit ? React.cloneElement(submit, submitProps) : <Submit {...submitProps} />;
  return (
    <Form {...props} onSuccess={handleSuccess} submit={modalSubmit}>
      {children}
    </Form>
  );
}