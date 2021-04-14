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
    }
  },
  Query: {
    users: async (_, args) => {
      const users = await prisma.user.findMany();
      return users;
    },
    user: async (_, args) => {
      const { email, password } = args;
      const user = await prisma.user.findUnique({
        where: {
          email
        }
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
      };
    },
    habits: async (_, args) => {
      const { userId } = args;
      const habits = await prisma.habit.findMany({
        where: {
          userId: 2
        }
      });
      return habits;
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