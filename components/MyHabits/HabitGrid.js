import React, { useContext, useEffect, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGripLines, faPen, faPlus, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

import styles from "./myHabits.module.css";
import { ModalContext } from "../../contexts";
import { getUnitFromLabel } from "../../utils";
import { HabitForm, HabitIcon } from ".";

export const HabitGridItem = React.forwardRef(({
    habits, habitItems, habitItemOrder, updateHabitItemOrder,
    addingNew,
    user, id, name, icon, color, label, complex, retired, index
  }, ref) => {
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
          <Grip {...{
            id,
            habitItems,
            dragging,
            updateDragging: setDragging,
            habitItemOrder,
            updateHabitItemOrder
          }} />
      </div>
    );
  }
);

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

const Grip = ({ id, habitItems, dragging, updateDragging, habitItemOrder, updateHabitItemOrder }) => {
  const [mouseIsDown, setMouseIsDown] = useState(false);
  const [activeHotspot, setActiveHotspot] = useState(null);
  useEffect(() => {
    if (!mouseIsDown) return;
    const handleMouseMove = (e) => {
      e.preventDefault();
      updateDragging(true);
    }
    const handleMouseUp = (e) => {
      e.preventDefault();
      updateDragging(false);
      setMouseIsDown(false);
      setActiveHotspot(null);
    }
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }
  }, [mouseIsDown]);
  useEffect(() => {
    if (!dragging) return;
    const hotspots = Object.entries(habitItems).map(([key, value]) => {
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
    });
    const checkIfInHotspot = (e) => {
      e.preventDefault();
      const conditions = (e) => {
        return hotspots.map(({ top, left, width, height }) => {
          const { clientX, clientY } = e;
          return (clientY > top) && (clientY < top + height) && (clientX > left) && (clientX < left + width);
        });
      }
      const activeHotspotIndex = conditions(e).findIndex(isTrue => isTrue);
      if (activeHotspotIndex !== -1) {
        setActiveHotspot(hotspots[activeHotspotIndex].id);
      }
      else setActiveHotspot(null);
    }
    window.addEventListener('mousemove', checkIfInHotspot);
    return () => window.removeEventListener('mousemove', checkIfInHotspot);
  }, [dragging]);
  useEffect(() => {
    if (activeHotspot) {
      habitItems[activeHotspot].setAttribute('data-hotspot', 'true');
    }
    else {
      const previous = document.querySelector('[data-hotspot=true]');
      if (previous) previous.setAttribute('data-hotspot', 'false');
    }
    const dropItem = () => {
      if (!activeHotspot) return;
      // reorder each item in habitItemOrder i guess
      const rearrangeOrder = () => {
        const rearrangedArray = [...habitItemOrder];
        // get index of active hotspot and index of current item
        const targetIndex = habitItemOrder.indexOf(activeHotspot);
        const currentIndex = habitItemOrder.indexOf(id);
        rearrangedArray.splice(currentIndex, 1);
        rearrangedArray.splice(targetIndex, 0, id);
        updateHabitItemOrder(rearrangedArray);
      }
      rearrangeOrder();
    }
    window.addEventListener('mouseup', dropItem);
    () => window.removeEventListener('mouseup', dropItem);
  }, [activeHotspot]);
  return (
    <div
      className={styles.grip}
      onMouseDown={() => setMouseIsDown(true)}>
        <FontAwesomeIcon icon={faGripLines} />
    </div>
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