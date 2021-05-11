import dayjs from "dayjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";

import styles from "./timeline.module.css";
import { getUnitFromLabel } from "../../../../utils";
import TooltipElement from "../../../../components/Tooltip";

const Timeline = ({ habits, entries, calendarPeriod, updateDashPanel }) => {
  const timelineEntries = () => {
    return (
      <div className={styles.timelineEntries} key={calendarPeriod}>
        {entries.map(entry => <DashboardEntry key={`dashboardEntry-entryId(${entry.id})`} {...{ entry, habits, updateDashPanel }} />)}
      </div>
    );
  }
  return (
    <div className={styles.Timeline}>
      {timelineEntries()}
    </div>
  );
}

const DashboardEntry = ({ entry, habits, updateDashPanel }) => {
  const { date, records } = entry;
  const getHabitObject = {
    fromId: (id) => {
      const index = habits.findIndex(habit => habit.id === id);
      return (index !== -1) ? habits[index] : {};
    }
  }
  const entryDate = () => {
    const month = dayjs(date).format('MMM');
    const day = dayjs(date).format('DD');
    const editEntry = () => {
      updateDashPanel('data', { date });
    }
    return (
      <div className={styles.entryTitle}>
        <span className={styles.day}>{day}</span>
        <span className={styles.month}>{month}</span>
        <button onClick={editEntry}>
          <TooltipElement className="below" content="edit in side panel">
            <FontAwesomeIcon icon={faPen} />
          </TooltipElement>
        </button>
      </div>
    );
  }
  const recordsList = records?.map(record => {
    const habit = getHabitObject.fromId(record.habitId);
    return <EntryRecord key={`entryRecord-entryId(${record.entryId})-recordId(${record.id})`} {...{ habit, record }} />
  });
  return (
    <div className={styles.DashboardEntry}>
      {entryDate(date)}
      <div className={styles.entryBody}>{recordsList}</div>
    </div>
  );
}

const EntryRecord = ({ habit, record }) => {
  const { amount, check } = record;
  const { icon, label, complex } = habit;
  if (!check || ((complex && check) && !amount)) return null;
  const preparedLabel = () => {
    if (!complex) return <span>{label}</span>;
    const pre = label.split('{')[0].trim();
    const post = label.split('}')[1].trim();
    const unit = getUnitFromLabel(label);
    return (
      <span>{pre} <b>{amount ?? 'some'} {unit}</b> {post}</span>
    );
  }
  return (
    <div>
      <span>{icon}</span>
      {preparedLabel()}
    </div>
  );
}

export default Timeline;