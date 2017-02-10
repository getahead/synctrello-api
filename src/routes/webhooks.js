import express from 'express';

import {copyCardController} from '../controllers/CopyCardController';

const router = express.Router();
/*
{
  model: {
    id: '588b7f67f4386d2bfe18eea5',
    name: 'Trello sync cards bot',
    desc: '',
    descData: null,
    closed: false,
    idOrganization: null,
    pinned: false,
    url: 'https://trello.com/b/LDacnoU2/trello-sync-cards-bot',
    shortUrl: 'https://trello.com/b/LDacnoU2',
    prefs: {
      permissionLevel: 'private',
      voting: 'disabled',
      comments: 'members',
      invitations: 'members',
      selfJoin: false,
      cardCovers: true,
      cardAging: 'regular',
      calendarFeedEnabled: false,
      background: 'blue',
      backgroundImage: null,
      backgroundImageScaled: null,
      backgroundTile: false,
      backgroundBrightness: 'dark',
      backgroundColor: '#0079BF',
      canBePublic: true,
      canBeOrg: true,
      canBePrivate: true,
      canInvite: true
    },
    labelNames: {
      green: 'Feature',
      yellow: 'Карьера',
      orange: '',
      red: 'Bug',
      purple: 'Frontend',
      blue: 'Backend',
      sky: 'Infostructure',
      lime: 'Management',
      pink: 'Marketing',
      black: ''
    }
  },
  action: {
    id: '589d4c19fe3c78ae7c2cd26e',
    idMemberCreator: '58749d2471e3adf79d1abd8b',
    data: {
      cardSource: [Object],
      board: [Object],
      list: [Object],
      card: [Object]
    },
    type: 'copyCard',
    date: '2017-02-10T05:14:01.143Z',
    memberCreator: {
      id: '58749d2471e3adf79d1abd8b',
      avatarHash: 'c4b9803e832fd92c96a6d699b6be47ef',
      fullName: 'Михаил Петров',
      initials: 'МП',
      username: 'mizhgan'
    }
  }
}
}
*/

const ACTION_TYPES = {
  copyCard: {
    name: 'copyCard',
    controller: copyCardController
  }
};

router.all('/:member', (req, res, next) => {
  if (req.body && req.body.action) {
    const action = req.body.action.type;
    const controller = ACTION_TYPES[action] && ACTION_TYPES[action].controller;

    if (controller && typeof controller === 'function') {
      controller(req, res, next);
    }
  }

  res.status(200).send();
});

export default router;
