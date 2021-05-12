import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

import dayjs from "dayjs";
import { Chart } from "chart.js/dist/chart";

import styles from "./graph.module.css";
import graphConfig from "./graphConfig";
import { useRefName } from "../../../hooks";
import { MobileContext } from "../../../contexts";

const Graph = ({ habits, entries, calendarPeriod, updateDashPanel }) => {
  return (
    <div className={styles.Graph}>
      <SimpleHabits {...{ habits, entries, calendarPeriod, updateDashPanel }} />
      <ComplexHabits {...{ habits, entries, calendarPeriod, updateDashPanel }} />
    </div>
  );
}

const ChartCanvas = ({ type, habits, entries, calendarPeriod, updateDashPanel, includeDateMarkers }) => {
  const [chartInstance, setChartInstance] = useState(null);
  const isMobile = useContext(MobileContext);
  const chartRef = useRef(null);
  const { data, config } = useMemo(() => {
    return graphConfig(habits, entries, calendarPeriod, type, isMobile, includeDateMarkers);
  }, [entries, isMobile]);
  useEffect(() => {
    if (!chartInstance) return;
    chartInstance.data = data;
    chartInstance.options = config.options;
    chartInstance.update();
  }, [data, config]);
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
      const chart = new Chart(ctx, config);
      setChartInstance(chart);
    }
    myCanvas.addEventListener('click', handleChartClick);
    return () => myCanvas.removeEventListener('click', handleChartClick);
  }, [chartRef, handleChartClick, config]);
  const chartHeight = () => {
    if (type === 'complex') return 250;
    if (habits.length <= 1) return 40;
    const num = includeDateMarkers ? 30 : 20;
    return habits.length * num;
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