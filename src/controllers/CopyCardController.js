import BindingModel from '../model/Bind.model';

/*
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
*/

export const copyCardController = (req, res, next) => {
  const {date, data, memberCreator} = req.body.action;

  console.log(req.body)
  console.log(req.body.action.data)
  BindingModel.createOrUpdateBinding({
    idCard: data.card.id,
    idBindedCard: data.cardSource.id,
    date,
    idMember: memberCreator.id,
    username: memberCreator.username
  })
};
