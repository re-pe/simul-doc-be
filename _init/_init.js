const User = require("../models/user");
const Document = require("../models/document");

const userno = 5;
const docno = 3;

const userTempl = {
  firstName: "Firstname${i}",
  lastName: "Lastname${i}",
  email: "email${i}@gmail.com",
  password: "abcdef${i}"
};

const testUser = {
  firstName: "Firstname",
  lastName: "Lastname",
  email: "email@gmail.com",
  password: "abcdef0"
};

const docTempl = {
  owner: "${user_id}",
  authors: ["${user_id}"],
  title: "title_${i}",
  content: "content ${i}"
};

const init = db => {
  let users = [];
  db.dropDatabase();
  const userStr = JSON.stringify(userTempl);
  const promises = [];
  for (let i = 0; i < userno; i++) {
    let newUserStr = userStr.replace(/\$\{i\}/g, i.toString());
    let user = JSON.parse(newUserStr);
    console.log("-----------------" + user.toString());
    promises.push((()=>{
      return User.create(user)
        .then(created => {
          console.log("created => " + created._id);
          return created._id;
        })
        .catch(err => {
          console.log(err);
        })
    })());
  }
  console.log('promises', promises);
  Promise.all(promises).then(values => {
    console.log("values => " + values);
  });

  //.then(        // User.create(user, (error, user) => {
  //   console.log(error);
  // });
  // .then(created => {
  //   console.log(created);
  //   users.push(created);
  // })
  // .catch(err => {
  //   console.log(err);
  // });
  // }
  //});
  // return;

  // const docStr = JSON.stringify(docTempl);

  // let docs = [];

  // for (let i = 0; i < docno; i++) {
  //   let index = i % users.length;
  //   const user_id = users[index]._id;
  //   // index = (i + 1) % user_ids.length;
  //   // const next_id = user_ids[index];
  //   let newUserStr = userStr.replace(/\$\{user_id\}/g, user_id);
  //   newUserStr = userStr.replace(/\$\{i\}/g, i.toString());
  //   let doc = JSON.parse(newDocStr);
  //   Document.create(docs).then(created => {
  //     docs.push(created);
  //   });
  // }
};

module.exports = init;
