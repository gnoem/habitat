import { handleRequest, handleQuery } from "./handleRequest";

export const User = {
  get: async (params) => await handleQuery(queries.getUser, params),
  create: async (formData) => await handleQuery(mutations.createUser, formData),
  edit: async (formData) => await handleQuery(mutations.editUser, formData),
  editPassword: async (formData) => await handleQuery(mutations.editPassword, formData),
  editSettings: async (formData) => await handleQuery(mutations.editSettings, formData),
  login: async (params) => await handleQuery(queries.loginUser, params),
  deleteAccount: async (data) => await handleQuery(mutations.deleteAccount, data),
  generateDemoData: async (id) => await handleQuery(mutations.generateDemoData, id),
  clearDemoData: async ({ demoTokenId }) => await handleQuery(mutations.clearDemoData, { demoTokenId }),
  validateSignupToken: async ({ tokenId }) => await handleQuery(mutations.validateSignupToken, { tokenId })
}

export const Habit = {
  get: async (params) => await handleQuery(queries.getHabits, params),
  create: async (formData) => await handleQuery(mutations.createHabit, formData),
  edit: async (formData) => await handleQuery(mutations.editHabit, formData),
  delete: async (formData) => await handleQuery(mutations.deleteHabit, formData),
  rearrange: async (data) => await handleQuery(mutations.rearrangeHabits, data)
}

export const Entry = {
  get: async (params) => await handleQuery(queries.getEntries, params),
  create: async (formData) => await handleQuery(mutations.createEntry, formData),
  edit: async (formData) => await handleQuery(mutations.editEntry, formData),
  delete: async (formData) => await handleQuery(mutations.deleteEntry, formData),
}

export const Token = {
  validate: async ({ tokenId }) => await handleQuery(mutations.validatePasswordToken, { tokenId }),
  createPasswordToken: async (formData) => await handleQuery(mutations.createPasswordToken, formData)
}

const queries = {
  getUser: `
    query($id: String, $demoTokenId: String) {
      user(id: $id, demoTokenId: $demoTokenId) {
        id
        name
        email
        settings {
          dashboard__defaultView
          habits__defaultView
          habits__newHabitIcon
          appearance__showClock
          appearance__24hrClock
          appearance__showClockSeconds
        }
      }
    }
  `,
  getHabits: `
    query($userId: String, $demoTokenId: String) {
      habits(userId: $userId, demoTokenId: $demoTokenId) {
        id
        name
        icon
        color
        label
        complex
        retired
      }
    }
  `,
  getEntries: `
    query($userId: String, $demoTokenId: String) {
      entries(userId: $userId, demoTokenId: $demoTokenId) {
        id
        date
        records {
          id
          habitId
          amount
          check
        }
      }
    }
  `,
  loginUser: `
    query($email: String, $password: String) {
      login(email: $email, password: $password) {
        ... on FormErrorReport {
          __typename
          errors {
            location
            message
          }
        }
        ... on User {
          id
          name
          email
          settings {
            dashboard__defaultView
            habits__defaultView
            habits__newHabitIcon
            appearance__showClock
            appearance__24hrClock
            appearance__showClockSeconds
          }
          demoTokenId
        }
      }
    }
  `
}

