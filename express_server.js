const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const PORT = 8080; // default port 8080
const {emailPasswordCheck} = require('./helpers');
const {generateRandonString} = require('./helpers');
const {urlsForUser} = require('./helpers');

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
//app.use(cookieParser());
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}));

const urlDatabase = {
  "b2xVn2": {longURL : "http://www.lighthouselabs.ca", userID: "userRandomID"},
  "9sm5xK": {longURL: "http://www.google.com", userID: "user2RandomID"}
};


const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "$2b$10$gsQ76ujQrxxzoqo.vMJwzei47iBHVkmOolCgJQpOAq0JY/oOeM1bq"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "$2b$10$jC2reBsO2/sVGvPGO9Y2v.e9vst.alw71JO2WuEUx4Z1Sgc59X8q2"
  }
};

app.get("/", (req,res) => {
  const user = users[req.session["user_id"]] ? users[req.session["user_id"]] : null;
  if (user) {
    res.redirect("/urls");
  } else {
    res.redirect("/login");
  }
});


app.get("/urls", (req,res) => {
  const user = users[req.session["user_id"]] ? users[req.session["user_id"]] : null;
  if (user) {
    const templateVars = {user: users[req.session["user_id"]], urls: urlsForUser(req.session["user_id"], urlDatabase)};
    res.render("urls_index", templateVars);
  } else {
    const templateVars = {user: users[req.session["user_id"]], urls: null};
    res.render("urls_index", templateVars);
  }
});

app.get("/urls/new", (req, res) => {
  const user = users[req.session["user_id"]] ? users[req.session["user_id"]] : null;
  const templateVars = { user: users[req.session["user_id"]] };
  if (user) {
    res.render("urls_new", templateVars);
  } else {
    res.redirect('/login');
  }
  
});

app.get("/urls/:shortURL", (req, res) => {
  const user = users[req.session["user_id"]] ? users[req.session["user_id"]] : null;
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], user: users[req.session["user_id"]] };
  if (user) {
    res.render("urls_show", templateVars);
  } else {
    res.redirect('/login');
  }
});

app.post("/urls/:shortURL", (req, res) => {
  const user = users[req.session["user_id"]] ? users[req.session["user_id"]] : null;
  if (user) {
    urlDatabase[req.params.shortURL].longURL = req.body.longURL;
    res.redirect('/urls');
  } else {
    res.redirect('/login');
  }
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const user = users[req.session["user_id"]] ? users[req.session["user_id"]] : null;
  if (user) {
    //const templateVars = {urls:urlDatabase};
    delete urlDatabase[req.params.shortURL];
    res.redirect('/urls');
  } else {
    res.redirect('/login');
  }
});


app.post("/urls", (req, res) => {
  const user = users[req.session["user_id"]] ? users[req.session["user_id"]] : null;
  if (user) {
    const shortURL = generateRandonString(6);
    urlDatabase[shortURL] = {longURL: req.body.longURL, userID: req.session["user_id"]};
    res.redirect("/urls/" + shortURL);
  } else {
    res.redirect('/login');
  }
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);
});

app.get("/login", (req,res) => {
  res.render("urls_login");
});

app.post("/login", (req, res) => {
  const {email, password} = req.body;

  const result = emailPasswordCheck(email, password, users);
  if (result.check) {
    req.session["user_id"] = result.user.id;
    res.redirect("/urls");
  } else {
    res.status(403).send('<html><h4> Make sure that you enter right credentials or <a href="/register"> Register </a></h4></html>');
  }
});

app.post('/logout', (req, res) => {
  req.session = null;
  res.redirect("/urls");
});

app.get('/register', (req, res) => {
  res.render('urls_register');
});

app.post('/register', (req, res) => {
  const { email, password } = req.body;
  const userId = generateRandonString(6);

  if (!email) {
    return res.status(400).send('<html><h4>Email is empty!</h4></html>');
  }

  if (!password) {
    return res.status(400).send('<html><h4>Password is empty!</h4></html>');
  }

  for (let user in users) {
    if (users[user].email === email) {
      return res.status(404).send('<html><h4>User already exists</h4></html>');
    }
  }
  
  users[userId] = {id: userId, email: email, password: bcrypt.hashSync(password, saltRounds)};
  console.log(users);
  req.session["user_id"] = userId;
  res.redirect("/urls");
  
});



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});