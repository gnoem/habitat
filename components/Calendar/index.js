import { faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dayjs from "dayjs";
import { fancyClassName } from "../../utils";
import styles from "./calendar.module.css";

export const Calendar = ({ habits, entries, calendarPeriod, updateDashPanel }) => {
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
      <div className={styles.calendarWeekLabel}>
        {weekName}
      </div>
    );
  });
}

const CalendarDays = ({ habits, entries, totalDaysInMonth, updateDashPanel }) => {
  return totalDaysInMonth.map((date, index) => {
    const isFiller = date === '';
    const { records } = entries.find(entry => entry.date === date) ?? {};
    const recordIcons = records?.map(record => {
      const habitIcon = habits.find(habit => habit.id === record.habitId)?.icon;
      return (
        <div>{habitIcon}</div>
      );
    });
    return (
      <CalendarDay key={`calendarDay-${index}`}
                   className={isFiller ? styles.filler : ''}
                   date={date}
                   updateDashPanel={updateDashPanel}>
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

const CalendarDay = ({ children, className, date, updateDashPanel }) => {
  return (
    <div className={`${styles.calendarDay} ${fancyClassName({ styles, className })}`}
         onClick={() => updateDashPanel('data', { date })}>
      {children}
    </div>
  );
}

// map entries to daysInMonth for calendarPeriod