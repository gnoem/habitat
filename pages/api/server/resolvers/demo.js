import dayjs from "dayjs";

const habitDefs = [
  { name: 'Hydration', icon: '💦', color: '#94e4ff', label: 'Drank {{oz}} of water', complex: true, retired: false, range: '20-60' },
  { name: 'Sleep', icon: '💤', color: '#bfa8ff', label: 'Slept {{hours}}', complex: true, retired: false, range: '5-9' },
  { name: 'Cardio', icon: '💓', color: '#ff94d2', label: 'Did cardio', complex: false, retired: false },
  { name: 'Plants', icon: '🌱', color: '#80ff8e', label: 'Watered plants', complex: false, retired: false },
  { name: 'Sunshine', icon: '☀️', color: '#ffe74d', label: 'Spent time outdoors', complex: false, retired: false }
]

const ids = habitDefs.map(habit => {
  return habit.name;
});

// for each entry that will be in entriesArray (between 30 and 60), create a record for each habit in habitDefs
export const recordsList = new Array(dayjs().daysInMonth()).fill('').map(() => {
  return habitDefs.map((habit, index) => {
    const randomAmount = () => {
      let [min, max] = habit.range.split('-');
      min = parseInt(min);
      max = parseInt(max);
      const randomInt = Math.floor(Math.random() * (max - min + 1) + min);
      return randomInt;
    }
    const randomBool = () => Math.random() < 0.5; // 50% probability of getting true 
    return {
      habitId: ids[index],
      amount: habit.complex ? randomAmount() : null,
      check: habit.complex ? true : randomBool()
    }
  });
});

// entries for last month + the current month up to current day
export const entriesList = (userId) => recordsList.map((records, index) => {
  const currentPeriod = dayjs().format('YYYY-MM');
  const dateForThisEntry = `${currentPeriod}-${index + 1}`;
  return {
    date: dayjs(dateForThisEntry).format('YYYY-MM-DD'),
    userId,
    demo: true
  }
});

export const habitsList = (userId) => habitDefs.map((habit, index) => {
  const sanitizedHabit = {...habit};
  delete sanitizedHabit.range;
  return {
    id: ids[index],
    ...sanitizedHabit,
    userId,
    demo: true
  }
});