import styles from "./layout.module.css";
import Image from "next/image";
import { Header } from "../Header";

export const Layout = ({ children, title, corner }) => {
  return (
    <div className={styles.Layout}>
      <Header />
      {corner ?? <Image alt="" src="/decor/hmmm.png" width={500} height={500} priority={true} />}
      <div className={styles.Body}>
        <h1>{title ?? 'habitat'}</h1>
        {children}
      </div>
    </div>
  );
}