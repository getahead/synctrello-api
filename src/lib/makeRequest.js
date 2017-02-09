import fetch from 'node-fetch';

const handleResponse = (response) => {
  if (!response.ok && response.status > 200) {
    return {
      error: {
        status: response.status,
        message: response.statusText
      }
    };
  }

  return response.json();
};

export default function makeRequest(url, {headers, ...requestParams} = {}) {
  const startTime = new Date().getTime();
  const baseHeaders = {
    'Content-type': 'application/json',
    Accept: 'application/json'
  };

  return fetch(url, {
    headers: {
      ...baseHeaders,
      ...headers
    },
    timeout: 5000,
    ...requestParams
  }).then(handleResponse)
    .then(json => {
      const responseData = json.error ? {error: json.error} : {data: json};
      return {
        success: !json.error,
        duration: new Date().getTime() - startTime,
        ...responseData
      }
    })
    .catch(error => ({success: false, duration: new Date().getTime() - startTime, error}));
}
