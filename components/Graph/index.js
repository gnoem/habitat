import styles from "./graph.module.css";
import { useEffect, useRef, useState } from "react";
import { Chart } from "chart.js/dist/chart";
import { config } from "./config";
import { NoData } from "../Timeline";

export const Graph = ({ habits, entries, calendarPeriod }) => {
  if (!entries.length) return <NoData />;
  return (
    <div className={styles.Graph}>
      <SimpleHabits {...{ habits, entries, calendarPeriod }} />
      <ComplexHabits {...{ habits, entries, calendarPeriod }} />
    </div>
  );
}

const ChartCanvas = ({ type, habits, entries, calendarPeriod }) => {
  const [chartInstance, setChartInstance] = useState(null);
  const chartRef = useRef(null);
  useEffect(() => {
    const { current: myCanvas } = chartRef;
    if (!myCanvas) {
      setChartInstance(null);
      chartInstance?.destroy();
      return;
    }
    const ctx = myCanvas.getContext('2d');
    const { data, initialSetup } = config(habits, entries, calendarPeriod, type);
    if (chartInstance) {
      chartInstance.data = data;
      chartInstance.update();
      return;
    }
    setChartInstance(new Chart(ctx, initialSetup));
  }, [chartRef, entries]);
  const chartHeight = () => {
    if (type === 'complex') return 250;
    if (habits.length <= 1) return 40;
    return habits.length * 20;
  }
  return (
    <div>
      <canvas id="myChart" height={chartHeight()} ref={chartRef}></canvas>
    </div>
  ); // height for simple habits: habitsActiveThisMonth.length * 40
  // visibility: hidden on canvas if habitsActiveThisMonth.length is 0
}

export const SimpleHabits = ({ habits, entries, calendarPeriod }) => {
  const simpleHabits = habits.filter(habit => !habit.complex);
  return (
    <ChartCanvas {...{
      type: 'simple',
      habits: simpleHabits,
      entries,
      calendarPeriod
    }} />
  );
}

export const ComplexHabits = ({ habits, entries, calendarPeriod }) => {
  const complexHabits = habits.filter(habit => habit.complex);
  return (
    <ChartCanvas {...{
      type: 'complex',
      habits: complexHabits,
      entries,
      calendarPeriod
    }} />
  );
}