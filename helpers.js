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

module.exports = { emailPasswordCheck };
