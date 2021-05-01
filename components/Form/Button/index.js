import { useRouter } from "next/router";

import styles from "./button.module.css";
import { fancyClassName } from "../../../utils";

const Button = ({ children, type, onClick, href, className, disabled }) => {
  const router = useRouter();
  const handleClick = () => {
    if (onClick) return onClick();
    if (href) router.push(href);
  }
  return (
    <button type={type ?? 'button'}
            className={`${styles.Button} ${fancyClassName({ styles, className })}`}
            onClick={handleClick}
            disabled={disabled}>
      {children}
    </button>
  );
}

export default Button;