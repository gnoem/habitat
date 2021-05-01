import styles from "./footer.module.css";

const Footer = ({ children }) => {
  return (
    <div className={styles.Footer}>
      {children}
    </div>
  );
}

export default Footer;