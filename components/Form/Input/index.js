import React from "react";

import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import styles from "./input.module.css";
import { fancyClassName } from "../../../utils";

const Input = ({
    type,
    name,
    label,
    value,
    defaultValue,
    placeholder,
    disabled,
    readOnly,
    onChange, onInput, onClick,
    note,
    alert,
    className,
    min
  }) => {
  return (
    <div className={`${styles.Input} ${fancyClassName({ styles, className })}`}>
      {label && <label>{label}</label>}
      <div>
        {(type === 'color') && <ColorInput {...{ color: value }} />}
        <input {...{
          type,
          name,
          value,
          defaultValue,
          placeholder,
          disabled,
          readOnly,
          onChange,
          onInput,
          onClick,
          min
        }} />
        <Alert {...{ alert, name }} />
      </div>
      {note && <span>{note}</span>}
    </div>
  );
}

const Alert = ({ alert, name }) => {
  if (!alert(name)) return null;
  return (
    <div className={styles.Alert}>
      <div><FontAwesomeIcon icon={faExclamationTriangle} /></div>
      <span><span>{alert(name).message}</span></span>
    </div>
  );
}

const ColorInput = ({ color }) => {
  return (
    <span className={styles.ColorInput} style={{ background: color }}></span>
  );
}

export default Input;