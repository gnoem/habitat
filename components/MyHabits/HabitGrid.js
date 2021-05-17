import React, { useContext, useEffect, useRef, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faPlus, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

import styles from "./myHabits.module.css";
import { ModalContext } from "../../contexts";
import { getUnitFromLabel } from "../../utils";
import { Grip, HabitForm, HabitIcon } from ".";

export const HabitGridItem = React.forwardRef(({ user, index, habits, addingNew, habit, habitItemsStuff }, ref) => {
  const { id, name, icon, color, label, complex, retired } = habit ?? {};
  const { habitItems, habitItemOrder, updateHabitItemOrder } = habitItemsStuff ?? {};
  const [dragging, setDragging] = useState(false);
  const { createModal } = useContext(ModalContext);
  const manageHabit = () => {
    createModal('manageHabit', {
      habitForm: <HabitForm />,
      habitFormProps: {
        title: addingNew ? 'create a new habit' : 'edit this habit',
        user,
        ...habit
      }
    });
  }
  const deleteHabit = () => {
    const habit = { id, name };
    createModal('deleteHabit', { habit });
  }
  if (addingNew) return (
    <div className={styles.NewHabitGridItem} style={{ order: '999' }}>
      <button type="button" onClick={manageHabit}>
        <div><FontAwesomeIcon icon={faPlus} /></div>
        <span>{habits.length ? 'Add new' : 'Create your first habit'}</span>
      </button>
    </div>
  );
  const orderIndex = { order: index };
  return (
    <div
      className={`${styles.HabitGridItem} ${retired ? styles.retired : ''} ${dragging ? styles.dragging : ''}`}
      style={orderIndex}
      ref={ref}>
        <span className={styles.HabitGridColorIndicator} style={{ background: color }}></span>
        <HabitGridItemHeader {...{ name, icon }} />
        <HabitGridItemBody {...{ user, id, name, icon, color, label, complex, manageHabit, deleteHabit }} />
        {!retired && (<MakeDraggable {...{
          id,
          habitItems,
          dragging,
          updateDragging: setDragging,
          habitItemOrder,
          updateHabitItemOrder
        }} />)}
    </div>
  );
});

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
      const hotspotDetails = (element) => {
        if (!element) return null;
        let { top, left, right, bottom } = element.getBoundingClientRect();
        const width = 100;
        const height = bottom - top;
        left = (id === 'last_item') ? right - (width * 0.5) : left - (width * 0.5);
        return {
          id, top, left, width, height
        }
      }
      return hotspotDetails(element);
    }
    hotspotsRef.current = Object.entries(objectToMap).map(generateHotspots).filter(el => el);
  }, [habitItems, habitItemOrder])
  return (
    <Grip {...{
      hotspots: hotspotsRef.current,
      ...props
    }} />
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