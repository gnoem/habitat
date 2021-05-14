import React, { useContext, useState } from "react";
import { useRouter } from "next/router";

import { User, Entry, Habit, Token, handleRequest } from "../../pages/api";
import { DataContext } from "../../contexts";
import { useForm } from "../../hooks";
import Form, { Submit, Button, Input } from "../Form";
import ModalForm, { ModalizedForm } from "./ModalForm";

export const modalStore = {
  'demoMessage': (props) => <DemoMessage {...props} />,
  'somethingWentWrong': (props) => <SomethingWentWrong {...props} />,
  'unhandledFormError': (props) => <UnhandledFormError {...props} />,
  'niceTry': (props) => <NiceTry {...props} />,
  'forgotPassword': (props) => <ForgotPassword {...props} />,
  'warnOverwriteEntry': (props) => <WarnOverwriteEntry {...props} />,
  'manageHabit': (props) => <ManageHabit {...props} />,
  'deleteHabit': (props) => <DeleteHabit {...props} />,
  'deleteEntry': (props) => <DeleteEntry {...props} />,
  'deleteAccount': (props) => <DeleteAccount {...props} />,
}

const DemoMessage = ({ closeModal }) => {
  const router = useRouter();
  const handleClick = () => {
    router.push('/');
    closeModal();
  }
  return (
    <>
      <h2>hi there!</h2>
      <p>welcome to habitat! i've set up a special account for people interesting in demoing the app. sign in with the username <b>demo</b> & password <b>habitat</b> and you'll have the option to generate temporary test data to play around with, which will be cleared on logout or automatically after 6 hours.</p>
      <Button onClick={handleClick} className="mt05">got it</Button>
    </>
  );
}

const SomethingWentWrong = ({ error, closeModal }) => {
  const handleClick = () => {
    closeModal();
    window.location.reload();
  }
  return (
    <div>
      <h2>something went wrong</h2>
      <p>an unknown error occurred, please reload the page and try again</p>
      <details className="errorReport">
        <summary>View details</summary>
        <div className="errorDetails">
          <code>{error?.caughtErrors ?? "nothing to see here, sorry :("}</code>
        </div>
      </details>
      <Button onClick={handleClick}>close & reload</Button>
    </div>
  );
}

const UnhandledFormError = ({ error, closeModal }) => {
  const { parseFormError } = useForm();
  const printErrors = () => {
    return Object.entries(parseFormError(error)).map(([key, value]) => {
      return <li><b>{key}</b>: {value}</li>
    });
  }
  return (
    <div>
      <h2>oopsies</h2>
      <p>found errors on the following fields:</p>
      <ul>{printErrors()}</ul>
      <div className="mt15">
        <Button onClick={closeModal}>try again</Button>
      </div>
    </div>
  );
}

const NiceTry = ({ closeModal }) => {
  return (
    <>
      <h2>nice try</h2>
      <p>you think im going to let my app be defeated by some nerd who knows how to use dev tools? try again sweetie</p>
      <Button onClick={closeModal}>close</Button>
    </>
  );
}

const ForgotPassword = ({ closeModal }) => {
  const [success, setSuccess] = useState(false);
  const { formData, handleFormError, inputProps } = useForm();
  const handleSubmit = async () => Token.createPasswordToken(formData);
  const handleSuccess = () => {
    setTimeout(() => {
      setSuccess(true);
    }, 200);
  }
  if (success) return (
    <>
      <h2>success!</h2>
      <p>an email containing a link to reset your password has been sent to <b>{formData.email}</b>. be sure to check your spam folder if you can't find the email in your regular inbox.</p>
      <Button onClick={closeModal}>close</Button>
    </>
  );
  return (
    <Form onSubmit={handleSubmit}
          onSuccess={handleSuccess}
          handleFormError={handleFormError}
          behavior={{ showSuccess: false }}
          title="reset your password">
      <Input type="text" name="email" label="enter your email address:" className="stretch alertInside" {...inputProps} />
    </Form>
  );
}

const WarnOverwriteEntry = ({ date, handleSubmit, handleSuccess }) => {
  return (
    <ModalForm
      onSubmit={handleSubmit}
      onSuccess={handleSuccess}
      title="overwrite previous entry?"
      submit={<Submit value="continue" />}>
        <p>an entry for <b>{date}</b> already exists. if you continue, it will be overwritten.</p>
    </ModalForm>
  );
}

const ManageHabit = ({ habitForm, habitFormProps }) => {
  return (
    <ModalizedForm {...{
      originalFormComponent: habitForm,
      originalFormProps: habitFormProps
    }} />
  );
}

const DeleteHabit = ({ habit }) => {
  const { getHabits, getEntries } = useContext(DataContext);
  const handleSubmit = async () => Habit.delete({ id: habit.id });
  const handleSuccess = () => {
    getHabits();
    getEntries(); // in case any entries were left empty by deleting this habit and all its records, since those entries will have been deleted too
  }
  return (
    <ModalForm
        onSubmit={handleSubmit}
        onSuccess={handleSuccess}
        title="delete this habit"
        submit={<Submit value="yes, i'm sure" />}>
      <p>are you sure you want to delete the habit <b>{habit.name}</b> and all data associated with it? this action cannot be undone.</p>
    </ModalForm>
  );
}

const DeleteEntry = ({ entry }) => {
  const { getEntries } = useContext(DataContext);
  const handleSubmit = async () => Entry.delete({ id: entry.id });
  return (
    <ModalForm
        onSubmit={handleSubmit}
        onSuccess={getEntries}
        title="delete this entry"
        submit={<Submit value="yes, i'm sure" />}>
      <p>are you sure you want to delete this entry? this action cannot be undone.</p>
    </ModalForm>
  );
}

const DeleteAccount = ({ user, closeModal }) => {
  const router = useRouter();
  const [success, setSuccess] = useState(false);
  const handleSubmit = async () => User.deleteAccount({ id: user.id });
  const handleSuccess = () => setSuccess(true);
  const handleSuccessClick = () => {
    closeModal();
    const logout = async () => {
      await handleRequest('/api/auth/logout');
      router.push('/');
    }
    setTimeout(logout, 200);
  }
  if (success) return (
    <>
      <h2>success!</h2>
      <p>all data associated with this account has been deleted. sorry to see you go!</p>
      <Button onClick={handleSuccessClick}>close</Button>
    </>
  );
  return (
    <Form onSubmit={handleSubmit}
          onSuccess={handleSuccess}
          title="delete account"
          behavior={{ showSuccess: false }}
          submit={<Submit value="yes, i'm sure" onCancel={closeModal} />}>
      <p>are you absolutely sure you want to delete your account and all data associated with it? this action cannot be undone.</p>
    </Form>
  );
}