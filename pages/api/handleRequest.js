import { FetchError } from "./handleError";

export const handleRequest = (...args) => {
  return Promise.race([
    handleFetch(...args),
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Timeout')), 10000);
    })
  ]).catch(err => {
    if (err.message === 'Timeout') throw new FetchError({ message: 'The connection timed out.' });
    console.log(`caught err in handleRequest:`);
    console.dir(err);
    throw err; // todo add catch block whenever await handleRequest occurs in client
  });
}

const handleFetch = async (route, body) => {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  };
  const response = await fetch(route, options);
  const data = await response.json();
  if (!response.ok) {
    // 400 or 500 server error:
    console.log('throwing err in handleFetch');
    // todo create class ServerError - should include response.status, response.statusText, and data.errors (if it exists)
    throw new Error(data?.errors ? JSON.stringify(data?.errors) : `fetch response is not ok: ${response.status} ${response.statusText}`);
  }
  return data;
}

export const handleQuery = (query = {}, variables = {}) => {
  return handleRequest('/api/server', { query, variables }).then(body => {
    if (body?.errors) {
      // these will be server/graphQL errors
      console.warn('body contained errors: ', body.errors);
      throw {
        caughtErrors: JSON.stringify(body.errors)
      }
    }
    if (body?.data) {
      const result = Object.values(body.data)[0];
      if (result?.__typename === 'FormErrorReport') throw result;
      // maybe better to parse error report here before returning/throwing back to client? todo think about it
      return body.data;
    }
    console.dir('no body.data');
    throw body;
  }).catch(err => {
    // errors might arrive via makeRequest catch block or via then block directly above this
    console.log(`caught err in handleQuery, now forwarding to client`);
    // passing error to whatever handles error on the client side, e.g. handleError in Form.js:
    throw err;
  });
}