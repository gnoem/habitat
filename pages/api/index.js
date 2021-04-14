export const handleQuery = async (params = {}, variables = {}) => {
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
