import BindingModel, {EDITABLE_FIELDS} from '../model/Bind.model';
import mapOutput from '../lib/mapOutput';

const DEFAULT_DOUBLE_BINDING_CARDS = true;

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

    DEFAULT_DOUBLE_BINDING_CARDS && BindingModel.createOrUpdateBinding({
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

  return BindingModel.deleteBindings({idCard: data.card.id})
};

export const getBindings = (userId) => {
  if (!userId) {
    return Promise.reject({
      success: false,
      error: {
        message: "No user Id provided"
      }
    });
  }

  return BindingModel.find({userId})
    .then(bindings =>
      bindings.map(binding => ({
        id: binding._id,
        idCard: binding.idCard,
        idBindedCard: binding.idBindedCard,
        idBinding: binding.idBinding,
        created: binding.created,
        lastSynced: binding.lastSynced,
        userNameLastSynced: binding.userNameLastSynced,
        bindingEnabled: binding.bindingEnabled
      })
    ))
};

export const editBinding = ({userId, id, newValues}) => {
  if (!userId) {
    return Promise.reject({
      success: false,
      error: {
        message: "No user Id provided"
      }
    });
  }

  const alowedNewValues = mapOutput(newValues, EDITABLE_FIELDS);
  return BindingModel.findOneAndUpdate({_id: id, userId}, newValues, {upsert: true, new: true})
    .lean()
    .then(binding => ({
      id: binding._id,
      ...mapOutput(binding, Object.keys(alowedNewValues))
    }));
};
