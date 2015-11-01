import Bluebird from 'bluebird';
let mongodb = Bluebird.promisifyAll(require('mongodb'));

const dbUrl = 'mongodb://localhost:27017/rpjs';

class Storage {
  constructor(collection = 'listings') {
    this.isReady = mongodb.MongoClient.connectAsync(dbUrl).then((db) => {
      this._connection = db;
      this.db = db.collection(collection);
    });
  }

  urlExists(key) {
    return this.db.findOneAsync({url: key}).then((res) => {
      return res != null;
    });
  }

  savePost(posting) {
    return this.db.insertAsync(posting);
  }

  ready() {
    return this.isReady;
  }

  close() {
    this._connection.close();
  }
}

export default Storage;

// let store = new Storage();
// store.ready().then(() => {
  // store.urlExists('blabla').then((val) => {
    // console.log(val);
  // });
// });
