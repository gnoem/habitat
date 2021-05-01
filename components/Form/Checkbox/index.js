import styles from "./checkbox.module.css";
import { fancyClassName } from "../../../utils";

const Checkbox = ({ label, name, detailedLabel, checkboxAfter, className, checked, onChange }) => {
  const checkboxClassName = () => {
    let stringToReturn = '';
    if (detailedLabel) stringToReturn += `${styles.detailed}`;
    if (checkboxAfter) stringToReturn += ` ${styles.checkboxAfter}`;
    if (className) stringToReturn += ` ${fancyClassName({ styles, className })}`;
    return stringToReturn;
  }
  return (
    <div className={`${styles.Checkbox} ${checkboxClassName()}`}>
      <div className={styles.checkboxElement}>
        <input type="checkbox" name={name} onChange={onChange} checked={checked} />
        <span className={styles.svg}>
          <svg viewBox="0 0 16 16"><polyline points="3 9 6 12 13 5"></polyline></svg>
        </span>
      </div>
      {label
        ? <label>{label}</label>
        : <div className={styles.label}>
            <label>{detailedLabel[0]}</label>
            <span>{detailedLabel[1]}</span>
          </div>
      }
    </div>
  );
}

export default Checkbox;