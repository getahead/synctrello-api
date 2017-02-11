import '../config';
import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const BindingSchema = new Schema({
  idBinding: {
    type: String,
    required: true
  },
  idCard: {
    type: String,
    required: true
  },
  idBindedCard: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  bindingEnabled: {
    type: Boolean
  },
  created: {
    type: Date,
    default: Date.now
  },
  lastSynced: {
    type: Date,
    default: Date.now
  },
  userCreated: String,
  userNameCreated: String,
  userLastSynced: String,
  userNameLastSynced: String
});

BindingSchema.statics.createOrUpdateBinding = function ({
  action = 'create',
  userId, // webhook owner
  idBinding,
  idCard,
  idBindedCard,
  date,
  idMember,
  username,
  enabled = true
}) {
  const Binding = this;

  // editable fields
  let bindingMapper = {
    bindingEnabled: enabled,
    lastSynced: date,
    userNameLastSynced: username,
    userLastSynced: idMember
  };

  if (action === 'create') {
    bindingMapper = {
      ...bindingMapper,
      idCard,
      idBindedCard,
      userId, // webhook owner
      idBinding,
      userCreated: idMember,
      userNameCreated: username
    }
  }

  return Binding.findOneAndUpdate({idCard, idBindedCard}, bindingMapper, {
    upsert: true,
    new: true,
    setDefaultsOnInsert: true
  }).lean()
    .then(binding => binding)
};

BindingSchema.statics.getBindedCards = function (condition, limit = 20) {
  if (!condition) {
    return Promise.resolve([]);
  }

  console.log(condition)
  return this.find(condition)
    .limit(limit)
    .lean()
    .then(bindings => bindings)
};

BindingSchema.statics.deleteBindings = function ({idCard}) {

  return this.remove({$or: [{idCard: idCard}, { idBindedCard: idCard }]})
    .lean()
    .then(bindings => bindings)
};

const BindingModel = mongoose.model('Binding', BindingSchema);
export default BindingModel;
