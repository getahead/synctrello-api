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
  ).then(res => res.reduce((result, item) => {
    if (!item.success) {
      throw item.error;
    }
    return result.concat(item.data)
  }, []))
};

export const searchCards = ({query = '', idBoards = '', trelloToken}) => {
  const parsedUrl = query.match(/^https:\/\/trello\.com\/[^\s]+\/([^\s]+)$/);
  const parsedQuery = (parsedUrl && parsedUrl[1]) ? parsedUrl[1] : query;

  const url = URI(config.API_URL)
    .pathname(`/1/search/`)
    .query({
      query: parsedQuery,
      idBoards: idBoards,
      modelTypes: 'cards',
      card_fields: 'name,desc,shortUrl,closed',
      cards_limit: 20,
      card_board: true,
      card_list: true,
      partial: true,
      key: config.TRELLO_API_KEY,
      token: trelloToken
    });


  return makeRequest(url.toString());
};
