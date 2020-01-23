const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const PORT = 8080; // default port 8080

// databases and related functions
const { 
  urlDatabase,
  users,
  addURL,
  updateURL,
  deleteURL,
  addUser,
  userExistsByEmail,
  userExistsbyID,
  userLogin,
  getUserID,
  getUserEmail,
  urlsForUser } = require("./db");

// server config
const app = express();
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.listen(PORT, () => {
  console.log(`TinyURL server listening on port ${PORT}!`);
});

// console.log("### User database")
// console.log(users)
// console.log("### URL database")
// console.log( urlDatabase)

const getCookieInfo = function ( req, res ) {
  let objReturn = {};

  let user_id = req.cookies["user_id"];

  if ( user_id && userExistsbyID(user_id) ){
    // valid user
    let user = { user_id: user_id, email: users[user_id].email}
    objReturn = { user: user, urls: urlDatabase };

  } else {
    // clean the cookie, the user isn't valid
    res.clearCookie("user_id");
    objReturn = {urls: urlDatabase};

  }
  return objReturn
}

const letTemplateVars = function(req, res) {
  let templateVars;
  console.log(req.header.user_id, req.cookies.user_id)
  if (req.header.user_id){
    console.log("...letTemplateVars, using header")
    const email = getUserEmail(req.header.user_id);
    const myURLs = urlsForUser(req.header.user_id);
    templateVars = { user: {user_id: req.header.user_id, email: email}, urls: myURLs };
  } else if ( req.cookies.user_id ) {
    console.log("...letTemplateVars, using cookies")

    const email = getUserEmail(req.cookies.user_id);
    const myURLs = urlsForUser(req.cookies.user_id);
    templateVars = { user: {user_id: req.cookies.user_id, email: email}, urls: myURLs };
  } else {
    console.log("...letTemplateVars, using empty")

    templateVars = { urls: urlsForUser("") };
  }
  return templateVars;
}

// use after using session
// app.use((req, res, next) => {
//   const userID = req.session.user_id;
//   const user = users[userID];
//   req.user = user;
//   next();
// })

    // handles
app.get("/", (req, res) => {
  let templateVars = letTemplateVars( req, res)
  res.render("urls_index", templateVars);

});

// shows all the URLs in a list
app.get("/urls", (req, res) => {
  let templateVars = letTemplateVars(req, res);
  console.log("/urls", templateVars)  

  res.render("urls_index", templateVars);
});

// adds a new URL to the database
app.post("/urls", (req, res) => {
  addURL( req.body.longURL, req.cookies.user_id );
  let templateVars = letTemplateVars(req, res);
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  console.log( req.cookies.user_id );
  if (!req.cookies.user_id) {
    res.redirect("/login");
  } else {
    let templateVars = letTemplateVars(req, res);
    res.render("urls_new", templateVars);
  }
});

// shows all the URL, using the JSON format
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// redirects the browser to the long URL
app.get("/u/:shortURL", (req, res) => {
  // console.log("u/:shortURL, login:", req.cookies.user_id, "URL:", req.params.shortURL, ", ", urlDatabase[req.params.shortURL].longURL )
  res.redirect(urlDatabase[req.params.shortURL].longURL);
});

// display the specific record on a page
app.get("/urls/:shortURL", (req, res) => {
  let user_id = req.cookies.user_id;
  let email = users[user_id].email;
console.log("/urls/:shortURL", user_id, email)
  let user = { user_id: user_id, email: email}
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL].longURL, user: user };

  res.render("urls_show", templateVars);
});

// redirects the browser to the long URL  //redo this one
app.post("/urls/:shortURL", (req, res) => {
  console.log( req.params.longURL)
  res.redirect(urlDatabase[req.params.shortURL]);
});

app.get("/urls/:shortURL/edit", (req, res) => {
  let shortURL = req.params.shortURL;
  let longURL = urlDatabase[shortURL].longURL;
  let user = { user_id: req.cookies.user_id, email: users[req.cookies.user_id].email };
  let templateVars = { user, shortURL: shortURL, longURL: longURL};
  res.render("urls_show", templateVars);
  })
  
app.post("/urls/:shortURL/edit", (req, res) => {
  let shortURL = req.params.shortURL;
  let longURL = req.body.newURL;
  let user_id = req.cookies.user_id;
  let user = { user_id: user_id, email: users[user_id].email };
  let templateVars = { user, urls: urlDatabase};
  if ( updateURL(shortURL, longURL, user_id) ){
    res.render("urls_index", templateVars);
  } else {
    res.status(400).send("Only the owner can edit its URL.");
  }
})

// deletes a URL from the base
app.post("/urls/:shortURL/delete", (req, res) => {
  let shortURL = req.params.shortURL;
  // console.log("Delete this URL", shortURL);
  if ( deleteURL(shortURL) ) {
    res.redirect("/urls");
  } else {
    res.status(400).send("Only the owner can delete its URL.");
  }
});

app.get("/login", (req, res) => {
  res.render("login");
})

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  res.clearCookie("user_id");
  
  if ( userLogin(email, password)) {
    let user_id = getUserID(email);
    console.log("user id no login", user_id)

    // let templateVars = { user: user, urls:urlDB};
    res.cookie("user_id", user_id)
    let user = {user_id: user_id, email: email};
    let templateVars = {user: user, urls: urlsForUser(user_id) };
    res.render("urls_index", templateVars);

  } else {
    res.status(400).send("Invalid credentials.")
  }
})

app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/urls");
})

// User registration GET / POST
app.get("/register", (req, res) => {
  res.render("register");
})

app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  
  if ( password.length && !userExistsByEmail(email) ) {
    const newUser = addUser( email, password);
    res.cookie("user_id", newUser);
    let templateVars = letTemplateVars( req, res );
    res.render("urls_index", templateVars);

  } else {
    if ( userExistsByEmail(email) ){
      res.status(400).send("This e-mail is already in use. ")
    } else {
      res.status(400).send("Your password can't be blank.")
    }
  }
})