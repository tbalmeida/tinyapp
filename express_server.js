const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new",);
});

app.get("/", (req, res) => {
  res.send("<h1 align=center>TinyApp</h1>" +
  "<p align=center>A full stack web app built with <i>Node</i> and <i>Express</i> that allows users to shorten long URLs (à la bit.ly)!</p>"+
  "<p align=center><br>A <i>Lighthouse Labs</i> bootcamp assignment.</p>");
});


app.get("/urls", (req, res) => {
  res.render("urls_index", {urls : urlDatabase});
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/hello", (req, res) => {
  let templateVars = { greeting: 'Hello World!' };
  res.render("hello_world", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render("urls_show", templateVars);
});



// app.get("/hello", (req, res) => {
//   res.send("<html><body>Hello <b>World</b></body></html>\n");
// });

// app.get("/set", (req, res) => {
//   const a = 1;
//   res.send(`a = ${a}`);
//  });
 
//  app.get("/fetch", (req, res) => {
//   res.send(`a = ${a}`);
//  });