function emailPasswordCheck(email, password, db) {
  let check = {check: false, user: ""};
  for (let user in db){
    if (db[user].email === email && db[user].password === password) {
      check.check = true;
      check.user = db[user];
    }
  };
  return check;  
}

function generateRandonString (length) {
  let result = '';
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

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
