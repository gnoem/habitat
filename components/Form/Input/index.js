import styles from "./input.module.css";

export const Input = ({ type, name, label, defaultValue, placeholder, disabled, onChange, onInput, note }) => {
  return (
    <div className={styles.Input}>
      {label && <label>{label}</label>}
      <div>
        <input {...{
          type,
          name,
          defaultValue,
          placeholder,
          disabled,
          onChange,
          onInput
        }} />
      </div>
      {note && <span>{note}</span>}
    </div>
  );
}
