import dayjs from "dayjs";
import { useEffect, useState } from "react";
import styles from "./date.module.css";

export const DateMarker = () => {
  return (
    <div className={styles.Date}>
      <span className={styles.dd}>{dayjs().format('D')}</span>
      <span className={styles.mm}>{dayjs().format('MMMM')}</span>
      <Time />
    </div>
  );
}

const Time = () => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const counter = setInterval(() => {
      setTime(new Date());
    }, 1 * 1000);
    return () => clearInterval(counter);
  }, []);
  let [hours, minutes, seconds] = [time.getHours(), time.getMinutes(), time.getSeconds()];
  const ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  const addZero = (num) => {
    let fixed = num < 10 ? '0' + num : num;
    return fixed;
  }
  minutes = addZero(minutes);
  seconds = addZero(seconds);
  return (
    <div className={styles.Time}>{hours}:{minutes}:{seconds} {ampm}</div>
  );
}