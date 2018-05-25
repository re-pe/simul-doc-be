const User = require("../models/user");
const Document = require("../models/document");

const USERNO = 5;
const DOCNO = 20;

const userTemplate = JSON.stringify({
  firstName: "Firstname${index}",
  lastName: "Lastname${index}",
  email: "email${index}@gmail.com",
  password: "abcdef${index}"
});

const docTemplate = JSON.stringify({
  owner: "${userId}",
  authors: ["${userId}"],
  title: "title${index}",
  content: "content ${index}"
});

const makeObjectString = (strTempl, variables) => {
  let result = strTempl;
  for (let key in variables) {
    result = result.replace(new RegExp(`\\$\\{${key}\\}`, "g"), variables[key]);
  }
  return result;
};

const makeArrayOfPromises = (model, data) =>
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
  let makeUserPromiseList = Promise.resolve(db.dropDatabase())
    .then(() =>
      new Array(USERNO).fill(null).map((_, index) => {
        return { index: index };
      })
    )
    .then(userIndexList =>
      userIndexList.map(item => makeObjectString(userTemplate, item))
    )
    .then(userObjStrList => userObjStrList.map(str => JSON.parse(str)))
    .then(userObjectList => makeArrayOfPromises(User, userObjectList));

  const userPromiseList = await makeUserPromiseList;
  const userIdList = await Promise.all(userPromiseList);
  console.log(`userIdList(${userIdList.length}) => [${userIdList}]`);

  let makeDocPromiseList = Promise.resolve(userIdList)
    .then(userIdList =>
      new Array(DOCNO).fill(null).map((_, index) => {
        return {
          index: index,
          userId: userIdList[index % USERNO]
        };
      })
    )
    .then(docDataList =>
      docDataList.map(item => makeObjectString(docTemplate, item))
    )
    .then(docObjStrList => docObjStrList.map(str => JSON.parse(str)))
    .then(docObjectList => makeArrayOfPromises(Document, docObjectList));

  let docPromiseList = await makeDocPromiseList;
  let docIdList = await Promise.all(docPromiseList);
  console.log(`docIdList(${docIdList.length}) => [${docIdList}]`);
}

module.exports = initDb;
