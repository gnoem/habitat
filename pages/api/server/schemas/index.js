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
  }

  union UserResult = User | FormErrorReport

  union TokenResult = Token | FormErrorReport

  type Query {
    users: [User]
    login(email: String, password: String): UserResult
    user(id: String): User
    settings(userId: String): Settings
    habits(userId: String): [Habit]
    entries(userId: String): [Entry]
    records(entryId: String): [Record]
  }
  
  type Mutation {
    validateSignupToken(tokenId: String): TokenResult
    createUser(email: String, password: String, token: String): UserResult
    editUser(id: String, name: String, email: String): UserResult
    editPassword(id: String, password: String, confirmPassword: String): UserResult
    editSettings(
      userId: String,
      dashboard__defaultView: String,
      habits__defaultView: String,
      appearance__showClock: Boolean,
      appearance__24hrClock: Boolean,
      appearance__showClockSeconds: Boolean
    ): Settings
    createHabit(
      name: String,
      icon: String,
      color: String,
      label: String,
      complex: Boolean,
      retired: Boolean,
      userId: String,
      demo: Boolean
    ): Habit
    editHabit(
      id: String,
      name: String,
      icon: String,
      color: String,
      label: String,
      complex: Boolean,
      retired: Boolean
    ): Habit
    deleteHabit(id: String): Habit
    createEntry(userId: String, date: String, records: [RecordInput], demo: Boolean): Entry
    editEntry(id: String, date: String, records: [RecordInput]): Entry
    deleteEntry(id: String): Entry
    generateDemoData(id: String, calendarPeriod: String, alsoHabits: Boolean): Success
  }
`;