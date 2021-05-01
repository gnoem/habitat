import styles from "./tooltip.module.css";
import { fancyClassName } from "../../utils";

const TooltipElement = ({ children, className, content }) => {
  return (
    <div className={styles.TooltipElement}>
      {children}
      <Tooltip {...{ className, content }} />
    </div>
  );
}

const Tooltip = ({ className, content }) => {
  return (
    <div className={`${styles.Tooltip} ${fancyClassName({ styles, className })}`}>
      {content}
    </div>
  );
}

export default TooltipElement;