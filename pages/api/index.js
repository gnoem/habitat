export const handleFetch = async (route, body) => {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  };
  const response = await fetch(route, options);
  const data = await response.json();
  if (response.ok) return data;
  console.dir(response.statusText);
}

const handleQuery = async (params = {}, variables = {}) => {
  const response = await fetch('/api/server', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query: params, variables })
  });
  const body = await response.json();
  if (body.data) return body.data;
  console.dir(body);
}

export const User = {
  get: async (params) => await handleQuery(queries.getUser, params),
  create: async (formData) => await handleQuery(mutations.createUser, formData),
  edit: async (formData) => await handleQuery(mutations.editUser, formData),
  editPassword: async (formData) => await handleQuery(mutations.editPassword, formData),
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
    query ($id: Int) {
      user(id: $id) {
        id
        name
        email
      }
    }
  `,
  getHabits: `
    query ($userId: Int) {
      habits(userId: $userId) {
        id
        name
        icon
        color
        label
        complex
      }
    }
  `,
  getEntries: `
    query ($userId: Int) {
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
    query ($email: String, $password: String) {
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
        }
      }
    }
  `
}

const mutations = {
  createUser: `
    mutation ($email: String, $password: String) {
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
        }
      }
    }
  `,
  editUser: `
    mutation ($id: Int, $name: String, $email: String) {
      editUser(id: $id, name: $name, email: $email) {
        id
        name
        email
      }
    }
  `,
  editPassword: `
    mutation ($id: Int, $password: String) {
      editPassword(id: $id, password: $password) {
        id
        name
        email
      }
    }
  `,
  createHabit: `
    mutation ($name: String, $icon: String, $color: String, $label: String, $complex: Boolean, $userId: Int) {
      createHabit(name: $name, icon: $icon, color: $color, label: $label, complex: $complex, userId: $userId) {
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
    mutation ($id: Int, $name: String, $icon: String, $color: String, $label: String, $complex: Boolean) {
      editHabit(id: $id, name: $name, icon: $icon, color: $color, label: $label, complex: $complex) {
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
    mutation ($id: Int) {
      deleteHabit(id: $id) {
        id
        name
        icon
        color
        label
        complex
      }
    }
  `,
  createEntry: `
    mutation ($userId: Int, $date: String, $records: [RecordInput]) {
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
    mutation ($id: Int, $date: String, $records: [RecordInput]) {
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
    mutation ($id: Int) {
      deleteEntry(id: $id) {
        id
        date
      }
    }
  `,
}