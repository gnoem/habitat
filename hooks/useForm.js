import { useState, useEffect } from 'react';
import { useWarnError } from ".";

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
    const updateFormDataDropdown = (key, value) => setFormData(prevState => ({
      ...prevState,
      [key]: value
    }));
    const resetForm = () => setFormData(initialState);
    return {
      formData,
      updateFormData,
      updateFormDataCheckbox,
      updateFormDataDropdown,
      setFormData,
      resetForm
    }
}

export const useFormError = (initialState = {}) => {
    const [formError, setFormError] = useState(initialState);
    const parseFormError = (errorReport) => {
      /* sample errorReport: [
        { location: 'email', message: 'already in use' },
        { location: 'password', message: 'must be at least 6 chars' }
      ] */
      if (!Array.isArray(errorReport)) return console.error(errorReport); // todo better
      const errors = errorReport.reduce((obj, error) => {
        obj[error.location] = error.message;
        return obj;
      }, {});
      /* errors: {
        email: 'already in use',
        password: 'must be at least 6 chars'
      } */
      return errors;
    }
    const updateFormError = (errorReport) => {
      const errors = parseFormError(errorReport);
      // now spread error object into formError so that errorAlert on each
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
      parseFormError,
      resetFormError,
      errorAlert
    }
}

export const useForm = (initialFormData = {}) => {
  const { formData, updateFormData, updateFormDataCheckbox, updateFormDataDropdown, setFormData, resetForm } = useFormData(initialFormData);
  const { updateFormError, parseFormError, resetFormError, errorAlert } = useFormError({});
  const inputProps = {
    onChange: updateFormData,
    onInput: resetFormError,
    alert: errorAlert
  }
  const checkboxProps = {
    onChange: updateFormDataCheckbox
  }
  const dropdownProps = {
    onChange: updateFormDataDropdown
  }
  return {
    formData,
    setFormData,
    resetForm,
    handleFormError: updateFormError,
    parseFormError,
    inputProps,
    checkboxProps,
    dropdownProps
  }
}

export const useFormSubmit = ({ onSubmit, onSuccess, handleFormError, behavior }) => {
  const warnError = useWarnError();
  const defaultBehavior = {
    showLoading: true,
    showSuccess: true,
    checkmarkStick: true
  }
  const { showLoading, showSuccess, checkmarkStick } = Object.assign(defaultBehavior, behavior);
  const [clickedOnceAlready, setClickedOnceAlready] = useState(false);
  const [successPending, setSuccessPending] = useState(false);
  const [successAnimation, setSuccessAnimation] = useState(null);
  useEffect(() => {
    if (successAnimation === 'fade') {
      setTimeout(() => {
        setSuccessAnimation(null);
      }, 500); /* length of checkmark-shrink duration */
    }
  }, [successAnimation]);
  const handleResult = (result) => {
    const validateResult = (result) => {
      if (!result) throw new Error('no response from server');
      if (Object.values(result)[0] == null) throw new Error('response object was null, indicates malformed query or something?')
    }
    validateResult(result);
    if (showSuccess) {
      setSuccessAnimation('check');
      setSuccessPending(false);
    }
    handleSuccess(result);
  }
  const handleSuccess = (result) => {
    setTimeout(() => {
      onSuccess(result);
      if (showSuccess && !checkmarkStick) {
        setSuccessAnimation('fade');
        setClickedOnceAlready(false);
      }
    }, showSuccess ? 1400 : 0);
  }
  const handleError = (err) => {
    setSuccessPending(false);
    setClickedOnceAlready(false);
    if (err === 'handled') return;
    const { __typename, errors } = err;
    if (__typename === 'FormErrorReport') {
      if (handleFormError) handleFormError(errors);
      else warnError('unhandledFormError', errors);
      return;
    }
    if (__typename === 'NiceTry') {
      return warnError('niceTry');
    }
    warnError('somethingWentWrong', err);
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    if (clickedOnceAlready) return;
    setClickedOnceAlready(true);
    if (!onSubmit) return console.log('missing onSubmit handler!');
    if (showLoading) setSuccessPending(true);
    onSubmit().then(handleResult).catch(handleError);
  }
  return {
    handleSubmit,
    successPending,
    successAnimation
  }
}