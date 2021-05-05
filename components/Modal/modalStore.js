import React, { useContext } from "react";

import { Entry, Habit } from "../../pages/api";
import { DataContext } from "../../contexts";
import { useForm } from "../../hooks";
import { Submit, Button } from "../Form";
import ModalForm, { ModalizedForm } from "./ModalForm";

export const modalStore = {
  'somethingWentWrong': (props) => <SomethingWentWrong {...props} />,
  'unhandledFormError': (props) => <UnhandledFormError {...props} />,
  'niceTry': (props) => <NiceTry {...props} />,
  'manageHabit': (props) => <ManageHabit {...props} />,
  'deleteHabit': (props) => <DeleteHabit {...props} />,
  'deleteEntry': (props) => <DeleteEntry {...props} />,
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
  return (
    <div>
      <h2>oopsies</h2>
      <p>there was some error with the data you submitted, possibly something like leaving a required form field blank or that you didn't meet a minimum/maximum character length requirement, that sort of thing. you can read the raw error report below:</p>
      <code>{JSON.stringify(parseFormError(error))}</code>
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

const ManageHabit = ({ habitForm, habitFormProps }) => {
  return (
    <ModalizedForm {...{
      originalFormComponent: habitForm,
      originalFormProps: habitFormProps
    }} />
  );
}

const DeleteHabit = ({ habit }) => {
  const { getHabits } = useContext(DataContext);
  const handleSubmit = async () => Habit.delete({ id: habit.id });
  return (
    <ModalForm
        onSubmit={handleSubmit}
        onSuccess={getHabits}
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