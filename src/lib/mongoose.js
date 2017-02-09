import mongoose from 'mongoose';
import config from '../config';

mongoose.Promise = global.Promise;
const uri = `mongodb://${config.mongo.host}:${config.mongo.port}/${config.mongo.database}`;
const options = {
  user: config.mongo.user,
  pass: config.mongo.pwd
};

const callback = (error) => {
  if (error) {
    setTimeout(createConnection, 5000);
  }
};

function createConnection() {
  return mongoose.connect(uri, options, callback);
}

export default createConnection();
