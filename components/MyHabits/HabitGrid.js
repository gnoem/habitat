import { HabitIcon } from ".";
import { getUnitFromLabel } from "../../utils";
import styles from "./myHabits.module.css";

export const HabitGridItem = ({ addingNew, userId, id, name, icon, color, label, complex }) => {
  return (
    <div className={styles.HabitGridItem}>
      <span className={styles.HabitGridColorIndicator} style={{ background: color }}></span>
      <HabitGridItemHeader {...{ name, icon }} />
      <HabitGridItemBody {...{ color, label, complex }} />
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

const HabitGridItemBody = ({ color, label, complex }) => {
  const [pre, post] = [label?.split('{{')[0], label?.split('}}')[1]];
  const unit = getUnitFromLabel(label);
  console.dir(typeof label);
  return (
    <div className={styles.HabitGridItemBody}>
      {complex
        ? <span>{pre} <b>__ {unit}</b> {post}</span>
        : <span>{label}</span>
      }
    </div>
  )
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