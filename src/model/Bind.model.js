import '../config';
import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const BindingSchema = new Schema({
  idCard: {
    type: String,
    required: true
  },
  idBindedCard: {
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
      userCreated: idMember,
      userLastSynced: idMember,
      userNameCreated: username,
      userNameLastSynced: username,
      lastSynced: date,
    }
  }

  console.log(bindingMapper)
  return Binding.findOneAndUpdate({idCard}, bindingMapper, {
    upsert: true,
    new: true,
    setDefaultsOnInsert: true
  }).lean().then(binding => binding)
};

const BindingModel = mongoose.model('Binding', BindingSchema);
export default BindingModel;
