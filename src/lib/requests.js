import URI from 'urijs';
import config from '../config.js';
import makeRequest from './makeRequest';

const TRELLO_API = new URI(config.API_URL);

export const updateCard = ({card, id, token}) =>
  makeRequest(TRELLO_API.clone()
    .pathname(`/1/cards/${id}`)
    .query({key: config.TRELLO_API_KEY, token})
    .toString(), {
      method: 'PUT',
      body: JSON.stringify({
        name: card.name,
        desc: card.desc,
        dueComplete: card.dueComplete,
        due: card.due,
      })
    }
  );
