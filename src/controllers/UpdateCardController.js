import BindingModel from '../model/Bind.model';
import * as requests from '../lib/requests';



const updateBindingsData = (binding, {date, memberCreator, data}) =>
  binding.reduce((promises, bind) =>
    promises.concat(BindingModel.createOrUpdateBinding({
      action: 'edit',
      date,
      idCard: bind.idCard,
      idBindedCard: bind.idBindedCard,
      enabled: typeof data.card.closed !== 'undefined' && data.old.closed !== data.card.closed
        ? !data.card.closed
        : bind.bindingEnabled,
      username: memberCreator.username,
      idMember: memberCreator.id
    })), []);

export const updateCardController = (req, res, next) => {
  const action = req.body.action;
  const updatedCard = action.data.card;

  return Promise.all([
    ...BindingModel.getBindedCards({idBindedCard: updatedCard.id})
      .then(bindings => updateBindingsData(bindings, action)),

    ...BindingModel.getBindedCards({idCard: updatedCard.id})
      .then(bindings => [
        ...updateBindingsData(bindings, action),
        ...bindings.reduce((promises, bind) =>
          bind.bindingEnabled && promises.concat(requests.updateCard({
            card: updatedCard,
            id: bind.idBindedCard,
            token: res.user.trelloToken
          })), [])
      ])
  ]);
};
