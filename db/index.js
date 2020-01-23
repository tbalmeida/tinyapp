// data and related functions used on TinyURL

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

const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
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
const addURL = function ( URL ){
  let newID = generateRandomString(6, aChar);
  {urlDatabase[newID] =  URL};
  return newID;
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
  return users[user_id].email;
}

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
    users[userID] = {id: userID, email: email, password: password};
    return userID;

  } else {
    console.log("already exists")
    // user already exists. Return empty.
    return "";
  }
}

const userLogin = function ( email, password) {
  for (const user of Object.values(users)) {
    if (user.email === email) {
      return password === user.password ? true : false;
    }
  }  
}

module.exports = 
  { urlDatabase, 
    users,
    addURL,
    addUser,
    userExistsByEmail,
    getUserEmail,
    getUserID,
    userExistsByEmail,
    userExistsbyID,
    userLogin
  }