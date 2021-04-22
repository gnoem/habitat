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
    const updateFormError = (errorReport) => {
      /* sample errorReport: [
        { location: 'email', message: 'already in use' },
        { location: 'password', message: 'must be at least 6 chars' }
      ] */
      console.dir(errorReport);
      if (!Array.isArray(errorReport)) return console.error(errorReport); // todo better
      const errors = errorReport.reduce((obj, error) => {
        obj[error.location] = error.message;
        return obj;
      }, {});
      /* errors: {
        email: 'already in use',
        password: 'must be at least 6 chars'
      } */
      // and then spread that object into formError so that errorAlert on each
      // input field can look at formError[inputName] and see if there's an error there
      setFormError(errors);
    }
    const resetFormError = (e) => {
      if (!formError?.[e.target.name]) return;
      setFormError(prevState => {
        if (!prevState?.[e.target.name]) return prevState;
        const newState = {...prevState};
        delete newState[e.target.name];
        return newState;
      });
    }
    const errorAlert = (inputName) => {
      if (formError?.[inputName]) return {
        type: 'error',
        message: formError[inputName]
      }
    }
    return {
      updateFormError,
      resetFormError,
      errorAlert
    }
}

export const useForm = (initialFormData = {}) => {
  const { formData, updateFormData, updateFormDataCheckbox, setFormData, resetForm } = useFormData(initialFormData);
  const { updateFormError, resetFormError, errorAlert } = useFormError({});
  const inputProps = {
    onChange: updateFormData,
    onInput: resetFormError,
    alert: errorAlert
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
