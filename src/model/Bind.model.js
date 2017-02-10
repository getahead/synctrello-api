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
  userId,
  idBinding,
  idCard,
  idBindedCard,
  date,
  idMember,
  username,
  enabled = true
}) {
  const Binding = this;
  let bindingMapper = {
    idCard,
    idBindedCard,
    bindingEnabled: enabled
  };

  if (action === 'create') {
    bindingMapper = {
      ...bindingMapper,
      userId,
      idBinding,
      userCreated: idMember,
      userLastSynced: idMember,
      userNameCreated: username,
      userNameLastSynced: username,
      lastSynced: date,
    }
  }

  return Binding.findOneAndUpdate({idCard}, bindingMapper, {
    upsert: true,
    new: true,
    setDefaultsOnInsert: true
  }).lean().then(binding => binding)
};

const BindingModel = mongoose.model('Binding', BindingSchema);
export default BindingModel;
