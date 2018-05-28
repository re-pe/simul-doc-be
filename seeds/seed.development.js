const User = require("../models/user");
const Document = require("../models/document");

const NUMBER_OF_USERS_TO_CREATE = 5;
const NUMBER_OF_DOCUMENTS_TO_CREATE = 20;

/**
 * Creates user data object from template literal
 *
 * @param {number} index
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
 * @param {_id} userId
 * @param {number} index
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
 * @param {mongoose.connection} db
 * @return {Object} Object with ids of items
 * users and documents collections in the database
 */
async function initDb(db) {
  let result = {};
  result["userIdList"] = await Promise.resolve(db.dropDatabase())
    .then(() =>
      new Array(NUMBER_OF_USERS_TO_CREATE).fill(null).map((_, index) => {
        return {
          index
        };
      })
    )
    .then(userDataList =>
      userDataList.map(item => createUserFromTemplate(item.index))
    )
    .then(userObjectList => User.create(userObjectList))
    .then(created => created.map(user => user._id))
    .catch(err => null);

  result["documentIdList"] = await Promise.resolve(result["userIdList"])
    .then(userIdList =>
      new Array(NUMBER_OF_DOCUMENTS_TO_CREATE).fill(null).map((_, index) => {
        return {
          index,
          userId: userIdList[index % NUMBER_OF_USERS_TO_CREATE]
        };
      })
    )
    .then(docDataList =>
      docDataList.map(item =>
        createDocumentFromTemplate(item.userId, item.index)
      )
    )
    .then(docObjectList => Document.create(docObjectList))
    .then(created => created.map(document => document._id))
    .catch(err => null);
  return result;
}

module.exports = initDb;
