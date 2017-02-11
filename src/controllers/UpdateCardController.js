import BindingModel from '../model/Bind.model';
import * as requests from '../lib/requests';



const updateBindingsData = (binding, {date, memberCreator, data}) =>
  binding.reduce((promises, bind) =>
    promises.concat(BindingModel.createOrUpdateBinding({
      action: 'edit',
      date,
      idCard: bind.idCard,
      idBindedCard: bind.idBindedCard,
      enabled: !data.card.closed,
      username: memberCreator.username,
      idMember: memberCreator.id
    })), []);

export const updateCardController = (req, res, next) => {
  const action = req.body.action;
  const updatedCard = action.data.card;

  return Promise.all([
    BindingModel.getBindedCards({idBindedCard: updatedCard.id})
      .then(bindings => updateBindingsData(bindings, action)),

    BindingModel.getBindedCards({idCard: updatedCard.id})
      .then(bindings => updateBindingsData(bindings, action))
      .then(bindings => bindings.reduce((promises, bind) =>
        bind.bindingEnabled && promises.concat(requests.updateCard({
          card: updatedCard,
          id: bind.idBindedCard,
          token: res.user.trelloToken
        })), []))
  ]).then(response => {console.log(response); return response;});

  /*
  return BindingModel.getBindedCards({idCard: data.card.id})
    .then(binding => {
      console.log(binding.length)
      console.log(binding.reduce((promises, bind) =>
        promises.concat({
          action: 'edit',
          date,
          // idCard: data.card.id === bind.idCard ? bind.idCard : bind.idBindedCard,
          // idBindedCard: data.card.id === bind.idBindedCard ? data.card.id : bind.idBindedCard,
          idCard: bind.idCard,
          idBindedCard: bind.idBindedCard,
          enabled: !data.card.closed,
          username: memberCreator.username,
          idMember: memberCreator.id
        }), []),);

      return Promise.all([
        // 1) Логировать последнюю синхронизацию
        // 2) отключать синхронизацию при архивировании
        ...binding.reduce((promises, bind) =>
          promises.concat(BindingModel.createOrUpdateBinding({
            action: 'edit',
            date,
            // idCard: data.card.id === bind.idCard ? bind.idCard : bind.idBindedCard,
            // idBindedCard: data.card.id === bind.idBindedCard ? data.card.id : bind.idBindedCard,
            idCard: bind.idCard,
            idBindedCard: bind.idBindedCard,
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
    })
    */
};
