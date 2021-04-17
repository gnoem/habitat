import React, { useEffect, useState } from "react";
import { handleQuery } from "../pages/api";

export const DataContext = React.createContext(null);

const DataContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [habits, setHabits] = useState(null);
  const [entries, setEntries] = useState(null);
  const getUser = async (userId = user.id) => {
    if (!userId) return console.log('userId is undefined!');
    const query = `
      query ($id: Int) {
        user(id: $id) {
          id
          name
          email
        }
      }
    `;
    const { user } = await handleQuery(query, { id: userId });
    setUser(user);
    return user;
  }
  const getHabits = async () => {
    if (!user) return console.log('User not stored');
    const query = `
      query ($userId: Int) {
        habits(userId: $userId) {
          id
          name
          icon
          color
          label
          complex
        }
      }
    `;
    const { habits } = await handleQuery(query, { userId: user.id });
    setHabits(habits);
    return habits;
  }
  const getEntries = async () => {
    if (!user) return console.log('User not stored');
    const query = `
      query ($userId: Int) {
        entries(userId: $userId) {
          id
          date
          records {
            id
            habitId
            amount
            check
          }
        }
      }
    `;
    const { entries } = await handleQuery(query, { userId: user.id });
    setEntries(entries);
    return entries;
  }
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

export const AppContextProvider = ({ children }) => {
  return (
    <DataContextProvider>
      {children}
    </DataContextProvider>
  );
}