import URI from 'urijs';

import config from '../config';
import makeRequest from '../lib/makeRequest';
import {serialize} from '../lib/serialize';

export const fetchAllBoards = (ids = [], field, trelloToken) => {
  const url = URI(config.API_URL)
    .query({
      key: config.TRELLO_API_KEY,
      token: trelloToken
    });

  return Promise.all(
    ids.map((id, index) =>
      makeRequest(url.pathname(`/1/boards/${id}`).toString())
        .then(board => {
          if (!board.success) {
            throw board.error;
          }
          return board.data;
        })
    )
  );
};

export const getWebhooks = (trelloToken) => {
  const url = URI(config.API_URL)
    .pathname(`/1/tokens/${trelloToken}/webhooks`)
    .query({
      key: config.TRELLO_API_KEY
    });

  return makeRequest(url.toString())
    .then(response => response.data)
};

export const addWebhook = ({idBoard, active, id, trelloToken}) => {
  const url = URI(config.API_URL)
    .pathname('/1/webhooks/')
    .query({
      key: config.TRELLO_API_KEY,
      token: trelloToken
    });

  const callbackURL = URI(config.serverUrl)
    .pathname(`/webhooks/${id}`)
    .toString();

  return makeRequest(url.toString(), {
    method: 'post',
    headers: {
      'Content-type': 'application/x-www-form-urlencoded'
    },
    body: serialize({
      active,
      idModel: idBoard,
      description: Date.now(),
      callbackURL
    })
  })
};

export const deleteWebhook = ({idWebhook, idBoard, trelloToken}) => {
  const url = URI(config.API_URL)
    .pathname(`/1/webhooks/${idWebhook}`)
    .query({
      key: config.TRELLO_API_KEY,
      token: trelloToken
    });

  return makeRequest(url.toString(), {
    method: 'delete',
    headers: {
      'Content-type': 'application/x-www-form-urlencoded'
    }
  }).then(res => {
    if (!res.success) {
      return res;
    }

    return {
      success: res.success,
      data: {
        idModel: idBoard,
        idWebhook: '',
        active: false
      }
    }
  })
};


export const processBoardsData = ({boards, boardsConfig, webhooks = []}) => {
  const boardsProcessed = boards.map(board => {
    const currWebhook = webhooks.find(webhook => webhook.idModel === board.id);

    if (!currWebhook) {
      return board;
    }

    return {
      ...board,
      active: currWebhook.active,
      idWebhook: currWebhook.id
    }
  });

  return {
    boards: boardsProcessed,
    boardsConfig
  };
};
