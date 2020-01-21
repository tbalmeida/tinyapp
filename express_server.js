const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

// Chars used to generate the short string.
const aChar = 'abcdefghijklmnopqrstuvxwyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

// This function generates a random string of the desired length (pLength), using characteres from the inputArray
function generateRandomString( pLength, inputArray ) {
  let arrayLength = inputArray.length - 1;
  let vShortStr = "";

  for (let i = 1; i <= pLength; i++){
    vShortStr += aChar[Math.round(Math.random() * arrayLength) ];
  }

  return vShortStr;
}


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

app.post("/urls", (req, res) => {
  console.log(req.body);  // Log the POST request body to the console
  let newID = generateRandomString(6, aChar);
  {urlDatabase[newID] =  req.body.longURL};
  console.log("urlDatabase", urlDatabase); 
  res.send("Ok");         // Respond with 'Ok' (we will replace this)
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