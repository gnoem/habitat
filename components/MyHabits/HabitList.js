import styles from "./myHabits.module.css";
import { useContext, useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDoubleRight } from "@fortawesome/free-solid-svg-icons";
import { Habit } from "../../pages/api";
import { DataContext, ModalContext } from "../../contexts";
import { useForm, useRefName } from "../../hooks";
import Form, { Input, Submit, Checkbox } from "../Form";
import { HabitIcon } from ".";

export const HabitListItem = ({ addingNew, userId, id, name, icon, color, label, complex }) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className={`${styles.HabitListItem} ${expanded ? styles.expanded : ''}`}>
      <HabitListItemHeader {...{
        name,
        icon,
        expanded,
        toggleExpanded: () => setExpanded(state => !state)
      }} />
      <HabitListItemBody {...{
        addingNew,
        userId,
        id,
        name,
        icon,
        color,
        label,
        complex,
        expanded,
        updateExpanded: setExpanded
      }} />
    </div>
  );
}

const HabitListItemHeader = ({ name, icon, color, toggleExpanded }) => {
  return (
    <div className={styles.HabitListItemHeader} onClick={toggleExpanded}>
      <HabitIcon>{icon}</HabitIcon>
      <h3>{name}</h3>
    </div>
  );
}

const HabitListItemBody = ({ addingNew, userId, id, name, icon, color, label, complex, expanded, updateExpanded }) => {
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
  const habitBodyRef = useRef(null);
  useEffect(() => {
    const habitBody = useRefName(habitBodyRef);
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
    <div className={styles.HabitListItemBody} ref={habitBodyRef}>
      <div>
        <Form onSubmit={handleSubmit} onSuccess={handleSuccess}
              behavior={{ checkmarkStick: false }}
              submit={<Submit className="compact" value="save changes" cancel={false} />}>
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
        {addingNew || <DeleteHabit {...{ id, name }} />}
      </div>
    </div>
  );
}

export const NewHabitListItem = ({ userId }) => {
  return (
    <HabitListItem {...{
      addingNew: true,
      userId,
      name: 'Add new',
      icon: '🌱' //'🐣'
    }} />
  );
}

const DeleteHabit = ({ id, name }) => {
  const { createModal } = useContext(ModalContext);
  const confirmDeleteHabit = () => {
    const habit = { id, name }
    createModal('deleteHabit', { habit });
  }
  return (
    <div className={styles.DeleteHabit}>
      <button onClick={confirmDeleteHabit}>
        <FontAwesomeIcon icon={faAngleDoubleRight} />
        <span>delete this habit</span>
      </button>
    </div>
  );
} 