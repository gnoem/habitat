import { useContext } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faPlus, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

import styles from "./myHabits.module.css";
import { ModalContext } from "../../contexts";
import { getUnitFromLabel } from "../../utils";
import { HabitForm, HabitIcon } from ".";

export const HabitGridItem = ({ habits, addingNew, user, id, name, icon, color, label, complex, retired }) => {
  const { createModal } = useContext(ModalContext);
  const manageHabit = () => {
    createModal('manageHabit', {
      habitForm: <HabitForm />,
      habitFormProps: {
        title: addingNew ? 'create a new habit' : 'edit this habit',
        user,
        id,
        name,
        icon,
        color,
        label,
        complex,
        retired
      }
    });
  }
  const deleteHabit = () => {
    const habit = { id, name };
    createModal('deleteHabit', { habit });
  }
  if (addingNew) return (
    <div className={styles.NewHabitGridItem}>
      <button type="button" onClick={manageHabit}>
        <div><FontAwesomeIcon icon={faPlus} /></div>
        <span>{habits.length ? 'Add new' : 'Create your first habit'}</span>
      </button>
    </div>
  );
  return (
    <div className={`${styles.HabitGridItem} ${retired ? styles.retired : ''}`}>
      <span className={styles.HabitGridColorIndicator} style={{ background: color }}></span>
      <HabitGridItemHeader {...{ name, icon }} />
      <HabitGridItemBody {...{ user, id, name, icon, color, label, complex, manageHabit, deleteHabit }} />
    </div>
  );
}

const HabitGridItemHeader = ({ name, icon }) => {
  return (
    <div className={styles.HabitGridItemHeader}>
      <HabitIcon>{icon}</HabitIcon>
      <span>{name}</span>
    </div>
  );
}

const HabitGridItemBody = ({ label, complex, manageHabit, deleteHabit }) => {
  const [pre, post] = [label?.split('{')[0], label?.split('}')[1]];
  const unit = getUnitFromLabel(label);
  return (
    <div className={styles.HabitGridItemBody}>
      {complex
        ? <span>{pre} <b>__ {unit}</b> {post}</span>
        : <span>{label}</span>
      }
      <div>
        <button onClick={manageHabit}><FontAwesomeIcon icon={faPen}/></button>
        <button onClick={deleteHabit}><FontAwesomeIcon icon={faTrashAlt}/></button>
      </div>
    </div>
  );
}

export const NewHabitGridItem = ({ user, habits }) => {
  return (
    <HabitGridItem {...{
      addingNew: true,
      user,
      habits
    }} />
  );
}