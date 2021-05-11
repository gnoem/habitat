import { useEffect, useState } from "react";
import dayjs from "dayjs";
import styles from "./clock.module.css";

const Clock = ({ user }) => {
  const { appearance__showClock, appearance__24hrClock, appearance__showClockSeconds } = user?.settings ?? {
    appearance__showClock: true,
    appearance__24hrClock: false,
    appearance__showClockSeconds: true
  }
  return (
    <div className={styles.Clock}>
      <span className={styles.dd}>{dayjs().format('DD')}</span>
      <span className={styles.mm}>{dayjs().format('MMMM')}</span>
      {appearance__showClock && <Time {...{ appearance__24hrClock, appearance__showClockSeconds }} />}
    </div>
  );
}

const Time = ({ appearance__24hrClock, appearance__showClockSeconds }) => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const counter = setInterval(() => {
      setTime(new Date());
    }, 1 * 1000);
    return () => clearInterval(counter);
  }, []);
  let [hours, minutes, seconds] = [time.getHours(), time.getMinutes(), time.getSeconds()];
  const ampm = appearance__24hrClock ? null : (hours >= 12) ? 'pm' : 'am';
  hours = appearance__24hrClock ? hours : hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  const addZero = (num) => {
    let fixed = num < 10 ? '0' + num : num;
    return fixed;
  }
  minutes = addZero(minutes);
  seconds = appearance__showClockSeconds ? `:${addZero(seconds)}` : null;
  return (
    <div className={styles.Time}>{hours}:{minutes}{seconds} {ampm}</div>
  );
}

export default Clock;