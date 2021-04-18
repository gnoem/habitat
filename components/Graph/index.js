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
    console.log(data);
    if (chartInstance) {
      chartInstance.data = data;
      chartInstance.update();
      return;
    }
    setChartInstance(new Chart(ctx, initialSetup));
  }, [chartRef, entries]);
  return (
    <div>
      <canvas id="myChart" width={type === 'simple' ? 600 : 600} height={type === 'simple' ? 40 : 250} ref={chartRef}></canvas>
    </div>
  );
}

export const SimpleHabits = ({ habits, entries, calendarPeriod }) => {
  const filteredHabits = habits.filter(habit => !habit.complex);
  return (
    <ChartCanvas {...{
      type: 'simple',
      habits: filteredHabits,
      entries,
      calendarPeriod
    }} />
  );
}

export const ComplexHabits = ({ habits, entries, calendarPeriod }) => {
  const filteredHabits = habits.filter(habit => habit.complex);
  return (
    <ChartCanvas {...{
      type: 'complex',
      habits: filteredHabits,
      entries,
      calendarPeriod
    }} />
  );
}