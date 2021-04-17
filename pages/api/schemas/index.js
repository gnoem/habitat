import { gql } from "apollo-server-micro"; 

export const typeDefs = gql`
  type User {
    id: Int
    name: String
    email: String
    password: String
    habits: [Habit]
    entries: [Entry]
  }

  type Habit {
    id: Int
    name: String
    icon: String
    color: String
    label: String
    complex: Boolean
    userId: Int
  }

  type Entry {
    id: Int
    date: String
    records: [Record]
    user: User
    userId: Int
  }

  type Record {
    id: Int
    habitId: Int
    amount: Int
    check: Boolean
    entryId: Int
  }

  type FormError {
    message: String
    location: String
  }

  input UserInput {
    email: String
    password: String
  }

  input RecordInput {
    id: Int
    habitId: Int
    amount: Int
    check: Boolean
  }

  union UserResult = User | FormError

  type Query {
    users: [User]
    login(email: String, password: String): UserResult
    user(id: Int): User
    habits(userId: Int): [Habit]
    entries(userId: Int): [Entry]
    records(entryId: Int): [Record]
  }
  
  type Mutation {
    createUser(email: String, password: String): User
    editUser(id: Int, name: String, email: String): User
    editPassword(id: Int, password: String): User
    createHabit(name: String, icon: String, label: String, complex: Boolean, userId: Int): Habit
    editHabit(id: Int, name: String, icon: String, label: String, complex: Boolean): Habit
    createEntry(userId: Int, date: String, records: [RecordInput]): Entry
    editEntry(id: Int, date: String, records: [RecordInput]): Entry
  }
`