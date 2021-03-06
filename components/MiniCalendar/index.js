import styles from "./miniCalendar.module.css";
import { useCalendar } from "../../hooks";
import dayjs from "dayjs";
import ArrowNav from "../ArrowNav";
import { useContext, useState } from "react";
import { MobileContext } from "../../contexts";
import { Button } from "../Form";

const MiniCalendarWrapper = ({ children, isMobile, miniCalendarPeriod, updateMiniCalendarPeriod }) => {
  const currentPeriod = dayjs().format('YYYY-MM');
  const jumpToCurrentMonth = () => updateMiniCalendarPeriod(currentPeriod);
  return (
    <div className={styles.MiniCalendarWrapper}>
      <Header {...{ miniCalendarPeriod, updateMiniCalendarPeriod }} />
      {children}
      {(miniCalendarPeriod === currentPeriod)
        ? null
        : isMobile
          ? <center><Button className="compact mt05" onClick={jumpToCurrentMonth}>&raquo; jump to current month</Button></center>
          : <button type="button" onClick={jumpToCurrentMonth}>&raquo; jump to current month</button>}
    </div>
  );
}

const Header = ({ miniCalendarPeriod, updateMiniCalendarPeriod }) => {
  const nav = (direction) => () => {
    const newPeriod = (direction === 'next')
      ? (period) => dayjs(period).add(1, 'month').format('YYYY-MM')
      : (period) => dayjs(period).subtract(1, 'month').format('YYYY-MM');
      updateMiniCalendarPeriod(newPeriod);
  }
  return (
    <div className={styles.Header}>
      {dayjs(miniCalendarPeriod).format('MMMM YYYY')}
      <ArrowNav ariaLabel="Calendar period" next={nav('next')} prev={nav('prev')} />
    </div>
  );
}

const MiniCalendar = ({ calendarPeriod, updateCalendarPeriod, updateDashPanel }) => {
  const isMobile = useContext(MobileContext);
  const [miniCalendarPeriod, updateMiniCalendarPeriod] = useState(calendarPeriod);
  const { weekdays, totalDaysInMonth } = useCalendar(miniCalendarPeriod);
  return (
    <MiniCalendarWrapper {...{ isMobile, miniCalendarPeriod, updateMiniCalendarPeriod }}>
      <div className={styles.MiniCalendar}>
        <WeekLabels {...{ weekdays }} />
        <DaysInMonth {...{ isMobile, totalDaysInMonth, updateCalendarPeriod, updateDashPanel }} />
      </div>
    </MiniCalendarWrapper>
  );
}

const WeekLabels = ({ weekdays }) => {
  return weekdays('dd').map(weekName => (
    <div key={`miniCalendar-weekLabels-${weekName}`} className={styles.WeekLabels}>
      {weekName}
    </div>
  ));
}

const DaysInMonth = ({ isMobile, totalDaysInMonth, updateCalendarPeriod, updateDashPanel }) => {
  return totalDaysInMonth.map((date, index) => {
    const handleClick = () => {
      updateCalendarPeriod(dayjs(date).format('YYYY-MM'));
      updateDashPanel(); // close it first to allow pretty opening animation
      setTimeout(() => {
        updateDashPanel('data', { date });
      }, isMobile ? 0 : 100);
    }
    const dayNumber = () => {
      if (date === '') return null;
      const rawDate = date.split('-')[2];
      return (parseInt(rawDate) > 9) ? rawDate : parseInt(rawDate).toString(); 
    }
    return (
      <div
        key={`miniCalendar-dayInMonth-${index}-(${date})`}
        onClick={handleClick}
        className={`${styles.CalendarDay} ${(date === '') ? styles.filler : ''}`}>
          {(date === '') ? null : <span>{dayNumber()}</span>}
      </div>
    );
  });
}

export default MiniCalendar;