import { fancyClassName } from "../../utils";
import styles from "./viewOptions.module.css";

export const ViewOptions = ({ children, className }) => {
  return (
    <div className={`${styles.viewOptions} ${fancyClassName({ styles, className })}`}>
      {children}
    </div>
  );
}