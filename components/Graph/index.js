import styles from "./graph.module.css";
import { useEffect, useRef, useState } from "react";
import { NoData } from "../Timeline";
import { Chart } from "chart.js/dist/chart";
import { config } from "./config";

export const Graph = ({ habits, entries, calendarPeriod }) => {
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
    const { data, initialSetup } = config(habits, entries, calendarPeriod);
    if (chartInstance) {
      chartInstance.data = data;
      chartInstance.update();
      return;
    }
    setChartInstance(new Chart(ctx, initialSetup));
  }, [chartRef, entries]);
  return (
    <div className={styles.Graph}>
      {entries.length
        ? <canvas id="myChart" width="500" height="250" ref={chartRef}></canvas>
        : <NoData />}
    </div>
  );
}