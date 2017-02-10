import BindingModel from '../model/Bind.model';
import * as requests from '../lib/requests';


export const editCard = (req, res, next) => {
  return requests.updateCard({card: req.body.card, id: req.body.id, token: res.user.trelloToken})
};

export const updateCardController = (req, res, next) => {
  const {date, data, memberCreator} = req.body.action;

  Promise.all([
    BindingModel.createOrUpdateBinding({
      action: 'update',
      date,
      idCard: data.card.id,
      idMember: memberCreator.id,
      username: memberCreator.username
    }),

    requests.updateCard({card: data.card, id: data.card.id, token: res.user.trelloToken})
  ]).then(result => {

    return result;
  })
};
