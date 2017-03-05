import uuid from 'uuid';

import BindingModel, {EDITABLE_FIELDS} from '../model/Bind.model';
import mapOutput from '../lib/mapOutput';

const DEFAULT_DOUBLE_BINDING_CARDS = true;

const bindingMapper = binding => ({
  id: binding._id,
  idCard: binding.idCard,
  idBindedCard: binding.idBindedCard,
  idBinding: binding.idBinding,
  created: binding.created,
  lastSynced: binding.lastSynced,
  userNameLastSynced: binding.userNameLastSynced,
  bindingEnabled: binding.bindingEnabled
})

export const copyCardController = (req, res, next) => {
  const {id, date, data, memberCreator} = req.body.action;

  return Promise.all([
    addBinding({
      date,
      userId: req.params.member,
      idBinding: id,
      idCard: data.card.id,
      idBindedCard: data.cardSource.id,
      idMember: memberCreator.id,
      username: memberCreator.username
    }),

    DEFAULT_DOUBLE_BINDING_CARDS && addBinding({
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
    .limit(100)
    .then(bindings => bindings.map(bindingMapper))
};

export const editBinding = async ({userId, id, newValues}) => {
  if (!userId) {
    return Promise.reject({
      success: false,
      error: {
        message: "No user Id provided"
      }
    });
  }

  if (newValues.idCard && newValues.idBindedCard) {
    // if cardIds are going to change, validate them
    const validationResult = await BindingModel.findOne({
      idCard: newValues.idCard,
      idBindedCard: newValues.idBindedCard
    });

    if (validationResult) {
      return Promise.reject({
        message: `These cards are already bound${validationResult.userId !== userId
          ? ` by user ${validationResult.userNameCreated}` : ''}`
      });
    }
  }

  const alowedNewValues = mapOutput(newValues, EDITABLE_FIELDS);
  return BindingModel.findOneAndUpdate({_id: id, userId}, newValues, {upsert: true, new: true})
    .lean()
    .then(binding => ({
      id: binding._id,
      ...mapOutput(binding, Object.keys(alowedNewValues))
    }));
};

export const createBinding = async ({firstCardId, secondCardId, user}) => {
  const validationResult = await validateIfBindingExists({firstCardId, secondCardId});

  if (validationResult && validationResult.length) {
    return Promise.reject({
      message: `These cards are already bound${validationResult[0].userId !== user.profile.id
        ? ` by user ${validationResult[0].userNameCreated}` : ''}`
    });
  }

  const idBinding = uuid.v4();
  return Promise.all([
    addBinding({
      userId: user.profile.id,
      idBinding: idBinding,
      idCard: firstCardId,
      idBindedCard: secondCardId,
      idMember: user.trelloId,
      username: user.profile.username
    }),
    addBinding({
      userId: user.profile.id,
      idBinding: idBinding,
      idCard: secondCardId,
      idBindedCard: firstCardId,
      idMember: user.trelloId,
      username: user.profile.username
    })
  ])
};

export const deleteBinding = ({userId, id}) =>
  BindingModel.find({idBinding: id, userId})
    .then(result => {
      result.map(doc => doc.remove());
      return result.reduce((arr, item) => arr.concat(item._id.toString()), []);
    });

const validateIfBindingExists = ({firstCardId, secondCardId}) =>
  BindingModel.find({$or: [
    {idCard: firstCardId, idBindedCard: secondCardId},
    {idCard: secondCardId, idBindedCard: firstCardId}]
  }).lean();

export const addBinding = (binding) =>
  BindingModel.createOrUpdateBinding(binding)
    .then(bindingMapper);
