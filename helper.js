// data files
const {users} = require("./db/users")
const {urlDatabase} = require("./db/urls");

// cryptography for password
const bcrypt = require('bcrypt');

// Chars used to generate the short string.
const aChar = 'abcdefghijklmnopqrstuvxwyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

// This function generates a string with the length passed as parameter, using the array as input
const generateRandomString = function ( pLength, inputArray ) {
  let arrayLength = inputArray.length - 1;
  let vShortStr = "";

  for (let i = 1; i <= pLength; i++){
    vShortStr += aChar[Math.round(Math.random() * arrayLength) ];
  }

  return vShortStr;
}

//      //      //      //      URLs functions
// adds a new URL to the library and returns its Id.
// to do: check if the URL is already in the library
const addURL = function ( URL, userID ) {
  let newID = generateRandomString(6, aChar);
  urlDatabase[newID] = {longURL: URL, user_id: userID}
  return newID;
}

// updates a URL IF the user_id is the owner
const updateURL = function ( shortURL, longURL, user_id) {
  if( urlDatabase[shortURL].user_id === user_id){
    urlDatabase[shortURL].longURL = longURL;
    return true;
  }
  return false;
}

// deletes a URL IF the user_id is the owner
const deleteURL = function ( shortURL, user_id) {
  if( urlDatabase[shortURL].user_id === user_id){
    delete urlDatabase[shortURL];
    return true;
  }
  return false;
}

// USER SPECIFC FUNCTIONS BELOW

const urlsForUser = function ( user_id ) {
  let filteredURLDB = { }
  for(url in urlDatabase){
    if( urlDatabase[url].user_id === user_id ){
      filteredURLDB[url] = {longURL: urlDatabase[url].longURL};
    }
  }  
  return filteredURLDB;
}

// checks if a user exist by looking for an email
const emailExists = function (email) {
  for (const user of Object.values(users)) {
    if (user.email === email) {
      return true;
    }
  }
  return false;
}

// // get userID by looking for an email
const getUserID = function (email) {
  for (const user of Object.values(users)) {
    if (user.email === email) {
      return user.id;
    }
  }
  return;
}

const getUserEmail = function (user_id) {
  if (user_id && users[user_id]){
    return users[user_id].email;
  } else {
    return undefined;
  }
}

const getUserByEmail = function (email, database) {
  for (const user of Object.values(database)) {
    if (user.email === email) {
      return user.id;
    }
  }
 };

// check if user exists, searching w/ email
const userExistsByEmail = function (email) {
  for (const user of Object.values(users)) {
    if (user.email === email) {
      return true;
    }
  }
  return false;
}

// check if a user exists using his ID
const userExistsbyID = function ( user_id ) {
  return users[user_id] ? true : false;  
}

const addUser = function ( email, password ) {
  if( !userExistsByEmail( email) ){
    const userID = generateRandomString(10, aChar);
    const hashedPassword = bcrypt.hashSync(password, 10);

    users[userID] = {id: userID, email: email, password: hashedPassword};
    return userID;

  } else {
    // user already exists. Return empty.
    return "";
  }
}

// verifies user credentials and returns true/false
const userLogin = function ( email, password) {
 
  const user_id = getUserByEmail(email, users);
  const storedPassword = users[user_id].password.toString();
 
  if (user_id && storedPassword){
    return bcrypt.compareSync(password, storedPassword);
  } else {
    return false;
  }
}

const letTemplateVars = (req, res)  => {
  let templateVars;
  if (req.header.user_id){
    const email = getUserEmail(req.session.user_id);
    const myURLs = urlsForUser(req.session.user_id);
    templateVars = { user: {user_id: req.session.user_id, email: email}, urls: myURLs };

  } else if ( req.session.user_id ) {
    let user_id = req.session.user_id;

    const email = getUserEmail(user_id);
    const myURLs = urlsForUser(user_id);
    templateVars = { user: {user_id: user_id, email: email}, urls: myURLs };

  } else {
    templateVars = { urls: urlsForUser("") };
  }
  return templateVars;
}

module.exports = {
  addURL,
  updateURL,
  deleteURL,
  urlsForUser,
  getUserID,
  userExistsByEmail,
  addUser,
  userLogin,
  letTemplateVars
}