// data and related functions used on TinyURL

// used to save passwords
const bcrypt = require('bcrypt');


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
  },
  "user1": {
    id: "user1", 
    email: "user1@gmail.com", 
    password: "123"
  }
}

const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", user_id: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", user_id: "user2RandomID" },
  hahaha: { longURL: "https://www.msn.ca", user_id: "uid200" }

};

// Chars used to generate the short string.
const aChar = 'abcdefghijklmnopqrstuvxwyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

// This function generates a string with the length passed as parameter, using the array as input
function generateRandomString( pLength, inputArray ) {
  let arrayLength = inputArray.length - 1;
  let vShortStr = "";

  for (let i = 1; i <= pLength; i++){
    vShortStr += aChar[Math.round(Math.random() * arrayLength) ];
  }

  return vShortStr;
}

// adds a new URL to the library and returns its Id.
// to do: check if the URL is already in the library
const addURL = function ( URL, userID ){
  let newID = generateRandomString(6, aChar);
  // {urlDatabase[newID] =  URL};
  urlDatabase[newID] = {longURL: URL, user_id: userID}
  return newID;
}

// updates a URL IF the user_id is the owner
const updateURL = function ( shortURL, longURL, user_id){
  if( urlDatabase[shortURL].user_id === user_id){
    urlDatabase[shortURL].longURL = longURL;
    return true;
  }
  return false;
}

// deletes a URL IF the user_id is the owner
const deleteURL = function ( shortURL, user_id){
  if( urlDatabase[shortURL].user_id === user_id){
    delete urlDatabase[shortURL];
    return true;
  }
  return false;
}

// USER SPECIFC FUNCTIONS BELOW

const urlsForUser = function ( user_id ){
  let filteredURLDB = { }
  for(url in urlDatabase){
    if( urlDatabase[url].user_id === user_id ){
      filteredURLDB[url] = {longURL: urlDatabase[url].longURL};
    }
  }  
  return filteredURLDB;
}

//  console.log(urlsForUser(undefined))

// checks if a user exist by looking for an email
const emailExists = function (email) {
  for (const user of Object.values(users)) {
    if (user.email === email) {
      return true;
    }
  }
  return false;
}

// get userID by looking for an email
const getUserID = function (email) {
  for (const user of Object.values(users)) {
    if (user.email === email) {
      return user.id;
    }
  }
  return;
}

const getUserEmail = function (user_id){
  if (user_id && users[user_id]){
    return users[user_id].email;
  } else {
    return undefined;
  }
}

// console.log( getUserEmail("user1"));

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
const userExistsbyID = function ( user_id ){
  return users[user_id] ? true : false;  
}

const addUser = function ( email, password ) {
  console.log("checking" ,email)
  if( !userExistsByEmail( email) ){
    const userID = generateRandomString(10, aChar);
    const hashedPassword = bcrypt.hashSync(password, 10);

    users[userID] = {id: userID, email: email, password: hashedPassword};
    console.log("new user", users)
    return userID;

  } else {
    console.log("already exists")
    // user already exists. Return empty.
    return "";
  }
}

// verifies user credentials and returns true/false
const userLogin = function ( email, password) {
  for (const user of Object.values(users)) {
    if (user.email === email) {
      // return password === user.password ? true : false;
      const hashedPassword = bcrypt.hashSync(password, 10);
      return bcrypt.compareSync(password, hashedPassword)
    }
  }  
}

module.exports = 
  { urlDatabase, 
    users,
    addUser,
    userLogin,
    getUserID,
    getUserEmail,
    userExistsByEmail,
    userExistsbyID,
    addURL,
    deleteURL,
    updateURL,
    urlsForUser
  }