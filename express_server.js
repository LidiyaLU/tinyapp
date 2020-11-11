const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

function generateRandonString (length) {
  let result           = '';
  let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let charactersLength = characters.length;
  for (let i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}


const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
}

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls", (req,res) => {
  const user = users[req.cookies["user_id"]];
  const templateVars = {urls:urlDatabase, email: user ? user.email : undefined };
  res.render('urls_index', templateVars);
})

app.get("/urls/new", (req, res) => {
  const user = users[req.cookies["user_id"]];
  const templateVars = { email: user ? user.email : undefined }; 
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const user = users[req.cookies["user_id"]];
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], email: user ? user.email : undefined }; 
  res.render("urls_show", templateVars);
});

app.post("/urls/:shortURL", (req, res) => {
  urlDatabase[req.params.shortURL] = req.body.longURL;
  res.redirect('/urls');
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const templateVars = {urls:urlDatabase};
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls');
});


app.post("/urls", (req, res) => {
  const shortURL = generateRandonString(6);
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect("/urls/" + shortURL);

});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.post("/login", (req, res) => {
  res.cookie("username", req.body.username);
  res.redirect("/urls");
});

app.post('/logout', (req, res) => {
  res.clearCookie("username");
  res.redirect("/urls");
});

app.get('/register', (req, res) => {
  res.render('urls_register');
});

app.post('/register', (req, res) => {
  const user_id = generateRandonString(6);
  users[user_id] = {id: user_id, email: req.body.email, password: req.body.password};
  res.cookie("user_id", user_id);
  res.redirect('/urls');
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});