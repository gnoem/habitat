import styles from "./calendar.module.css";
import { getUnitFromLabel } from "../../../utils";
import TooltipElement from "../../Tooltip";
import { useCalendar } from "../../../hooks";

const Calendar = ({ habits, entries, calendarPeriod, updateDashPanel }) => {
  const { weekdays, totalDaysInMonth } = useCalendar(calendarPeriod);
  return (
    <div className={styles.Calendar}>
      <CalendarWeekLabels {...{ weekdays }} />
      <CalendarDays {...{ habits, entries, totalDaysInMonth, updateDashPanel }} />
    </div>
  );
}

const CalendarWeekLabels = ({ weekdays }) => {
  return weekdays('ddd').map(weekName => (
    <div key={`calendarWeekLabels-${weekName}`} className={styles.calendarWeekLabel}>
      {weekName}
    </div>
  ));
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