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
    editUser: async (_, args) => {
      const { id, name, email } = args;
      const user = await prisma.user.update({
        where: { id },
        data: {
          name,
          email
        }
      });
      return user;
    },
    editPassword: async (_, args) => {
      const { id, password } = args;
      const user = await prisma.user.update({
        where: { id },
        data: {
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
    },
    editHabit: async (_, args) => {
      const { id, name, icon, label, complex } = args;
      const habit = await prisma.habit.update({
        where: { id },
        data: {
          name,
          icon,
          label,
          complex
        }
      });
      return habit;
    },
    createEntry: async (_, args) => {
      const { userId, date, records } = args;
      const entry = await prisma.entry.create({
        data: {
          userId,
          date,
          records: {
            create: records
          }
        }
      });
      return entry;
    },
    editEntry: async (_, args) => {
      const { id, date, records } = args;
      const entry = await prisma.entry.update({
        where: { id },
        data: {
          date,
          records: {
            deleteMany: {},
            create: records
          }
        }
      });
      return entry;
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
        orderBy: { id: 'asc' }, // order of creation i guess
        where: { userId }
      });
      return habits;
    },
    entries: async (_, args) => {
      const { userId } = args;
      const entries = await prisma.entry.findMany({
        orderBy: { date: 'desc' },
        where: { userId }
      });
      return entries;
    },
    records: async (_, args) => {
      const { entryId } = args;
      const records = await prisma.record.findMany({
        orderBy: { habitId: 'asc' },
        where: { entryId }
      });
      return records;
    }
  },
  Entry: {
    records: (parent) => {
      return resolvers.Query.records(null, { entryId: parent.id })
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