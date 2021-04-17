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

export const User = {
  get: async (params) => await handleQuery(queries.getUser, params),
  create: async (formData) => await handleQuery(mutations.createUser, formData),
  login: async (params) => await handleQuery(queries.loginUser, params)
}

export const Habit = {
  get: async (params) => await handleQuery(queries.getHabits, params),
  create: async (formData) => await handleQuery(mutations.createHabit, formData),
  edit: async (formData) => await handleQuery(mutations.editHabit, formData),
}

export const Entry = {
  get: async (params) => await handleQuery(queries.getEntries, params),
  create: async (formData) => await handleQuery(mutations.createEntry, formData),
  edit: async (formData) => await handleQuery(mutations.editEntry, formData),
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
        ... on FormError {
          __typename
          message
          location
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
        email
        password
      }
    }
  `,
  createHabit: `
    mutation ($name: String, $icon: String, $label: String, $complex: Boolean, $userId: Int) {
      createHabit(name: $name, icon: $icon, label: $label, complex: $complex, userId: $userId) {
        name
        icon
        label
        complex
        userId
      }
    }
  `,
  editHabit: `
    mutation ($id: Int, $name: String, $icon: String, $label: String, $complex: Boolean) {
      editHabit(id: $id, name: $name, icon: $icon, label: $label, complex: $complex) {
        id
        name
        icon
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
  `
}