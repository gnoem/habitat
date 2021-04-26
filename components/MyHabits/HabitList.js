import styles from "./myHabits.module.css";
import { useContext, useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDoubleRight } from "@fortawesome/free-solid-svg-icons";
import { Habit } from "../../pages/api";
import { DataContext, ModalContext } from "../../contexts";
import { useForm, useRefName } from "../../hooks";
import Form, { Input, Submit, Checkbox } from "../Form";
import { HabitForm, HabitIcon } from ".";

export const HabitListItem = ({ addingNew, userId, id, name, icon, color, label, complex }) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className={`${styles.HabitListItem} ${expanded ? styles.expanded : ''}`}>
      <HabitListItemHeader {...{
        name,
        icon,
        expanded,
        toggleExpanded: () => setExpanded(state => !state)
      }} />
      <HabitListItemBody {...{
        addingNew,
        userId,
        id,
        name,
        icon,
        color,
        label,
        complex,
        expanded,
        updateExpanded: setExpanded
      }} />
    </div>
  );
}

const HabitListItemHeader = ({ name, icon, color, toggleExpanded }) => {
  return (
    <div className={styles.HabitListItemHeader} onClick={toggleExpanded}>
      <HabitIcon>{icon}</HabitIcon>
      <h3>{name}</h3>
    </div>
  );
}

const HabitListItemBody = ({ addingNew, userId, id, name, icon, color, label, complex, expanded, updateExpanded }) => {
  const habitBodyRef = useRef(null);
  useEffect(() => {
    const habitBody = useRefName(habitBodyRef);
    if (!habitBody) return;
    if (expanded) {
      habitBody.style.maxHeight = habitBody.scrollHeight + 'px';
    } else {
      habitBody.style.maxHeight = '0';
    }
  }, [expanded]);
  return (
    <div className={styles.HabitListItemBody} ref={habitBodyRef}>
      <div>
        <HabitForm {...{
          userId,
          id,
          name,
          icon,
          color,
          label,
          complex,
          formBehavior: { checkmarkStick: false },
          onSuccess: () => updateExpanded(false),
          resetFormAfter: !!addingNew
        }} />
        {addingNew || <DeleteHabit {...{ id, name }} />}
      </div>
    </div>
  );
}

export const NewHabitListItem = ({ userId }) => {
  return (
    <HabitListItem {...{
      addingNew: true,
      userId,
      name: 'Add new',
      icon: '🌱' //'🐣'
    }} />
  );
}

const DeleteHabit = ({ id, name }) => {
  const { createModal } = useContext(ModalContext);
  const confirmDeleteHabit = () => {
    const habit = { id, name };
    createModal('deleteHabit', { habit });
  }
  return (
    <div className={styles.DeleteHabit}>
      <button onClick={confirmDeleteHabit}>
        <FontAwesomeIcon icon={faAngleDoubleRight} />
        <span>delete this habit</span>
      </button>
    </div>
  );
} 