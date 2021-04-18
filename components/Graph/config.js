import dayjs from "dayjs";

export const config = (habits, entries, calendarPeriod) => {
  const daysInMonth = new Array(dayjs(calendarPeriod).daysInMonth()).fill('');
  const datesInMonth = daysInMonth.map((_, i) => {
    return dayjs(`${calendarPeriod}-${i + 1}`).format('YYYY-MM-DD');
  });
  const particularEntryRecord = (someEntry, habitId) => {
    return someEntry.records.find(record => record.habitId === habitId);
  }
  const datasets = habits.map(habit => {
    const activeThisMonth = entries.some(entry => particularEntryRecord(entry, habit.id)?.check);
    if (!activeThisMonth) return null;
    const data = datesInMonth.map(day => {
      const currentEntry = entries.find(entry => entry.date === day);
      if (!currentEntry) return habit.complex ? 0 : null;
      if (particularEntryRecord(currentEntry, habit.id)?.check) {
        return habit.complex
          ? particularEntryRecord(currentEntry, habit.id).amount
          : habit.name;
      }
      return habit.complex ? 0 : null;
    });
    const unit = habit.label.split('{{')[1]?.split('}}')[0]?.trim();
    const obj = {
      label: habit.name,
      unit,
      data,
      borderColor: '#000',
      borderWidth: 1,
      backgroundColor: /* habit.color ?? */ '#45DAC8',
      tension: 0.3
    }
    return obj;
  }).filter(el => el);
  const labels = datesInMonth.map(day => dayjs(day).format('MMM DD'));
  return {
    initialSetup: chartSetup(labels, datasets),
    data: {
      labels,
      datasets
    }
  }
}

export const chartSetup = (labels, datasets) => ({
  type: 'line',
  options: {
    layout: {
      padding: {
        //right: 100
      }
    },
    scales: {
      x: {
        ticks: { ...tickSettings }
      },
      y: {
        ticks: { ...tickSettings, color: '#000' }
      }
    },
    responsive: true,
    maintainAspectRatio: false,
    hoverMode: 'index',
    plugins: {
      legend: {
        display: true,
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

const tickSettings = {
  font: {
    family: 'Inconsolata, monospace'
  }
}