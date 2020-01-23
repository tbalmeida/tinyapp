const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const PORT = 8080; // default port 8080

// databases and related functions
const {urlDatabase} = require("./db");
const {users} = require("./db");
const {addURL} = require("./db");
const {addUser} = require("./db");
const {userExistsByEmail} = require("./db");
const {userExistsbyID} = require("./db");
const {userLogin} = require("./db");
const {getUserID} = require("./db");

// server config
const app = express();
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

console.log("... Server up!")

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


    // handles

app.get("/", (req, res) => {
  let templateVars = { username: req.cookies["username"], urls: urlDatabase }
  res.render("urls_index", templateVars);
});

// shows a page with info about the project (under construction)
app.get("/about", (req, res) => {
  res.render("about");
});

// Hello world, default page for testing
app.get("/hello", (req, res) => {
  let templateVars = { greeting: 'Hello World!' };
  res.render("hello_world", templateVars);
});

// shows all the URLs in a list
app.get("/urls", (req, res) => {
    let templateVars = getCookieInfo( req, res );
    res.render("urls_index", templateVars);
});

// adds a new URL to the database
app.post("/urls", (req, res) => {
  addURL( req.body.longURL );
  let templateVars = getCookieInfo( req, res );
  // let templateVars = { username: req.cookies["user_id"], urls: urlDatabase }
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  let templateVars = getCookieInfo( req, res );
  // let templateVars = { username: req.cookies["username"] }
  res.render("urls_new", templateVars);
});

// shows all the URL, using the JSON format
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// redirects the browser to the long URL
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

// display the specific record on a page
app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], username: req.cookies["username"] };
  res.render("urls_show", templateVars);
});

// deletes a URL from the base
app.post("/urls/:shortURL/delete", (req, res) => {
  let shortURL = req.params.shortURL;
  // console.log("Delete this URL", shortURL);
  delete urlDatabase[shortURL];
  res.redirect("/urls");
});

app.post("/urls/:shortURL", (req, res) => {
  const longURL = req.body.newURL;
  const shortURL = req.body.shortURL;
  urlDatabase[shortURL] = longURL;
  // let templateVars = { username: req.cookies["username"], urls: urlDatabase }
  let templateVars = getCookieInfo( req, res );
  res.redirect("urls_index", templateVars)
})

app.get("/login", (req, res) => {
  res.render("login");
})

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  res.clearCookie("user_id");
  
  if ( userLogin(email, password)) {

    let user_id = getUserID(email);
    res.cookie("user_id", user_id)
    let templateVars = getCookieInfo( req, res );
    res.render("urls_index", templateVars);

    res.redirect("/urls");
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
  
  // console.log("...Adding new user: ", email, password);
  // console.log(("Algo vazio?", !password || !email ))  
  // console.log(password.length)
  if ( password.length && !userExistsByEmail(email) ) {
    // console.log("Adding new user");
    const newUser = addUser( email, password);

    // console.log("new user", newUser);
    res.cookie("user_id", newUser,);
    res.redirect("/urls");

  } else {
    if ( userExistsByEmail(email) ){
      res.status(400).send("This e-mail is already in use. ")
    } else {
      res.status(400).send("Your password can't be blank.")
    }
  }
})