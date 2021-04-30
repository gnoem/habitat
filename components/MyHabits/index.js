import styles from "./myHabits.module.css";
import { useContext, useState } from "react";
import { HabitListItem, NewHabitListItem } from "./HabitList";
import { HabitGridItem, NewHabitGridItem } from "./HabitGrid";
import { ViewOptions } from "../ViewOptions";
import { faListUl, faTh } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useForm } from "../../hooks";
import Form, { Checkbox, Input, Submit } from "../Form";
import { Habit } from "../../pages/api";
import { DataContext } from "../../contexts";

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
        userId: user.id,
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
      <NewHabit {...{ habits, userId }} />
    </div>
  );
}

export const HabitForm = ({ title, userId, id, name, icon, color, label, complex, formBehavior, onSuccess, resetFormAfter }) => {
  const addingNew = !id;
  const { getHabits } = useContext(DataContext);
  const { formData, handleFormError, resetForm, inputProps, checkboxProps } = useForm({
    userId,
    id: addingNew ? '' : id,
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
      <Input type="text" name="name" label="Habit name:" value={formData.name} className="stretch" {...inputProps} />
      <div className={styles.displayOptions}>
        <Input type="text" name="icon" label="Icon:" value={formData.icon} className="stretch" {...inputProps} />
        <Input type="color" name="color" label="Color:" value={formData.color} {...inputProps} />
      </div>
      <Input type="text" name="label" label="Display label:" className="stretch" value={formData.label} {...inputProps} />
      <Checkbox name="complex" className="mt10" checked={formData.complex} detailedLabel={[
        "enable complex tracking",
        "if checked, you will be able to record an amount when tracking this habit, e.g. how many hours of studying, how many oz. of water"
      ]} {...checkboxProps} />
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