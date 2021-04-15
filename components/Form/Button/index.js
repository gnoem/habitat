import styles from "./button.module.css";
import { useRouter } from "next/router";

export const Button = ({ children, type, onClick, href, className }) => {
  const router = useRouter();
  const handleClick = () => {
    if (onClick) return onClick();
    if (href) router.push(href);
  }
  return (
    <button type={type ?? 'button'} className={`${styles.Button} ${styles[className]}`} onClick={handleClick}>
      {children}
    </button>
  );
}