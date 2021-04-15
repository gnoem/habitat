import styles from "./checkbox.module.css";

export const Checkbox = ({ label, name, detailedLabel, checked, onChange }) => {
  return (
      <div className={`${styles.Checkbox} ${detailedLabel ? styles.detailed : ''}`}>
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