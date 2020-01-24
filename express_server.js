const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  name: 'session',
  keys: ['Paranapiacaba', 'Pindamonhangaba'],
  // Cookie Options
  maxAge: 30000 //   ms
}))

// app.use(cookieParser);
app.listen(PORT, () => {
  console.log(`TinyURL server listening on port ${PORT}!`);
});
// databases and related functions
const { urlDatabase } = require("./db/urls");
const { users } = require("./db/users");

const {
  addURL,
  updateURL,
  deleteURL,
  urlsForUser,
  getUserID,
  userExistsByEmail,
  addUser,
  userLogin,
  letTemplateVars
} = require("./helper");


// use after using session
app.use((req, res, next) => {
  const userID = req.session.user_id;
  const user = users[userID];
  req.user = user;
  next();
})

    // handles
app.get("/", (req, res) => {
  let templateVars = letTemplateVars( req, res)
  res.render("urls_index", templateVars);

});

// shows all the URLs in a list
app.get("/urls", (req, res) => {
  let templateVars = letTemplateVars(req, res);

  res.render("urls_index", templateVars);
});

// adds a new URL to the database
app.post("/urls", (req, res) => {
  addURL( req.body.longURL, req.session.user_id);
  // addURL( req.body.longURL, req.cookies.user_id );
  let templateVars = letTemplateVars(req, res);
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  if (!req.session.user_id) {
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
  res.redirect(urlDatabase[req.params.shortURL].longURL);
});

// display the specific record on a page
app.get("/urls/:shortURL", (req, res) => {
  // let user_id = req.cookies.user_id;
  let user_id = req.session.user_id;
  let email = users[user_id].email;
  let user = { user_id: user_id, email: email}
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL].longURL, user: user };

  res.render("urls_show", templateVars);
});

// redirects the browser to the long URL  //redo this one
app.post("/urls/:shortURL", (req, res) => {
  res.redirect(urlDatabase[req.params.shortURL]);
});

app.get("/urls/:shortURL/edit", (req, res) => {
  let shortURL = req.params.shortURL;
  let longURL = urlDatabase[shortURL].longURL;
  let user = { user_id: req.session.user_id, email: users[req.session.user_id].email };
  console.log("user:", user)
  let templateVars = { user, shortURL: shortURL, longURL: longURL};
  res.render("urls_show", templateVars);
  })
  
app.post("/urls/:shortURL/edit", (req, res) => {
  let shortURL = req.params.shortURL;
  let longURL = req.body.newURL;
  let user_id = req.session.user_id;
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
  if ( deleteURL(shortURL, req.session.user_id) ) {
      templateVars = letTemplateVars(req, res);
    res.render("urls_index", templateVars);
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
  console.log(email, password);
  if ( userLogin(email, password)) {
    let user_id = getUserID(email);

    req.session.user_id = user_id;
    let user = {user_id: user_id, email: email};
    let templateVars = {user: user, urls: urlsForUser(user_id) };
    
    res.render("urls_index", templateVars);

  } else {
    res.status(400).send("Invalid credentials.")
  }
})

app.post("/login", (req, res) => {
  const password = req.body['password'];
  const email = req.body['emailAddress'];
  
  if(password && email ){
    if ( userLogin(email, password) ) {
      req.session.user_id = getUserID(email);
      res.redirect('/urls');
    } else {
      res.status(400).send("Credential information can't be empty")
    }
  } else {
    res.status(400).send("Credential information can't be empty")
  }

});


app.post("/logout", (req, res) => {
  req.session = null
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
    req.session.user_id = newUser;
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