const mutations = {
  validateSignupToken: `
    mutation($tokenId: String) {
      validateSignupToken(tokenId: $tokenId) {
        ... on FormErrorReport {
          __typename
          errors {
            location
            message
          }
        }
        ... on Token {
          id
        }
      }
    }
  `,
  createUser: `
    mutation($email: String, $password: String, $token: String) {
      createUser(email: $email, password: $password, token: $token) {
        ... on FormErrorReport {
          __typename
          errors {
            location
            message
          }
        }
        ... on User {
          id
          name
          email
          settings {
            dashboard__defaultView
            habits__defaultView
            habits__newHabitIcon
            appearance__showClock
            appearance__24hrClock
            appearance__showClockSeconds
          }
        }
      }
    }
  `,
  editUser: `
    mutation($id: String, $name: String, $email: String) {
      editUser(id: $id, name: $name, email: $email) {
        ... on FormErrorReport {
          __typename
          errors {
            location
            message
          }
        }
        ... on User {
          id
          name
          email
        }
      }
    }
  `,
  editPassword: `
    mutation($id: String, $password: String, $confirmPassword: String, $reset: Boolean) {
      editPassword(id: $id, password: $password, confirmPassword: $confirmPassword, reset: $reset) {
        ... on FormErrorReport {
          __typename
          errors {
            location
            message
          }
        }
        ... on User {
          id
          name
          email
        }
      }
    }
  `,
  deleteAccount: `
    mutation($id: String) {
      deleteAccount(id: $id) {
        ... on FormErrorReport {
          __typename
          errors {
            location
            message
          }
        }
        ... on User {
          id
          name
          email
        }
      }
    }
  `,
  editSettings: `
    mutation(
      $userId: String,
      $demoTokenId: String,
      $dashboard__defaultView: String,
      $habits__defaultView: String,
      $habits__newHabitIcon: String,
      $appearance__showClock: Boolean,
      $appearance__24hrClock: Boolean,
      $appearance__showClockSeconds: Boolean
    ) {
      editSettings(
        userId: $userId,
        demoTokenId: $demoTokenId,
        dashboard__defaultView: $dashboard__defaultView,
        habits__defaultView: $habits__defaultView,
        habits__newHabitIcon: $habits__newHabitIcon,
        appearance__showClock: $appearance__showClock,
        appearance__24hrClock: $appearance__24hrClock,
        appearance__showClockSeconds: $appearance__showClockSeconds
      ) {
        dashboard__defaultView
        habits__defaultView
        habits__newHabitIcon
        appearance__showClock
        appearance__24hrClock
        appearance__showClockSeconds
      }
    }
  `,
  createHabit: `
    mutation(
      $name: String,
      $icon: String,
      $color: String,
      $label: String,
      $complex: Boolean,
      $retired: Boolean,
      $userId: String,
      $demoTokenId: String
    ) {
      createHabit(
        name: $name,
        icon: $icon,
        color: $color,
        label: $label,
        complex: $complex,
        retired: $retired,
        userId: $userId,
        demoTokenId: $demoTokenId
      ) {
        ... on FormErrorReport {
          __typename
          errors {
            location
            message
          }
        }
        ... on Habit {
          id
          name
          icon
          color
          label
          complex
        }
      }
    }
  `,
  editHabit: `
    mutation($id: String, $name: String, $icon: String, $color: String, $label: String, $complex: Boolean, $retired: Boolean) {
      editHabit(id: $id, name: $name, icon: $icon, color: $color, label: $label, complex: $complex, retired: $retired) {
        ... on FormErrorReport {
          __typename
          errors {
            location
            message
          }
        }
        ... on Habit {
          id
          name
          icon
          color
          label
          complex
        }
      }
    }
  `,
  deleteHabit: `
    mutation($id: String) {
      deleteHabit(id: $id) {
        id
        name
        icon
        color
        label
        complex
        retired
      }
    }
  `,
  rearrangeHabits: `
    mutation($array: [String]) {
      rearrangeHabits(array: $array) {
        success
      }
    }
  `,
  createEntry: `
    mutation($userId: String, $date: String, $records: [RecordInput], $demoTokenId: String) {
      createEntry(userId: $userId, date: $date, records: $records, demoTokenId: $demoTokenId) {
        ... on FormErrorReport {
          __typename
          errors {
            location
            message
          }
        }
        ... on Entry {
          id
          date
          records {
            habitId
            amount
            check
          }
        }
      }
    }
  `,
  editEntry: `
    mutation($id: String, $date: String, $records: [RecordInput], $demoTokenId: String) {
      editEntry(id: $id, date: $date, records: $records, demoTokenId: $demoTokenId) {
        ... on FormErrorReport {
          __typename
          errors {
            location
            message
          }
        }
        ... on Entry {
          id
          date
          records {
            habitId
            amount
            check
          }
        }
      }
    }
  `,
  deleteEntry: `
    mutation($id: String) {
      deleteEntry(id: $id) {
        id
        date
      }
    }
  `,
  generateDemoData: `
    mutation($id: String, $demoTokenId: String, $calendarPeriod: String, $alsoHabits: Boolean) {
      generateDemoData(id: $id, demoTokenId: $demoTokenId, calendarPeriod: $calendarPeriod, alsoHabits: $alsoHabits) {
        success
      }
    }
  `,
  clearDemoData: `
    mutation($demoTokenId: String) {
      clearDemoData(demoTokenId: $demoTokenId) {
        success
      }
    }
  `,
  createPasswordToken: `
    mutation($email: String) {
      createPasswordToken(email: $email) {
        ... on FormErrorReport {
          __typename
          errors {
            location
            message
          }
        }
        ... on Token {
          id
        }
      }
    }
  `,
  validatePasswordToken: `
    mutation($tokenId: String) {
      validatePasswordToken(tokenId: $tokenId) {
        ... on FormErrorReport {
          __typename
          errors {
            location
            message
          }
        }
        ... on Token {
          id
          userId
        }
      }
    }
  `,
}

export { handleRequest }