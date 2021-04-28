import styles from "./graph.module.css";
import dayjs from "dayjs";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Chart } from "chart.js/dist/chart";
import { config } from "./config";
import { NoData } from "../Timeline";
import { useRefName } from "../../hooks";
import { MobileContext } from "../../contexts";

export const Graph = ({ habits, entries, calendarPeriod, updateDashPanel }) => {
  if (!entries.length) return <NoData />;
  return (
    <div className={styles.Graph}>
      <SimpleHabits {...{ habits, entries, calendarPeriod, updateDashPanel }} />
      <ComplexHabits {...{ habits, entries, calendarPeriod, updateDashPanel }} />
    </div>
  );
}

const ChartCanvas = ({ type, habits, entries, calendarPeriod, updateDashPanel }) => {
  const isMobile = useContext(MobileContext);
  const [chartInstance, setChartInstance] = useState(null);
  const chartRef = useRef(null);
  const { data, initialSetup } = useMemo(() => {
    return config(habits, entries, calendarPeriod, type, isMobile);
  }, [entries]);
  useEffect(() => {
    if (!chartInstance) return;
    chartInstance.data = data;
    chartInstance.update();
  }, [entries]);
  useEffect(() => {
    if (chartInstance) return;
    const myCanvas = useRefName(chartRef);
    if (!myCanvas) {
      setChartInstance(null);
      chartInstance.destroy();
      return;
    }
    const ctx = myCanvas.getContext('2d');
    const chart = new Chart(ctx, initialSetup);
    setChartInstance(chart);
    const handleChartClick = (e) => {
      const points = chart.getElementsAtEventForMode(e, 'nearest', { intersect: true }, true);
      if (!points.length) return;
      const { index } = points[0];
      const date = dayjs(data.labels[index])?.format(`${calendarPeriod}-DD`);
      if (date) updateDashPanel('data', { date });
    }
    myCanvas.addEventListener('click', handleChartClick);
    return () => myCanvas.removeEventListener('click', handleChartClick);
  }, [chartRef]);
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

export const SimpleHabits = ({ habits, entries, calendarPeriod, updateDashPanel }) => {
  const simpleHabits = habits.filter(habit => !habit.complex);
  return (
    <ChartCanvas {...{
      type: 'simple',
      habits: simpleHabits,
      entries,
      calendarPeriod,
      updateDashPanel
    }} />
  );
}

export const ComplexHabits = ({ habits, entries, calendarPeriod, updateDashPanel }) => {
  const complexHabits = habits.filter(habit => habit.complex);
  return (
    <ChartCanvas {...{
      type: 'complex',
      habits: complexHabits,
      entries,
      calendarPeriod,
      updateDashPanel
    }} />
  );
}