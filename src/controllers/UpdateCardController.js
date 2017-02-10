import BindingModel from '../model/Bind.model';
import * as requests from '../lib/requests';


export const editCard = (req, res, next) => {
  return requests.updateCard({card: req.body.card, id: req.body.id, token: res.user.trelloToken})
};

export const updateCardController = (req, res, next) => {
  const {date, data, memberCreator} = req.body.action;

  console.log(req.body.action)
  // return BindingModel.createOrUpdateBinding({
  //   action: 'update',
  //   date,
  //   idCard: data.card.id,
  //   idMember: memberCreator.id,
  //   username: memberCreator.username
  // })
    return BindingModel.getBindedCards({idCard: data.card.id})
    .then(binding => {

    console.log(binding)
      return binding;
    // return requests.updateCard({card: data.card, id: binding.idBindedCard, token: res.user.trelloToken})
  });
};
