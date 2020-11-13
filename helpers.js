const bcrypt = require('bcrypt');
//const saltRounds = 10;

const emailPasswordCheck = function(email, password, db) {
  let check = {check: false, user: ""};
  for (let user in db) {
    if (db[user].email === email && bcrypt.compareSync(password, db[user].password)) {
      check.check = true;
      check.user = db[user];
    }
  }
  return check;
};

const generateRandonString = function(length) {
  let result = '';
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const urlsForUser = function(id, db) {
  let restrictedUrls = {};
  for (let url in db) {
    if (db[url].userID === id) {
      restrictedUrls[url] = db[url];
    }
  }
  return restrictedUrls;
};

module.exports = { emailPasswordCheck, generateRandonString, urlsForUser};
