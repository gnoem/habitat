import dayjs from "dayjs";

const habitDefs = [
  { name: 'Hydration', icon: '💦', color: '#94e4ff', label: 'Drank {{oz}} of water', complex: true, retired: false, range: '35-60' },
  { name: 'Sleep', icon: '💤', color: '#bfa8ff', label: 'Slept {{hours}}', complex: true, retired: false, range: '5-9' },
  { name: 'Cardio', icon: '💓', color: '#ff94d2', label: 'Did cardio', complex: false, retired: false },
  { name: 'Plants', icon: '🌱', color: '#80ff8e', label: 'Watered plants', complex: false, retired: false },
  { name: 'Sunshine', icon: '☀️', color: '#ffe74d', label: 'Spent time outdoors', complex: false, retired: false }
]

const ids = habitDefs.map(habit => {
  return habit.name;
});

// for each entry that will be in entriesArray (28-31 depending on calendar period), create a record for each habit in habitDefs
export const recordsList = (calendarPeriod) => {
  return new Array(dayjs(calendarPeriod).daysInMonth()).fill('').map(() => {
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
}

// entries for the whole current month
export const entriesList = (userId, calendarPeriod) => recordsList(calendarPeriod).map((_, index) => {
  const dateForThisEntry = `${calendarPeriod}-${index + 1}`;
  return {
    date: dayjs(dateForThisEntry).format('YYYY-MM-DD'),
    userId,
    demo: true
  }
});

export const habitsList = (userId) => habitDefs.map((habit, index) => {
  const sanitizedHabit = {...habit};
  delete sanitizedHabit.range; // range is only there for data generation, will cause server error if we try to write it to db
  return {
    id: ids[index],
    ...sanitizedHabit,
    userId,
    demo: true
  }
});