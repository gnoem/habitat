import React, { useEffect, useRef, useState } from "react";

import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import styles from "./input.module.css";
import { fancyClassName } from "../../../utils";
import { useRefName } from "../../../hooks";

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
    maxLength,
    min
  }) => {
    const inputRef = useRef(null);
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
          maxLength,
          min
        }} ref={inputRef} />
        <Alert {...{ alert, name, inputRef }} />
      </div>
      {note && <span>{note}</span>}
    </div>
  );
}

const Alert = ({ alert, name, inputRef }) => {
  const spanRef = useRef(null);
  useEffect(() => {
    const input = useRefName(inputRef);
    const span = useRefName(spanRef);
    if (!input || !span) return;
    if (span.scrollWidth > input.scrollWidth) {
      span.style.width = input.scrollWidth * 0.9 + 'px';
      span.style.paddingTop = '0.5rem';
      span.style.paddingBottom = '0.5rem';
      span.style.lineHeight = '1.2';
      span.style.whiteSpace = 'normal';
    }
  }, [alert, name, inputRef, spanRef]);
  if (!alert(name)) return null;
  return (
    <div className={styles.Alert}>
      <div><FontAwesomeIcon icon={faExclamationTriangle} /></div>
      <span ref={spanRef}><span>{alert(name).message}</span></span>
    </div>
  );
}

const ColorInput = ({ color }) => {
  return (
    <span className={styles.ColorInput} style={{ background: color }}></span>
  );
}

export default Input;