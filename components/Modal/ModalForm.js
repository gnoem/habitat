import React, { useContext } from "react";

import { ModalContext } from "../../contexts";
import Form, { Submit } from "../Form";

const ModalForm = (props) => {
  const { children, onSuccess, submit } = props;
  const { closeModal } = useContext(ModalContext);
  const handleSuccess = (result) => {
    onSuccess(result);
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

export const ModalizedForm = ({ originalFormComponent, originalFormProps }) => {
  const { closeModal, submit } = useContext(ModalContext);
  const { onSuccess } = originalFormProps;
  const handleSuccess = () => {
    onSuccess?.();
    closeModal();
  }
  const submitProps = {
    onCancel: closeModal
  }
  const modalSubmit = submit ? React.cloneElement(submit, submitProps) : <Submit {...submitProps} />;
  const componentToReturn = React.cloneElement(originalFormComponent, {
    onSuccess: handleSuccess,
    submit: modalSubmit,
    ...originalFormProps
  });
  return componentToReturn;
}

export default ModalForm;