import { fancyClassName } from "../../utils";
import styles from "./tooltip.module.css";

export const TooltipElement = ({ children, className, content }) => {
  return (
    <div className={styles.TooltipElement}>
      {children}
      <Tooltip {...{ className, content }} />
    </div>
  );
}

export const Tooltip = ({ className, content }) => {
  return (
    <div className={`${styles.Tooltip} ${fancyClassName({ styles, className })}`}>
      {content}
    </div>
  );
}