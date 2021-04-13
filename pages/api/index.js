export const handleFetch = async (params, variables) => {
  const response = await fetch('/api/server', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query: params, variables })
  });
  const body = await response.json();
  if (body.data) return body.data;
  throw new Error(`Something went wrong`);
}