import styles from "./myHabits.module.css";
import { useContext, useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { Habit } from "../../pages/api";
import { DataContext } from "../../contexts";
import { useForm } from "../../hooks";
import Form, { Input, Submit, Checkbox } from "../Form";

export const MyHabits = ({ children, userId }) => {
  return (
    <div className={styles.MyHabits}>
      {children}
      <NewHabitBox {...{ userId }} />
    </div>
  );
}

export const HabitBox = ({ addingNew, userId, id, name, icon, label, complex }) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className={`${styles.HabitBox} ${expanded ? styles.expanded : ''}`}>
      <HabitHeader {...{
        name,
        icon,
        expanded,
        toggleExpanded: () => setExpanded(state => !state)
      }} />
      <HabitBody {...{
        addingNew,
        userId,
        id,
        name,
        icon,
        label,
        complex,
        expanded,
        updateExpanded: setExpanded
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

const HabitBody = ({ addingNew, userId, id, name, icon, label, complex, expanded, updateExpanded }) => {
  const { getHabits } = useContext(DataContext);
  const { formData, handleFormError, resetForm, inputProps, checkboxProps } = useForm({
    userId,
    id: addingNew ? '' : id,
    name: addingNew ? '' : name,
    icon: addingNew ? '' : icon,
    label: label ?? '',
    complex: complex ?? false
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
  const handleSubmit = async () => {
    const submit = addingNew ? Habit.create : Habit.edit;
    return submit(formData);
  }
  const handleSuccess = (result) => {
    console.log(result);
    getHabits();
    updateExpanded(false);
    if (addingNew) {
      resetForm();
      // clear form
      // maybe everytime state changes from expanded to closed, add habit form is reset?
      // also do form reset via useForm hook since it's all already there
    }
  }
  return (
    <div className={styles.HabitBody} ref={habitBodyRef}>
      <div>
        <Form onSubmit={handleSubmit} onSuccess={handleSuccess}
              behavior={{ checkmarkStick: false }}
              submit={<Submit className="compact" value="save changes" cancel={false} />}>
          <div className={styles.HabitFormTopRow}>
            <Input type="text" name="name" label="Habit name:" value={formData.name} {...inputProps} />
            <Input type="text" name="icon" label="Icon:" value={formData.icon} {...inputProps} />
          </div>
          <Input type="text" name="label" label="Display label:" className="stretch" value={formData.label} {...inputProps} />
          <Checkbox name="complex" className="mt10" checked={formData.complex} detailedLabel={[
            "enable complex tracking",
            "if checked, you will be able to record an amount when tracking this habit, e.g. how many hours of studying, how many oz. of water"
          ]} {...checkboxProps} />
        </Form>
        {addingNew || <DeleteHabit {...{ id, name }} />}
      </div>
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

const NewHabitBox = ({ userId }) => {
  return (
    <HabitBox {...{
      addingNew: true,
      userId,
      name: 'Add new',
      icon: '🌱' //'🐣'
    }} />
  );
}

const DeleteHabit = ({ id }) => {
  return (
    <div className={styles.DeleteHabit}>
      <span>delete this habit</span>
      <div>
        <span>permanently erase any & all evidence of this habit's existence (you will be asked to confirm)</span>
        <button type="button"><FontAwesomeIcon icon={faTrashAlt} /></button>
      </div>
    </div>
  );
}