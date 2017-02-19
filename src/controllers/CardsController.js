import URI from 'urijs';

import config from '../config';
import makeRequest from '../lib/makeRequest'

export const getCards = (ids, trelloToken) => {
  const url = URI(config.API_URL)
    .query({
      key: config.TRELLO_API_KEY,
      token: trelloToken
    });


  return Promise.all(
    ids.map((id, index) =>
      makeRequest(url.pathname(`/1/cards/${id}`).toString())
    )
  )
};
