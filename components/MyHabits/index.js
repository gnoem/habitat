import { useEffect, useRef, useState } from "react";
import { useForm } from "../../hooks";
import { handleQuery } from "../../pages/api";
import Form, { Input, Submit } from "../Form";
import { Checkbox } from "../Form/Checkbox";
import styles from "./myHabits.module.css";

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

const HabitBody = ({ addingNew, userId, id, name, icon, label, complex, expanded }) => {
  const { formData, warnFormError, inputProps, checkboxProps } = useForm({
    userId,
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
    const mutation = `
      mutation ($name: String, $icon: String, $label: String, $complex: Boolean, $userId: Int) {
        createHabit(name: $name, icon: $icon, label: $label, complex: $complex, userId: $userId) {
          name
          icon
          label
          complex
          userId
        }
      }
    `;
    //return Promise.resolve(formData);
    return await handleQuery(mutation, formData);
  }
  const handleSuccess = (result) => {
    console.log(result);
  }
  return (
    <div className={styles.HabitBody} ref={habitBodyRef}>
      <Form onSubmit={handleSubmit} onSuccess={handleSuccess}
            behavior={{ checkmarkStick: false }}
            submit={<Submit className="compact" value="save changes" cancel={false} />}>
        <div className={styles.HabitFormTopRow}>
          <Input type="text" name="name" label="Habit name:" defaultValue={formData.name} {...inputProps} />
          <Input type="text" name="icon" label="Icon:" defaultValue={formData.icon} {...inputProps} />
        </div>
        <Input type="text" name="label" label="Display label:" defaultValue={formData.label} {...inputProps} />
        <Checkbox name="complex" checked={formData.complex} detailedLabel={[
          "enable complex tracking",
          "if checked, you will be able to record an amount when tracking this habit, e.g. how many hours of studying, how many oz. of water"
        ]} {...checkboxProps} />
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