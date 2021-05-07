import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

import dayjs from "dayjs";
import { Chart } from "chart.js/dist/chart";

import styles from "./graph.module.css";
import { config } from "./config";
import { MobileContext } from "../../contexts";
import { useRefName } from "../../hooks";

const Graph = ({ habits, entries, calendarPeriod, updateDashPanel }) => {
  return (
    <div className={styles.Graph}>
      <SimpleHabits {...{ habits, entries, calendarPeriod, updateDashPanel }} />
      <ComplexHabits {...{ habits, entries, calendarPeriod, updateDashPanel }} />
    </div>
  );
}

const ChartCanvas = ({ type, habits, entries, calendarPeriod, updateDashPanel, includeDateMarkers }) => {
  const isMobile = useContext(MobileContext);
  const [chartInstance, setChartInstance] = useState(null);
  const chartRef = useRef(null);
  const { data, initialSetup } = useMemo(() => {
    return config(habits, entries, calendarPeriod, type, isMobile, includeDateMarkers);
  }, [entries]);
  useEffect(() => {
    if (!chartInstance) return;
    chartInstance.data = data;
    chartInstance.update();
  }, [entries]);
  const handleChartClick = useCallback((e) => {
    if (!chartInstance) return;
    const points = chartInstance.getElementsAtEventForMode(e, 'nearest', { intersect: true }, true);
    if (!points.length) return;
    const { index } = points[0];
    const date = dayjs(data.labels[index])?.format(`${calendarPeriod}-DD`);
    if (date) updateDashPanel('data', { date });
  }, [chartInstance, calendarPeriod]);
  useEffect(() => {
    const myCanvas = useRefName(chartRef);
    if (!chartInstance) {
      if (!myCanvas) {
        setChartInstance(null);
        chartInstance.destroy();
        return;
      }
      const ctx = myCanvas.getContext('2d');
      const chart = new Chart(ctx, initialSetup);
      setChartInstance(chart);
    }
    myCanvas.addEventListener('click', handleChartClick);
    return () => myCanvas.removeEventListener('click', handleChartClick);
  }, [chartRef, handleChartClick]);
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
  if (!simpleHabits.length) return null;
  const includeDateMarkers = simpleHabits.length === habits.length;
  return (
    <ChartCanvas {...{
      type: 'simple',
      habits: simpleHabits,
      entries,
      calendarPeriod,
      updateDashPanel,
      includeDateMarkers
    }} />
    );
  }
  
export const ComplexHabits = ({ habits, entries, calendarPeriod, updateDashPanel }) => {
    const complexHabits = habits.filter(habit => habit.complex);
    if (!complexHabits.length) return null;
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

export default Graph;