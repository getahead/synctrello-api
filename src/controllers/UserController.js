import URI from 'urijs';

import config from '../config';

import makeRequest from '../lib/makeRequest';
import UserModel from '../model/User.model';

export const authorizeUserByLocalToken = (id) =>
  UserModel.authorizeUserByVerifiedTokenId(id);

export const fetchUserFromTrello = (trelloToken) => {
  if (!trelloToken) {
    return Promise.reject('You should not pass without Trello token');
  }

  const trelloFetchUrl = URI(config.API_URL)
    .pathname('/1/members/me')
    .query({
      key: config.TRELLO_API_KEY,
      token: trelloToken
    });

  return makeRequest(trelloFetchUrl.toString(), {timeout: 10000})
    .catch(error => ({success: false, error}));
};

export const loginWithTrello = (trelloToken) => {
  // 1. Fetch request to get user info with fetchUserFromTrello()
  // 2. Compare fetched user with registered users and select if exists
  // 3. Get Trello userId
  // 4. SELECT existing or CREATE a new user
  // 5. Return local token

  return fetchUserFromTrello(trelloToken)
    .then((response) => {
      if (response.success && response.data && response.data.id) {
        return UserModel.findUserAndSync(trelloToken, response.data)
          .catch(error => ({success: false, error}));
      }

      return response;
    })

};
