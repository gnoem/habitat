import { useRouter } from "next/router";
import { fancyClassName } from "../../utils";

export const LinkButton = ({ children, onClick, href, className }) => {
  const router = useRouter();
  const handleClick = () => {
    if (onClick) return onClick();
    if (href) router.push(href);
  }
  return (
    <button type="button" className={`link ${fancyClassName({ className })}`} onClick={handleClick}>
      {children}
    </button>
  );
}