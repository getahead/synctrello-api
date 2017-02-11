import BindingModel from '../model/Bind.model';
import * as requests from '../lib/requests';

export const updateCardController = (req, res, next) => {
  const {data, date, username, memberCreator} = req.body.action;

  return BindingModel.getBindedCards({idCard: data.card.id})
    .then(binding =>
      Promise.all([
        ...binding.reduce((promises, bind) =>
          promises.concat(BindingModel.createOrUpdateBinding({
            action: 'edit',
            date,
            idCard: bind.idBindedCard,
            idBindedCard: data.card.id,
            enabled: !bind.closed,
            userNameLastSynced: memberCreator.username,
            userLastSynced: memberCreator.id
          })), []),

        ...binding.reduce((promises, bind) =>
          bind.bindingEnabled && promises.concat(requests.updateCard({
            card: data.card,
            id: bind.idBindedCard,
            token: res.user.trelloToken
          })), [])
      ])
    )
};
