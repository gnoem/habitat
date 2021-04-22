import { fancyClassName } from "../../utils";
import styles from "./tooltip.module.css";

export const TooltipElement = ({ children, tooltip }) => {
  return (
    <div className={styles.TooltipElement}>
      {children}
      <Tooltip {...tooltip} />
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