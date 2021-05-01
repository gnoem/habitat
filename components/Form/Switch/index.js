import styles from "./switch.module.css";

const Switch = ({ name, on, onChange }) => {
  return (
    <div className={styles.Switch}>
      <input name={name} type="checkbox" defaultChecked={on} onChange={onChange} />
      <div><span></span></div>
    </div>
  );
}

export default Switch;