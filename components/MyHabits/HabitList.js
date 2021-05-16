import React, { useContext, useEffect, useRef, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDoubleRight } from "@fortawesome/free-solid-svg-icons";

import styles from "./myHabits.module.css";
import { ModalContext } from "../../contexts";
import { useRefName } from "../../hooks";
import { Grip, HabitForm, HabitIcon } from ".";

export const HabitListItem = React.forwardRef(({ addingNew, user, index, habit, habitItemsStuff }, ref) => {
  const { id, name, icon, color, label, complex, retired } = habit ?? {};
  const { habitItems, habitItemOrder, updateHabitItemOrder } = habitItemsStuff ?? {};
  const [expanded, setExpanded] = useState(false);
  const [dragging, setDragging] = useState(false);
  const orderIndex = { order: index };
  return (
    <div
      className={`${styles.HabitListItem} ${expanded ? styles.expanded : ''} ${dragging ? styles.dragging : ''}`}
      style={addingNew ? { order: '999' } : orderIndex}
      ref={ref}>
        <HabitListItemHeader {...{
          name,
          icon,
          retired,
          toggleExpanded: () => setExpanded(state => !state)
        }} />
        {(!addingNew && !retired) && (<MakeDraggable {...{
          id,
          habitItems,
          dragging,
          updateDragging: setDragging,
          habitItemOrder,
          updateHabitItemOrder
        }} />)}
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

const MakeDraggable = (props) => {
  const { habitItems, habitItemOrder } = props;
  const hotspotsRef = useRef([]);
  useEffect(() => {
    const lastHabitItemId = habitItemOrder[habitItemOrder.length - 1]; // lastElement depends on habitItemOrder!!!!!!
    const lastElement = habitItems[lastHabitItemId];
    const objectToMap = {
      ...habitItems,
      last_item: lastElement // to add the hotspot after the last item
    }
    const generateHotspots = ([id, element]) => {
      const hotspotDetails = () => {
        let { top, bottom, left, right } = element.getBoundingClientRect();
        const width = right - left;
        const height = 24;
        top = (id === 'last_item') ? bottom : top - height;
        return {
          id: id, top, left, width, height
        }
      }
      return hotspotDetails();
    }
    hotspotsRef.current = Object.entries(objectToMap).map(generateHotspots);
  }, [habitItems, habitItemOrder]);
  return (
    <Grip {...{
      hotspots: hotspotsRef.current,
      ...props
    }} />
  );
}

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
      habit: {
        name: habits.length ? 'Add new' : 'Create your first habit',
        icon: '🐛'
      }
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