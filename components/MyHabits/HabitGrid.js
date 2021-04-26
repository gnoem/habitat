import { faPen, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext } from "react";
import { HabitForm, HabitIcon } from ".";
import { ModalContext } from "../../contexts";
import { getUnitFromLabel } from "../../utils";
import styles from "./myHabits.module.css";

export const HabitGridItem = ({ addingNew, userId, id, name, icon, color, label, complex }) => {
  return (
    <div className={styles.HabitGridItem}>
      <span className={styles.HabitGridColorIndicator} style={{ background: color }}></span>
      <HabitGridItemHeader {...{ name, icon }} />
      <HabitGridItemBody {...{ userId, id, name, icon, color, label, complex }} />
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

const HabitGridItemBody = ({ userId, id, name, icon, color, label, complex }) => {
  const { createModal } = useContext(ModalContext);
  const [pre, post] = [label?.split('{{')[0], label?.split('}}')[1]];
  const unit = getUnitFromLabel(label);
  const editHabit = () => {
    createModal('manageHabit', {
      habitForm: <HabitForm />,
      habitFormProps: {
        title: id ? 'edit this habit' : 'create a new habit',
        userId,
        id,
        name,
        icon,
        color,
        label,
        complex
      }
    });
  }
  const deleteHabit = () => {
    const habit = { id, name };
    createModal('deleteHabit', { habit });
  }
  return (
    <div className={styles.HabitGridItemBody}>
      {complex
        ? <span>{pre} <b>__ {unit}</b> {post}</span>
        : <span>{label}</span>
      }
      <div>
        <button onClick={editHabit}><FontAwesomeIcon icon={faPen}/></button>
        <button onClick={deleteHabit}><FontAwesomeIcon icon={faTrashAlt}/></button>
      </div>
    </div>
  );
}

export const NewHabitGridItem = ({ userId }) => {
  return (
    <HabitGridItem {...{
      addingNew: true,
      userId,
      name: 'Add new',
      icon: '🌱' //'🐣'
    }} />
  );
}