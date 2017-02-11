import BindingModel from '../model/Bind.model';

const DEFAULT_DOUNBLE_BINDING_CARDS = true;

export const copyCardController = (req, res, next) => {
  const {id, date, data, memberCreator} = req.body.action;

  return Promise.all([
    BindingModel.createOrUpdateBinding({
      date,
      userId: req.params.member,
      idBinding: id,
      idCard: data.card.id,
      idBindedCard: data.cardSource.id,
      idMember: memberCreator.id,
      username: memberCreator.username
    }),

    DEFAULT_DOUNBLE_BINDING_CARDS && BindingModel.createOrUpdateBinding({
      date,
      userId: req.params.member,
      idBinding: id,
      idCard: data.cardSource.id,
      idBindedCard: data.card.id,
      idMember: memberCreator.id,
      username: memberCreator.username
    })
  ]).then(result => result)
};

export const deleteCardController = (req, res, next) => {
  const {data} = req.body.action;

  return BindingModel.deleteBindings({id: data.card.id})
    .then(res => {
      console.log(res)
      return res;
    });
};
