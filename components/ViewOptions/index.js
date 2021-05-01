import styles from "./viewOptions.module.css";
import { fancyClassName } from "../../utils";

const ViewOptions = ({ children, className }) => {
  return (
    <div className={`${styles.viewOptions} ${fancyClassName({ styles, className })}`}>
      {children}
    </div>
  );
}

export default ViewOptions;