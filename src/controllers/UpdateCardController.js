import BindingModel from '../model/Bind.model';
import * as requests from '../lib/requests';

export const updateCardController = (req, res, next) => {
  const {data, date, memberCreator} = req.body.action;

  return BindingModel.getBindedCards({idCard: data.card.id})
    .then(binding =>
      Promise.all([
        // 1) Логировать последнюю синхронизацию
        // 2) отключать синхронизацию при архивировании
        ...binding.reduce((promises, bind) =>
          promises.concat(BindingModel.createOrUpdateBinding({
            action: 'edit',
            date,
            idCard: data.card.id === bind.idCard ? bind.idCard : bind.idBindedCard,
            idBindedCard: data.card.id === bind.idCard ? bind.idBindedCard : data.card.id,
            enabled: !data.card.closed,
            username: memberCreator.username,
            idMember: memberCreator.id
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
