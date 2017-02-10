import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

import config from '../config';
import {isEmailValid, ERROR_MESSAGES} from '../lib/validation';

const TOKEN_EXPIRATION_TIME = 60 * 60 * 24 * 365;
import {AVATAR_HOST} from '../lib/constants';

const mapOutputUser = (user) => ({
  id: user._id.toString(),
  username: user.username,
  locale: user.locale,
  idBoards: user.idBoards,
  avatar: `${AVATAR_HOST}${user.avatarHash}/170.png`
});
const signToken = (id) =>
  jwt.sign({id}, config.userSecret, { expiresIn: TOKEN_EXPIRATION_TIME });

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: isEmailValid,
      message: ERROR_MESSAGES.VALIDATE_EMAIL
    },
    // required: [true, 'Email is required']
  },
  hashedPassword: {
    type: String,
    // required: true
  },
  salt: {
    type: String,
    // required: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  lastSynced: {
    type: Date,
    default: Date.now
  },

  // TRELLO DATA
  trelloId: {
    type: String,
    required: true,
    index: true
  },
  trelloToken: {
    type: String,
    required: true
  },
  idBoards: [String],
  fullName: String,
  url: String,
  locale: String,
  avatarHash: String
});

UserSchema.statics.findUserAndSync = function (trelloToken, trelloUser, updateToken = true) {
  const User = this;
  const userMapper = {
    trelloToken,
    avatarHash: trelloUser.avatarHash,
    trelloId: trelloUser.id,
    idBoards: trelloUser.idBoards,
    email: trelloUser.email,
    username: trelloUser.username,
    url: trelloUser.url,
    locale: trelloUser.prefs.locale,
    lastSynced: Date.now()
  };

  return User.findOneAndUpdate({trelloId: trelloUser.id}, userMapper, {
    upsert: true,
    new: true,
    setDefaultsOnInsert: true
  }).lean()
    .then(user => {
      const token = updateToken && signToken(user._id);
      return {
        token,
        profile: mapOutputUser(user)
      }
    });
};

/**
 * Get user by token
 * @param token
 * @returns {Promise}
 */
UserSchema.statics.authorizeUserByVerifiedTokenId = function (id) {
  const User = this;
  return User.findOne({_id: id})
    .then(user => ({
      trelloToken: user.trelloToken,
      profile: mapOutputUser(user)
    }));
};

/**
 * Validate user by token
 * @param token
 * @returns {Promise}
 */
UserSchema.methods.validateUser = function (token) {
  const User = this;
  const secret = config.userSecret;
  return new Promise((resolve, reject) =>
    jwt.verify(token, secret, function(err, decoded) {
      if (err) {
        return reject(err);
      }
      return resolve(User);
    })
  );
};

const UserModel = mongoose.model('User', UserSchema);
export default UserModel;
