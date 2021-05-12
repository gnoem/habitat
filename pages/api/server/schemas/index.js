import { gql } from "apollo-server-micro"; 

export const typeDefs = gql`
  type User {
    id: String
    name: String
    email: String
    password: String
    habits: [Habit]
    entries: [Entry]
    settings: Settings
    demoTokenId: String
  }

  type Settings {
    userId: String,
    dashboard__defaultView: String,
    habits__defaultView: String,
    appearance__showClock: Boolean,
    appearance__24hrClock: Boolean,
    appearance__showClockSeconds: Boolean
  }

  type Habit {
    id: String
    name: String
    icon: String
    color: String
    label: String
    complex: Boolean
    retired: Boolean
    userId: String
  }

  type Entry {
    id: String
    date: String
    records: [Record]
    user: User
    userId: String
  }

  type Record {
    id: String
    habitId: String
    amount: Int
    check: Boolean
    entryId: String
  }

  type FormErrorReport {
    errors: [FormError]
  }

  type FormError {
    message: String,
    location: String
  }

  type Success {
    success: Boolean
  }

  input UserInput {
    email: String
    password: String
  }

  input RecordInput {
    id: String
    habitId: String
    amount: Int
    check: Boolean
  }

  type Token {
    id: String
    userId: String
  }

  union UserResult = User | FormErrorReport
  
  union HabitResult = Habit | FormErrorReport

  union TokenResult = Token | FormErrorReport

  type Query {
    users: [User]
    login(email: String, password: String): UserResult
    user(id: String, demoTokenId: String): User
    settings(userId: String, demoTokenId: String): Settings
    habits(userId: String, demoTokenId: String): [Habit]
    entries(userId: String, demoTokenId: String): [Entry]
    records(entryId: String): [Record]
  }
  
  type Mutation {
    createUser(email: String, password: String, token: String): UserResult
    editUser(id: String, name: String, email: String): UserResult
    editPassword(id: String, password: String, confirmPassword: String, reset: Boolean): UserResult
    editSettings(
      userId: String,
      demoTokenId: String,
      dashboard__defaultView: String,
      habits__defaultView: String,
      appearance__showClock: Boolean,
      appearance__24hrClock: Boolean,
      appearance__showClockSeconds: Boolean
    ): Settings
    deleteAccount(id: String): UserResult
    createHabit(
      name: String,
      icon: String,
      color: String,
      label: String,
      complex: Boolean,
      retired: Boolean,
      userId: String,
      demoTokenId: String
    ): HabitResult
    editHabit(
      id: String,
      name: String,
      icon: String,
      color: String,
      label: String,
      complex: Boolean,
      retired: Boolean
    ): HabitResult
    deleteHabit(id: String): Habit
    createEntry(userId: String, date: String, records: [RecordInput], demoTokenId: String): Entry
    editEntry(id: String, date: String, records: [RecordInput]): Entry
    deleteEntry(id: String): Entry
    generateDemoData(id: String, demoTokenId: String, calendarPeriod: String, alsoHabits: Boolean): Success
    clearDemoData(demoTokenId: String): Success
    validateSignupToken(tokenId: String): TokenResult
    createPasswordToken(email: String): TokenResult
    validatePasswordToken(tokenId: String): TokenResult
  }
`;