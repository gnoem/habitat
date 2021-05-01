import dayjs from "dayjs";

import styles from "./calendar.module.css";
import { getUnitFromLabel } from "../../utils";
import TooltipElement from "../Tooltip";

const Calendar = ({ habits, entries, calendarPeriod, updateDashPanel }) => {
  const daysInMonth = new Array(dayjs(calendarPeriod).daysInMonth()).fill('').map((_, index) => {
    return dayjs(`${calendarPeriod}-${index + 1}`).format('YYYY-MM-DD');
  });
  const totalDaysInMonth = (() => {
    const monthStartsOnDay = dayjs(daysInMonth[0]).day();
    const lastDayIndex = daysInMonth.length - 1;
    const monthEndsOnDay = dayjs(daysInMonth[lastDayIndex]).day();
    let pre = (monthStartsOnDay !== 0) ? new Array(monthStartsOnDay).fill('') : [];
    let post = (monthEndsOnDay !== 6) ? new Array(6 - monthEndsOnDay).fill('') : [];
    return [
      ...pre,
      ...daysInMonth,
      ...post
    ];
  })();
  return (
    <div className={styles.Calendar}>
      <CalendarWeekLabels />
      <CalendarDays {...{ habits, entries, totalDaysInMonth, updateDashPanel }} />
    </div>
  );
}

const CalendarWeekLabels = () => {
  return new Array(7).fill('').map((_, index) => {
    const weekName = dayjs().day(index).format('ddd');
    return (
      <div key={`calendarWeekLabels-${weekName}`} className={styles.calendarWeekLabel}>
        {weekName}
      </div>
    );
  });
}

const CalendarDays = ({ habits, entries, totalDaysInMonth, updateDashPanel }) => {
  return totalDaysInMonth.map((date, index) => {
    const isFiller = date === '';
    const { records } = entries.find(entry => entry.date === date) ?? {};
    const recordIcons = records?.map(({ habitId, amount, check }) => {
      if (!check) return null;
      const { name, icon, label, complex } = habits.find(habit => habit.id === habitId);
      const unit = complex ? getUnitFromLabel(label) : null;
      const recordDetails = (
        <span>
          {complex
            ? <><b>{name}:</b> {amount} {unit}</>
            : <>{label}</>
          }
        </span>
      );
      return (
        <TooltipElement
          key={`recordIcon-${date}-${habitId}`}
          className="below nowrap"
          content={recordDetails}>
            {icon}
        </TooltipElement>
      );
    });
    return (
      <CalendarDay {...{
        key: `calendarDay-${index}`,
        isFiller,
        date,
        updateDashPanel
      }}>
        {isFiller ? null : (
          <div className={styles.title}>
            {date.split('-')[2]}
          </div>
        )}
        <div>{recordIcons}</div>
      </CalendarDay>
    );
  });
}

const CalendarDay = ({ children, isFiller, date, updateDashPanel }) => {
  const handleClick = () => {
    if (isFiller) return;
    updateDashPanel('data', { date })
  }
  return (
    <div className={`${styles.calendarDay} ${isFiller ? styles.filler : ''}`}
         onClick={handleClick}>
      {children}
    </div>
  );
}

export default Calendar;