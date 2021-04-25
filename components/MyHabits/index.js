import styles from "./myHabits.module.css";
import { useState } from "react";
import { HabitListItem, NewHabitListItem } from "./HabitList";
import { HabitGridItem, NewHabitGridItem } from "./HabitGrid";
import { ViewOptions } from "../ViewOptions";
import { faListUl, faTh } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const MyHabits = ({ userId, habits }) => {
  const [habitView, setHabitView] = useState('list');
  const content = () => {
    switch (habitView) {
      case 'list': return <HabitList {...{ userId, habits }} />;
      default: return <HabitList {...{ userId, habits }} />;
    }
  }
  return (
    <div className={styles.MyHabits}>
      <MyHabitsNav {...{
        habitView,
        updateHabitView: setHabitView
      }} />
      <Habits {...{
        habitView,
        userId,
        habits
      }} />
    </div>
  );
}

const MyHabitsNav = ({ habitView, updateHabitView }) => {
  return (
    <div className={styles.MyHabitsNav}>
      <ViewOptions className={styles.HabitViewOptions}>
        <button
          className={habitView === 'list' ? styles.currentHabitView : ''}
          onClick={() => updateHabitView('list')}>
            <FontAwesomeIcon icon={faListUl} />
            list
        </button>
        <button
          className={habitView === 'grid' ? styles.currentHabitView : ''}
          onClick={() => updateHabitView('grid')}>
            <FontAwesomeIcon icon={faTh} />
            grid
        </button>
      </ViewOptions>
    </div>
  );
}

const Habits = ({ habitView, userId, habits }) => {
  const [Habit, NewHabit] = habitView === 'list'
    ? [HabitListItem, NewHabitListItem]
    : [HabitGridItem, NewHabitGridItem];
  const boxes = habits.map(habit => (
    <Habit key={`habit-habitId(${habit.id})`} userId={userId} {...habit} />
  ));
  return (
    <div className={habitView === 'list' ? styles.HabitList : styles.HabitGrid}>
      {boxes}
      <NewHabit {...{ userId }} />
    </div>
  );
}

export const HabitIcon = ({ children }) => {
  return (
    <div className={styles.HabitIcon}>
      {children}
    </div>
  );
}