import { faCaretLeft, faCaretRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dayjs from "dayjs";
import styles from "./timeline.module.css";
import { LinkButton } from "../LinkButton";

export const Timeline = ({ habits, entries, calendarPeriod, updateCalendarPeriod }) => {
  const timelineEntries = () => {
    if (!entries.length) return (
      <div className={styles.noData}><span>
        you haven't added any data for this period
      </span></div>
    );
    return (
      <div className={styles.timelineEntries} key={calendarPeriod}>
        {entries.map(entry => <DashboardEntry key={`dashboardEntry-entryId(${entry.id})`} {...{ entry, habits }} />)}
      </div>
    );
  }
  return (
    <div className={styles.Timeline}>
      <TimelineHeader {...{ calendarPeriod, updateCalendarPeriod }} />
      <TimelineContent content={timelineEntries()} />
    </div>
  );
}

const TimelineHeader = ({ calendarPeriod, updateCalendarPeriod }) => {
  const currentPeriod = dayjs().format('YYYY-MM');
  const nav = (direction) => () => {
    const newPeriod = direction === 'next'
      ? (period) => dayjs(period).add(1, 'month').format('YYYY-MM')
      : (period) => dayjs(period).subtract(1, 'month').format('YYYY-MM');
    updateCalendarPeriod(newPeriod);
  }
  return (
    <div className={styles.TimelineHeader}>
      <nav aria-label="Calendar months">
        <button type="button" onClick={nav('prev')}><FontAwesomeIcon icon={faCaretLeft} /></button>
        <button type="button" onClick={nav('next')}><FontAwesomeIcon icon={faCaretRight} /></button>
      </nav>
      <div className={styles.calendarPeriod}>
        {dayjs(calendarPeriod).format('MMMM YYYY')}
        {(calendarPeriod !== currentPeriod) &&
          <LinkButton className={styles.jumpToCurrentMonth} onClick={() => updateCalendarPeriod(currentPeriod)}>jump to current month</LinkButton>}
      </div>
    </div>
  );
}

const TimelineContent = ({ content }) => {
  return content;
}

const DashboardEntry = ({ entry, habits }) => {
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
    const year = dayjs(date).format('YYYY');
    return (
      <div className={styles.entryTitle}>
        <span className={styles.day}>{day}</span>
        <span className={styles.month}>{month}</span>
      </div>
    );
  }
  const recordsList = records.map(record => {
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
    const pre = label.split('{{')[0].trim();
    const post = label.split('}}')[1].trim();
    const unit = label.split('{{')[1].split('}}')[0].trim();
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