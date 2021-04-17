import React from "react";
import { fancyClassName } from "../../../utils";
import styles from "./input.module.css";

export const Input = ({
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
    className,
    min
  }) => {
  return (
    <div className={`${styles.Input} ${fancyClassName({ styles, className })}`}>
      {label && <label>{label}</label>}
      <div>
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
      </div>
      {note && <span>{note}</span>}
    </div>
  );
}
