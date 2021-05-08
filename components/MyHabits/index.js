import { useContext, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faListUl, faTh } from "@fortawesome/free-solid-svg-icons";

import styles from "./myHabits.module.css";
import { Habit } from "../../pages/api";
import { DataContext } from "../../contexts";
import { useForm } from "../../hooks";
import Form, { Checkbox, Input, Submit } from "../Form";
import { HabitListItem, NewHabitListItem } from "./HabitList";
import { HabitGridItem, NewHabitGridItem } from "./HabitGrid";
import ViewOptions from "../ViewOptions";

export const MyHabits = ({ user, habits }) => {
  const [habitView, setHabitView] = useState(user.settings?.habits__defaultView ?? 'list');
  return (
    <div className={styles.MyHabits}>
      {(habits.length > 0) && (
        <MyHabitsNav {...{
          habitView,
          updateHabitView: setHabitView
        }} />
      )}
      <Habits {...{
        habitView,
        user,
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

const Habits = ({ habitView, user, habits }) => {
  const [Habit, NewHabit] = habitView === 'list'
    ? [HabitListItem, NewHabitListItem]
    : [HabitGridItem, NewHabitGridItem];
  const activeHabits = habits.map(habit => {
    if (habit.retired) return null;
    return <Habit key={`habit-habitId(${habit.id})`} user={user} {...habit} />;
  });
  const retiredHabits = habits.map(habit => {
    if (!habit.retired) return null;
    return <Habit key={`habit-habitId(${habit.id})`} user={user} {...habit} retired />;
  }).filter(el => el);
  return (
    <div className={styles.HabitsContainer}>
      <div className={habitView === 'list' ? styles.HabitList : styles.HabitGrid}>
        {activeHabits}
        <NewHabit {...{ habits, user }} />
      </div>
      {retiredHabits.length > 0 && (
        <div className={habitView === 'grid' ? styles.HabitGrid : ''}>
          <h2>retired habits</h2>
          {retiredHabits}
        </div>
      )}
    </div>
  );
}

export const HabitForm = ({ title, user, id, name, icon, color, label, complex, retired, formBehavior, onSuccess, resetFormAfter }) => {
  const addingNew = !id;
  const { getHabits } = useContext(DataContext);
  const { formData, handleFormError, resetForm, inputProps, checkboxProps } = useForm({
    userId: user.id,
    demo: user.email === 'demo',
    id: addingNew ? '' : id,
    retired: addingNew ? false : retired,
    name: addingNew ? '' : name,
    icon: addingNew ? '' : icon,
    color: addingNew ? '#45DAC8' : color,
    label: label ?? '',
    complex: complex ?? false
  });
  const handleSubmit = () => {
    const submit = addingNew ? Habit.create : Habit.edit;
    return submit(formData);
  }
  const handleSuccess = () => {
    onSuccess?.();
    getHabits();
    if (resetFormAfter) {
      resetForm();
    }
  }
  return (
    <Form onSubmit={handleSubmit} onSuccess={handleSuccess} handleFormError={handleFormError}
          title={title}
          behavior={formBehavior}
          submit={<Submit className="compact jcc" value="save changes" cancel={false} />}>
      <Input
        type="text"
        name="name"
        label="Habit name:"
        value={formData.name}
        placeholder="e.g. Hydration"
        className="stretch"
        {...inputProps}
      />
      <div className={styles.displayOptions}>
        <Input type="text" name="icon" label="Icon:" value={formData.icon} className="stretch" maxLength="1" {...inputProps} />
        <Input type="color" name="color" label="Color:" value={formData.color} {...inputProps} />
      </div>
      <Input
        type="text"
        name="label"
        label="Display label:"
        placeholder={formData.complex ? 'e.g. Drank {oz} of water' : 'e.g. Drank water'}
        className="stretch alertInside"
        value={formData.label}
        {...inputProps}
        note={formData.complex ? (
          <>
            with complex habits, make sure to include the unit label in {'{curly brackets}'}: e.g. <b>drank {'{oz}'} of water</b>, <b>got {'{hours}'} of sleep</b>
          </>
        ) : ''}
      />
      <Checkbox name="complex" className="mt10" checked={formData.complex} detailedLabel={[
        "enable complex tracking",
        "if checked, you will be able to record an amount when tracking this habit, e.g. how many hours of studying, how many oz. of water"
      ]} {...checkboxProps} />
      {!addingNew && (
        <Checkbox name="retired" className="mt10" checked={formData.retired} detailedLabel={[
          "mark as retired",
          "if checked, this habit will no longer show up when adding/editing records - perfect for habits you no longer want to track but still want to preserve existing data for"
        ]} {...checkboxProps} />
      )}
    </Form>
  );
}

export const HabitIcon = ({ children }) => {
  return (
    <div className={styles.HabitIcon}>
      {children}
    </div>
  );
}