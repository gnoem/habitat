import React, { useEffect, useState } from "react";
import { User, Habit, Entry, handleRequest } from "../pages/api";

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
    // keep session up to date if user edits account details/settings
    // todo come up with a better workaround, session should probably just store user id
    // just gotta make sure things like settings are already stored somewhere on first load, e.g. so clock doesn't flicker
    // maybe add a useEffect in dashboard layout that if !user, grabs the userId from session, makes fetch call
    // and immediately stores the complete user object in state - this will run on first render, whether the user is getting there
    // from logging in -> dashboard or visits a protected route directly via url bar
    const setSession = async () => await handleRequest('/api/auth/login', { user });
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