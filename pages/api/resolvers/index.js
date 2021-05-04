import bcrypt from "bcryptjs";
import * as Validator from "validatorjs";

import prisma from "../../../lib/prisma";
import { validationError } from "./validation";

export const resolvers = {
  Mutation: {
    createUser: async (_, args) => {
      const { email = '', password } = args;
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
      const user = await prisma.user.create({
        data: {
          email,
          password: bcrypt.hashSync(password, 8)
        }
      });
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
      const { id, password, confirmPassword } = args;
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
        where: { id },
        data: {
          password: bcrypt.hashSync(password, 8)
        }
      });
      return {
        __typename: 'User',
        ...user
      }
    },
    editSettings: async (_, args) => {
      const {
        userId,
        dashboard__defaultView,
        habits__defaultView,
        appearance__showClock,
        appearance__24hrClock,
        appearance__showClockSeconds
      } = args;
      const settingsObj = {
        dashboard__defaultView,
        habits__defaultView,
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
      const { name, icon, color, label, complex, retired, userId } = args;
      const habit = await prisma.habit.create({
        data: {
          name,
          icon,
          color,
          label,
          complex,
          retired,
          userId
        }
      });
      return habit;
    },
    editHabit: async (_, args) => {
      const { id, name, icon, color, label, retired, complex } = args;
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
      // todo!
      // if deleteRecords leaves any entries empty, delete those entries
      // each deleted record should have an entryId, find those entries and look at their 'records' array
      // if !records.length || records.length > 1, return
      // else check habitId on that one record (probably unnecessary but just to be safe) and if it matches args.id, delete it
      const [__, deletedHabit] = await prisma.$transaction([deleteRecords, deleteHabit]);
      return deletedHabit;
    },
    createEntry: async (_, args) => {
      const { userId, date, records } = args;
      // todo filter records - only include those with check = true
      // no use clogging up the db
      // also for editEntry
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
      const [__, deletedEntry] = await prisma.$transaction([deleteRecords, deleteEntry]);
      return deletedEntry;
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