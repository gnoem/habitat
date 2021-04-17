import { useState } from 'react';

export const useFormData = (initialState = {}) => {
    const [formData, setFormData] = useState(initialState);
    const updateFormData = (e) => setFormData(prevState => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
    const updateFormDataCheckbox = (e) => setFormData(prevState => ({
      ...prevState,
      [e.target.name]: e.target.checked
    }));
    const resetForm = () => setFormData(initialState);
    return {
      formData,
      updateFormData,
      updateFormDataCheckbox,
      setFormData,
      resetForm
    }
}

export const useFormError = (initialState = {}) => {
    const [formError, setFormError] = useState(initialState);
    const updateFormError = (errors) => setFormError(prevState => ({
      ...prevState,
      ...errors
    }));
    const resetFormError = (e) => setFormError(prevState => {
        if (!prevState?.[e.target.name]) return prevState;
        const newState = {...prevState};
        delete newState[e.target.name];
        return newState;
    });
    const warnFormError = (inputName) => {
        if (formError?.[inputName]) return {
          type: 'error',
          message: formError[inputName]
        }
    }
    return {
      updateFormError,
      resetFormError,
      warnFormError
    }
}

export const useForm = (initialFormData = {}) => {
  const { formData, updateFormData, updateFormDataCheckbox, setFormData, resetForm } = useFormData(initialFormData);
  const { updateFormError, resetFormError, warnFormError } = useFormError({});
  const inputProps = {
    onChange: updateFormData,
    onInput: resetFormError,
    alert: warnFormError
  }
  const checkboxProps = {
    onChange: updateFormDataCheckbox
  }
  return {
    formData,
    setFormData,
    resetForm,
    handleFormError: updateFormError,
    inputProps,
    checkboxProps
  }
}