const User = require("../models/user");
const Document = require("../models/document");

const USERNO = 5;
const DOCNO = 5;

const userTemplate = JSON.stringify({
  firstName: "Firstname${index}",
  lastName: "Lastname${index}",
  email: "email${index}@gmail.com",
  password: "abcdef${index}"
});

const documentTemplate = JSON.stringify({
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
        //console.log("created => ", created);
        return created._id;
      })
      .catch(err => {
        return null;
      })
  );

const initDb = db =>
  Promise.resolve(db.dropDatabase())
    .then(() =>
      new Array(USERNO)
        .fill(null)
        .map((_, index) => makeObjectString(userTemplate, { index: index }))
    )
    .then(userObjStrList => userObjStrList.map(str => JSON.parse(str)))
    .then(userObjectList => makeArrayOfPromises(User, userObjectList))
    .then(userPromiseList =>
      Promise.all(userPromiseList).then(userIdList => userIdList)
    )
    .then(userIdList => {
      console.log("Length of userIdList == " + userIdList.length);
      return userIdList;
    })
    .then(userIdList =>
      new Array(DOCNO).fill(null).map((_, index) =>
        makeObjectString(documentTemplate, {
          index: index,
          userId: userIdList[index % USERNO]
        })
      )
    )
    .then(docObjStrList => docObjStrList.map(str => JSON.parse(str)))
    .then(docObjectList => makeArrayOfPromises(Document, docObjectList))
    .then(docPromiseList =>
      Promise.all(docPromiseList).then(docIdList => docIdList)
    )
    .then(docIdList =>
      console.log("Length of docIdList == " + docIdList.length)
    );

module.exports = initDb;
