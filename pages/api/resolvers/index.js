import prisma from "../../../lib/prisma"

export const resolvers = {
  Mutation: {
    createUser: async (_, args) => {
      const { email, password } = args;
      const emailIsInUse = await prisma.user.findUnique({
        where: { email }
      });
      const errors = [];
      if (!email || email.length === 0) errors.push({
        location: 'email',
        message: 'this field is required'
      });
      if (emailIsInUse) errors.push({
        location: 'email',
        message: 'email is already in use'
      });
      if (!password || password.length === 0) errors.push({
        location: 'password',
        message: 'this field is required'
      }); else if (password.length < 6) errors.push({
        location: 'password',
        message: 'minimum 6 characters'
      });
      if (errors.length > 0) return {
        __typename: 'FormErrorReport',
        errors
      }
      const user = await prisma.user.create({
        data: {
          email,
          password
        }
      });
      return {
        __typename: 'User',
        ...user
      }
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
    editSettings: async (_, args) => {
      const {
        userId,
        dashboard__defaultView,
        appearance__showClock,
        appearance__24hrClock,
        appearance__showClockSeconds
      } = args;
      const settingsObj = {
        dashboard__defaultView,
        appearance__showClock,
        appearance__24hrClock,
        appearance__showClockSeconds
      }
      const settings = await prisma.settings.upsert({
        where: {
          userId
        },
        update: settingsObj,
        create: {
          userId,
          ...settingsObj
        }
      });
      return {
        __typename: 'Settings',
        ...settings
      }
    },
    createHabit: async (_, args) => {
      const { name, icon, color, label, complex, userId } = args;
      const habit = await prisma.habit.create({
        data: {
          name,
          icon,
          color,
          label,
          complex,
          userId
        }
      });
      return habit;
    },
    editHabit: async (_, args) => {
      const { id, name, icon, color, label, complex } = args;
      const habit = await prisma.habit.update({
        where: { id },
        data: {
          name,
          icon,
          color,
          label,
          complex
        }
      });
      return habit;
    },
    deleteHabit: async (_, args) => {
      const { id } = args;
      const deleteHabit = prisma.habit.delete({
        where: { id }
      });
      const deleteRecords = prisma.record.deleteMany({
        where: { habitId: id }
      });
      const transaction = await prisma.$transaction([deleteHabit, deleteRecords]);
      return transaction;
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
    },
    deleteEntry: async (_, args) => {
      const { id } = args;
      const deleteEntry = prisma.entry.delete({
        where: { id }
      });
      const deleteRecords = prisma.record.deleteMany({
        where: { entryId: id }
      });
      const transaction = await prisma.$transaction([deleteEntry, deleteRecords]);
      return transaction;
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
        __typename: 'FormErrorReport',
        errors: [{
          message: 'User not found',
          location: 'email'
        }]
      }
      if (user.password !== password) return {
        __typename: 'FormErrorReport',
        errors: [{
          message: 'Invalid password',
          location: 'password'
        }]
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
    },
    settings: async (_, args) => {
      const { userId } = args;
      //console.dir(prisma);
      //console.dir(prisma.settings);
      const settings = await prisma.settings?.findUnique({
        where: { userId }
      });
      return settings;
    }
  },
  User: {
    settings: (parent) => {
      return resolvers.Query.settings(null, { userId: parent.id })
    }
  },
  Entry: {
    records: (parent) => {
      return resolvers.Query.records(null, { entryId: parent.id })
    }
  },
  // note to self: when creating unions remember to update "... on User" thing in query/mutation string
  UserResult: {
    __resolveType(obj) {
      if (obj.__typename === 'FormErrorReport') {
        return 'FormErrorReport';
      }
      if (obj.__typename === 'User') {
        return 'User';
      }
      return null;
    }
  }
}