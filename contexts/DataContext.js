import React, { useState } from "react";
import { useRouter } from "next/router";

import { User, Habit, Entry, handleRequest } from "../pages/api";

export const DataContext = React.createContext(null);

export const DataContextProvider = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [habits, setHabits] = useState(null);
  const [entries, setEntries] = useState(null);
  const [demoTokenId, setDemoTokenId] = useState(null);
  const [demoGenOption, setDemoGenOption] = useState(true);
  const getUser = async (userId = user.id) => {
    if (!userId) return console.log('userId is undefined!');
    const { demoTokenId: tokenId } = await handleRequest('/api/auth/getSession');
    setDemoTokenId(tokenId);
    const { user } = await User.get({ id: userId, demoTokenId: tokenId });
    if (user == null) { // if user doesn't exist
      await handleRequest('/api/auth/logout');
      router.push('/');
    }
    setUser(user);
    return user;
  }
  const getHabits = async () => {
    console.log('getting habits');
    if (!user) return console.log('User not stored');
    const { habits } = await Habit.get({ userId: user.id, demoTokenId });
    if (user.email === 'demo') {
      // check if user has created any of their own habits, in which case they can't use feature to auto generate data
      // only demo habits will have ids of the form demo-0, demo-1, demo-2, etc, all others will be a string of letters & numbers
      const containsOnlyDemoHabits = habits.every(habit => habit.id.split('-')[0] === 'demo');
      if (containsOnlyDemoHabits) setDemoGenOption(true);
      else setDemoGenOption(false);
    }
    setHabits(habits);
    return habits;
  }
  const getEntries = async () => {
    if (!user) return console.log('User not stored');
    const { entries } = await Entry.get({ userId: user.id, demoTokenId });
    setEntries(entries);
    return entries;
  }
  const dataContext = {
    user, setUser, getUser,
    habits, setHabits, getHabits,
    entries, setEntries, getEntries,
    demoTokenId, setDemoTokenId,
    demoGenOption
  }
  return (
    <DataContext.Provider value={dataContext}>
      {children}
    </DataContext.Provider>
  );
}