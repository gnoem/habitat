import styles from "./util.module.css";

export const Gap = ({ height }) => <div className={`${styles.Gap} ${styles[height] ?? ''}`}></div>;