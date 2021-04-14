import { Nav } from "../Nav";
import { Sidebar } from "../Sidebar";
import { DateMarker } from "../Date";
import styles from "./dash.module.css";

export const Dash = ({ children }) => {
  return (
    <div className={styles.Dash}>
      <Sidebar>
        <Nav />
      </Sidebar>
      <DateMarker />
      <div>{children}</div>
    </div>
  );
}