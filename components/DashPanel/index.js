import styles from "./dashPanel.module.css";
import { useState } from "react";
import { Sidebar } from "../Dashboard";
import Form, { Input, Checkbox } from "../Form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBacon, faCalendarAlt, faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

const DashPanel = () => {
  const [view, setView] = useState(null);
  const handleNavClick = (newView) => {
    if (view === newView) setView(null);
    else setView(newView);
  }
  const isActiveClassName = (name) => {
    if (view == null) return '';
    return view === name ? styles.active : styles.inactive;
  }
  const isActive = (name) => {
    if (view === null) return false;
    return view === name;
  }
  return (
    <Sidebar>
        <div className={styles.DashPanel}>
          <nav>
            <button className={isActiveClassName('data')} onClick={() => handleNavClick('data')}>
              <span>Add data</span>
              <span><FontAwesomeIcon icon={isActive('data') ? faTimes : faPlus} /></span>
            </button>
            <button className={isActiveClassName('calendar')} onClick={() => handleNavClick('calendar')}>
              <span>Jump to date</span>
              <span><FontAwesomeIcon icon={isActive('calendar') ? faTimes : faCalendarAlt} /></span>
            </button>
            <button className={isActiveClassName('test')} onClick={() => handleNavClick('test')}>
              <span>Dummy</span>
              <span><FontAwesomeIcon icon={isActive('test') ? faTimes : faBacon} /></span>
            </button>
          </nav>
        <PanelContent {...{ view }} />
        </div>
    </Sidebar>
  );
}

const PanelContent = ({ view }) => {
  return (
    <div className={`${styles.PanelContent} ${view ? styles.active : ''}`}>
      current view is: {view}
    </div>
  );
}

export default DashPanel;