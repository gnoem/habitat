import dayjs from "dayjs";

export const useCalendar = (calendarPeriod) => {
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
  const weekdays = (format) => new Array(7).fill('').map((_, index) => dayjs().day(index).format(format));
  return {
    weekdays,
    totalDaysInMonth
  }
}