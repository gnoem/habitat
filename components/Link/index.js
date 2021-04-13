import { useRouter } from "next/router";

export const Link = ({ children, onClick, href }) => {
  const router = useRouter();
  const handleClick = () => {
    if (onClick) return onClick();
    if (href) router.push(href);
  }
  return (
    <button type="button" className="link" onClick={handleClick}>
      {children}
    </button>
  );
}