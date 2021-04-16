import prisma from "../../../lib/prisma"

export const resolvers = {
  Mutation: {
    createUser: async (_, args) => {
      const { email, password } = args;
      const user = await prisma.user.create({
        data: {
          email,
          password
        }
      });
      return user;
    },
    createHabit: async (_, args) => {
      const { name, icon, label, complex, userId } = args;
      const habit = await prisma.habit.create({
        data: {
          name,
          icon,
          label,
          complex,
          userId
        }
      });
      return habit;
    }
  },
  Query: {
    users: async (_, args) => {
      const users = await prisma.user.findMany();
      return users;
    },
    login: async (_, args) => {
      const { email, password } = args;
      const user = await prisma.user.findUnique({
        where: { email }
      });
      if (!user) return {
        __typename: 'FormError',
        message: 'User not found',
        location: 'email'
      }
      if (user.password !== password) return {
        __typename: 'FormError',
        message: 'Invalid password',
        location: 'password'
      }
      return {
        __typename: 'User',
        ...user
      }
    },
    user: async (_, args) => {
      const { id } = args;
      const user = await prisma.user.findUnique({
        where: { id }
      });
      return user;
    },
    habits: async (_, args) => {
      const { userId } = args;
      const habits = await prisma.habit.findMany({
        where: { userId }
      });
      return habits;
    },
    entries: async (_, args) => {
      const { userId } = args;
      const entries = await prisma.entry.findMany({
        where: { userId }
      });
      return entries;
    }
  },
  UserResult: {
    __resolveType(obj) {
      if (obj.__typename === 'FormError') {
        return 'FormError';
      }
      if (obj.__typename === 'User') {
        return 'User';
      }
      return null;
    }
  }
}