import { gql } from "apollo-server-micro"; 

export const typeDefs = gql`
  input UserInput {
    email: String
    password: String
  }

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

  union UserResult = User | FormError

  type Query {
    users: [User]
    login(email: String, password: String): UserResult
    user(id: Int): User
    habits(userId: Int): [Habit]
    entries(userId: Int): [Entry]
  }
  
  type Mutation {
    createUser(email: String, password: String): User
    editUser(id: ID!, input: UserInput): User
    createHabit(name: String, icon: String, label: String, complex: Boolean, userId: Int): Habit
  }
`