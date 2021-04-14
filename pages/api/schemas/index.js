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
  }

  type Habit {
    id: Int
    name: String
    icon: String
    color: String
    label: String
    unit: String
    userId: Int
  }

  type FormError {
    message: String
    location: String
  }

  union UserResult = User | FormError

  type Query {
    users: [User]
    user(email: String, password: String): UserResult
    habits(userId: Int): [Habit]
  }
  
  type Mutation {
    createUser(email: String, password: String): User
    editUser(id: ID!, input: UserInput): User
    createHabit(name: String, icon: String, color: String, label: String): Habit
  }
`