import { useEffect, useRef, useState } from "react";
import { useForm } from "../../hooks";
import Form, { Input } from "../Form";
import { Checkbox } from "../Form/Checkbox";
import styles from "./myHabits.module.css";

export const MyHabits = ({ children, editHabit, createHabit }) => {
  return (
    <div className={styles.MyHabits}>
      {children}
      <NewHabitBox />
    </div>
  );
}

export const HabitBox = ({ addingNew, name, icon, color, label }) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className={`${styles.HabitBox} ${expanded ? styles.expanded : ''}`}>
      <HabitHeader {...{
        name,
        icon,
        color,
        expanded,
        toggleExpanded: () => setExpanded(state => !state)
      }} />
      <HabitBody {...{
        addingNew,
        name,
        icon,
        color,
        label,
        expanded
      }} />
    </div>
  );
}

const HabitHeader = ({ name, icon, color, toggleExpanded }) => {
  return (
    <div className={styles.HabitHeader} onClick={toggleExpanded}>
      <HabitIcon>{icon}</HabitIcon>
      <h3>{name}</h3>
    </div>
  );
}

const HabitBody = ({ addingNew, name, icon, color, label, expanded }) => {
  const { formData, warnFormError, inputProps } = useForm(addingNew ? {} : {
    name,
    icon,
    color,
    label
  });
  const habitBodyRef = useRef(null);
  useEffect(() => {
    const { current: habitBody } = habitBodyRef;
    if (!habitBody) return;
    if (expanded) {
      habitBody.style.maxHeight = habitBody.scrollHeight + 'px';
    } else {
      habitBody.style.maxHeight = '0';
    }
  }, [expanded]);
  return (
    <div className={styles.HabitBody} ref={habitBodyRef}>
      <Form submit={false}>
        <div className={styles.HabitFormTopRow}>
          <Input type="text" name="name" label="Habit name:" defaultValue={formData.name} />
          <Input type="text" name="icon" label="Icon:" defaultValue={formData.icon} />
        </div>
        <Input type="text" name="label" label="Display label:" defaultValue={formData.label} />
        <Checkbox detailedLabel={[
          "enable complex tracking",
          "if checked, you will be able to record an amount when tracking this habit, e.g. how many hours of studying, how many oz. of water"
        ]} />
      </Form>
    </div>
  );
}

const HabitIcon = ({ children }) => {
  return (
    <div className={styles.HabitIcon}>
      {children}
    </div>
  );
}

const NewHabitBox = () => {
  return (
    <HabitBox {...{
      addingNew: true,
      name: 'Add new',
      icon: '🐣'
    }} />
  );
}