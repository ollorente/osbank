// @ts-check
// @ts-ignore`
export const FETCH = async (options) => {
  return await fetch('/.netlify/functions/graphql', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify({
      query: options.query,
      variables: options.variables
    })
  })
}
