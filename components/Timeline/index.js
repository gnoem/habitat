import { useContext, useState } from "react";

import dayjs from "dayjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartLine, faListOl, faPen, faTh } from "@fortawesome/free-solid-svg-icons";

import styles from "./timeline.module.css";
import { User } from "../../pages/api";
import { DataContext } from "../../contexts";
import { getUnitFromLabel } from "../../utils";
import Graph from "../Graph";
import Calendar from "../Calendar";
import LinkButton from "../LinkButton";
import ArrowNav from "../ArrowNav";
import TooltipElement from "../Tooltip";
import ViewOptions from "../ViewOptions";
import { Submit } from "../Form";

const Timeline = ({ user, habits, entries, calendarPeriod, updateCalendarPeriod, updateDashPanel }) => {
  const [timelineView, setTimelineView] = useState(user.settings?.dashboard__defaultView ?? 'list');
  const timelineEntries = () => {
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
        user,
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

export const NoData = ({ user,habits, calendarPeriod }) => {
  const showButton = user?.email === 'demo';
  return (
    <div className={styles.noData}>
      <span>you haven't added any data for this period</span>
      {showButton && <ButtonToGenerateTestData {...{ user, calendarPeriod }} />}
    </div>
  );
}

const ButtonToGenerateTestData = ({ user, calendarPeriod }) => {
  const { demoGenOption, habits, getHabits, getEntries } = useContext(DataContext);
  const [successPending, setSuccessPending] = useState(false);
  const handleClick = () => {
    setSuccessPending(true);
    return User.generateDemoData({
      id: user.id, 
      calendarPeriod,
      alsoHabits: !habits?.length
    }).then(() => {
      getHabits();
      getEntries();
    });
  }
  if (!demoGenOption) return null;
  return (
    <Submit
      value="click to generate test data"
      onClick={handleClick}
      className="mt15"
      successPending={successPending}
      cancel={false}
    />
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
        <ViewOptions className={styles.TimelineViewOptions}>
          <button
            className={timelineView === 'list' ? styles.currentTimelineView : ''}
            onClick={() => updateTimelineView('list')}>
              <FontAwesomeIcon icon={faListOl} />
              list
          </button>
          <button
            className={timelineView === 'grid' ? styles.currentTimelineView : ''}
            onClick={() => updateTimelineView('grid')}>
              <FontAwesomeIcon icon={faTh} />
              grid
          </button>
          <button
            className={timelineView === 'graph' ? styles.currentTimelineView : ''}
            onClick={() => updateTimelineView('graph')}>
              <FontAwesomeIcon icon={faChartLine} />
              graph
          </button>
        </ViewOptions>
      </div>
    </div>
  );
}

const TimelineContent = ({ user, habits, entries, calendarPeriod, updateDashPanel, timelineView, content }) => {
  if (!entries.length) return <NoData {...{ user, habits, calendarPeriod }} />;
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
    const pre = label.split('{{')[0].trim();
    const post = label.split('}}')[1].trim();
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