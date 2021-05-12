import dayjs from "dayjs";
import { getUnitFromLabel } from "../../../utils";

const graphConfig = (habits, entries, calendarPeriod, type, isMobile, includeDateMarkers) => {
  const daysInMonth = new Array(dayjs(calendarPeriod).daysInMonth()).fill('');
  const datesInMonth = daysInMonth.map((_, i) => {
    return dayjs(`${calendarPeriod}-${i + 1}`).format('YYYY-MM-DD');
  });
  const datasets = habits.map(habit => {
    const particularEntryRecord = (someEntry, habitId) => {
      return someEntry?.records?.find(record => record.habitId === habitId);
    }
    const activeThisMonth = entries.some(entry => particularEntryRecord(entry, habit.id)?.check);
    if (!activeThisMonth) return null;
    const data = datesInMonth.map(day => {
      const currentEntry = entries.find(entry => entry.date === day);
      if (!currentEntry) return habit.complex ? 0 : null;
      if (particularEntryRecord(currentEntry, habit.id)?.check) {
        return habit.complex
          ? particularEntryRecord(currentEntry, habit.id).amount
          : isMobile ? habit.icon : habit.name;
      }
      return habit.complex ? 0 : null;
    });
    const unit = getUnitFromLabel(habit.label);
    const obj = {
      label: habit.name,
      unit,
      data,
      borderColor: '#000',
      borderWidth: 1,
      backgroundColor: habit.color || '#45DAC8',
      tension: 0.3
    }
    return obj;
  }).filter(el => el);
  const labels = datesInMonth.map(day => dayjs(day).format('MMM DD'));
  const yAxisLabels = (type === 'complex')
    ? null
    : isMobile
      ? habits.map(habit => habit.icon)
      : habits.map(habit => habit.name);
  return {
    initialSetup: chartSetup(labels, yAxisLabels, datasets, type, isMobile, includeDateMarkers),
    data: {
      labels,
      yAxisLabels,
      datasets
    }
  }
}

export const chartSetup = (labels, yAxisLabels, datasets, type, isMobile, includeDateMarkers) => ({
  type: 'line',
  options: {
    layout: {
      padding: {
        right: isMobile ? 0 : 30,
        bottom: (isMobile && type === 'complex') ? 32 : 0
      }
    },
    scales: {
      x: {
        ticks: {
          font: {
            family: 'Inconsolata, monospace'
          },
          display: (type === 'complex') || includeDateMarkers
        },
        grid: {
          drawTicks: type === 'complex'
        }
      },
      y: {
        type: yAxisLabels ? 'category' : 'linear',
        labels: yAxisLabels,
        ticks: {
          font: {
            family: 'Inconsolata, monospace',
            size: (isMobile && type === 'simple') ? 14 : 10
          },
          color: '#000'
        },
        afterSetDimensions: (axes) => {
          axes.paddingLeft = isMobile ? 40 : 100;
        }
      }
    },
    responsive: true,
    maintainAspectRatio: false,
    hoverMode: 'index',
    plugins: {
      legend: {
        display: type === 'complex',
        position: 'bottom',
        labels: {
          font: {
            family: 'Work Sans, sans-serif',
            size: 12
          },
          boxWidth: 7,
          usePointStyle: true,
          padding: 20
        }
      },
      tooltip: {
        enabled: type === 'complex',
        cornerRadius: 0,
        titleColor: '#000',
        titleFont: {
          family: 'Inconsolata, monospace',
          weight: 'normal',
          size: 14
        },
        bodyColor: '#000',
        bodyFont: {
          family: 'Work Sans, sans-serif',
          lineHeight: 1
        },
        backgroundColor: '#fff',
        boxWidth: 7,
        boxHeight: 7,
        usePointStyle: true,
        padding: 8,
        callbacks: {
          afterLabel: (context) => {
            const { unit } = context.dataset;
            return unit;
          }
        }
      }
    }
  },
  data: {
    labels,
    datasets
  },
});

export default graphConfig;
