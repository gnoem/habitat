import { useContext } from "react";
import { DataContext } from "../../contexts";
import { Entry, Habit } from "../../pages/api";
import { Submit } from "../Form";
import { ModalForm } from "./ModalForm";

export const modalStore = {
  'deleteHabit': (props) => <DeleteHabit {...props} />,
  'deleteEntry': (props) => <DeleteEntry {...props} />,
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