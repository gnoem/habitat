import React, { useEffect, useState } from "react";
import { User, Habit, Entry, handleFetch } from "../pages/api";

export const DataContext = React.createContext(null);

export const DataContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [habits, setHabits] = useState(null);
  const [entries, setEntries] = useState(null);
  const getUser = async (userId = user.id) => {
    if (!userId) return console.log('userId is undefined!');
    const { user } = await User.get({ id: userId });
    setUser(user);
    return user;
  }
  const getHabits = async () => {
    if (!user) return console.log('User not stored');
    const { habits } = await Habit.get({ userId: user.id });
    setHabits(habits);
    return habits;
  }
  const getEntries = async () => {
    if (!user) return console.log('User not stored');
    const { entries } = await Entry.get({ userId: user.id });
    setEntries(entries);
    return entries;
  }
  useEffect(() => {
    const setSession = async () => await handleFetch('/api/auth/login', { user });
    setSession();
  }, [user]);
  const dataContext = {
    user, setUser, getUser,
    habits, setHabits, getHabits,
    entries, setEntries, getEntries
  }
  return (
    <DataContext.Provider value={dataContext}>
      {children}
    </DataContext.Provider>
  );
}