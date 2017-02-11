import BindingModel from '../model/Bind.model';
import * as requests from '../lib/requests';

export const updateCardController = (req, res, next) => {
  const {data} = req.body.action;

  return BindingModel.getBindedCards({idCard: data.card.id})
    .then(binding =>
      Promise.all(
        binding.reduce((promises, bind) =>
          promises.concat(requests.updateCard({
            card: data.card,
            id: bind.idBindedCard,
            token: res.user.trelloToken
          })), [])
      )
    )
};
