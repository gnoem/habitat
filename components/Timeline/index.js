import { faCaretLeft, faCaretRight, faChartLine, faEdit, faListOl, faPen, faTh } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dayjs from "dayjs";
import styles from "./timeline.module.css";
import { LinkButton } from "../LinkButton";
import { Graph } from "../Graph";
import { useEffect, useState } from "react";
import { ArrowNav } from "../ArrowNav";
import { Calendar } from "../Calendar";
import { TooltipElement } from "../Tooltip";

export const Timeline = ({ habits, entries, calendarPeriod, updateCalendarPeriod, dashPanel, updateDashPanel }) => {
  // view options: list, grid, graph
  // filter options: - include empty days
  const [timelineView, setTimelineView] = useState('list'); // todo later config settings
  const timelineEntries = () => {
    if (!entries.length) return <NoData />;
    return (
      <div className={styles.timelineEntries} key={calendarPeriod}>
        {entries.map(entry => <DashboardEntry key={`dashboardEntry-entryId(${entry.id})`} {...{ entry, habits, updateDashPanel }} />)}
      </div>
    );
  }
  return (
    <div className={styles.Timeline}>
      <TimelineHeader {...{
        calendarPeriod,
        updateCalendarPeriod,
        timelineView,
        updateTimelineView: setTimelineView
      }} />
      <TimelineContent {...{
        habits,
        entries,
        calendarPeriod,
        updateDashPanel,
        timelineView,
        content: timelineEntries()
      }} />
    </div>
  );
}

export const NoData = () => {
  return (
    <div className={styles.noData}><span>
      you haven't added any data for this period
    </span></div>
  );
}

const TimelineHeader = ({ calendarPeriod, updateCalendarPeriod, timelineView, updateTimelineView }) => {
  const currentPeriod = dayjs().format('YYYY-MM');
  const nav = (direction) => () => {
    const newPeriod = direction === 'next'
      ? (period) => dayjs(period).add(1, 'month').format('YYYY-MM')
      : (period) => dayjs(period).subtract(1, 'month').format('YYYY-MM');
    updateCalendarPeriod(newPeriod);
  }
  return (
    <div className={styles.TimelineHeader}>
      <div className={styles.TimelineNav}>
        <ArrowNav ariaLabel="Calendar navigation" prev={nav('prev')} next={nav('next')} />
        {(calendarPeriod !== currentPeriod) &&
          <LinkButton className={styles.jumpToCurrentMonth} onClick={() => updateCalendarPeriod(currentPeriod)}>jump to current month</LinkButton>}
      </div>
      <div className={styles.calendarPeriod}>
        {dayjs(calendarPeriod).format('MMMM YYYY')}
        <div className={styles.timelineOptions}>
          <button
            className={timelineView === 'list' ? styles.active : ''}
            onClick={() => updateTimelineView('list')}>
              <FontAwesomeIcon icon={faListOl} />
              list
          </button>
          <button
            className={timelineView === 'grid' ? styles.active : ''}
            onClick={() => updateTimelineView('grid')}>
              <FontAwesomeIcon icon={faTh} />
              grid
          </button>
          <button
            className={timelineView === 'graph' ? styles.active : ''}
            onClick={() => updateTimelineView('graph')}>
              <FontAwesomeIcon icon={faChartLine} />
              graph
          </button>
        </div>
      </div>
    </div>
  );
}

const TimelineContent = ({ habits, entries, calendarPeriod, updateDashPanel, timelineView, content }) => {
  switch (timelineView) {
    case 'list': return content;
    case 'grid': return <Calendar {...{ habits, entries, calendarPeriod, updateDashPanel }} />;
    case 'graph': return <Graph {...{ habits, entries, calendarPeriod, updateDashPanel }} />;
    default: return content;
  }
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