import styles from "./input.module.css";

export const Input = ({ type, name, label, defaultValue, placeholder, disabled, onChange, onInput, note, className, min }) => {
  return (
    <div className={`${styles.Input} ${styles[className] ?? ''} ${className ?? ''}`}>
      {label && <label>{label}</label>}
      <div>
        <input {...{
          type,
          name,
          defaultValue,
          placeholder,
          disabled,
          onChange,
          onInput,
          min
        }} />
      </div>
      {note && <span>{note}</span>}
    </div>
  );
}
