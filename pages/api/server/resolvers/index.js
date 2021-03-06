import bcrypt from "bcryptjs";
import * as Validator from "validatorjs";

import prisma from "../../../../lib/prisma";
import { habitLabelIsValid, validationError } from "./validation";
import { habitsList, entriesList, recordsList, clearSampleData } from "./demo";
import { sendPasswordResetEmail } from "./mail";
import { differenceInMinutes } from "../../../../utils";

export const resolvers = {
  Mutation: {
    validateSignupToken: async (_, args) => {
      const { tokenId } = args;
      const token = await prisma.signupToken.findUnique({
        where: {
          id: tokenId
        }
      });
      if (!token) return validationError({ tokenId: 'code is invalid' });
      return {
        __typename: 'Token',
        ...token
      }
    },
    createUser: async (_, args) => {
      const { email = '', password, token } = args;
      const emailIsInUse = await prisma.user.findUnique({
        where: { email }
      });
      Validator.register('isAvailable', () => !emailIsInUse);
      const validation = new Validator({ email, password }, {
        email: 'required|email|isAvailable|max:50',
        password: 'required|min:6'
      }, {
        required: 'this field is required!',
        email: 'please enter a valid email address!',
        isAvailable: 'email address is already in use!',
        max: 'maximum 50 characters!',
        min: 'minimum 6 characters!'
      });
      if (validation.fails()) return validationError(validation.errors.all());
      const createUser = prisma.user.create({
        data: {
          email,
          password: bcrypt.hashSync(password, 8)
        }
      });
      const deleteToken = prisma.signupToken.delete({
        where: {
          id: token
        }
      });
      const [__, user] = await prisma.$transaction([deleteToken, createUser]);
      return {
        __typename: 'User',
        ...user
      }
    },
    editUser: async (_, args) => {
      const { id, name, email } = args;
      const userWithThisEmail = await prisma.user.findUnique({
        where: { email }
      });
      Validator.register('isAvailable', () => {
        if (!userWithThisEmail) return true;
        return userWithThisEmail.id === id;
      });
      const validation = new Validator({ name, email }, {
        name: 'max:50',
        email: 'required|email|isAvailable|max:50'
      }, {
        required: 'this field is required!',
        email: 'please enter a valid email address!',
        isAvailable: 'email address is already in use!',
        max: 'maximum 50 characters!'
      });
      if (validation.fails()) return validationError(validation.errors.all());
      const user = await prisma.user.update({
        where: { id },
        data: {
          name,
          email
        }
      });
      return {
        __typename: 'User',
        ...user
      }
    },
    editPassword: async (_, args) => {
      const { id, password, confirmPassword, reset = false } = args;
      Validator.register('matchesConfirmPassword', () => {
        return password === confirmPassword;
      });
      const validation = new Validator({ password }, {
        password: 'matchesConfirmPassword|min:6'
      }, {
        matchesConfirmPassword: 'passwords do not match!',
        min: 'minimum 6 characters!'
      });
      if (validation.fails()) return validationError(validation.errors.all());
      const user = await prisma.user.update({
        where: {
          id
        },
        data: {
          password: bcrypt.hashSync(password, 8)
        }
      });
      if (reset) {
        await prisma.passwordToken.delete({
          where: {
            userId: id
          }
        });
      }
      return {
        __typename: 'User',
        ...user
      }
    },
    editSettings: async (_, args) => {
      const {
        userId,
        demoTokenId,
        dashboard__defaultView,
        habits__defaultView,
        habits__newHabitIcon,
        appearance__showClock,
        appearance__24hrClock,
        appearance__showClockSeconds
      } = args;
      const settingsObj = {
        demoTokenId,
        dashboard__defaultView,
        habits__defaultView,
        habits__newHabitIcon,
        appearance__showClock,
        appearance__24hrClock,
        appearance__showClockSeconds
      }
      const idField = demoTokenId
        ? { demoTokenId }
        : { userId };
      const settings = await prisma.settings.upsert({
        where: idField,
        update: settingsObj,
        create: {
          ...idField,
          ...settingsObj
        }
      });
      return {
        __typename: 'Settings',
        ...settings
      }
    },
    deleteAccount: async (_, args) => {
      const { id } = args;
      const whereBelongsToUser = {
        where: {
          userId: id
        }
      }
      const deleteUser = prisma.user.delete({
        where: {
          id
        }
      });
      const deleteHabits = prisma.habit.deleteMany(whereBelongsToUser);
      const deleteEntries = prisma.entry.deleteMany(whereBelongsToUser);
      const deleteRecords = prisma.record.deleteMany(whereBelongsToUser);
      const deleteSettings = await prisma.settings.findUnique(whereBelongsToUser)
        ? prisma.settings.delete(whereBelongsToUser)
        : null;
      const deletePasswordToken = await prisma.passwordToken.findUnique(whereBelongsToUser)
        ? prisma.passwordToken.delete(whereBelongsToUser)
        : null;
      await prisma.$transaction([
        deleteHabits,
        deleteEntries,
        deleteRecords,
        deleteSettings,
        deletePasswordToken,
        deleteUser
      ].filter(el => el));
      return {
        __typename: 'User'
      }
    },
    createHabit: async (_, args) => {
      const { name, icon, color, label, complex, retired, userId, demoTokenId } = args;
      if (complex && !habitLabelIsValid(label)) {
        return validationError({ label: 'invalid habit label, remember to include unit in curly braces!' });
      }
      const habit = await prisma.habit.create({
        data: {
          name,
          icon,
          color,
          label,
          complex,
          retired,
          userId,
          demoTokenId
        }
      });
      return {
        __typename: 'Habit',
        ...habit
      }
    },
    editHabit: async (_, args) => {
      const { id, name, icon, color, label, retired, complex } = args;
      if (complex && !habitLabelIsValid(label)) {
        return validationError({ label: 'invalid habit label, remember to include unit in curly braces!' });
      }
      const habit = await prisma.habit.update({
        where: { id },
        data: {
          name,
          icon,
          color,
          label,
          complex,
          retired
        }
      });
      return {
        __typename: 'Habit',
        ...habit
      }
    },
    deleteHabit: async (_, args) => {
      const { id } = args;
      const deleteHabit = prisma.habit.delete({
        where: { id }
      });
      const deleteRecords = prisma.record.deleteMany({
        where: { habitId: id }
      });
      const deleteEntries = prisma.entry.deleteMany({
        where: {
          records: {
            none: {}
          }
        }
      });
      const transaction = await prisma.$transaction([deleteRecords, deleteEntries, deleteHabit]);
      return transaction[2];
    },
    rearrangeHabits: async (_, args) => {
      const { array } = args;
      const updateHabits = array.map((habitId, index) => {
        return prisma.habit.update({
          where: {
            id: habitId
          },
          data: {
            order: index
          }
        });
      });
      await prisma.$transaction(updateHabits);
      return {
        success: true
      }
    },
    createEntry: async (_, args) => {
      const { userId, date, records, demoTokenId } = args;
      const identifier = demoTokenId ? { demoTokenId } : { userId };
      const existingEntry = await prisma.entry.findFirst({
        where: {
          AND: [
            identifier,
            { date }
          ]
        }
      });
      if (existingEntry) return validationError({ date: 'an entry already exists for this date!' });
      const editedRecords = records.map(record => {
        // filtering out records with check = false
        // no use clogging up the db
        if (!record.check) return null;
        const recordToReturn = {...record};
        // add demo token id (only for demo accounts, otherwise null)
        recordToReturn.demoTokenId = demoTokenId;
        return recordToReturn;
      }).filter(el => el);
      const entry = await prisma.entry.create({
        data: {
          userId,
          date,
          records: {
            create: editedRecords
          },
          demoTokenId
        }
      });
      return {
        __typename: 'Entry',
        ...entry
      }
    },
    editEntry: async (_, args) => {
      const { id, date, records, demoTokenId } = args;
      const existingEntry = await prisma.entry.findFirst({
        where: {
          AND: [
            {
              id: {
                not: id
              }
            },
            { date }
          ]
        }
      });
      if (existingEntry) {
        await prisma.entry.delete({
          where: {
            id: existingEntry.id
          }
        });
      }
      const updatedRecords = records.map(record => {
        // filtering out records with check = false
        // no use clogging up the db
        if (!record.check) return null;
        const recordToReturn = {...record};
        // add demo token id (only for demo accounts, otherwise null)
        recordToReturn.demoTokenId = demoTokenId;
        return recordToReturn;
      }).filter(el => el);
      const entry = await prisma.entry.update({
        where: { id },
        data: {
          date,
          records: {
            deleteMany: {},
            create: updatedRecords
          }
        }
      });
      return {
        __typename: 'Entry',
        ...entry
      }
    },
    deleteEntry: async (_, args) => {
      const { id } = args;
      const deleteEntry = prisma.entry.delete({
        where: { id }
      });
      const deleteRecords = prisma.record.deleteMany({
        where: { entryId: id }
      });
      const [__, deletedEntry] = await prisma.$transaction([deleteRecords, deleteEntry]);
      return deletedEntry;
    },
    generateDemoData: async (_, args) => {
      const { id, demoTokenId, calendarPeriod, alsoHabits } = args;
      // create demo habits and entries
      if (alsoHabits) {
        await prisma.habit.createMany({
          data: habitsList(id, demoTokenId)
        });
      }
      await prisma.entry.createMany({
        data: entriesList(id, demoTokenId, calendarPeriod)
      });
      const entries = await prisma.entry.findMany({
        where: {
          AND: [
            {
              demoTokenId
            },
            {
              date: {
                startsWith: calendarPeriod
              }
            }
          ]
        }
      });
      // for each entry, loop through recordsArray and add entry id, user id, and demoTokenId, then prisma.record.createMany
      const records = entries.map((entry, index) => {
        return recordsList(demoTokenId, calendarPeriod)[index].map(record => {
          const recordWithEntryId = {...record};
          recordWithEntryId.entryId = entry.id;
          recordWithEntryId.userId = id;
          recordWithEntryId.demoTokenId = demoTokenId;
          return recordWithEntryId;
        });
      }).flat();
      await prisma.record.createMany({
        data: records
      });
      return {
        success: true
      }
    },
    clearDemoData: async (_, args) => {
      const { demoTokenId } = args;
      await clearSampleData(demoTokenId, prisma);
      return {
        success: true
      }
    },
    createPasswordToken: async (_, args) => {
      const { email } = args;
      const user = await prisma.user.findUnique({
        where: {
          email
        }
      });
      if (!user) {
        return validationError({ email: 'user not found' });
      }
      const existingToken = await prisma.passwordToken.findUnique({
        where: {
          userId: user.id
        }
      });
      if (existingToken) {
        await prisma.passwordToken.delete({
          where: {
            id: existingToken.id
          }
        });
      }
      const token = await prisma.passwordToken.create({
        data: {
          userId: user.id
        }
      });
      await sendPasswordResetEmail({
        to: email,
        subject: 'your habitat account ???',
        resetLink: `https://habi.vercel.app/recover?token=${token.id}`
      });
      return {
        __typename: 'Token'
      }
    },
    validatePasswordToken: async (_, args) => {
      const { tokenId } = args;
      const token = await prisma.passwordToken.findUnique({
        where: {
          id: tokenId
        }
      });
      // prisma doesn't let you add a ttl index to models so i'm doing this instead
      const tokenIsExpiredOrInvalid = (() => {
        if (!token) return true;
        return differenceInMinutes(token.createdAt) > 120;
      })();
      if (token && tokenIsExpiredOrInvalid) {
        await prisma.passwordToken.delete({
          where: {
            id: tokenId
          }
        });
      }
      if (tokenIsExpiredOrInvalid) return validationError({ tokenId: 'code is invalid' });
      return {
        __typename: 'Token',
        ...token
      }
    }
  },
  Query: {
    users: async (_, args) => {
      const users = await prisma.user.findMany();
      return users;
    },
    login: async (_, args) => {
      const { email = '', password } = args;
      const user = await prisma.user.findUnique({
        where: { email }
      });
      Validator.register('userExists', () => !!user);
      let validation = new Validator({ email, password }, {
        email: 'required|userExists',
        password: 'required'
      }, {
        userExists: 'user not found!', 
        required: 'this field is required!'
      });
      if (validation.fails()) return validationError(validation.errors.all());
      const passwordIsValid = bcrypt.compareSync(password, user.password);
      if (!passwordIsValid) return validationError({ password: 'invalid password' });
      if (email === 'demo') {
        // clear expired demo tokens + all data associated with those tokens
        const allDemoTokens = await prisma.demoToken.findMany();
        allDemoTokens.forEach(demoToken => {
          const tokenIsExpired = differenceInMinutes(demoToken.createdAt) >= 120; // 2 hours
          return tokenIsExpired ? clearSampleData(demoToken.id, prisma) : null;
        });
        // create demoToken for this logged in user (demoTokenId will be added to the session cookie)
        const createdToken = await prisma.demoToken.create({
          data: {}
        });
        return {
          __typename: 'User',
          ...user,
          demoTokenId: createdToken.id
        }
      }
      return {
        __typename: 'User',
        ...user
      }
    },
    user: async (_, args) => {
      const { id, demoTokenId } = args;
      const user = await prisma.user.findUnique({
        where: {
          id
        }
      });
      return {
        ...user,
        demoTokenId
      }
    },
    habits: async (_, args) => {
      const { userId, demoTokenId } = args;
      const habits = await prisma.habit.findMany({
        orderBy: { order: 'asc' }, // order of creation i guess
        where: { userId, demoTokenId }
      });
      return habits;
    },
    entries: async (_, args) => {
      const { userId, demoTokenId } = args;
      const entries = await prisma.entry.findMany({
        orderBy: { date: 'desc' },
        where: { userId, demoTokenId }
      });
      return entries;
    },
    records: async (_, args) => {
      const { entryId } = args;
      const records = await prisma.record.findMany({
        orderBy: {
          habit: {
            order: 'asc'
          }
        },
        where: { entryId }
      });
      return records;
    },
    settings: async (_, args) => {
      const { userId, demoTokenId } = args;
      if (!demoTokenId) {
        const settings = await prisma.settings.findUnique({
          where: {
            userId
          }
        });
        return settings;
      }
      const demoSettings = await prisma.settings.findUnique({
        where: {
          demoTokenId
        }
      });
      return demoSettings;
    }
  },
  User: {
    settings: (parent) => {
      return resolvers.Query.settings(null, {
        userId: parent.id,
        demoTokenId: parent.demoTokenId
      });
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
  },
  HabitResult: {
    __resolveType(obj) {
      if (obj.__typename === 'FormErrorReport') {
        return 'FormErrorReport';
      }
      if (obj.__typename === 'Habit') {
        return 'Habit';
      }
      return null;
    }
  },
  EntryResult: {
    __resolveType(obj) {
      if (obj.__typename === 'FormErrorReport') {
        return 'FormErrorReport';
      }
      if (obj.__typename === 'Entry') {
        return 'Entry';
      }
      return null;
    }
  },
  TokenResult: {
    __resolveType(obj) {
      if (obj.__typename === 'FormErrorReport') {
        return 'FormErrorReport';
      }
      if (obj.__typename === 'Token') {
        return 'Token';
      }
      return null;
    }
  }
}