import React, { useContext, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGripLines, faPen, faPlus, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

import styles from "./myHabits.module.css";
import { DataContext, ModalContext } from "../../contexts";
import { getUnitFromLabel } from "../../utils";
import { Grip, HabitForm, HabitIcon } from ".";
import { Habit } from "../../pages/api";
import { useWarnError } from "../../hooks";

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
        <MakeDraggable {...{
          id,
          habitItems,
          dragging,
          updateDragging: setDragging,
          habitItemOrder,
          updateHabitItemOrder
        }} />
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
  const generateHotspots = ([key, value]) => {
    const hotspotDetails = (element) => {
      let { top, left, bottom } = element.getBoundingClientRect();
      const width = 24;
      const height = bottom - top;
      left = left - width;
      return {
        id: key, top, left, width, height
      }
    }
    return hotspotDetails(value);
  }
  return (
    <Grip {...{
      generateHotspots,
      ...props
    }} />
  );
}

// drag and drop to rearrange:
/* 
on click drag icon :: detect ranges (in px) that will constitute draggable areas
where if you drag the mouse to that area, a little pink bar or whatever will show up and then if you release, that sets the flex order and also triggers whatever function will actually save the new order

on click: for each grid item, set one draggable area to the left, with width = the gap between items and height = the same height as the row

*/

export const NewHabitGridItem = ({ user, habits }) => {
  return (
    <HabitGridItem {...{
      addingNew: true,
      user,
      habits
    }} />
  );
}