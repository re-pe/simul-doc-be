const User = require("../models/user");
const Document = require("../models/document");

const NUMBER_OF_USERS_TO_CREATE = 5;
const NUMBER_OF_DOCUMENTS_TO_CREATE = 20;

const createUserFromTemplate = (index) => JSON.parse(`{
  "firstName": "Firstname${index}",
  "lastName": "Lastname${index}",
  "email": "email${index}@gmail.com",
  "password": "abcdef${index}"
}`)

const createDocumentFromTemplate = (userId, index) => JSON.parse(`{
  "owner": "${userId}",
  "authors": ["${userId}"],
  "title": "title${index}",
  "content": "content ${index}"
}`)

/**
 * Creates items in database
 * @param {model} model
 * @params {Object} data
 */

const createItemsInDatabase = (model, data) =>
  data.map(item =>
    model
    .create(item)
    .then(created => {
      return created._id;
    })
    .catch(err => {
      return null;
    })
  );

async function initDb(db) {
  let result;
  await Promise.resolve(db.dropDatabase())
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
    .then(userObjectList => createItemsInDatabase(User, userObjectList))
    .then(userPromiseList => Promise.all(userPromiseList))
    .then(userIdList => {
      result = { userIdList };
      return userIdList;
    })
    .then(userIdList =>
      new Array(NUMBER_OF_DOCUMENTS_TO_CREATE).fill(null).map((_, index) => {
        return {
          index,
          userId: userIdList[index % NUMBER_OF_USERS_TO_CREATE]
        };
      })
    )
    .then(docDataList =>
      docDataList.map(item => createDocumentFromTemplate(item.userId, item.index))
    )
    .then(docObjectList => createItemsInDatabase(Document, docObjectList))
    .then(docPromiseList => Promise.all(docPromiseList))
    .then(docIdList => Object.assign(result, {docIdList}));
  console.log(result);
}

module.exports = initDb;
