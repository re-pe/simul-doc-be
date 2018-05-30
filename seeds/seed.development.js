const User = require('../models/user');
const Document = require('../models/document');
const mongoose = require('mongoose');

const mongoDB = 'mongoDb://localhost/simul-doc';
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;

const NUMBER_OF_USERS_TO_CREATE = 5;
const NUMBER_OF_DOCUMENTS_TO_CREATE = 20;

/**
 * Creates user data object from template literal
 *
 * @param {Number} index
 * @return {Object} Object with data to create item
 * in database users collection
 */
const createUserFromTemplate = index =>
  JSON.parse(`{
  "firstName": "Firstname${index}",
  "lastName": "Lastname${index}",
  "email": "email${index}@gmail.com",
  "password": "abcdef${index}"
}`);

/**
 * Creates user data object from template litteral
 *
 * @param {String} userId
 * @param {Number} index
 * @return {Object} Object with data to create item
 * in database documents collection
 */
const createDocumentFromTemplate = (userId, index) =>
  JSON.parse(`{
  "owner": "${userId}",
  "authors": ["${userId}"],
  "title": "title${index}",
  "content": "content ${index}"
}`);

/**
 * Creates initials item set in the database
 *
 * @return {Object} Object with ids of items
 * users and documents collections in the database
 */
async function initDb(db) {
  const result = {};
  result.userIdList = await Promise.resolve(db.dropDatabase())
    .then(() =>
      new Array(NUMBER_OF_USERS_TO_CREATE).fill(null).map((_, index) => ({
        index,
      })))
    .then(userDataList =>
      userDataList.map(item => createUserFromTemplate(item.index)))
    .then(userObjectList => User.create(userObjectList))
    .then(created => created.map(user => user.id))
    .catch(err => err);

  result.documentIdList = await Promise.resolve(result.userIdList)
    .then(userIdList =>
      new Array(NUMBER_OF_DOCUMENTS_TO_CREATE).fill(null).map((_, index) => ({
        index,
        userId: userIdList[index % NUMBER_OF_USERS_TO_CREATE],
      })))
    .then(docDataList =>
      docDataList.map(item =>
        createDocumentFromTemplate(item.userId, item.index)))
    .then(docObjectList => Document.create(docObjectList))
    .then(created => created.map(document => document.id))
    .catch(err => err);
  db.close();
  return result;
}

initDb(mongoose.connection).then((result) => {
  if (result.userIdList.length &&
    result.userIdList.length === NUMBER_OF_USERS_TO_CREATE &&
    result.documentIdList.length &&
    result.documentIdList.length === NUMBER_OF_DOCUMENTS_TO_CREATE) {
    console.log('Success! Database have been initialized!\n');
  } else {
    console.log('Error! Database have not been initialized!\n');
  }
});
