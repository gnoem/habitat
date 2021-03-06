import { useContext, useEffect } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt, faPlus } from "@fortawesome/free-solid-svg-icons";

import styles from "./dashPanel.module.css";
import DataForm from "../DataForm";
import { DataContext } from "../../contexts";
import MiniCalendar from "../MiniCalendar";

const DashPanel = ({ dashPanel, updateDashPanel, calendarPeriod, updateCalendarPeriod }) => {
  const { habits } = useContext(DataContext);
  const { view: panelName, options: dashPanelOptions } = dashPanel ?? {};
  const handleNavClick = (newPanelName) => {
    if (panelName === newPanelName) updateDashPanel(null);
    else updateDashPanel(newPanelName);
  }
  const isActiveClassName = (name) => {
    if (panelName == null) return '';
    return panelName === name ? styles.active : styles.inactive;
  }
  const isActive = (name) => {
    if (panelName == null) return false;
    return panelName === name;
  }
  return (
    <div className={styles.DashPanel}>
      <nav aria-label="Dashboard actions" className={(panelName == null) ? '' : styles.active}>
        <button className={isActiveClassName('data')} onClick={() => handleNavClick('data')}>
          <span>Add data</span>
          <span><FontAwesomeIcon icon={faPlus} /></span>
        </button>
        <button className={isActiveClassName('calendar')} onClick={() => handleNavClick('calendar')}>
          <span>Jump to...</span>
          <span><FontAwesomeIcon icon={isActive('calendar') ? faPlus : faCalendarAlt} /></span>
        </button>
      </nav>
      <PanelContent {...{
        view: panelName,
        habits,
        dashPanelOptions,
        updateDashPanel,
        calendarPeriod,
        updateCalendarPeriod
      }} />
    </div>
  );
}

const PanelContent = ({ view, habits, dashPanelOptions, updateDashPanel, calendarPeriod, updateCalendarPeriod }) => {
  return (
    <div className={`${styles.PanelContent} ${view ? styles.active : ''}`}>
      {(view === 'data') && <DataForm {...{ habits, dashPanelOptions, updateDashPanel }} />}
      {(view === 'calendar') && <MiniCalendar {...{ calendarPeriod, updateCalendarPeriod, updateDashPanel }} />}
    </div>
  );
}

export default DashPanel;