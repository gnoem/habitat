import React, { useContext, useEffect, useRef, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDoubleRight } from "@fortawesome/free-solid-svg-icons";

import styles from "./myHabits.module.css";
import { ModalContext } from "../../contexts";
import { useRefName } from "../../hooks";
import { HabitForm, HabitIcon } from ".";

export const HabitListItem = React.forwardRef(({ addingNew, user, id, name, icon, color, label, complex, retired }, ref) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className={`${styles.HabitListItem} ${expanded ? styles.expanded : ''}`} ref={ref}>
      <HabitListItemHeader {...{
        name,
        icon,
        retired,
        toggleExpanded: () => setExpanded(state => !state)
      }} />
      <HabitListItemBody {...{
        addingNew,
        user,
        id,
        name,
        icon,
        color,
        label,
        complex,
        retired,
        expanded,
        updateExpanded: setExpanded
      }} />
    </div>
  );
});

const HabitListItemHeader = ({ name, icon, retired, toggleExpanded }) => {
  return (
    <div className={`${styles.HabitListItemHeader} ${retired ? styles.retired : ''}`} onClick={toggleExpanded}>
      <HabitIcon>{icon}</HabitIcon>
      <h3>{name}</h3>
    </div>
  );
}

const HabitListItemBody = ({ addingNew, user, id, name, icon, color, label, complex, retired, expanded, updateExpanded }) => {
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
          user,
          id,
          name,
          icon,
          color,
          label,
          complex,
          retired,
          formBehavior: { checkmarkStick: false },
          onSuccess: () => updateExpanded(false),
          resetFormAfter: !!addingNew
        }} />
        {addingNew || <DeleteHabit {...{ id, name }} />}
      </div>
    </div>
  );
}

export const NewHabitListItem = ({ habits, user }) => {
  return (
    <HabitListItem {...{
      addingNew: true,
      user,
      name: habits.length ? 'Add new' : 'Create your first habit',
      icon: '🐛'
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