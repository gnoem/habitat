import { handleRequest, handleQuery } from "./handleRequest";

export const User = {
  get: async (params) => await handleQuery(queries.getUser, params),
  create: async (formData) => await handleQuery(mutations.createUser, formData),
  edit: async (formData) => await handleQuery(mutations.editUser, formData),
  editPassword: async (formData) => await handleQuery(mutations.editPassword, formData),
  editSettings: async (formData) => await handleQuery(mutations.editSettings, formData),
  login: async (params) => await handleQuery(queries.loginUser, params)
}

export const Habit = {
  get: async (params) => await handleQuery(queries.getHabits, params),
  create: async (formData) => await handleQuery(mutations.createHabit, formData),
  edit: async (formData) => await handleQuery(mutations.editHabit, formData),
  delete: async (formData) => await handleQuery(mutations.deleteHabit, formData)
}

export const Entry = {
  get: async (params) => await handleQuery(queries.getEntries, params),
  create: async (formData) => await handleQuery(mutations.createEntry, formData),
  edit: async (formData) => await handleQuery(mutations.editEntry, formData),
  delete: async (formData) => await handleQuery(mutations.deleteEntry, formData),
}

const queries = {
  getUser: `
    query($id: String) {
      user(id: $id) {
        id
        name
        email
        settings {
          dashboard__defaultView
          habits__defaultView
          appearance__showClock
          appearance__24hrClock
          appearance__showClockSeconds
        }
      }
    }
  `,
  getHabits: `
    query($userId: String) {
      habits(userId: $userId) {
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
    query($userId: String) {
      entries(userId: $userId) {
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
            appearance__showClock
            appearance__24hrClock
            appearance__showClockSeconds
          }
        }
      }
    }
  `
}

const mutations = {
  createUser: `
    mutation($email: String, $password: String) {
      createUser(email: $email, password: $password) {
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
    mutation($id: String, $password: String, $confirmPassword: String) {
      editPassword(id: $id, password: $password, confirmPassword: $confirmPassword) {
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
      $dashboard__defaultView: String,
      $habits__defaultView: String,
      $appearance__showClock: Boolean,
      $appearance__24hrClock: Boolean,
      $appearance__showClockSeconds: Boolean
    ) {
      editSettings(
        userId: $userId,
        dashboard__defaultView: $dashboard__defaultView,
        habits__defaultView: $habits__defaultView,
        appearance__showClock: $appearance__showClock,
        appearance__24hrClock: $appearance__24hrClock,
        appearance__showClockSeconds: $appearance__showClockSeconds
      ) {
        dashboard__defaultView
        habits__defaultView
        appearance__showClock
        appearance__24hrClock
        appearance__showClockSeconds
      }
    }
  `,
  createHabit: `
    mutation($name: String, $icon: String, $color: String, $label: String, $complex: Boolean, $retired: Boolean, $userId: String) {
      createHabit(name: $name, icon: $icon, color: $color, label: $label, complex: $complex, retired: $retired, userId: $userId) {
        name
        icon
        color
        label
        complex
        userId
      }
    }
  `,
  editHabit: `
    mutation($id: String, $name: String, $icon: String, $color: String, $label: String, $complex: Boolean, $retired: Boolean) {
      editHabit(id: $id, name: $name, icon: $icon, color: $color, label: $label, complex: $complex, retired: $retired) {
        id
        name
        icon
        color
        label
        complex
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
  createEntry: `
    mutation($userId: String, $date: String, $records: [RecordInput]) {
      createEntry(userId: $userId, date: $date, records: $records) {
        id
        date
        records {
          habitId
          amount
          check
        }
      }
    }
  `,
  editEntry: `
    mutation($id: String, $date: String, $records: [RecordInput]) {
      editEntry(id: $id, date: $date, records: $records) {
        id
        date
        records {
          habitId
          amount
          check
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
}

export { handleRequest }