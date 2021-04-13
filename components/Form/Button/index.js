import { useRouter } from "next/router";

export const Button = ({ children, type, onClick, href, className }) => {
  const router = useRouter();
  const handleClick = () => {
    if (onClick) return onClick();
    if (href) router.push(href);
  }
  return (
    <button type={type ?? 'button'} className={className} onClick={handleClick}>
      {children}
    </button>
  );
}